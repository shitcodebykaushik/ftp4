'use client';

import { Editor } from '@monaco-editor/react';
import { defaultSketch } from '@/lib/defaultSketch';
import { useState } from 'react';

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  const [code, setCode] = useState(value || defaultSketch);

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || '';
    setCode(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      <div className="border-b border-zinc-700 bg-[#252526] px-4 py-2">
        <h2 className="text-sm font-semibold text-zinc-300">Code Editor</h2>
      </div>
      <Editor
        height="calc(100% - 41px)"
        defaultLanguage="cpp"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
