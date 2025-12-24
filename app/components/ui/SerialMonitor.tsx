'use client';

import { useEffect, useRef } from 'react';
import type { SerialOutput } from '@/types/simulator';

interface SerialMonitorProps {
  output: SerialOutput[];
  onClear?: () => void;
}

export default function SerialMonitor({ output, onClear }: SerialMonitorProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-zinc-700 bg-[#252526] px-4 py-2">
        <h2 className="text-sm font-semibold text-zinc-300">Serial Monitor</h2>
        <button
          onClick={onClear}
          className="rounded bg-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-600"
        >
          Clear
        </button>
      </div>
      <div
        ref={outputRef}
        className="h-[calc(100%-41px)] overflow-auto p-4 font-mono text-sm text-zinc-300"
      >
        {output.length === 0 ? (
          <div className="text-zinc-500">No serial output yet...</div>
        ) : (
          output.map((line, index) => (
            <div key={index} className="mb-1">
              <span className="text-zinc-500">
                [{new Date(line.timestamp).toLocaleTimeString()}]
              </span>{' '}
              <span>{line.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
