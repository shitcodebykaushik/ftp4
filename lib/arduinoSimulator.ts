export interface PinState {
  mode: 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';
  value: number;
  analogValue?: number;
}

export interface SerialMessage {
  timestamp: number;
  message: string;
}

export class ArduinoSimulator {
  private pins: Map<number, PinState> = new Map();
  private serialBuffer: SerialMessage[] = [];
  private serialBaud: number = 9600;
  private isRunning: boolean = false;
  private loopInterval: NodeJS.Timeout | null = null;
  private setupCalled: boolean = false;

  public LED_BUILTIN = 13;

  constructor() {
    for (let i = 0; i <= 53; i++) {
      this.pins.set(i, { mode: 'INPUT', value: 0 });
    }
  }

  pinMode(pin: number, mode: 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP') {
    const pinState = this.pins.get(pin);
    if (pinState) {
      pinState.mode = mode;
    }
  }

  digitalWrite(pin: number, value: number) {
    const pinState = this.pins.get(pin);
    if (pinState && pinState.mode === 'OUTPUT') {
      pinState.value = value ? 1 : 0;
      console.log(`[Arduino] digitalWrite(${pin}, ${value}) -> ${pinState.value}`);
      this.notifyPinChange(pin, pinState.value);
    }
  }

  digitalRead(pin: number): number {
    const pinState = this.pins.get(pin);
    return pinState ? pinState.value : 0;
  }

  analogWrite(pin: number, value: number) {
    const pinState = this.pins.get(pin);
    if (pinState) {
      pinState.analogValue = Math.max(0, Math.min(255, value));
      this.notifyPinChange(pin, pinState.analogValue / 255);
    }
  }

  analogRead(pin: number): number {
    const pinState = this.pins.get(pin);
    return pinState?.analogValue || 0;
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  serialBegin(baud: number) {
    this.serialBaud = baud;
    this.serialPrintln(`Serial communication started at ${baud} baud`);
  }

  serialPrint(message: string) {
    const msg: SerialMessage = {
      timestamp: Date.now(),
      message: message,
    };
    this.serialBuffer.push(msg);
    this.notifySerial(msg);
  }

  serialPrintln(message: string) {
    this.serialPrint(message + '\n');
  }

  getPinState(pin: number): PinState | undefined {
    return this.pins.get(pin);
  }

  getSerialBuffer(): SerialMessage[] {
    return [...this.serialBuffer];
  }

  clearSerial() {
    this.serialBuffer = [];
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
  }

  reset() {
    this.stop();
    this.pins.clear();
    for (let i = 0; i <= 53; i++) {
      this.pins.set(i, { mode: 'INPUT', value: 0 });
    }
    this.serialBuffer = [];
    this.setupCalled = false;
  }

  private notifyPinChange(pin: number, value: number) {
    if (typeof window !== 'undefined') {
      console.log(`[Arduino] Pin ${pin} changed to ${value}`);
      window.dispatchEvent(
        new CustomEvent('arduino-pin-change', {
          detail: { pin, value },
        })
      );
    }
  }

  private notifySerial(message: SerialMessage) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('arduino-serial', {
          detail: message,
        })
      );
    }
  }
}

let simulatorInstance: ArduinoSimulator | null = null;

export function getSimulator(): ArduinoSimulator {
  if (!simulatorInstance) {
    simulatorInstance = new ArduinoSimulator();
  }
  return simulatorInstance;
}
