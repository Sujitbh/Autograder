'use client';

import { useCallback, useRef } from 'react';
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
  readonly language: string;
  readonly value?: string;
  readonly onChange?: (value: string) => void;
  readonly readOnly?: boolean;
  readonly height?: string;
}

/* ── Custom Monaco themes matching the Axiom maroon brand ── */
function defineAxiomThemes(monaco: typeof import('monaco-editor')) {
  monaco.editor.defineTheme('axiom-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: '2D2D2D', background: 'FFFFFF' },
      { token: 'comment', foreground: '8A8A8A', fontStyle: 'italic' },
      { token: 'keyword', foreground: '6B0000', fontStyle: 'bold' },
      { token: 'string', foreground: '2D6A2D' },
      { token: 'number', foreground: '8A5700' },
      { token: 'type', foreground: '1A4D7A', fontStyle: 'bold' },
      { token: 'function', foreground: '8B1A1A' },
      { token: 'variable', foreground: '2D2D2D' },
      { token: 'constant', foreground: '8B0000' },
      { token: 'operator', foreground: '595959' },
      { token: 'delimiter', foreground: '8A8A8A' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#2D2D2D',
      'editor.lineHighlightBackground': '#FAF5F5',
      'editor.selectionBackground': '#F5EDED80',
      'editorLineNumber.foreground': '#8A8A8A',
      'editorLineNumber.activeForeground': '#595959',
      'editorCursor.foreground': '#6B0000',
      'editor.inactiveSelectionBackground': '#F5EDED40',
      'editorIndentGuide.background1': '#D9D9D9',
      'editorIndentGuide.activeBackground1': '#8A8A8A',
      'editorBracketMatch.background': '#F5EDED60',
      'editorBracketMatch.border': '#6B0000',
      'minimap.background': '#FAF5F5',
      'scrollbarSlider.background': '#D9D9D950',
      'scrollbarSlider.hoverBackground': '#8A8A8A60',
    },
  });

  monaco.editor.defineTheme('axiom-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'F5F5F5', background: '1C1C1C' },
      { token: 'comment', foreground: '858585', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'D4544C', fontStyle: 'bold' },
      { token: 'string', foreground: '81C784' },
      { token: 'number', foreground: 'FFD54F' },
      { token: 'type', foreground: '90CAF9', fontStyle: 'bold' },
      { token: 'function', foreground: 'E8CC6E' },
      { token: 'variable', foreground: 'F5F5F5' },
      { token: 'constant', foreground: 'EF9A9A' },
      { token: 'operator', foreground: 'BDBDBD' },
      { token: 'delimiter', foreground: '858585' },
    ],
    colors: {
      'editor.background': '#1C1C1C',
      'editor.foreground': '#F5F5F5',
      'editor.lineHighlightBackground': '#2A2A2A',
      'editor.selectionBackground': '#6B000050',
      'editorLineNumber.foreground': '#555555',
      'editorLineNumber.activeForeground': '#BDBDBD',
      'editorCursor.foreground': '#D4544C',
      'editor.inactiveSelectionBackground': '#33333340',
      'editorIndentGuide.background1': '#333333',
      'editorIndentGuide.activeBackground1': '#555555',
      'editorBracketMatch.background': '#6B000030',
      'editorBracketMatch.border': '#D4544C80',
      'minimap.background': '#212121',
      'scrollbarSlider.background': '#33333360',
      'scrollbarSlider.hoverBackground': '#55555580',
    },
  });
}

export function CodeEditor({ language, value = '', onChange, readOnly = false, height = '100%' }: Readonly<CodeEditorProps>) {
  const { isDark } = useTheme();
  const themesDefinedRef = useRef(false);

  const handleChange = useCallback(
    (val: string | undefined) => {
      if (onChange && val !== undefined) {
        onChange(val);
      }
    },
    [onChange],
  );

  const handleBeforeMount = useCallback((monaco: typeof import('monaco-editor')) => {
    if (!themesDefinedRef.current) {
      defineAxiomThemes(monaco);
      themesDefinedRef.current = true;
    }
  }, []);

  const monacoLanguage = LANGUAGE_MAP[language.toLowerCase()] ?? 'plaintext';
  const monacoTheme = isDark ? 'axiom-dark' : 'axiom-light';

  return (
    <MonacoEditor
      height={height}
      language={monacoLanguage}
      theme={monacoTheme}
      value={value}
      onChange={handleChange}
      beforeMount={handleBeforeMount}
      options={{
        readOnly,
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
        lineNumbers: 'on',
        minimap: { enabled: true, scale: 1 },
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
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        guides: { bracketPairs: true },
      }}
    />
  );
}
