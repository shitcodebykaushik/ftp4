'use client';

import { useState, useEffect, useRef } from 'react';
import { SplitPane, Pane } from 'react-split-pane';
import CodeEditor from '../editor/CodeEditor';
import CircuitCanvas from '../canvas/CircuitCanvas';
import SerialMonitor from '../ui/SerialMonitor';
import ControlPanel from '../ui/ControlPanel';
import { getSimulator } from '@/lib/arduinoSimulator';
import type { SerialOutput, SimulationState } from '@/types/simulator';

export default function SimulatorLayout() {
  const [code, setCode] = useState('');
  const [serialOutput, setSerialOutput] = useState<SerialOutput[]>([]);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    isPaused: false,
    components: [],
    wires: [],
    serialOutput: [],
    currentTime: 0,
  });
  const stopSimulation = useRef<(() => void) | null>(null);

  useEffect(() => {
    const handleSerialOutput = (event: Event) => {
      const customEvent = event as CustomEvent<{ timestamp: number; message: string }>;
      const { timestamp, message } = customEvent.detail;
      setSerialOutput((prev) => [...prev, { timestamp, message }]);
    };

    window.addEventListener('arduino-serial', handleSerialOutput);

    return () => {
      window.removeEventListener('arduino-serial', handleSerialOutput);
      if (stopSimulation.current) {
        stopSimulation.current();
      }
    };
  }, []);

  const handleRun = async () => {
    setSimulationState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
    
    const simulator = getSimulator();
    simulator.start();

    setSerialOutput((prev) => [
      ...prev,
      { timestamp: Date.now(), message: '=== Simulation started ===' },
    ]);

    try {
      let shouldStop = false;
      stopSimulation.current = () => {
        shouldStop = true;
      };

      const pinMode = (pin: number, mode: string) => {
        simulator.pinMode(pin, mode as 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP');
      };

      const digitalWrite = (pin: number, value: number) => {
        simulator.digitalWrite(pin, value);
      };

      const digitalRead = (pin: number) => simulator.digitalRead(pin);

      const analogWrite = (pin: number, value: number) => {
        simulator.analogWrite(pin, value);
      };

      const analogRead = (pin: number) => simulator.analogRead(pin);

      const delay = (ms: number) => simulator.delay(ms);

      const LED_BUILTIN = simulator.LED_BUILTIN;
      const HIGH = 1;
      const LOW = 0;
      const INPUT = 'INPUT';
      const OUTPUT = 'OUTPUT';
      const INPUT_PULLUP = 'INPUT_PULLUP';

      const Serial = {
        begin: (baud: number) => simulator.serialBegin(baud),
        print: (msg: string | number) => simulator.serialPrint(String(msg)),
        println: (msg: string | number) => simulator.serialPrintln(String(msg)),
      };

      const setupCode = extractSetupCode(code);
      const loopCode = extractLoopCode(code);

      // Execute setup
      const setupFunction = new Function(
        'pinMode', 'digitalWrite', 'digitalRead', 'analogWrite', 'analogRead', 
        'delay', 'LED_BUILTIN', 'HIGH', 'LOW', 'INPUT', 'OUTPUT', 'INPUT_PULLUP', 'Serial',
        `return (async function() { ${setupCode} })();`
      );

      await setupFunction(
        pinMode, digitalWrite, digitalRead, analogWrite, analogRead,
        delay, LED_BUILTIN, HIGH, LOW, INPUT, OUTPUT, INPUT_PULLUP, Serial
      );

      // Execute loop continuously
      const loopFunction = new Function(
        'pinMode', 'digitalWrite', 'digitalRead', 'analogWrite', 'analogRead',
        'delay', 'LED_BUILTIN', 'HIGH', 'LOW', 'INPUT', 'OUTPUT', 'INPUT_PULLUP', 'Serial',
        `return (async function() { ${loopCode} })();`
      );

      while (!shouldStop) {
        await loopFunction(
          pinMode, digitalWrite, digitalRead, analogWrite, analogRead,
          delay, LED_BUILTIN, HIGH, LOW, INPUT, OUTPUT, INPUT_PULLUP, Serial
        );
      }
    } catch (error) {
      console.error('Simulation error:', error);
      setSerialOutput((prev) => [
        ...prev,
        { timestamp: Date.now(), message: `❌ Error: ${error}` },
      ]);
      setSimulationState((prev) => ({ ...prev, isRunning: false }));
    }
  };

  const handlePause = () => {
    setSimulationState((prev) => ({ ...prev, isPaused: true }));
    if (stopSimulation.current) {
      stopSimulation.current();
    }
    
    setSerialOutput((prev) => [
      ...prev,
      { timestamp: Date.now(), message: '⏸️ Simulation paused.' },
    ]);
  };

  const handleStop = () => {
    setSimulationState((prev) => ({ ...prev, isRunning: false, isPaused: false }));
    if (stopSimulation.current) {
      stopSimulation.current();
      stopSimulation.current = null;
    }
    
    const simulator = getSimulator();
    simulator.stop();
    
    setSerialOutput((prev) => [
      ...prev,
      { timestamp: Date.now(), message: '⏹️ Simulation stopped.' },
    ]);
  };

  const handleReset = () => {
    if (stopSimulation.current) {
      stopSimulation.current();
      stopSimulation.current = null;
    }

    setSimulationState({
      isRunning: false,
      isPaused: false,
      components: [],
      wires: [],
      serialOutput: [],
      currentTime: 0,
    });
    
    const simulator = getSimulator();
    simulator.reset();
    setSerialOutput([]);
  };

  const handleClearSerial = () => {
    setSerialOutput([]);
    const simulator = getSimulator();
    simulator.clearSerial();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#1e1e1e]">
      <ControlPanel
        isRunning={simulationState.isRunning}
        isPaused={simulationState.isPaused}
        onRun={handleRun}
        onPause={handlePause}
        onStop={handleStop}
        onReset={handleReset}
      />

      <div className="h-[calc(100vh-57px)]">
        <SplitPane direction="horizontal">
          <Pane minSize="300px" defaultSize="40%">
            <CodeEditor value={code} onChange={setCode} />
          </Pane>
          
          <Pane minSize="400px">
            <SplitPane direction="vertical">
              <Pane minSize="200px" defaultSize="70%">
                <CircuitCanvas />
              </Pane>
              
              <Pane minSize="150px">
                <SerialMonitor output={serialOutput} onClear={handleClearSerial} />
              </Pane>
            </SplitPane>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}

function extractSetupCode(code: string): string {
  const setupMatch = code.match(/void\s+setup\s*\(\s*\)\s*\{([\s\S]*?)\}/);
  if (setupMatch) {
    return setupMatch[1];
  }
  return '';
}

function extractLoopCode(code: string): string {
  const loopMatch = code.match(/void\s+loop\s*\(\s*\)\s*\{([\s\S]*?)\}/);
  if (loopMatch) {
    return loopMatch[1];
  }
  return '';
}
