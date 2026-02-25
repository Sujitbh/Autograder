'use client';

/* ═══════════════════════════════════════════════════════════════════
   SubmissionComponent
   ─ Language selector + Monaco code editor + Run & Submit button
   ─ Shows live test results after execution
   ═══════════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
    Play, CheckCircle2, XCircle, MinusCircle, Loader2,
    ChevronDown, AlertTriangle, BarChart3, Code2,
} from 'lucide-react';
import api from '@/services/api/client';

// Lazy-load Monaco (it is heavy — avoids SSR issues)
const MonacoEditor = dynamic(
    () => import('@monaco-editor/react').then(m => m.default),
    {
        ssr: false,
        loading: () => (
            <div style={{ height: '320px', backgroundColor: '#1E1E2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#A0A0B8' }} />
            </div>
        ),
    }
);

// ── Types ─────────────────────────────────────────────────────────────

export interface TestCaseResult {
    testcase_id: number | null;
    testcase_name: string;
    input: string | null;
    expected_output: string | null;
    is_public: boolean;
    points: number;
    passed: boolean;
    actual_output: string;
    error_output: string;
    execution_time_ms: number;
    points_earned: number;
}

export interface CodeSubmitResponse {
    submission_id: number;
    total_testcases: number;
    passed: number;
    failed: number;
    score: number;
    max_score: number;
    percentage: number;
    results: TestCaseResult[];
}

// ── Language config ───────────────────────────────────────────────────

const LANGUAGES = [
    { value: 'python',     label: 'Python 3',     monacoLang: 'python',     placeholder: '# Write your Python solution here\n\ndef solution():\n    pass\n' },
    { value: 'java',       label: 'Java',          monacoLang: 'java',       placeholder: '// Write your Java solution here\n\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n' },
    { value: 'cpp',        label: 'C++',           monacoLang: 'cpp',        placeholder: '// Write your C++ solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n' },
    { value: 'javascript', label: 'JavaScript',    monacoLang: 'javascript', placeholder: '// Write your JavaScript solution here\n\n' },
];

// ── Sub-components ────────────────────────────────────────────────────

function ResultBadge({ passed }: { passed: boolean }) {
    return passed ? (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
            <CheckCircle2 className="w-3 h-3" /> PASS
        </span>
    ) : (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
            <XCircle className="w-3 h-3" /> FAIL
        </span>
    );
}

function TestResultCard({ result, index }: { result: TestCaseResult; index: number }) {
    const [expanded, setExpanded] = useState(!result.passed);
    return (
        <div className="rounded-xl overflow-hidden"
            style={{ border: `1px solid ${result.passed ? '#A7F3D0' : '#FECACA'}` }}>
            {/* Header row */}
            <button
                onClick={() => setExpanded(p => !p)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                style={{ backgroundColor: result.passed ? '#F0FDF4' : '#FFF5F5' }}>
                <div className="flex items-center gap-3">
                    <span style={{ fontSize: '13px', fontWeight: 600, color: result.passed ? '#065F46' : '#991B1B' }}>
                        {result.testcase_name}
                    </span>
                    <ResultBadge passed={result.passed} />
                </div>
                <div className="flex items-center gap-3">
                    {result.points > 0 && (
                        <span style={{ fontSize: '12px', color: result.passed ? '#065F46' : '#991B1B', fontWeight: 600 }}>
                            {result.points_earned}/{result.points} pts
                        </span>
                    )}
                    {result.execution_time_ms > 0 && (
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>
                            {result.execution_time_ms.toFixed(1)}ms
                        </span>
                    )}
                    <ChevronDown
                        className="w-4 h-4 transition-transform"
                        style={{ color: '#6B7280', transform: expanded ? 'rotate(180deg)' : undefined }} />
                </div>
            </button>

            {/* Expanded body */}
            {expanded && (
                <div className="px-4 py-3 space-y-3" style={{ backgroundColor: '#fff' }}>
                    {result.input && (
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Input</p>
                            <pre style={{ fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px 10px', margin: 0, overflowX: 'auto', color: '#1F2937' }}>{result.input}</pre>
                        </div>
                    )}
                    <div>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Expected Output</p>
                        <pre style={{ fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px 10px', margin: 0, overflowX: 'auto', color: '#1F2937' }}>{result.expected_output ?? '(none)'}</pre>
                    </div>
                    {result.actual_output && (
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: result.passed ? '#065F46' : '#991B1B', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Your Output</p>
                            <pre style={{ fontSize: '12px', fontFamily: 'monospace', backgroundColor: result.passed ? '#F0FDF4' : '#FFF5F5', border: `1px solid ${result.passed ? '#A7F3D0' : '#FECACA'}`, borderRadius: '6px', padding: '8px 10px', margin: 0, overflowX: 'auto', color: '#1F2937' }}>{result.actual_output}</pre>
                        </div>
                    )}
                    {result.error_output && (
                        <div>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Error / Stderr</p>
                            <pre style={{ fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '6px', padding: '8px 10px', margin: 0, overflowX: 'auto', color: '#991B1B' }}>{result.error_output}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main export ───────────────────────────────────────────────────────

interface Props {
    assignmentId: number;
    assignmentTitle?: string;
}

export default function SubmissionComponent({ assignmentId, assignmentTitle }: Props) {
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(LANGUAGES[0].placeholder);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CodeSubmitResponse | null>(null);

    const selectedLang = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

    const handleLanguageChange = (val: string) => {
        setLanguage(val);
        // Only swap placeholder if code is still the old placeholder
        const oldPlaceholder = selectedLang.placeholder;
        if (code === oldPlaceholder) {
            const newLang = LANGUAGES.find(l => l.value === val);
            if (newLang) setCode(newLang.placeholder);
        }
    };

    const handleSubmit = async () => {
        if (!code.trim()) return;
        setSubmitting(true);
        setError(null);
        setResult(null);
        try {
            const { data } = await api.post<CodeSubmitResponse>('/submissions/code', {
                assignment_id: assignmentId,
                language,
                code,
            });
            setResult(data);
        } catch (err: any) {
            const msg = err?.response?.data?.detail ?? err?.message ?? 'Submission failed';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* ── Language + Editor ── */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-2.5"
                    style={{ backgroundColor: '#1E1E2E', borderBottom: '1px solid #2D2D3F' }}>
                    <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4" style={{ color: '#A0A0B8' }} />
                        <span style={{ fontSize: '12px', color: '#A0A0B8', fontWeight: 500 }}>
                            {assignmentTitle ?? 'Code Editor'}
                        </span>
                    </div>
                    {/* Language dropdown */}
                    <div className="relative">
                        <select
                            value={language}
                            onChange={e => handleLanguageChange(e.target.value)}
                            className="appearance-none rounded-md pl-3 pr-7 py-1 text-xs font-semibold cursor-pointer outline-none"
                            style={{ backgroundColor: '#2D2D3F', color: '#E0E0F0', border: '1px solid #3D3D5F' }}>
                            {LANGUAGES.map(l => (
                                <option key={l.value} value={l.value}>{l.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A0A0B8' }} />
                    </div>
                </div>

                {/* Code editor (Monaco) */}
                <MonacoEditor
                    height="320px"
                    language={selectedLang.monacoLang}
                    theme="vs-dark"
                    value={code}
                    onChange={val => setCode(val ?? '')}
                    options={{
                        fontSize: 13,
                        fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        lineNumbers: 'on',
                        roundedSelection: true,
                        automaticLayout: true,
                        tabSize: 4,
                        wordWrap: 'on',
                        padding: { top: 12, bottom: 12 },
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: true,
                    }}
                />
            </div>

            {/* ── Submit button ── */}
            <button
                onClick={handleSubmit}
                disabled={submitting || !code.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all"
                style={{
                    backgroundColor: submitting || !code.trim() ? '#9CA3AF' : '#6B0000',
                    color: 'white',
                    fontSize: '14px',
                    cursor: submitting || !code.trim() ? 'not-allowed' : 'pointer',
                }}>
                {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Running against test cases…</>
                ) : (
                    <><Play className="w-4 h-4" /> Run &amp; Submit</>
                )}
            </button>

            {/* ── Error ── */}
            {error && (
                <div className="flex items-start gap-2 p-4 rounded-xl"
                    style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#991B1B' }} />
                    <p style={{ fontSize: '13px', color: '#991B1B' }}>{error}</p>
                </div>
            )}

            {/* ── Results panel ── */}
            {result && (
                <div className="space-y-4">
                    {/* Summary card */}
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                        <div className="px-5 py-4"
                            style={{
                                backgroundColor: result.passed === result.total_testcases && result.total_testcases > 0
                                    ? '#065F46' : '#6B0000',
                            }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Test Results
                                    </p>
                                    <p style={{ color: 'white', fontSize: '26px', fontWeight: 800, lineHeight: '32px', marginTop: '2px' }}>
                                        {result.passed}/{result.total_testcases}{' '}
                                        <span style={{ fontSize: '14px', fontWeight: 400, opacity: 0.8 }}>test cases passed</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                        <span style={{ color: 'white', fontSize: '18px', fontWeight: 800, lineHeight: 1 }}>{result.percentage}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            {result.total_testcases > 0 && (
                                <div style={{ marginTop: '12px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${result.percentage}%`,
                                        backgroundColor: 'white',
                                        borderRadius: '3px',
                                        transition: 'width 0.5s ease',
                                    }} />
                                </div>
                            )}
                        </div>

                        {/* Score row */}
                        {result.max_score > 0 && (
                            <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: '#F9FAFB', borderTop: '1px solid var(--color-border)' }}>
                                <BarChart3 className="w-4 h-4" style={{ color: '#6B0000' }} />
                                <span style={{ fontSize: '13px', color: 'var(--color-text-dark)', fontWeight: 500 }}>
                                    Score: <strong style={{ color: '#6B0000' }}>{result.score}/{result.max_score} points</strong>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ── Per-test breakdown ── */}
                    {result.results.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                    Detailed Results
                                </p>
                                <div className="flex items-center gap-3" style={{ fontSize: '12px' }}>
                                    <span style={{ color: '#065F46', fontWeight: 600 }}>
                                        ✓ {result.passed} passed
                                    </span>
                                    {result.failed > 0 && (
                                        <span style={{ color: '#991B1B', fontWeight: 600 }}>
                                            ✗ {result.failed} failed
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                {result.results.map((r, i) => (
                                    <TestResultCard key={i} result={r} index={i} />
                                ))}
                            </div>
                        </div>
                    )}

                    {result.total_testcases === 0 && (
                        <div className="flex flex-col items-center py-8 rounded-xl"
                            style={{ backgroundColor: '#F9FAFB', border: '1px dashed var(--color-border)' }}>
                            <MinusCircle className="w-8 h-8 mb-2 opacity-30" />
                            <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                No test cases found for this assignment. Your code was saved.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
