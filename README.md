# Arduino Simulator Platform

A real-time Arduino simulator built with Next.js 16, React 19, and authentic [Wokwi Elements](https://www.npmjs.com/package/@wokwi/elements). Experience hardware simulation with actual web components used in the Wokwi platform.

![Arduino Simulator](https://img.shields.io/badge/Arduino-Simulator-00979D?style=for-the-badge&logo=arduino)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## ✨ Features

### 🎮 Real-Time Simulation
- **Live Hardware**: Real Wokwi web components (LED, buttons, Arduino Uno)
- **Interactive Components**: Drag, drop, and interact with components
- **Pin Control**: Real-time LED control via digitalWrite()
- **Serial Monitor**: Live serial output with timestamps

### 💻 Professional Code Editor
- **Monaco Editor**: Same editor as VS Code
- **Arduino Syntax**: C++ syntax highlighting for Arduino
- **Auto-complete**: Smart code completion
- **Dark Theme**: Easy on the eyes

### 🎨 Modern UI
- **Split Panes**: Resizable editor and canvas panels
- **Component Palette**: Add components with one click
- **Grid Canvas**: Visual grid for component alignment
- **Responsive**: Works on any screen size

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the simulator.

## 🎯 How to Use

### 1. Write Arduino Code
Use the code editor on the left to write your Arduino sketch:

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

### 2. Add Components
Click components in the palette to add them to the canvas:
- **LED** - Visual output indicator
- **Button** - User input
- **Resistor** - Circuit element
- **Potentiometer** - Variable input
- **7-Segment** - Numeric display
- **LCD** - Text display

### 3. Run Simulation
- Click **Run** to start the simulation
- Watch the LED blink in real-time
- Check the serial monitor for output
- Use **Pause/Stop** to control execution

### 4. Interact with Components
- **Drag** components to rearrange
- **Click** to select components
- **Delete** key to remove selected components
- **Button** components respond to clicks

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Arduino Simulator                   │
├──────────────────┬──────────────────────────────┤
│  Code Editor     │     Circuit Canvas           │
│  (Monaco)        │     (Wokwi Elements)         │
│                  │                               │
│  - C++ Syntax    │  - Drag & Drop               │
│  - Auto-complete │  - Real Components           │
│  - Dark Theme    │  - Pin Control               │
│                  │                               │
│                  ├───────────────────────────────┤
│                  │   Serial Monitor              │
│                  │   - Live Output               │
└──────────────────┴───────────────────────────────┘
```

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Code Editor**: Monaco Editor
- **Hardware**: @wokwi/elements
- **Layout**: React Split Pane

## 🧩 Wokwi Elements

This simulator uses authentic Wokwi web components:

| Component | Element | Status |
|-----------|---------|--------|
| Arduino Uno | `wokwi-arduino-uno` | ✅ Active |
| LED | `wokwi-led` | ✅ Active |
| Push Button | `wokwi-pushbutton` | ✅ Active |
| Resistor | `wokwi-resistor` | ✅ Available |
| Potentiometer | `wokwi-potentiometer` | ✅ Available |
| 7-Segment | `wokwi-seven-segment` | ✅ Available |
| LCD 16x2 | `wokwi-lcd1602` | ✅ Available |

See [WOKWI_INTEGRATION.md](./WOKWI_INTEGRATION.md) for detailed documentation.

## 🎓 Supported Arduino Functions

### Digital I/O
```cpp
pinMode(pin, OUTPUT);
digitalWrite(pin, HIGH);
int value = digitalRead(pin);
```

### Analog I/O
```cpp
analogWrite(pin, 128);      // PWM (0-255)
int value = analogRead(A0); // ADC (0-1023)
```

### Serial Communication
```cpp
Serial.begin(9600);
Serial.print("Hello");
Serial.println("World");
```

### Timing
```cpp
delay(1000);  // milliseconds
```

## 📁 Project Structure

```
project/
├── app/
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── CircuitCanvas.tsx       # Wokwi components
│   │   │   └── ComponentPalette.tsx    # Component toolbar
│   │   ├── editor/
│   │   │   └── CodeEditor.tsx          # Monaco editor
│   │   ├── layout/
│   │   │   └── SimulatorLayout.tsx     # Main layout
│   │   └── ui/
│   │       ├── ControlPanel.tsx        # Run/Stop controls
│   │       └── SerialMonitor.tsx       # Serial output
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── arduinoSimulator.ts             # Arduino engine
│   └── defaultSketch.ts                # Template code
├── types/
│   └── simulator.ts                    # TypeScript types
└── public/
    └── components/                     # SVG assets
```

## 🎯 Example Projects

### Blink LED
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

### Button Control
```cpp
void setup() {
  pinMode(2, INPUT);
  pinMode(13, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int state = digitalRead(2);
  digitalWrite(13, state);
  Serial.println(state);
  delay(100);
}
```

### PWM Fade
```cpp
int brightness = 0;

void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  analogWrite(9, brightness);
  brightness = (brightness + 5) % 256;
  delay(30);
}
```

## 🛠️ Development

### Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

### Adding Components
See [WOKWI_INTEGRATION.md](./WOKWI_INTEGRATION.md) for how to add more Wokwi components.

## 📚 Documentation

- [SIMULATOR_README.md](./SIMULATOR_README.md) - Detailed simulator docs
- [WOKWI_INTEGRATION.md](./WOKWI_INTEGRATION.md) - Wokwi components guide

## 🔮 Roadmap

- [x] Real-time LED control
- [x] Component drag & drop
- [x] Serial monitor
- [x] Multiple components
- [ ] Wire drawing
- [ ] Button input handling
- [ ] Analog input (potentiometer)
- [ ] LCD display output
- [ ] Save/load circuits
- [ ] More sensors
- [ ] I2C/SPI support

## 🤝 Contributing

Contributions are welcome! This is a learning project showcasing:
- Next.js 16 App Router
- React 19 features
- Web Components integration
- Real-time simulation
- TypeScript best practices

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- [Wokwi](https://wokwi.com/) - For the amazing web components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - For the code editor
- [Next.js](https://nextjs.org/) - For the React framework
- [Tailwind CSS](https://tailwindcss.com/) - For the styling

## 🐛 Known Issues

- Wire connections are logical only (no visual wires yet)
- Component rotation not implemented
- Limited to basic Arduino functions
- No I2C/SPI communication yet

## 💡 Tips

1. Use the grid to align components neatly
2. Check the serial monitor for debugging
3. Components remember their positions
4. Use Delete key to remove components
5. Test code incrementally

---

**Built with ❤️ using Next.js, React, and Wokwi Elements**
