# Quick Start Guide

## 🚀 Getting Started in 60 Seconds

### 1. Install & Run (10 seconds)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Write Code (20 seconds)

The editor already has a blink example. If not, paste this:

```cpp
void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("LED ON");
  delay(1000);
  
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}
```

### 3. Run Simulation (5 seconds)

1. Click the green **Run** button
2. Watch the LED blink on the canvas!
3. See output in Serial Monitor below

### 4. Experiment (25 seconds)

Try changing the delay:

```cpp
delay(500);  // Blink faster!
```

Or change the LED pattern:

```cpp
void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(100);
  digitalWrite(LED_BUILTIN, LOW);
  delay(900);
}
```

Click **Stop**, then **Run** again to see changes.

## ✨ What You See

```
┌──────────────────────────────────────────┐
│  Run | Pause | Stop | Reset              │
├─────────────────┬────────────────────────┤
│                 │  🤖 Arduino Board       │
│  Code Editor    │  💡 LED (blinks!)      │
│  (Monaco)       │  🔘 Button             │
│                 │                         │
├─────────────────┴────────────────────────┤
│  Serial Monitor                           │
│  > LED ON                                 │
│  > LED OFF                                │
└──────────────────────────────────────────┘
```

## 🎮 Controls

- **Run** ▶️ - Start simulation
- **Pause** ⏸️ - Pause execution
- **Stop** ⏹️ - Stop and reset
- **Reset** 🔄 - Clear everything

## 🧩 Add Components

Click component buttons to add:

- 💡 LED
- 🔘 Button  
- ⚡ Resistor
- 🎚️ Potentiometer
- 🔢 7-Segment Display
- 📟 LCD Display

Drag components to reposition them.

## 📝 Example Projects

### Blink LED (Beginner)

```cpp
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
```

### Fade LED (Intermediate)

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

### Morse Code (Advanced)

```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // S (...)
  for(int i=0; i<3; i++) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(200);
    digitalWrite(LED_BUILTIN, LOW);
    delay(200);
  }
  delay(600);
  
  // O (---)
  for(int i=0; i<3; i++) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(600);
    digitalWrite(LED_BUILTIN, LOW);
    delay(200);
  }
  delay(600);
  
  // S (...)
  for(int i=0; i<3; i++) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(200);
    digitalWrite(LED_BUILTIN, LOW);
    delay(200);
  }
  
  delay(2000);
  Serial.println("SOS");
}
```

## 🎯 Tips

1. **Always call pinMode()** in setup() before using a pin
2. **Use Serial.begin(9600)** to see debug output
3. **Add delay()** in loop() or it runs too fast
4. **Stop before Run** - Click Stop before starting new simulation
5. **Check console** - Press F12 to see debug messages

## 🐛 Troubleshooting

### Simulation not working?

1. Open browser console (F12)
2. Look for errors in red
3. Click Reset and try again

### LED not blinking?

1. Check you called `pinMode(LED_BUILTIN, OUTPUT)`
2. Make sure you're using digitalWrite()
3. Verify delay() is called

### Nothing in Serial Monitor?

1. Add `Serial.begin(9600)` in setup()
2. Use `Serial.println()` not just `Serial.print()`
3. Click Clear and Run again

## 📚 Next Steps

- [Full Documentation](./README.md)
- [Wokwi Integration Guide](./WOKWI_INTEGRATION.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

## 🎓 Learn Arduino

New to Arduino? Try these functions:

```cpp
// Digital I/O
pinMode(pin, OUTPUT);        // Set pin as output
digitalWrite(pin, HIGH);     // Turn pin on (5V)
digitalWrite(pin, LOW);      // Turn pin off (0V)
int value = digitalRead(pin);// Read pin state

// Analog I/O  
analogWrite(pin, 128);       // PWM (0-255)
int value = analogRead(A0);  // Read analog (0-1023)

// Serial
Serial.begin(9600);          // Start serial
Serial.print("Hello");       // Print text
Serial.println(value);       // Print with newline

// Timing
delay(1000);                 // Wait 1 second
unsigned long time = millis(); // Get milliseconds

// Constants
LED_BUILTIN = 13            // Built-in LED pin
HIGH = 1                    // On
LOW = 0                     // Off
```

## 🎉 Have Fun!

Experiment, break things, learn! The simulator resets with one click.

---

**Ready to build something awesome? Click Run!** ▶️
