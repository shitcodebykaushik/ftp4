'use client';

import { useState } from 'react';
import { SplitPane, Pane } from 'react-split-pane';
import CodeEditor from '../editor/CodeEditor';
import CircuitCanvas from '../canvas/CircuitCanvas';
import SerialMonitor from '../ui/SerialMonitor';
import ControlPanel from '../ui/ControlPanel';
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

  const handleRun = () => {
    setSimulationState((prev) => ({ ...prev, isRunning: true, isPaused: false }));
    setSerialOutput([
      ...serialOutput,
      { timestamp: Date.now(), message: 'Simulation started...' },
    ]);
  };

  const handlePause = () => {
    setSimulationState((prev) => ({ ...prev, isPaused: true }));
    setSerialOutput([
      ...serialOutput,
      { timestamp: Date.now(), message: 'Simulation paused.' },
    ]);
  };

  const handleStop = () => {
    setSimulationState((prev) => ({ ...prev, isRunning: false, isPaused: false }));
    setSerialOutput([
      ...serialOutput,
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
    setSerialOutput([]);
  };

  const handleClearSerial = () => {
    setSerialOutput([]);
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
