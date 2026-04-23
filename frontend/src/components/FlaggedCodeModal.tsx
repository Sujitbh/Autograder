'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/utils/ThemeContext';
import { submissionService } from '@/services/api';
import type { FlaggedCodeFileResult } from '@/services/api/submissionService';
import { defineAxiomThemes } from '@/components/CodeEditor';
import { Loader2, X, ShieldAlert, FileCode2 } from 'lucide-react';

// We only need the basic Editor here (not the DiffEditor). Load dynamically so
// Monaco stays out of the server bundle, matching how PlagiarismCompareModal
// handles its DiffEditor.
const MonacoEditor = dynamic(
    () => import('@monaco-editor/react').then((m) => m.default),
    {
        ssr: false,
        loading: () => (
            <div
                className="flex items-center justify-center gap-2 py-16"
                style={{ color: 'var(--color-text-mid)' }}
            >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading flagged code…</span>
            </div>
        ),
    },
);

const LANGUAGE_MAP: Record<string, string> = {
    python: 'python',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    'c++': 'cpp',
    c: 'c',
    javascript: 'javascript',
    js: 'javascript',
    typescript: 'typescript',
    ts: 'typescript',
};

function detectMonacoLanguage(filename: string | undefined, fallback: string): string {
    const ext = (filename ?? '').split('.').pop()?.toLowerCase() ?? '';
    return LANGUAGE_MAP[ext] ?? LANGUAGE_MAP[fallback.toLowerCase()] ?? 'plaintext';
}

function riskPillStyle(thresholdExceeded: boolean) {
    return thresholdExceeded
        ? { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' }
        : { background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC' };
}

export interface FlaggedCodeModalProps {
    readonly open: boolean;
    readonly onClose: () => void;
    readonly submissionId: string | number;
    readonly assignmentLanguage: string;
}

// Module-scoped flag so we only inject the highlight CSS once, even if the
// modal opens/closes many times (or is mounted in multiple places).
let highlightStyleInjected = false;

function ensureHighlightStyles(): void {
    if (typeof document === 'undefined' || highlightStyleInjected) return;
    const style = document.createElement('style');
    style.dataset.flaggedCodeHighlights = 'true';
    style.textContent = `
        .flagged-code-line-bg {
            background-color: rgba(220, 38, 38, 0.14);
        }
        .flagged-code-line-gutter {
            background-color: rgba(220, 38, 38, 0.65);
            width: 3px !important;
            margin-left: 3px;
        }
    `;
    document.head.appendChild(style);
    highlightStyleInjected = true;
}

export function FlaggedCodeModal({
    open,
    onClose,
    submissionId,
    assignmentLanguage,
}: FlaggedCodeModalProps) {
    const { isDark } = useTheme();
    const themesDefinedRef = useRef(false);
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);
    const decorationIdsRef = useRef<string[]>([]);
    const [activeFileIndex, setActiveFileIndex] = useState(0);

    useEffect(() => {
        if (open) ensureHighlightStyles();
    }, [open]);

    // Reset the active file whenever the modal closes so the next open starts
    // at the top-most flagged file.
    useEffect(() => {
        if (!open) setActiveFileIndex(0);
    }, [open]);

    const submissionKey = String(submissionId);
    const { data, isLoading, error } = useQuery({
        queryKey: ['submission-flagged-code', submissionKey],
        queryFn: () => submissionService.getFlaggedCode(submissionKey),
        enabled: open && !!submissionKey,
        staleTime: 60_000,
    });

    // Prefer files that actually crossed the threshold; fall back to whatever
    // came back so the TA/instructor always sees something useful.
    const orderedFiles: FlaggedCodeFileResult[] = useMemo(() => {
        if (!data?.files) return [];
        const copy = [...data.files];
        copy.sort((a, b) => {
            if (a.threshold_exceeded !== b.threshold_exceeded) {
                return a.threshold_exceeded ? -1 : 1;
            }
            return (b.file_ai_confidence ?? 0) - (a.file_ai_confidence ?? 0);
        });
        return copy;
    }, [data?.files]);

    const activeFile: FlaggedCodeFileResult | undefined = orderedFiles[activeFileIndex];

    const activeFileContent = useMemo(() => {
        if (!activeFile) return '';
        if (activeFile.full_file_code && activeFile.full_file_code.trim().length > 0) {
            return activeFile.full_file_code;
        }
        // If the backend didn't include the full file, stitch together the
        // flagged blocks we do have so the instructor can still review them.
        return (activeFile.blocks || [])
            .map((block) => {
                const range = block.start_line && block.end_line
                    ? `// lines ${block.start_line}-${block.end_line}`
                    : `// block ${block.block_id}`;
                return `${range}\n${block.code ?? ''}`;
            })
            .join('\n\n// ──────────────────────────────\n\n');
    }, [activeFile]);

    const monacoLanguage = detectMonacoLanguage(
        activeFile?.filename,
        activeFile?.detected_language || assignmentLanguage || 'python',
    );

    const handleBeforeMount = useCallback((monaco: typeof import('monaco-editor')) => {
        if (!themesDefinedRef.current) {
            defineAxiomThemes(monaco);
            themesDefinedRef.current = true;
        }
    }, []);

    const handleMount = useCallback((editor: any, monaco: any) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    }, []);

    // Apply line-level decorations for every flagged block on the active file.
    // We re-run whenever the active file changes so decorations stay in sync.
    useEffect(() => {
        const editor = editorRef.current;
        const monaco = monacoRef.current;
        if (!editor || !monaco || !activeFile) return;
        const decorations = (activeFile.blocks || [])
            .filter((b) => b.start_line && b.end_line && b.start_line > 0 && b.end_line >= b.start_line)
            .map((b) => ({
                range: new monaco.Range(b.start_line as number, 1, b.end_line as number, 1),
                options: {
                    isWholeLine: true,
                    className: 'flagged-code-line-bg',
                    linesDecorationsClassName: 'flagged-code-line-gutter',
                    hoverMessage: {
                        value: `**${b.block_id}** — AI confidence ${b.score.toFixed(1)}% (${b.threshold_exceeded ? 'above' : 'below'} threshold)`,
                    },
                },
            }));
        decorationIdsRef.current = editor.deltaDecorations(decorationIdsRef.current, decorations);

        // Jump to the first flagged block so the instructor lands on it.
        const firstBlock = (activeFile.blocks || []).find((b) => b.threshold_exceeded && b.start_line);
        if (firstBlock?.start_line) {
            editor.revealLineInCenter(firstBlock.start_line);
        }
    }, [activeFile, activeFileContent]);

    const jumpToBlock = useCallback((line: number) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.revealLineInCenter(line);
        editor.setPosition({ lineNumber: line, column: 1 });
        editor.focus();
    }, []);

    if (!open) return null;

    const monacoTheme = isDark ? 'axiom-dark' : 'axiom-light';
    const flaggedBlocks = (activeFile?.blocks || []).filter((b) => b.threshold_exceeded);
    const otherBlocks = (activeFile?.blocks || []).filter((b) => !b.threshold_exceeded);

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="flagged-code-title"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="flex flex-col w-full max-w-[min(1280px,100vw-24px)] max-h-[min(900px,100vh-24px)] rounded-xl overflow-hidden shadow-2xl"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between gap-3 px-4 py-3 shrink-0"
                    style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-elevated)' }}
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <ShieldAlert className="w-5 h-5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                        <div className="min-w-0">
                            <h2 id="flagged-code-title" className="text-sm font-bold truncate" style={{ color: 'var(--color-text-dark)' }}>
                                Flagged code review
                            </h2>
                            <p className="text-xs truncate" style={{ color: 'var(--color-text-mid)' }}>
                                Sections predicted above the flag threshold — advisory only, not a final judgment.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {data && typeof data.threshold_used === 'number' && (
                            <span
                                className="text-xs font-bold px-2.5 py-1 rounded-full"
                                style={{
                                    background: 'rgba(107,0,0,.08)',
                                    color: 'var(--color-primary)',
                                    border: '1px solid rgba(107,0,0,.22)',
                                }}
                            >
                                Threshold {(data.threshold_used * 100).toFixed(0)}%
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

                {/* Body */}
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center gap-2 py-20">
                            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                            <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>Analyzing flagged code…</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-6">
                            <p className="text-sm font-semibold" style={{ color: '#B91C1C' }}>
                                Could not load flagged code.
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--color-text-mid)' }}>
                                {(error as Error).message || 'Unknown error'}
                            </p>
                        </div>
                    )}

                    {data && !isLoading && orderedFiles.length === 0 && (
                        <div className="p-6">
                            <p className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
                                No block-level flagged regions were available for this submission.
                            </p>
                        </div>
                    )}

                    {data && !isLoading && orderedFiles.length > 0 && activeFile && (
                        <>
                            {/* File tabs */}
                            {orderedFiles.length > 1 && (
                                <div
                                    className="flex items-center gap-1 overflow-x-auto px-3 py-2 shrink-0"
                                    style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
                                >
                                    {orderedFiles.map((file, idx) => {
                                        const active = idx === activeFileIndex;
                                        return (
                                            <button
                                                key={`${file.filename}-${idx}`}
                                                type="button"
                                                onClick={() => setActiveFileIndex(idx)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors"
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: active ? 700 : 500,
                                                    color: active ? 'var(--color-text-dark)' : 'var(--color-text-mid)',
                                                    background: active ? 'var(--color-primary-bg)' : 'transparent',
                                                    border: `1px solid ${active ? 'var(--color-border)' : 'transparent'}`,
                                                }}
                                            >
                                                <FileCode2 className="w-3.5 h-3.5" />
                                                <span className="truncate max-w-[220px]">{file.filename || 'source'}</span>
                                                <span
                                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                                    style={riskPillStyle(file.threshold_exceeded)}
                                                >
                                                    {(file.file_ai_confidence * 100).toFixed(0)}%
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Editor + block list */}
                            <div className="flex-1 min-h-0 grid grid-cols-[1fr_280px]">
                                {/* Left: Monaco viewer */}
                                <div className="relative min-h-[320px]">
                                    <MonacoEditor
                                        height="100%"
                                        language={monacoLanguage}
                                        theme={monacoTheme}
                                        value={activeFileContent}
                                        beforeMount={handleBeforeMount}
                                        onMount={handleMount}
                                        options={{
                                            readOnly: true,
                                            fontSize: 13,
                                            minimap: { enabled: true },
                                            automaticLayout: true,
                                            scrollBeyondLastLine: false,
                                            wordWrap: 'on',
                                            lineNumbers: 'on',
                                        }}
                                    />
                                </div>

                                {/* Right: block side panel */}
                                <aside
                                    className="overflow-y-auto p-3"
                                    style={{ borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface-elevated)' }}
                                >
                                    <div className="mb-2">
                                        <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-text-mid)' }}>
                                            File overview
                                        </p>
                                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-dark)' }}>
                                            {activeFile.filename || 'source'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                                style={riskPillStyle(activeFile.threshold_exceeded)}
                                            >
                                                {(activeFile.file_ai_confidence * 100).toFixed(1)}% AI confidence
                                            </span>
                                            {activeFile.detected_language && (
                                                <span className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>
                                                    {activeFile.detected_language}
                                                </span>
                                            )}
                                        </div>
                                        {activeFile.signals && activeFile.signals.length > 0 && (
                                            <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-light)' }}>
                                                Signals: {activeFile.signals.slice(0, 3).join(' • ')}
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        className="my-2"
                                        style={{ height: 1, background: 'var(--color-border)' }}
                                    />

                                    <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: '#B91C1C' }}>
                                        Above threshold ({flaggedBlocks.length})
                                    </p>
                                    {flaggedBlocks.length === 0 ? (
                                        <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>
                                            No blocks in this file exceeded the threshold.
                                        </p>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {flaggedBlocks.map((b, i) => (
                                                <button
                                                    key={`${b.block_id}-${i}`}
                                                    type="button"
                                                    onClick={() => b.start_line && jumpToBlock(b.start_line)}
                                                    className="w-full text-left rounded-md px-2 py-1.5 transition-colors hover:bg-red-50"
                                                    style={{
                                                        border: '1px solid #FCA5A5',
                                                        background: '#FFF5F5',
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-xs font-semibold truncate" style={{ color: '#991B1B' }}>
                                                            {b.block_id}
                                                        </span>
                                                        <span className="text-[11px] font-bold" style={{ color: '#991B1B' }}>
                                                            {b.score.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] mt-0.5" style={{ color: '#7F1D1D' }}>
                                                        {b.start_line && b.end_line ? `Lines ${b.start_line}–${b.end_line}` : b.block_type}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {otherBlocks.length > 0 && (
                                        <>
                                            <p className="text-[11px] font-bold uppercase tracking-wide mb-2 mt-3" style={{ color: 'var(--color-text-mid)' }}>
                                                Other blocks ({otherBlocks.length})
                                            </p>
                                            <div className="space-y-1.5">
                                                {otherBlocks.map((b, i) => (
                                                    <button
                                                        key={`${b.block_id}-other-${i}`}
                                                        type="button"
                                                        onClick={() => b.start_line && jumpToBlock(b.start_line)}
                                                        className="w-full text-left rounded-md px-2 py-1.5 transition-colors"
                                                        style={{
                                                            border: '1px solid var(--color-border)',
                                                            background: 'var(--color-surface)',
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-xs font-medium truncate" style={{ color: 'var(--color-text-dark)' }}>
                                                                {b.block_id}
                                                            </span>
                                                            <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text-mid)' }}>
                                                                {b.score.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-light)' }}>
                                                            {b.start_line && b.end_line ? `Lines ${b.start_line}–${b.end_line}` : b.block_type}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </aside>
                            </div>

                            {/* Footer note */}
                            <p
                                className="text-[10px] px-3 py-2 shrink-0"
                                style={{
                                    color: 'var(--color-text-light)',
                                    borderTop: '1px solid var(--color-border)',
                                    background: 'var(--color-surface-elevated)',
                                }}
                            >
                                {data.disclaimer}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FlaggedCodeModal;
