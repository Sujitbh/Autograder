'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/utils/ThemeContext';
import { Loader2 } from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full gap-2" style={{ color: 'var(--color-text-mid)' }}>
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Loading editor...</span>
    </div>
  ),
});

const LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  javascript: 'javascript',
  js: 'javascript',
};

interface CodeEditorProps {
  language: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({ language, value = '', onChange, readOnly = false, height = '100%' }: CodeEditorProps) {
  const { theme } = useTheme();

  const handleChange = useCallback(
    (val: string | undefined) => {
      if (onChange && val !== undefined) {
        onChange(val);
      }
    },
    [onChange],
  );

  const monacoLanguage = LANGUAGE_MAP[language.toLowerCase()] ?? 'plaintext';
  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'light';

  return (
    <MonacoEditor
      height={height}
      language={monacoLanguage}
      theme={monacoTheme}
      value={value}
      onChange={handleChange}
      options={{
        readOnly,
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
        lineNumbers: 'on',
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'on',
        bracketPairColorization: { enabled: true },
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoIndent: 'full',
        folding: true,
        renderWhitespace: 'selection',
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        padding: { top: 12 },
      }}
    />
  );
}
