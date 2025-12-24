# Arduino Simulator Platform

A Wokwi-like Arduino simulator built with Next.js 16, React 19, TypeScript, and modern web technologies.

## 🎯 Features

- **Code Editor**: Monaco Editor with Arduino (C++) syntax highlighting
- **Circuit Canvas**: Interactive Fabric.js canvas with breadboard and component palette
- **Serial Monitor**: Real-time serial output display with timestamps
- **Control Panel**: Run, Pause, Stop, and Reset simulation controls
- **Responsive Layout**: Split-pane interface with resizable panels

## 🏗️ Project Structure

```
project/
├── app/
│   ├── components/
│   │   ├── canvas/
│   │   │   └── CircuitCanvas.tsx       # Fabric.js circuit canvas
│   │   ├── editor/
│   │   │   └── CodeEditor.tsx          # Monaco code editor
│   │   ├── layout/
│   │   │   └── SimulatorLayout.tsx     # Main split-pane layout
│   │   └── ui/
│   │       ├── ControlPanel.tsx        # Simulation controls
│   │       └── SerialMonitor.tsx       # Serial output display
│   ├── globals.css                     # Global styles + resizer styles
│   ├── layout.tsx                      # Root layout with fonts & metadata
│   └── page.tsx                        # Home page (renders SimulatorLayout)
├── lib/
│   └── defaultSketch.ts                # Default Arduino sketch template
├── types/
│   └── simulator.ts                    # TypeScript interfaces
└── public/
    └── components/                     # SVG component assets
        ├── arduino.svg
        ├── led.svg
        ├── button.svg
        └── resistor.svg
```

## 📦 Dependencies

### Core
- **next**: ^16.0.7
- **react**: ^19.2.1
- **react-dom**: ^19.2.1

### Simulator Libraries
- **monaco-editor**: ^0.55.1 - Code editor engine
- **@monaco-editor/react**: ^4.7.0 - React wrapper for Monaco
- **fabric**: ^7.0.0 - Canvas manipulation library
- **react-split-pane**: ^3.0.4 - Resizable split panels

### Dev Dependencies
- **@types/fabric**: ^5.3.10 - TypeScript definitions for Fabric.js
- **typescript**: ^5
- **tailwindcss**: ^4
- **@tailwindcss/postcss**: ^4
- **eslint**: ^9

## 🎨 Layout

The simulator uses a 3-panel split layout:

```
┌─────────────────────────────────────────────────┐
│           Control Panel (Top Bar)                │
├──────────────────┬──────────────────────────────┤
│                  │                               │
│   Code Editor    │     Circuit Canvas            │
│     (40%)        │         (60%)                 │
│                  │                               │
│                  ├───────────────────────────────┤
│                  │                               │
│                  │    Serial Monitor (Bottom)    │
│                  │                               │
└──────────────────┴───────────────────────────────┘
```

- **Left Panel (40%)**: Monaco code editor with Arduino template
- **Right Top (60% of right, 70% of height)**: Circuit canvas with breadboard
- **Right Bottom (30% of height)**: Serial monitor for output

## 🧩 Component Interfaces

### SimulationState
```typescript
interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  components: Component[];
  wires: Wire[];
  serialOutput: SerialOutput[];
  currentTime: number;
}
```

### Component
```typescript
interface Component {
  id: string;
  type: 'arduino' | 'led' | 'resistor' | 'button' | 'breadboard';
  position: { x: number; y: number };
  rotation: number;
  properties: Record<string, any>;
}
```

### Wire
```typescript
interface Wire {
  id: string;
  from: { componentId: string; pin: string };
  to: { componentId: string; pin: string };
  color: string;
}
```

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## 🎯 Current Implementation Status

### ✅ Phase 1 Complete
- [x] Core dependencies installed
- [x] Project structure created
- [x] Code editor with Monaco
- [x] Circuit canvas with Fabric.js
- [x] Serial monitor component
- [x] Control panel with buttons
- [x] Split-pane layout
- [x] TypeScript interfaces
- [x] Default Arduino sketch
- [x] SVG component assets
- [x] Dark mode styling
- [x] Resizable panels

### 🔜 Next Steps (Phase 2)
- [ ] Arduino code parser/compiler
- [ ] Simulation engine
- [ ] Component state management
- [ ] Pin I/O simulation
- [ ] Serial.print() implementation
- [ ] Drag-and-drop component placement
- [ ] Wire drawing and connections
- [ ] Real-time simulation execution

## 🎨 Styling

- **Dark Theme**: Dark editor and canvas backgrounds (#1e1e1e, #1a1a1a)
- **Tailwind CSS v4**: Utility-first styling
- **Custom Resizers**: Draggable split-pane dividers with hover effects
- **Responsive**: Handles window resize gracefully

## 📝 Development Notes

### Fabric.js v7 API Changes
The project uses Fabric.js v7 which has breaking changes from v5:
- Import as namespace: `import * as fabric from 'fabric'`
- Use `FabricText` instead of `Text`
- `Line` constructor: `new fabric.Line([x1, y1, x2, y2], options)`
- Canvas dimensions: Use `setDimensions({ width, height })`

### Monaco Editor
- Language: C++ (closest to Arduino syntax)
- Theme: vs-dark
- Features: Line numbers, syntax highlighting, auto-layout

### React Split Pane v3
- Uses named exports: `import { SplitPane, Pane } from 'react-split-pane'`
- Direction: 'horizontal' or 'vertical'
- Size units: pixels (px) or percentage (%)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Code Editor**: Monaco Editor
- **Canvas**: Fabric.js v7
- **Layout**: React Split Pane v3
- **Fonts**: Geist Sans & Geist Mono

## 📄 License

This project is part of a learning/development exercise.
