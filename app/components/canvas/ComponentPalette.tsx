'use client';

interface ComponentPaletteProps {
  onAddComponent: (type: string) => void;
}

export default function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  const components = [
    { type: 'led', label: 'LED', icon: '💡' },
    { type: 'pushbutton', label: 'Button', icon: '🔘' },
    { type: 'resistor', label: 'Resistor', icon: '⚡' },
    { type: 'potentiometer', label: 'Potentiometer', icon: '🎚️' },
    { type: 'seven-segment', label: '7-Segment', icon: '🔢' },
    { type: 'lcd1602', label: 'LCD', icon: '📟' },
  ];

  return (
    <div className="w-full border-b border-zinc-700 bg-[#252526] p-3">
      <div className="flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-zinc-400 whitespace-nowrap">
          Components:
        </span>
        {components.map((comp) => (
          <button
            key={comp.type}
            onClick={() => onAddComponent(comp.type)}
            className="flex items-center gap-1.5 rounded bg-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-600 transition-colors whitespace-nowrap"
            title={`Add ${comp.label}`}
          >
            <span>{comp.icon}</span>
            <span>{comp.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
