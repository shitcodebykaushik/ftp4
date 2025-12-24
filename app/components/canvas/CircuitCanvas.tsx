'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import type { Component } from '@/types/simulator';

export default function CircuitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [components] = useState<Component[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: canvasRef.current.parentElement?.clientWidth || 800,
      height: canvasRef.current.parentElement?.clientHeight || 600,
      backgroundColor: '#1a1a1a',
    });

    fabricCanvasRef.current = canvas;

    const handleResize = () => {
      if (canvasRef.current?.parentElement) {
        canvas.setDimensions({
          width: canvasRef.current.parentElement.clientWidth,
          height: canvasRef.current.parentElement.clientHeight,
        });
        canvas.renderAll();
      }
    };

    window.addEventListener('resize', handleResize);

    addBreadboard(canvas);
    addComponentPalette(canvas);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  const addBreadboard = (canvas: fabric.Canvas) => {
    const breadboardWidth = 400;
    const breadboardHeight = 300;
    const centerX = (canvas.width as number) / 2;
    const centerY = (canvas.height as number) / 2;

    const breadboard = new fabric.Rect({
      left: centerX - breadboardWidth / 2,
      top: centerY - breadboardHeight / 2,
      width: breadboardWidth,
      height: breadboardHeight,
      fill: '#2a2a2a',
      stroke: '#444',
      strokeWidth: 2,
      selectable: false,
      rx: 5,
      ry: 5,
    });

    const divider = new fabric.Line(
      [
        centerX - breadboardWidth / 2,
        centerY,
        centerX + breadboardWidth / 2,
        centerY,
      ],
      {
        stroke: '#555',
        strokeWidth: 1,
        selectable: false,
      }
    );

    canvas.add(breadboard, divider);

    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 5; j++) {
        const hole = new fabric.Circle({
          left: centerX - breadboardWidth / 2 + 20 + i * 12,
          top: centerY - breadboardHeight / 2 + 30 + j * 15,
          radius: 2,
          fill: '#1a1a1a',
          selectable: false,
        });
        canvas.add(hole);
      }
    }

    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 5; j++) {
        const hole = new fabric.Circle({
          left: centerX - breadboardWidth / 2 + 20 + i * 12,
          top: centerY + 20 + j * 15,
          radius: 2,
          fill: '#1a1a1a',
          selectable: false,
        });
        canvas.add(hole);
      }
    }
  };

  const addComponentPalette = (canvas: fabric.Canvas) => {
    const paletteX = 20;
    const paletteY = 20;
    const componentSize = 50;
    const spacing = 10;

    const components = [
      { label: 'Arduino', color: '#4a9eff' },
      { label: 'LED', color: '#ff4757' },
      { label: 'Button', color: '#ffa502' },
      { label: 'Resistor', color: '#f1c40f' },
    ];

    components.forEach((comp, index) => {
      const rect = new fabric.Rect({
        left: paletteX,
        top: paletteY + index * (componentSize + spacing),
        width: componentSize,
        height: componentSize,
        fill: comp.color,
        stroke: '#fff',
        strokeWidth: 2,
        rx: 5,
        ry: 5,
        selectable: true,
      });

      const text = new fabric.FabricText(comp.label, {
        left: paletteX + componentSize / 2,
        top: paletteY + index * (componentSize + spacing) + componentSize / 2,
        fontSize: 10,
        fill: '#fff',
        originX: 'center',
        originY: 'center',
        selectable: false,
      });

      canvas.add(rect, text);
    });
  };

  return (
    <div className="h-full w-full bg-[#1a1a1a]">
      <div className="border-b border-zinc-700 bg-[#252526] px-4 py-2">
        <h2 className="text-sm font-semibold text-zinc-300">Circuit Canvas</h2>
      </div>
      <div className="h-[calc(100%-41px)] w-full">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
