'use client';

import { useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/utils/ThemeContext';
import { submissionService } from '@/services/api';
import { defineAxiomThemes } from '@/components/CodeEditor';
import { Loader2, X, GitCompare } from 'lucide-react';

const DiffEditor = dynamic(
  () => import('@monaco-editor/react').then((m) => m.DiffEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center gap-2 py-16" style={{ color: 'var(--color-text-mid)' }}>
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading comparison…</span>
      </div>
    ),
  },
);

const LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  javascript: 'javascript',
  js: 'javascript',
};

function getRiskStyle(risk: 'low' | 'medium' | 'high') {
  if (risk === 'high') return { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' };
  if (risk === 'medium') return { bg: '#FEF3C7', color: '#92400E', border: '#FCD34D' };
  return { bg: '#DCFCE7', color: '#166534', border: '#86EFAC' };
}

export interface PlagiarismCompareModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly baseSubmissionId: string;
  readonly otherSubmissionId: number;
  readonly assignmentLanguage: string;
}

export function PlagiarismCompareModal({
  open,
  onClose,
  baseSubmissionId,
  otherSubmissionId,
  assignmentLanguage,
}: PlagiarismCompareModalProps) {
  const { isDark } = useTheme();
  const themesDefinedRef = useRef(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['plagiarism-compare', baseSubmissionId, otherSubmissionId],
    queryFn: () => submissionService.getPlagiarismCompare(baseSubmissionId, otherSubmissionId),
    enabled: open && !!baseSubmissionId && otherSubmissionId > 0,
  });

  const handleBeforeMount = useCallback((monaco: typeof import('monaco-editor')) => {
    if (!themesDefinedRef.current) {
      defineAxiomThemes(monaco);
      themesDefinedRef.current = true;
    }
  }, []);

  if (!open) return null;

  const monacoLang = LANGUAGE_MAP[assignmentLanguage.toLowerCase()] ?? 'plaintext';
  const monacoTheme = isDark ? 'axiom-dark' : 'axiom-light';
  const riskStyle = data ? getRiskStyle(data.risk) : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="plagiarism-compare-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex flex-col w-full max-w-[min(1200px,100vw-24px)] max-h-[min(900px,100vh-24px)] rounded-xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-elevated)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <GitCompare className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
            <div className="min-w-0">
              <h2 id="plagiarism-compare-title" className="text-sm font-bold truncate" style={{ color: 'var(--color-text-dark)' }}>
                Plagiarism comparison
              </h2>
              <p className="text-xs truncate" style={{ color: 'var(--color-text-mid)' }}>
                This submission vs submission #{otherSubmissionId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {data && riskStyle && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: riskStyle.bg,
                  color: riskStyle.color,
                  border: `1px solid ${riskStyle.border}`,
                }}
              >
                {data.similarity_percent}% similar
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-text-mid)' }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-2 py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
              <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
                Loading sources…
              </p>
            </div>
          )}

          {error && (
            <div className="p-6">
              <p className="text-sm font-semibold" style={{ color: '#B91C1C' }}>
                Could not load comparison.
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-mid)' }}>
                {(error as Error).message || 'Unknown error'}
              </p>
            </div>
          )}

          {data && !isLoading && (
            <>
              <div
                className="grid grid-cols-2 gap-0 text-xs font-semibold px-3 py-2 shrink-0"
                style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-dark)' }}
              >
                <div className="truncate pr-2">
                  Left: {data.base.student_name} — {data.base.filename ?? 'source'}
                </div>
                <div className="truncate pl-2 border-l" style={{ borderColor: 'var(--color-border)' }}>
                  Right: {data.peer.student_name} — {data.peer.filename ?? 'source'}
                </div>
              </div>
              <div className="w-full h-[min(52vh,520px)] min-h-[280px]">
                <DiffEditor
                  height="100%"
                  language={monacoLang}
                  theme={monacoTheme}
                  original={data.base.content}
                  modified={data.peer.content}
                  beforeMount={handleBeforeMount}
                  options={{
                    readOnly: true,
                    renderSideBySide: true,
                    fontSize: 13,
                    minimap: { enabled: true },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                  }}
                />
              </div>
              {data.unified_diff.trim().length > 0 && (
                <details className="shrink-0 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <summary
                    className="px-3 py-2 cursor-pointer text-xs font-semibold"
                    style={{ color: 'var(--color-text-mid)', background: 'var(--color-primary-bg)' }}
                  >
                    Unified diff (text)
                  </summary>
                  <pre
                    className="text-[11px] leading-relaxed overflow-auto max-h-40 p-3 m-0 font-mono"
                    style={{ background: '#111827', color: '#E5E7EB' }}
                  >
                    {data.unified_diff}
                  </pre>
                </details>
              )}
              <p className="text-[10px] px-3 py-2 shrink-0" style={{ color: 'var(--color-text-light)' }}>
                {data.note}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
