'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleSerialOutput = (event: Event) => {
      const customEvent = event as CustomEvent<{ timestamp: number; message: string }>;
      const { timestamp, message } = customEvent.detail;
      setSerialOutput((prev) => [...prev, { timestamp, message }]);
    };

    window.addEventListener('arduino-serial', handleSerialOutput);

    return () => {
      window.removeEventListener('arduino-serial', handleSerialOutput);
    };
  }, []);

  const handleRun = async () => {
    setSimulationState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
    
    const simulator = getSimulator();
    simulator.start();

    setSerialOutput((prev) => [
      ...prev,
      { timestamp: Date.now(), message: 'Simulation started...' },
    ]);

    try {
      const arduino = {
        pinMode: (pin: number, mode: string) => {
          simulator.pinMode(pin, mode as 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP');
        },
        digitalWrite: (pin: number, value: number) => {
          simulator.digitalWrite(pin, value);
        },
        digitalRead: (pin: number) => simulator.digitalRead(pin),
        analogWrite: (pin: number, value: number) => {
          simulator.analogWrite(pin, value);
        },
        analogRead: (pin: number) => simulator.analogRead(pin),
        delay: (ms: number) => simulator.delay(ms),
        LED_BUILTIN: simulator.LED_BUILTIN,
        HIGH: 1,
        LOW: 0,
        INPUT: 'INPUT',
        OUTPUT: 'OUTPUT',
        INPUT_PULLUP: 'INPUT_PULLUP',
      };

      const serial = {
        begin: (baud: number) => simulator.serialBegin(baud),
        print: (msg: string) => simulator.serialPrint(String(msg)),
        println: (msg: string) => simulator.serialPrintln(String(msg)),
      };

      const wrappedCode = `
        (async function() {
          const { pinMode, digitalWrite, digitalRead, analogWrite, analogRead, delay, LED_BUILTIN, HIGH, LOW, INPUT, OUTPUT, INPUT_PULLUP } = arduino;
          const Serial = serial;
          
          async function setup() {
            ${extractSetupCode(code)}
          }
          
          async function loop() {
            ${extractLoopCode(code)}
          }
          
          await setup();
          
          while(true) {
            await loop();
          }
        })();
      `;

      // Note: Function constructor is used here for code execution - consider alternative approaches for production
      (new Function('arduino', 'serial', `"use strict"; ${wrappedCode}`))(arduino, serial);
    } catch (error) {
      console.error('Simulation error:', error);
      setSerialOutput((prev) => [
        ...prev,
        { timestamp: Date.now(), message: `Error: ${error}` },
      ]);
    }
  };

  const handlePause = () => {
    setSimulationState((prev) => ({ ...prev, isPaused: true }));
    const simulator = getSimulator();
    simulator.stop();
    
    setSerialOutput((prev) => [
      ...prev,
      { timestamp: Date.now(), message: 'Simulation paused.' },
    ]);
  };

  const handleStop = () => {
    setSimulationState((prev) => ({ ...prev, isRunning: false, isPaused: false }));
    const simulator = getSimulator();
    simulator.stop();
    
    setSerialOutput((prev) => [
      ...prev,
      { timestamp: Date.now(), message: 'Simulation stopped.' },
    ]);
  };

  const handleReset = () => {
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
