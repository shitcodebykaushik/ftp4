'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ComponentPalette from './ComponentPalette';

interface WokwiComponent {
  id: string;
  type: string;
  element: HTMLElement;
  x: number;
  y: number;
}

export default function CircuitCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [components, setComponents] = useState<WokwiComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const elementsLoaded = useRef(false);

  useEffect(() => {
    if (!containerRef.current || elementsLoaded.current) return;

    const loadWokwiElements = async () => {
      try {
        await import('@wokwi/elements');
        elementsLoaded.current = true;

        const container = containerRef.current;
        if (!container) return;

        const arduino = document.createElement('wokwi-arduino-uno');
        arduino.id = 'arduino';
        arduino.style.position = 'absolute';
        arduino.style.left = '100px';
        arduino.style.top = '100px';
        arduino.style.cursor = 'move';
        container.appendChild(arduino);

        const led = document.createElement('wokwi-led');
        led.id = 'led1';
        led.setAttribute('color', 'red');
        led.setAttribute('pin', '13');
        led.style.position = 'absolute';
        led.style.left = '400px';
        led.style.top = '150px';
        led.style.cursor = 'move';
        container.appendChild(led);

        const button = document.createElement('wokwi-pushbutton');
        button.id = 'button1';
        button.setAttribute('color', 'blue');
        button.setAttribute('pin', '2');
        button.style.position = 'absolute';
        button.style.left = '400px';
        button.style.top = '250px';
        button.style.cursor = 'pointer';
        container.appendChild(button);

        button.addEventListener('button-press', () => {
          console.log('Button pressed');
        });

        button.addEventListener('button-release', () => {
          console.log('Button released');
        });

        const handlePinChange = (event: Event) => {
          const customEvent = event as CustomEvent<{ pin: number; value: number }>;
          const { pin, value } = customEvent.detail;
          console.log(`[Canvas] Pin change event: pin=${pin}, value=${value}`);
          
          if (pin === 13) {
            const newValue = value > 0.5;
            console.log(`[Canvas] Setting LED to ${newValue}`);
            (led as HTMLElement & { value: boolean }).value = newValue;
          }
        };

        window.addEventListener('arduino-pin-change', handlePinChange);
        console.log('[Canvas] LED listener registered for pin 13');

        setComponents([
          { id: 'arduino', type: 'arduino-uno', element: arduino, x: 100, y: 100 },
          { id: 'led1', type: 'led', element: led, x: 400, y: 150 },
          { id: 'button1', type: 'pushbutton', element: button, x: 400, y: 250 },
        ]);

        makeDraggable(arduino, 'arduino');
        makeDraggable(led, 'led1');
        makeDraggable(button, 'button1');

        return () => {
          window.removeEventListener('arduino-pin-change', handlePinChange);
        };
      } catch (error) {
        console.error('Failed to load Wokwi elements:', error);
      }
    };

    loadWokwiElements();
  }, []);

  const makeDraggable = (element: HTMLElement, id: string) => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName.toLowerCase().includes('button')) {
        return;
      }

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = element.getBoundingClientRect();
      const parent = element.parentElement?.getBoundingClientRect();
      initialX = rect.left - (parent?.left || 0);
      initialY = rect.top - (parent?.top || 0);
      element.style.zIndex = '1000';
      setSelectedComponent(id);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newX = initialX + dx;
      const newY = initialY + dy;

      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        element.style.zIndex = '1';

        setComponents((prev) =>
          prev.map((comp) =>
            comp.id === id
              ? {
                  ...comp,
                  x: parseInt(element.style.left),
                  y: parseInt(element.style.top),
                }
              : comp
          )
        );
      }
    };

    element.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      element.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  };

  const addComponent = (type: string) => {
    if (!containerRef.current || !elementsLoaded.current) return;

    const id = `${type}-${Date.now()}`;
    const x = 200 + Math.random() * 200;
    const y = 200 + Math.random() * 200;

    const element = document.createElement(`wokwi-${type}`) as HTMLElement;
    element.id = id;
    element.style.position = 'absolute';
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.cursor = 'move';

    if (type === 'led') {
      element.setAttribute('color', 'red');
    } else if (type === 'pushbutton') {
      element.setAttribute('color', 'blue');
      element.style.cursor = 'pointer';
      element.addEventListener('button-press', () => {
        console.log(`Button ${id} pressed`);
      });
    } else if (type === 'resistor') {
      element.setAttribute('value', '220');
    } else if (type === 'potentiometer') {
      element.setAttribute('value', '50');
    }

    containerRef.current.appendChild(element);
    makeDraggable(element, id);

    setComponents((prev) => [...prev, { id, type, element, x, y }]);
  };

  const deleteSelectedComponent = useCallback(() => {
    if (!selectedComponent) return;

    const component = components.find((c) => c.id === selectedComponent);
    if (component && component.id !== 'arduino') {
      component.element.remove();
      setComponents((prev) => prev.filter((c) => c.id !== selectedComponent));
      setSelectedComponent(null);
    }
  }, [selectedComponent, components]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponent) {
        deleteSelectedComponent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent, components, deleteSelectedComponent]);

  return (
    <div className="h-full w-full bg-[#1a1a1a] flex flex-col">
      <div className="border-b border-zinc-700 bg-[#252526] px-4 py-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300">Circuit Canvas</h2>
        {selectedComponent && selectedComponent !== 'arduino' && (
          <button
            onClick={deleteSelectedComponent}
            className="rounded bg-red-700 px-3 py-1 text-xs text-white hover:bg-red-600"
          >
            Delete Selected (Del)
          </button>
        )}
      </div>

      <ComponentPalette onAddComponent={addComponent} />

      <div
        ref={containerRef}
        className="flex-1 w-full relative overflow-auto bg-gradient-to-br from-[#1a1a1a] to-[#252525]"
        style={{ minHeight: '500px' }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedComponent(null);
          }
        }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 19px, #333 19px, #333 20px),
              repeating-linear-gradient(90deg, transparent, transparent 19px, #333 19px, #333 20px)
            `,
          }}
        />
      </div>
    </div>
  );
}
