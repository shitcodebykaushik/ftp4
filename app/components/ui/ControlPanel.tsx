'use client';

interface ControlPanelProps {
  isRunning: boolean;
  isPaused: boolean;
  onRun: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
}

export default function ControlPanel({
  isRunning,
  isPaused,
  onRun,
  onPause,
  onStop,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-700 bg-[#252526] px-4 py-3">
      <button
        onClick={onRun}
        disabled={isRunning && !isPaused}
        className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        Run
      </button>

      <button
        onClick={onPause}
        disabled={!isRunning || isPaused}
        className="flex items-center gap-2 rounded bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
        Pause
      </button>

      <button
        onClick={onStop}
        disabled={!isRunning}
        className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M6 6h12v12H6z" />
        </svg>
        Stop
      </button>

      <button
        onClick={onReset}
        className="flex items-center gap-2 rounded bg-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Reset
      </button>

      {isRunning && (
        <div className="ml-auto flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm text-zinc-300">
            {isPaused ? 'Paused' : 'Running'}
          </span>
        </div>
      )}
    </div>
  );
}
