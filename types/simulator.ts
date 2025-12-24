export interface Component {
  id: string;
  type: 'arduino' | 'led' | 'resistor' | 'button' | 'breadboard';
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  properties: Record<string, string | number | boolean>;
}

export interface Wire {
  id: string;
  from: {
    componentId: string;
    pin: string;
  };
  to: {
    componentId: string;
    pin: string;
  };
  color: string;
}

export interface SerialOutput {
  timestamp: number;
  message: string;
}

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  components: Component[];
  wires: Wire[];
  serialOutput: SerialOutput[];
  currentTime: number;
}

export interface PinState {
  componentId: string;
  pin: string;
  mode: 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';
  value: number;
  analogValue?: number;
}
