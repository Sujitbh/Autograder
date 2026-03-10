'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/utils/ThemeContext';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import {
    useTASubmissionDetail,
    useTAGradeSubmission,
    useTACoursePermissions,
    useTARunTests,
    useTAAutoGrade,
} from '@/hooks/queries/useTADashboard';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    Send,
    Save,
    Loader2,
    ChevronDown,
    ChevronRight,
    AlertTriangle,
    User,
    Calendar,
    Hash,
    FileText,
    Play,
    Zap,
} from 'lucide-react';

interface TAGradingPageProps {
    courseId: string;
    submissionId: string;
}

const LANGUAGE_EXTENSION_MAP: Record<string, string> = {
    python: '.py',
    java: '.java',
    cpp: '.cpp',
    c: '.c',
    javascript: '.js',
};

const FILE_ICONS: Record<string, string> = {
    java: '☕', cpp: '⚙️', c: '⚙️', js: '🟨', ts: '🔷',
    html: '🌐', css: '🎨', json: '{}', md: '📝', txt: '📄',
};

function getFileIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (ext === 'py') return (
        <svg viewBox="0 0 256 255" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
            <path fill="#3776ab" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" />
            <path fill="#ffd343" d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" />
        </svg>
    );
    return FILE_ICONS[ext] ?? '📄';
}

export default function TAGradingPage({ courseId, submissionId }: Readonly<TAGradingPageProps>) {
    const router = useRouter();
    const { isDark } = useTheme();
    const courseIdNum = Number.parseInt(courseId);
    const submissionIdNum = Number.parseInt(submissionId);

    const { data: permissions } = useTACoursePermissions(courseIdNum);
    const { data: detail, isLoading, error } = useTASubmissionDetail(courseIdNum, submissionIdNum);
    const gradeMutation = useTAGradeSubmission(courseIdNum);
    const runTestsMutation = useTARunTests(courseIdNum);
    const autoGradeMutation = useTAAutoGrade(courseIdNum);

    // Code execution hook (for ad-hoc run)
    const { execute, isRunning: isExecutingCode, result: execResult, error: execError } = useCodeExecution();

    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [score, setScore] = useState<string>('');
    const [maxScore, setMaxScore] = useState<string>('');
    const [feedback, setFeedback] = useState('');
    const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set());

    // UI Layout state
    const [showExplorer, setShowExplorer] = useState(true);
    const [showInfoPanel, setShowInfoPanel] = useState(true);
    const [outputOpen, setOutputOpen] = useState(false);
    const [infoTab, setInfoTab] = useState<'desc' | 'tests' | 'grading'>('grading');
    const [stdinDialogOpen, setStdinDialogOpen] = useState(false);
    const [stdinValue, setStdinValue] = useState('');

    const [runTestsResult, setRunTestsResult] = useState<{
        total_testcases: number;
        passed_testcases: number;
        total_points: number;
        earned_points: number;
        score_percentage: number;
        results: Array<{
            id: number;
            testcase_id: number | null;
            testcase_name: string | null;
            is_public?: boolean | null;
            passed: boolean;
            output: string | null;
            error_output: string | null;
            points_awarded: number | null;
            execution_time_ms: number | null;
        }>;
    } | null>(null);
    const [autoGradeResult, setAutoGradeResult] = useState<{
        score: number | null;
        max_score: number | null;
        feedback: string | null;
        percentage: number;
        message: string;
    } | null>(null);

    // Populate form when detail loads
    useEffect(() => {
        if (detail) {
            setScore(detail.score?.toString() || '');
            setMaxScore(detail.max_score?.toString() || '');
            setFeedback(detail.feedback || '');
        }
    }, [detail]);

    const toggleTest = (testId: number) => {
        setExpandedTests((prev) => {
            const next = new Set(prev);
            if (next.has(testId)) next.delete(testId);
            else next.add(testId);
            return next;
        });
    };

    const handleGrade = (isDraft: boolean) => {
        gradeMutation.mutate(
            {
                submissionId: submissionIdNum,
                payload: {
                    score: score ? Number.parseFloat(score) : undefined,
                    max_score: maxScore ? Number.parseFloat(maxScore) : undefined,
                    feedback: feedback || undefined,
                    is_draft: isDraft,
                },
            },
            {
                onSuccess: () => {
                    if (!isDraft) {
                        router.push(`/ta/courses/${courseId}/submissions`);
                    }
                },
            }
        );
    };

    const handleAutoGrade = useCallback((silent: boolean = false) => {
        if (!silent) {
            setAutoGradeResult(null);
            setInfoTab('grading');
        }
        autoGradeMutation.mutate(submissionIdNum, {
            onSuccess: (data) => {
                setAutoGradeResult(data);
                // Populate the grading form with auto-grade results
                if (data.score != null) setScore(data.score.toString());
                if (data.max_score != null) setMaxScore(data.max_score.toString());
                if (data.feedback) setFeedback(data.feedback);
                // Also update test results display
                if (data.stored_results) {
                    setRunTestsResult({
                        total_testcases: data.stored_results.length,
                        passed_testcases: data.stored_results.filter((r: { passed: boolean }) => r.passed).length,
                        total_points: 0,
                        earned_points: 0,
                        score_percentage: data.percentage,
                        results: data.stored_results,
                    });
                }
            },
        });
    }, [submissionIdNum, autoGradeMutation]);

    const handleRunTests = () => {
        setRunTestsResult(null);
        setInfoTab('tests');
        // prompt: "automatically grades after running test cases"
        // So we trigger auto-grade which runs tests and computes score.
        handleAutoGrade(true);
    };

    const breadcrumbs = [
        { label: 'Submissions', href: `/ta/courses/${courseId}/submissions` },
        { label: `Grading #${submissionId}` },
    ];

    if (isLoading) {
        return (
            <PageLayout>
                <TopNav breadcrumbs={[{ label: 'TA Dashboard', href: '/ta' }, ...breadcrumbs]} />
                <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            </PageLayout>
        );
    }

    if (error || !detail) {
        return (
            <PageLayout>
                <TopNav breadcrumbs={[{ label: 'TA Dashboard', href: '/ta' }, ...breadcrumbs]} />
                <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
                    <div className="text-center">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-error)' }} />
                        <p style={{ fontSize: '16px', color: 'var(--color-text-dark)' }}>Could not load submission</p>
                        <button
                            onClick={() => router.back()}
                            className="mt-4 px-4 py-2 rounded-lg"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '14px' }}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const language = (detail.assignment.language || 'python').toLowerCase();
    const activeFile = detail.files[activeFileIndex];
    const code = activeFile?.content || '';

    // Ad-hoc execution helpers (similar to StudentAssignmentDetail)
    const codeUsesInput = (codeStr: string) => {
        const lines = codeStr.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('#')) continue;
            if (trimmed.includes('input(')) return true;
        }
        return false;
    };

    const handleRunCode = async () => {
        if (language === 'python' && codeUsesInput(code)) {
            setStdinDialogOpen(true);
            return;
        }
        setOutputOpen(true);
        await execute(code, language);
    };

    const handleRunWithStdin = async () => {
        setStdinDialogOpen(false);
        setOutputOpen(true);
        await execute(code, language, stdinValue);
    };

    return (
        <PageLayout>
            <TopNav breadcrumbs={[{ label: 'TA Dashboard', href: '/ta' }, ...breadcrumbs]} />

            <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
                <div className="flex flex-1 overflow-hidden relative">

                    {/* ── LEFT: Explorer ── */}
                    {showExplorer && (
                        <div
                            className="flex flex-col shrink-0 overflow-hidden"
                            style={{
                                width: 220, minWidth: 220,
                                background: 'var(--color-surface)',
                                borderRight: '1px solid var(--color-border)',
                                transition: 'margin-left .25s ease, opacity .25s ease',
                            }}
                        >
                            <div style={{ padding: '12px 14px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', color: 'var(--color-text-light)', textTransform: 'uppercase' as const }}>
                                Explorer
                            </div>
                            <div className="flex-1 overflow-y-auto" style={{ padding: '4px 0' }}>
                                {detail.files.map((file, idx) => {
                                    const isActive = idx === activeFileIndex;
                                    return (
                                        <div
                                            key={file.id}
                                            onClick={() => setActiveFileIndex(idx)}
                                            className="group"
                                            style={{
                                                display: 'flex', alignItems: 'center',
                                                padding: '5px 14px', cursor: 'pointer',
                                                fontSize: 13, color: isActive ? 'var(--color-text-dark)' : 'var(--color-text-mid)',
                                                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                                                background: isActive ? 'var(--color-surface-elevated)' : 'transparent',
                                                gap: 6, transition: 'background .15s',
                                            }}
                                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
                                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? 'var(--color-surface-elevated)' : 'transparent'; }}
                                        >
                                            <span style={{ fontSize: 14, flexShrink: 0, display: 'inline-flex', alignItems: 'center', width: 16, height: 16 }}>{getFileIcon(file.filename)}</span>
                                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{file.filename}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column' as const, gap: 4, borderTop: '1px solid var(--color-border)' }}>
                                <button
                                    onClick={() => router.push(`/ta/courses/${courseId}/submissions`)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: 'var(--color-text-mid)', transition: 'background .15s', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-elevated)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <ArrowLeft style={{ width: 15, height: 15 }} /> Back to Submissions
                                </button>
                                {/* Removed New File / Upload Files for TA/Faculty */}
                            </div>
                        </div>
                    )}

                    {/* ── CENTER: Editor ── */}
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                        {/* Editor Topbar */}
                        <div style={{
                            height: 38, background: 'var(--color-surface)',
                            borderBottom: '1px solid var(--color-border)',
                            display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0,
                        }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                {activeFile?.filename ?? 'No file open'}
                            </span>
                            <span style={{
                                fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const,
                                letterSpacing: '.6px', padding: '2px 8px', borderRadius: 10,
                                background: isDark ? '#3b1a1a' : '#fef3c7',
                                color: isDark ? '#fca5a5' : '#92400e',
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                            }}>
                                {language.charAt(0).toUpperCase() + language.slice(1)}
                            </span>
                            <div style={{ flex: 1 }} />

                            {/* Ad-hoc Run button (similar to student) */}
                            <button
                                onClick={handleRunCode}
                                disabled={isExecutingCode || runTestsMutation.isPending || autoGradeMutation.isPending}
                                style={{
                                    padding: '5px 16px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                                    background: '#16a34a', color: '#fff', letterSpacing: '.3px',
                                    transition: 'background .15s, box-shadow .2s',
                                    opacity: isExecutingCode ? 0.7 : 1,
                                    cursor: isExecutingCode ? 'not-allowed' : 'pointer',
                                    border: 'none',
                                }}
                                onMouseEnter={e => { if (!isExecutingCode) { e.currentTarget.style.background = '#15803d'; e.currentTarget.style.boxShadow = '0 0 10px rgba(22,163,74,.5)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                {isExecutingCode ? '⏳ Running...' : '▶ Run Code'}
                            </button>

                            <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 6px' }} />

                            {/* Auto Grade button also in top bar for convenience */}
                            {permissions?.can_grade !== false && (
                                <button
                                    onClick={() => handleAutoGrade(false)}
                                    disabled={autoGradeMutation.isPending || runTestsMutation.isPending}
                                    style={{
                                        padding: '5px 16px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                                        background: isDark ? '#7f1d1d' : '#991b1b', color: '#fff', letterSpacing: '.3px',
                                        transition: 'background .15s, box-shadow .2s',
                                        opacity: autoGradeMutation.isPending ? 0.7 : 1,
                                        cursor: autoGradeMutation.isPending ? 'not-allowed' : 'pointer',
                                        border: 'none', display: 'flex', alignItems: 'center', gap: 6,
                                    }}
                                    onMouseEnter={e => { if (!autoGradeMutation.isPending) { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.boxShadow = '0 0 10px rgba(153,27,27,.5)'; } }}
                                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#7f1d1d' : '#991b1b'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {autoGradeMutation.isPending ? '⏳ Grading...' : <><Zap style={{ width: 14, height: 14 }} /> Auto Grade</>}
                                </button>
                            )}

                            <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 6px' }} />

                            {/* Layout toggles */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <button
                                    onClick={() => setShowExplorer(v => !v)}
                                    title="Toggle Explorer"
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                                        borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: showExplorer ? 'var(--color-text-dark)' : 'var(--color-text-light)',
                                        transition: 'background .12s, color .12s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-dark)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = showExplorer ? 'var(--color-text-dark)' : 'var(--color-text-light)'; }}
                                >
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.2} width={16} height={16}>
                                        <rect x="1" y="1" width="4.5" height="14" rx="1" fill="currentColor" opacity=".35" />
                                        <rect x="1" y="1" width="14" height="14" rx="1.5" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setOutputOpen(v => !v)}
                                    title="Toggle Output Panel"
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                                        borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: outputOpen ? 'var(--color-text-dark)' : 'var(--color-text-light)',
                                        transition: 'background .12s, color .12s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-dark)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = outputOpen ? 'var(--color-text-dark)' : 'var(--color-text-light)'; }}
                                >
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.2} width={16} height={16}>
                                        <rect x="1" y="9.5" width="14" height="5.5" rx="1" fill="currentColor" opacity=".35" />
                                        <rect x="1" y="1" width="14" height="14" rx="1.5" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setShowInfoPanel(v => !v)}
                                    title="Toggle Info Panel"
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                                        borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: showInfoPanel ? 'var(--color-text-dark)' : 'var(--color-text-light)',
                                        transition: 'background .12s, color .12s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-dark)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = showInfoPanel ? 'var(--color-text-dark)' : 'var(--color-text-light)'; }}
                                >
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.2} width={16} height={16}>
                                        <rect x="10.5" y="1" width="4.5" height="14" rx="1" fill="currentColor" opacity=".35" />
                                        <rect x="1" y="1" width="14" height="14" rx="1.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Editor area */}
                        <div className="flex-1 overflow-hidden relative" style={{ background: 'var(--color-surface)' }}>
                            {activeFile ? (
                                <CodeEditor
                                    language={language}
                                    value={code}
                                    onChange={() => { }} // Read-only for TAs
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p style={{ color: 'var(--color-text-mid)', fontSize: '14px' }}>No file content available</p>
                                </div>
                            )}
                        </div>

                        {/* Output Panel (collapsible, matching student) */}
                        <div style={{
                            height: outputOpen ? 280 : 0,
                            background: 'var(--color-surface)',
                            borderTop: outputOpen ? '1px solid var(--color-border)' : 'none',
                            overflow: 'hidden',
                            transition: 'height .3s ease',
                            flexShrink: 0,
                            display: 'flex',
                            flexDirection: 'column' as const,
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '6px 14px', background: 'var(--color-surface-elevated)',
                                borderBottom: '1px solid var(--color-border)',
                                fontSize: 11, fontWeight: 600, color: 'var(--color-text-light)', flexShrink: 0,
                            }}>
                                <span>⬤ TERMINAL OUTPUT</span>
                                <button
                                    onClick={() => setOutputOpen(false)}
                                    style={{
                                        fontSize: 14, color: 'var(--color-text-light)', padding: '2px 6px', borderRadius: 3,
                                        background: 'transparent', border: 'none', cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-dark)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-light)'; }}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex-1 min-h-0">
                                <OutputPanel result={execResult} isRunning={isExecutingCode} error={execError} />
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Info Panel (tabbed) ── */}
                    {showInfoPanel && (
                        <div
                            className="flex flex-col overflow-hidden shrink-0"
                            style={{
                                width: 360, minWidth: 360,
                                background: 'var(--color-surface)',
                                borderLeft: '1px solid var(--color-border)',
                                transition: 'width .3s ease, min-width .3s ease, opacity .25s ease',
                            }}
                        >
                            {/* Tabs */}
                            <div style={{ display: 'flex', padding: '8px 10px 0', gap: 4, flexShrink: 0, flexWrap: 'wrap' as const }}>
                                {(['desc', 'tests', 'grading'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setInfoTab(tab)}
                                        style={{
                                            padding: '6px 12px', borderRadius: 16, fontSize: 11, fontWeight: 600,
                                            whiteSpace: 'nowrap' as const, transition: 'all .2s',
                                            background: infoTab === tab ? '#7f1d1d' : 'transparent',
                                            color: infoTab === tab ? '#fff' : 'var(--color-text-light)',
                                            border: 'none', cursor: 'pointer',
                                        }}
                                        onMouseEnter={e => { if (infoTab !== tab) { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-mid)'; } }}
                                        onMouseLeave={e => { if (infoTab !== tab) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-light)'; } }}
                                    >
                                        {tab === 'desc' ? '📋 Info' : tab === 'tests' ? '🧪 Tests' : tab === 'grading' ? '📊 Grading' : 'Submit'}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto" style={{ padding: 16 }}>

                                {/* ── Desc Tab ── */}
                                {infoTab === 'desc' && (
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: 'var(--color-primary-light)' }}
                                            >
                                                <User className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                                    {detail.student.name}
                                                </p>
                                                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                    {detail.student.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 mb-6">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                    {detail.assignment.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                    Attempt #{detail.attempt_number}
                                                </span>
                                            </div>
                                            {detail.created_at && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                        Submitted: {new Date(detail.created_at).toLocaleString('en-US', {
                                                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                            {detail.assignment.due_date && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                        Due: {new Date(detail.assignment.due_date).toLocaleDateString('en-US', {
                                                            month: 'short', day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ── Tests Tab ── */}
                                {infoTab === 'tests' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)' }}>
                                                🧪 Test Results
                                            </h2>
                                            {permissions?.can_run_tests !== false && (
                                                <button
                                                    onClick={handleRunTests}
                                                    disabled={runTestsMutation.isPending || autoGradeMutation.isPending}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                                                    style={{
                                                        backgroundColor: 'var(--color-primary-light)',
                                                        color: 'var(--color-primary)',
                                                        border: '1px solid var(--color-primary)',
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        textTransform: 'uppercase',
                                                    }}
                                                >
                                                    {autoGradeMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                                                    Run All Tests
                                                </button>
                                            )}
                                        </div>

                                        {(() => {
                                            const displayTests = runTestsResult?.results ?? (detail.test_results.length > 0 ? detail.test_results : null);
                                            if (!displayTests || displayTests.length === 0) {
                                                if (autoGradeMutation.isPending) {
                                                    return <div className="flex flex-col items-center justify-center p-8 gap-3">
                                                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
                                                        <p style={{ fontSize: 12, color: 'var(--color-text-mid)' }}>Running tests and grading...</p>
                                                    </div>;
                                                }
                                                return <p style={{ fontSize: 13, color: 'var(--color-text-mid)' }}>No test results yet. Run tests to see output.</p>;
                                            }
                                            const passed = displayTests.filter((t: any) => t.passed).length;
                                            return (
                                                <div>
                                                    <span
                                                        className="px-2.5 py-1 rounded-full mb-4 inline-block"
                                                        style={{
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            color: passed === displayTests.length ? '#059669' : '#D97706',
                                                            backgroundColor: passed === displayTests.length ? '#D1FAE5' : '#FEF3C7',
                                                        }}
                                                    >
                                                        {passed}/{displayTests.length} passed
                                                    </span>

                                                    <div className="space-y-2">
                                                        {displayTests.map((test: any) => (
                                                            <div
                                                                key={test.id}
                                                                className="rounded-lg overflow-hidden"
                                                                style={{ border: '1px solid var(--color-border)' }}
                                                            >
                                                                <button
                                                                    onClick={() => toggleTest(test.id)}
                                                                    className="w-full flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-[var(--color-primary-bg)]"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        {test.passed ? (
                                                                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#059669' }} />
                                                                        ) : (
                                                                            <XCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#DC2626' }} />
                                                                        )}
                                                                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                                            {test.testcase_name || `Test #${test.testcase_id}`}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {test.points_awarded != null && (
                                                                            <span style={{ fontSize: '11px', color: 'var(--color-text-mid)' }}>
                                                                                {test.points_awarded} pts
                                                                            </span>
                                                                        )}
                                                                        {expandedTests.has(test.id) ? (
                                                                            <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                                        ) : (
                                                                            <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                                        )}
                                                                    </div>
                                                                </button>
                                                                {expandedTests.has(test.id) && (
                                                                    <div
                                                                        className="px-3 py-2 border-t"
                                                                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-primary-bg)' }}
                                                                    >
                                                                        {test.output && (
                                                                            <div className="mb-2">
                                                                                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '4px' }}>
                                                                                    Output:
                                                                                </p>
                                                                                <pre
                                                                                    className="p-2 rounded text-xs overflow-x-auto"
                                                                                    style={{
                                                                                        backgroundColor: '#1e1e1e',
                                                                                        color: '#d4d4d4',
                                                                                        fontFamily: 'monospace',
                                                                                        maxHeight: '120px',
                                                                                    }}
                                                                                >
                                                                                    {test.output}
                                                                                </pre>
                                                                            </div>
                                                                        )}
                                                                        {test.error_output && (
                                                                            <div>
                                                                                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: '#DC2626', marginBottom: '4px' }}>
                                                                                    Error:
                                                                                </p>
                                                                                <pre
                                                                                    className="p-2 rounded text-xs overflow-x-auto"
                                                                                    style={{
                                                                                        backgroundColor: '#FEF2F2',
                                                                                        color: '#991B1B',
                                                                                        fontFamily: 'monospace',
                                                                                        maxHeight: '120px',
                                                                                    }}
                                                                                >
                                                                                    {test.error_output}
                                                                                </pre>
                                                                            </div>
                                                                        )}
                                                                        {!test.output && !test.error_output && (
                                                                            <p style={{ fontSize: '11px', color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                                                                                No output recorded
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* ── Grading Tab ── */}
                                {infoTab === 'grading' && (
                                    <div>
                                        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 12 }}>
                                            📊 Assess &amp; Grade
                                        </h2>

                                        {/* Auto-Grade Result Banner */}
                                        {autoGradeResult && (
                                            <div
                                                className="mb-6 px-4 py-3 rounded-lg"
                                                style={{ backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7' }}
                                            >
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#065F46', marginBottom: '4px' }}>
                                                    {autoGradeResult.message}
                                                </p>
                                                <p style={{ fontSize: '12px', color: '#065F46' }}>
                                                    Auto-score: {autoGradeResult.score ?? '—'} / {autoGradeResult.max_score ?? '—'} ({autoGradeResult.percentage.toFixed(1)}%)
                                                </p>
                                            </div>
                                        )}

                                        {/* Rubric Section */}
                                        {detail.rubrics.length > 0 && (
                                            <div className="mb-6">
                                                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '8px' }}>
                                                    Rubric Reference
                                                </h3>
                                                <div className="space-y-2">
                                                    {detail.rubrics.map((rubric) => {
                                                        // Find if we have auto-grade results for this rubric
                                                        const autoEval = autoGradeResult?.rubric_results?.evaluations?.find(
                                                            (e: any) => e.rubric_id === rubric.id
                                                        );
                                                        const earned = autoEval ? autoEval.earned_points : null;
                                                        const max = rubric.max_points || 0;

                                                        return (
                                                            <div
                                                                key={rubric.id}
                                                                className="flex items-center justify-between px-3 py-2 rounded-lg"
                                                                style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }}
                                                            >
                                                                <div className="flex-1 pr-2">
                                                                    <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                                        {rubric.name}
                                                                    </p>
                                                                    {autoEval?.feedback && (
                                                                        <p style={{ fontSize: '10px', color: 'var(--color-text-mid)', marginTop: '2px' }}>
                                                                            {autoEval.feedback}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <span
                                                                    className="px-2 py-0.5 rounded-md shrink-0"
                                                                    style={{
                                                                        fontSize: '11px',
                                                                        fontWeight: 600,
                                                                        color: earned !== null ? (earned === max ? '#059669' : '#D97706') : 'var(--color-text-mid)',
                                                                        backgroundColor: 'var(--color-surface)',
                                                                        border: '1px solid var(--color-border)',
                                                                    }}
                                                                >
                                                                    {earned !== null ? `${earned} / ` : ''}{max} pts
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Grading Form */}
                                        {permissions?.can_grade !== false && (
                                            <div>
                                                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '12px' }}>
                                                    Grading Form
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label
                                                            htmlFor="grade-score"
                                                            style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', display: 'block', marginBottom: '6px' }}
                                                        >
                                                            Score Earned
                                                        </label>
                                                        <input
                                                            id="grade-score"
                                                            type="number"
                                                            value={score}
                                                            onChange={(e) => setScore(e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                                            style={{
                                                                backgroundColor: 'var(--color-surface)',
                                                                border: '1px solid var(--color-border)',
                                                                fontSize: '14px',
                                                                color: 'var(--color-text-dark)',
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="grade-max-score"
                                                            style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', display: 'block', marginBottom: '6px' }}
                                                        >
                                                            Max Points
                                                        </label>
                                                        <input
                                                            id="grade-max-score"
                                                            type="number"
                                                            value={maxScore}
                                                            onChange={(e) => setMaxScore(e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                                            style={{
                                                                backgroundColor: 'var(--color-surface)',
                                                                border: '1px solid var(--color-border)',
                                                                fontSize: '14px',
                                                                color: 'var(--color-text-dark)',
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-6">
                                                    <label
                                                        htmlFor="grade-feedback"
                                                        style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', display: 'block', marginBottom: '6px' }}
                                                    >
                                                        Feedback for Student
                                                    </label>
                                                    <textarea
                                                        id="grade-feedback"
                                                        value={feedback}
                                                        onChange={(e) => setFeedback(e.target.value)}
                                                        rows={5}
                                                        placeholder="Add comments on their submission..."
                                                        className="w-full px-3 py-2 rounded-lg resize-none"
                                                        style={{
                                                            backgroundColor: 'var(--color-primary-bg)',
                                                            border: '1px solid var(--color-border)',
                                                            fontSize: '13px',
                                                            color: 'var(--color-text-dark)',
                                                            lineHeight: 1.5,
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <button
                                                        onClick={() => handleGrade(false)}
                                                        disabled={gradeMutation.isPending || !score}
                                                        style={{
                                                            width: '100%', padding: '12px', borderRadius: 6,
                                                            fontSize: 13, fontWeight: 700, border: 'none',
                                                            background: isDark ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #15803d, #16a34a)',
                                                            color: '#fff', transition: 'all .2s',
                                                            textTransform: 'uppercase' as const, letterSpacing: '.5px',
                                                            cursor: (gradeMutation.isPending || !score) ? 'not-allowed' : 'pointer',
                                                            opacity: (gradeMutation.isPending || !score) ? 0.7 : 1,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                        }}
                                                        onMouseEnter={e => {
                                                            if (!gradeMutation.isPending && score) {
                                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                                                e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(22,163,74,.4)' : '0 4px 12px rgba(21,128,61,.35)';
                                                            }
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.transform = 'none';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                    >
                                                        {gradeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                        Submit Final Grade
                                                    </button>

                                                    <button
                                                        onClick={() => handleGrade(true)}
                                                        disabled={gradeMutation.isPending}
                                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                                                        style={{
                                                            backgroundColor: 'var(--color-primary-bg)',
                                                            border: '1px solid var(--color-border)',
                                                            color: 'var(--color-text-dark)',
                                                            fontSize: '13px',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        <Save className="w-4 h-4" /> Save Draft
                                                    </button>
                                                </div>

                                                {gradeMutation.isSuccess && (
                                                    <div
                                                        className="mt-4 px-4 py-2 rounded-lg"
                                                        style={{ backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7' }}
                                                    >
                                                        <p style={{ fontSize: '12px', fontWeight: 500, color: '#065F46' }}>
                                                            Grade recorded successfully
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ═══ STATUS BAR ═══ */}
                <div style={{
                    height: 28, background: '#1e4a7a', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 12px', fontSize: 11, fontWeight: 500, flexShrink: 0,
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '.4px' }}>
                            <span style={{ opacity: .7 }}>ROLE:</span> TA/FACULTY
                        </span>
                        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '.4px' }}>
                            <span style={{ opacity: .7 }}>LANG:</span> {language.toUpperCase()}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: .9 }}>
                            {detail.status === 'graded' ? '✓ SUBMISSION GRADED' : '● NEEDS GRADING'}
                        </span>
                    </div>
                </div>

            </div>

            {/* Stdin Dialog */}
            <Dialog open={stdinDialogOpen} onOpenChange={setStdinDialogOpen}>
                <DialogContent style={{ maxWidth: '500px' }}>
                    <DialogHeader>
                        <DialogTitle>Run with Input</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        <label className="text-sm font-medium" style={{ color: 'var(--color-text-dark)' }}>
                            Enter program input (stdin):
                        </label>
                        <Textarea
                            value={stdinValue}
                            onChange={(e) => setStdinValue(e.target.value)}
                            placeholder="Type your input here..."
                            className="mt-2 font-mono text-sm"
                            rows={6}
                        />
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setStdinDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleRunWithStdin} className="text-white" style={{ backgroundColor: 'var(--color-success)' }}>
                            <Play className="w-4 h-4 mr-2" /> Run
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </PageLayout>
    );
}
