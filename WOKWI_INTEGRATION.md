# Wokwi Elements Integration

This document describes how the Arduino simulator integrates real Wokwi elements for authentic hardware simulation.

## 🎯 Overview

The simulator now uses actual [@wokwi/elements](https://www.npmjs.com/package/@wokwi/elements) web components to provide realistic Arduino hardware simulation. These are the same components used in the official Wokwi platform.

## 🧩 Integrated Components

### Currently Active
- **Arduino Uno** (`wokwi-arduino-uno`) - Main microcontroller board
- **LED** (`wokwi-led`) - Light emitting diode with color support
- **Push Button** (`wokwi-pushbutton`) - Interactive button component
- **Resistor** (`wokwi-resistor`) - Basic resistor with configurable values

### Available in Palette
- **Potentiometer** (`wokwi-potentiometer`) - Variable resistor
- **7-Segment Display** (`wokwi-seven-segment`) - Numeric display
- **LCD 16x2** (`wokwi-lcd1602`) - Text display module

## 🔌 Real-Time Component Interaction

### LED Control
The LED component is connected to pin 13 (LED_BUILTIN) and responds in real-time to digitalWrite commands:

```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);  // LED turns ON
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);   // LED turns OFF
  delay(1000);
}
```

### Button Input
Buttons dispatch events when pressed/released:

```javascript
button.addEventListener('button-press', () => {
  console.log('Button pressed');
});

button.addEventListener('button-release', () => {
  console.log('Button released');
});
```

## 🎨 Component Features

### Draggable Components
All components can be dragged and repositioned on the canvas:
- Click and hold any component
- Drag to desired position
- Components maintain their pin connections

### Dynamic Component Creation
Add new components using the component palette:
- Click any component button in the palette
- Component appears at a random position
- Automatically draggable and interactive

### Component Deletion
Remove unwanted components:
- Select a component by clicking it
- Press `Delete` or `Backspace` key
- Or click the "Delete Selected" button
- Arduino board cannot be deleted

## 🔧 Arduino Simulation Engine

### Pin State Management
The simulator maintains state for all 54 Arduino pins:
- Digital pins (0-53)
- Analog pins (A0-A5 mapped to 14-19)
- PWM-capable pins

### Supported Arduino Functions

#### Digital I/O
```cpp
pinMode(pin, OUTPUT);          // Set pin mode
digitalWrite(pin, HIGH);        // Write digital value
int value = digitalRead(pin);   // Read digital value
```

#### Analog I/O
```cpp
analogWrite(pin, 128);          // Write PWM value (0-255)
int value = analogRead(A0);     // Read analog value (0-1023)
```

#### Time Functions
```cpp
delay(1000);                    // Delay in milliseconds
```

#### Serial Communication
```cpp
Serial.begin(9600);             // Initialize serial
Serial.print("Hello");          // Print without newline
Serial.println("World");        // Print with newline
```

## 📡 Event System

### Pin Change Events
When a pin changes state, an event is dispatched:

```javascript
window.addEventListener('arduino-pin-change', (event) => {
  const { pin, value } = event.detail;
  // Update component based on pin change
});
```

### Serial Output Events
Serial messages are dispatched as events:

```javascript
window.addEventListener('arduino-serial', (event) => {
  const { timestamp, message } = event.detail;
  // Display in serial monitor
});
```

## 🎮 Component Attributes

### LED
```javascript
led.setAttribute('color', 'red');     // Set LED color
led.setAttribute('pin', '13');         // Assign to pin
led.value = true;                      // Turn on/off
```

### Push Button
```javascript
button.setAttribute('color', 'blue');  // Set button color
button.setAttribute('pin', '2');       // Assign to pin
button.pressed;                        // Get press state
```

### Resistor
```javascript
resistor.setAttribute('value', '220'); // Set resistance (ohms)
```

### Potentiometer
```javascript
pot.setAttribute('value', '50');       // Set position (0-100)
pot.addEventListener('change', (e) => {
  console.log('Value:', e.target.value);
});
```

## 🚀 How It Works

### 1. Component Loading
```javascript
await import('@wokwi/elements');
```
Web components are loaded dynamically when the canvas mounts.

### 2. Component Creation
```javascript
const led = document.createElement('wokwi-led');
led.setAttribute('color', 'red');
led.style.position = 'absolute';
container.appendChild(led);
```

### 3. Pin Connection
```javascript
const handlePinChange = (event) => {
  const { pin, value } = event.detail;
  if (pin === 13) {
    led.value = value > 0.5;
  }
};
window.addEventListener('arduino-pin-change', handlePinChange);
```

### 4. Code Execution
The Arduino code is parsed and executed:
```javascript
const wrappedCode = `
  async function setup() { ... }
  async function loop() { ... }
  await setup();
  while(true) await loop();
`;
eval(wrappedCode);
```

## 🎨 Visual Features

### Grid Background
The canvas has a subtle grid pattern for easier component alignment.

### Component Highlighting
Selected components are highlighted for better visibility.

### Responsive Layout
The canvas adapts to the available space and is scrollable for large circuits.

## 🔮 Future Enhancements

### Planned Features
- [ ] Wire drawing between components
- [ ] Component properties editor
- [ ] Save/load circuit diagrams
- [ ] More Wokwi components (servo, motor, sensors)
- [ ] Analog input simulation (potentiometer values)
- [ ] I2C/SPI communication
- [ ] Custom component templates
- [ ] Circuit validation and error detection

### Component Library Expansion
More Wokwi elements to be added:
- `wokwi-servo` - Servo motor
- `wokwi-pir-motion-sensor` - Motion sensor
- `wokwi-dht22` - Temperature/humidity sensor
- `wokwi-ultrasonic-sensor` - Distance sensor
- `wokwi-membrane-keypad` - 4x4 keypad
- `wokwi-slide-switch` - Toggle switch

## 📚 References

- [Wokwi Elements NPM Package](https://www.npmjs.com/package/@wokwi/elements)
- [Wokwi Documentation](https://docs.wokwi.com/)
- [Web Components Standard](https://www.webcomponents.org/)

## 💡 Tips

1. **Component Placement**: Use the grid to align components neatly
2. **Testing**: Always test your code with the Run button before expecting results
3. **Serial Monitor**: Check the serial output for debugging messages
4. **Component Properties**: Different components have different attributes - check documentation
5. **Performance**: Too many components may slow down the simulation

## 🐛 Known Issues

1. **Wire Connections**: Visual wires are not yet implemented - pin assignments are logical only
2. **Component Rotation**: Components cannot be rotated yet
3. **Undo/Redo**: No undo functionality for component operations
4. **Mobile Support**: Touch interactions may not work perfectly on all devices

## 🎓 Example Circuits

### Blink LED
```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
```

### Button Control LED
```cpp
const int buttonPin = 2;
const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  int buttonState = digitalRead(buttonPin);
  digitalWrite(ledPin, buttonState);
  Serial.print("Button: ");
  Serial.println(buttonState);
  delay(100);
}
```

### PWM Fade
```cpp
int brightness = 0;
int fadeAmount = 5;

void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  analogWrite(9, brightness);
  brightness += fadeAmount;
  if (brightness <= 0 || brightness >= 255) {
    fadeAmount = -fadeAmount;
  }
  delay(30);
}
```
