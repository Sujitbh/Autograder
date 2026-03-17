'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { AxiosError } from 'axios';
import { useTheme } from '@/utils/ThemeContext';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { submissionService } from '@/services/api';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
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

interface FacultyGradingPageProps {
    courseId: string;
    submissionId: string;
}

const LANGUAGE_EXTENSION_MAP: Record<string, string> = {
    python: '.py', java: '.java', cpp: '.cpp', c: '.c', javascript: '.js',
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

function getRiskTagStyle(risk: 'low' | 'medium' | 'high') {
    if (risk === 'high') {
        return { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5' };
    }
    if (risk === 'medium') {
        return { background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' };
    }
    return { background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC' };
}

function getBandLabel(scoreBand: 'low' | 'medium' | 'high') {
    return scoreBand.charAt(0).toUpperCase() + scoreBand.slice(1);
}

export default function FacultyGradingPage({ courseId, submissionId }: Readonly<FacultyGradingPageProps>) {
    const router = useRouter();
    const { isDark } = useTheme();
    const queryClient = useQueryClient();

    const { data: detail, isLoading, error } = useQuery({
        queryKey: ['faculty-submission-detail', submissionId],
        queryFn: () => submissionService.getSubmissionDetail(submissionId),
    });

    const gradeMutation = useMutation({
        mutationFn: (payload: { score: number; max_score: number; feedback?: string }) =>
            submissionService.overrideSubmissionScore(submissionId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faculty-submission-detail', submissionId] });
        },
    });

    const autoGradeMutation = useMutation({
        mutationFn: () => submissionService.autoGrade(submissionId),
    });

    const runTestsMutation = useMutation({
        mutationFn: () => submissionService.runTests(submissionId),
    });

    const { execute, isRunning: isExecutingCode, result: execResult, error: execError, lastStdinInput } = useCodeExecution();

    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [rubricScores, setRubricScores] = useState<number[]>([]);
    const [feedback, setFeedback] = useState('');
    const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set());
    const [showExplorer, setShowExplorer] = useState(true);
    const [showInfoPanel, setShowInfoPanel] = useState(true);
    const [infoPanelWidth, setInfoPanelWidth] = useState(380);
    const [outputOpen, setOutputOpen] = useState(false);
    const [outputPanelHeight, setOutputPanelHeight] = useState(280);
    const [infoTab, setInfoTab] = useState<'desc' | 'tests' | 'grading' | 'rubric' | 'integrity'>('grading');
    const [stdinValue, setStdinValue] = useState('');
    const [showInlineInput, setShowInlineInput] = useState(false);
    const [autoGradeResult, setAutoGradeResult] = useState<any>(null);
    const [liveTestResults, setLiveTestResults] = useState<any[] | null>(null);

    const { data: assignmentSubmissions = [] } = useQuery({
        queryKey: ['faculty-assignment-submissions', detail?.assignment?.id],
        queryFn: () => submissionService.getSubmissions(String(detail!.assignment.id)),
        enabled: !!detail?.assignment?.id,
    });

    // Helper: flatten rubric sections into flat array of criteria for scoring
    const flattenRubrics = (sections: any[]) => {
        return sections.flatMap((section) => (section.criteria || []).map((crit: any) => ({
            ...crit,
            section_name: section.name,
            section_weight: section.weight ?? 1,
        })));
    };

    const sectionWeightPercent = (weight?: number | null) => {
        if (weight == null || Number.isNaN(weight)) return 100;
        return weight <= 1.5 ? weight * 100 : weight;
    };

    // Initialise form when detail loads
    useEffect(() => {
        if (!detail) return;
        setFeedback(detail.feedback || '');
        const rubricSections = detail.rubrics ?? [];
        const flatRubrics = flattenRubrics(rubricSections);
        
        if (flatRubrics.length > 0) {
            // If already graded, distribute score proportionally across criteria
            if (detail.score != null && flatRubrics.length > 0) {
                const totalMax = flatRubrics.reduce((s: number, r: any) => s + (r.max_points || 0), 0);
                setRubricScores(flatRubrics.map((r: any) =>
                    totalMax > 0 ? Math.round((detail.score! / totalMax) * (r.max_points || 0)) : 0
                ));
            } else {
                setRubricScores(flatRubrics.map(() => 0));
            }
        }
    }, [detail?.id]);

    const rubricSections = detail?.rubrics ?? [];
    const rubrics = flattenRubrics(rubricSections);
    const inferredWeightedRubric = rubricSections.some((section: any) => 
        Math.abs(sectionWeightPercent(section.weight) - 100) > 0.0001 || 
        (section.criteria || []).some((crit: any) => Math.abs((crit.weight ?? 1) - 1) > 0.0001)
    );
    const isWeightedRubric = detail?.assignment?.rubric_mode === 'weighted' || inferredWeightedRubric;
    const getSectionFallbackPoints = (section: any) => {
        const assignmentMaxPoints = detail?.assignment?.max_points ?? 0;
        if (assignmentMaxPoints <= 0) return null;
        if (rubricSections.length === 1) return assignmentMaxPoints;
        if (isWeightedRubric) return Math.round((assignmentMaxPoints * sectionWeightPercent(section.weight)) / 100);
        return null;
    };
    const getTotalScore = () => rubricScores.reduce((s, n) => s + (Number(n) || 0), 0);
    const getTotalMax = () => rubrics.reduce((s: number, r: any) => s + (r.max_points || 0), 0);
    const resultPointsTotal = (detail?.results ?? []).reduce((s, r) => s + (r.points || 0), 0);
    const resolvedMaxPoints = getTotalMax() || detail?.max_score || resultPointsTotal || detail?.assignment?.max_points || 100;

    const updateRubricScore = (idx: number, val: string) => {
        const num = Math.max(0, Math.min(Number(val) || 0, rubrics[idx]?.max_points ?? 0));
        setRubricScores(prev => { const next = [...prev]; next[idx] = num; return next; });
    };

    const getGradeErrorMessage = () => {
        if (!gradeMutation.isError || !gradeMutation.error) {
            return 'Failed to save grade. Please try again.';
        }
        const err = gradeMutation.error as AxiosError<{ detail?: string | Array<{ msg?: string }> }>;
        const detail = err.response?.data?.detail;
        if (typeof detail === 'string' && detail.trim()) {
            return detail;
        }
        if (Array.isArray(detail)) {
            const combined = detail
                .map((d) => d?.msg)
                .filter((msg): msg is string => Boolean(msg && msg.trim()))
                .join('; ');
            if (combined) {
                return combined;
            }
        }
        return err.message || 'Failed to save grade. Please try again.';
    };

    const toggleTest = (id: number) => {
        setExpandedTests(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    };

    const handleAutoGrade = useCallback(async () => {
        setAutoGradeResult(null);
        setInfoTab('grading');
        try {
            const result = await autoGradeMutation.mutateAsync();
            setAutoGradeResult(result);
            // Populate score fields
            if (result.score != null && rubrics.length > 0) {
                const totalMax = rubrics.reduce((s: number, r: any) => s + r.max_points, 0);
                setRubricScores(rubrics.map((r: any) =>
                    totalMax > 0 ? Math.round((result.score / totalMax) * r.max_points) : 0
                ));
            }
            if (result.feedback) setFeedback(result.feedback);
            // Update live test results
            if (result.stored_results) {
                setLiveTestResults(result.stored_results.map((r: any, i: number) => ({
                    id: r.id ?? i,
                    testcase_id: r.testcase_id ?? null,
                    testcase_name: r.testcase_name ?? null,
                    input_data: r.input_data ?? null,
                    expected_output: r.expected_output ?? null,
                    passed: r.passed,
                    output: r.output ?? null,
                    error_output: r.error_output ?? r.error ?? null,
                    points_awarded: r.points_awarded ?? null,
                })));
            }
        } catch (e) { /* handled by mutation state */ }
    }, [rubrics, autoGradeMutation]);

    const sortedAssignmentSubmissions = [...assignmentSubmissions].sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    const currentSubmissionIndex = sortedAssignmentSubmissions.findIndex((s) => s.id === submissionId);
    const nextSubmissionId =
        currentSubmissionIndex >= 0 && currentSubmissionIndex < sortedAssignmentSubmissions.length - 1
            ? sortedAssignmentSubmissions[currentSubmissionIndex + 1].id
            : null;

    const handleRunTests = async () => {
        setInfoTab('tests');
        try {
            const result = await runTestsMutation.mutateAsync();
            const testRows = result?.test_results?.results ?? result?.results ?? [];
            setLiveTestResults(
                testRows.map((r: any, i: number) => ({
                    id: r.id ?? r.testcase_id ?? i,
                    testcase_id: r.testcase_id ?? null,
                    testcase_name: r.testcase_name ?? null,
                    input_data: r.input_data ?? null,
                    expected_output: r.expected_output ?? null,
                    passed: !!r.passed,
                    output: r.output ?? r.actual_output ?? null,
                    error_output: r.error_output ?? r.stderr ?? null,
                    points_awarded: r.points_awarded ?? r.points_earned ?? null,
                }))
            );
        } catch {
            // Mutation state handles the UI error state.
        }
    };

    const handleGrade = async (isDraft: boolean, moveToNext: boolean = false) => {
        const rawScore = getTotalScore();
        const normalizedScore = Math.max(0, Math.min(Math.round(rawScore), resolvedMaxPoints));
        const normalizedMax = Math.max(1, Math.round(resolvedMaxPoints));
        const feedbackToSave = feedback.trim() || 'Reviewed by instructor.';
        await gradeMutation.mutateAsync({ score: normalizedScore, max_score: normalizedMax, feedback: feedbackToSave });
        if (!isDraft) {
            if (moveToNext && nextSubmissionId) {
                router.push(`/courses/${courseId}/submissions/${nextSubmissionId}/grade`);
                return;
            }
            router.push(`/courses/${courseId}/assignments/${detail?.assignment.id}/grading`);
        }
    };

    const codeUsesInput = (code: string, lang: string) =>
        code.split('\n').some((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('#')) return false;
            if (lang === 'python') return trimmed.includes('input(');
            if (lang === 'java') {
                return trimmed.includes('Scanner')
                    || trimmed.includes('System.in')
                    || /\bnext(Line|Int|Double|Float|Long|Short|Byte|Boolean)?\s*\(/.test(trimmed);
            }
            return false;
        });

    const handleRunCode = async () => {
        if (!detail) return;
        const lang = (detail.assignment.language || 'python').toLowerCase();
        const code = detail.files[activeFileIndex]?.content ?? '';
        setOutputOpen(true);
        if (codeUsesInput(code, lang)) {
            if (!showInlineInput) {
                setShowInlineInput(true);
                return;
            }
            await execute(code, lang, stdinValue);
            return;
        }
        setShowInlineInput(false);
        await execute(code, lang);
    };
    const handleOpenInlineInput = () => {
        setOutputOpen(true);
        setShowInlineInput(true);
    };
    const handleRunWithStdin = async () => {
        if (!detail) return;
        const lang = (detail.assignment.language || 'python').toLowerCase();
        const code = detail.files[activeFileIndex]?.content ?? '';
        setOutputOpen(true);
        setShowInlineInput(true);
        await execute(code, lang, stdinValue);
    };

    const breadcrumbs = [
        { label: 'Assignments', href: `/courses/${courseId}/assignments/${detail?.assignment?.id}/grading` },
        { label: `Grading #${submissionId}` },
    ];

    if (isLoading) {
        return (
            <PageLayout>
                <TopNav breadcrumbs={breadcrumbs} />
                <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            </PageLayout>
        );
    }

    if (error || !detail) {
        return (
            <PageLayout>
                <TopNav breadcrumbs={breadcrumbs} />
                <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
                    <div className="text-center">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-error)' }} />
                        <p style={{ fontSize: '16px', color: 'var(--color-text-dark)' }}>Could not load submission</p>
                        <button onClick={() => router.back()} className="mt-4 px-4 py-2 rounded-lg"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '14px' }}>
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
    const displayTests = liveTestResults ?? (detail.results.length > 0
        ? detail.results.map((r, i) => ({
            id: i,
            testcase_id: r.testcase_id,
            testcase_name: r.test_name,
            input_data: r.input_data,
            expected_output: r.expected_output,
            passed: r.passed,
            output: r.actual_output,
            error_output: r.error,
            points_awarded: r.points_earned,
        }))
        : null);

    return (
        <PageLayout>
            <TopNav breadcrumbs={[{ label: 'My Courses', href: '/courses' }, ...breadcrumbs]} />

            <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
                <div className="flex flex-1 overflow-hidden relative">

                    {/* ── LEFT: File Explorer ── */}
                    {showExplorer && (
                        <div className="flex flex-col shrink-0 overflow-hidden"
                            style={{ width: 220, minWidth: 220, background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
                            <div style={{ padding: '12px 14px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', color: 'var(--color-text-light)', textTransform: 'uppercase' as const }}>
                                Explorer
                            </div>
                            <div className="flex-1 overflow-y-auto" style={{ padding: '4px 0' }}>
                                {detail.files.map((file, idx) => {
                                    const isActive = idx === activeFileIndex;
                                    return (
                                        <div key={file.id} onClick={() => setActiveFileIndex(idx)}
                                            style={{
                                                display: 'flex', alignItems: 'center', padding: '5px 14px', cursor: 'pointer',
                                                fontSize: 13, color: isActive ? 'var(--color-text-dark)' : 'var(--color-text-mid)',
                                                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                                                background: isActive ? 'var(--color-surface-elevated)' : 'transparent',
                                                gap: 6, transition: 'background .15s',
                                            }}
                                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
                                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <span style={{ fontSize: 14, flexShrink: 0, display: 'inline-flex', alignItems: 'center', width: 16, height: 16 }}>{getFileIcon(file.filename)}</span>
                                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{file.filename}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ padding: '8px 10px', borderTop: '1px solid var(--color-border)' }}>
                                <button onClick={() => router.push(`/courses/${courseId}/assignments/${detail.assignment.id}/grading`)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, color: 'var(--color-text-mid)', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', transition: 'background .15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-elevated)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <ArrowLeft style={{ width: 15, height: 15 }} /> Back to Grading
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── CENTER: Editor ── */}
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                        {/* Editor Topbar */}
                        <div style={{ height: 38, background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                {activeFile?.filename ?? 'No file open'}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.6px', padding: '2px 8px', borderRadius: 10, background: isDark ? '#3b1a1a' : '#fef3c7', color: isDark ? '#fca5a5' : '#92400e', display: 'inline-flex', alignItems: 'center' }}>
                                {language.charAt(0).toUpperCase() + language.slice(1)}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.6px', padding: '2px 8px', borderRadius: 10, background: isDark ? '#1f2937' : '#e5e7eb', color: isDark ? '#d1d5db' : '#374151', display: 'inline-flex', alignItems: 'center' }}>
                                View Only
                            </span>
                            <div style={{ flex: 1 }} />
                            {/* Run Code */}
                            <button onClick={handleRunCode} disabled={isExecutingCode || autoGradeMutation.isPending}
                                style={{ padding: '5px 16px', borderRadius: 5, fontSize: 12, fontWeight: 700, background: '#16a34a', color: '#fff', letterSpacing: '.3px', transition: 'background .15s', opacity: isExecutingCode ? 0.7 : 1, cursor: isExecutingCode ? 'not-allowed' : 'pointer', border: 'none' }}
                                onMouseEnter={e => { if (!isExecutingCode) { e.currentTarget.style.background = '#15803d'; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; }}>
                                {isExecutingCode ? '⏳ Running...' : '▶ Run Code'}
                            </button>
                            <button
                                onClick={handleOpenInlineInput}
                                disabled={isExecutingCode || autoGradeMutation.isPending}
                                style={{
                                    padding: '5px 12px', borderRadius: 5, fontSize: 12, fontWeight: 700,
                                    background: 'var(--color-surface-elevated)', color: 'var(--color-text-dark)', letterSpacing: '.3px',
                                    transition: 'background .15s', opacity: isExecutingCode ? 0.7 : 1,
                                    cursor: isExecutingCode ? 'not-allowed' : 'pointer', border: '1px solid var(--color-border)'
                                }}
                                onMouseEnter={e => { if (!isExecutingCode) e.currentTarget.style.background = 'var(--color-border)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; }}
                            >
                                ⌨ Input
                            </button>
                            <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 6px' }} />
                            {/* Auto Grade */}
                            <button onClick={handleAutoGrade} disabled={autoGradeMutation.isPending}
                                style={{ padding: '5px 16px', borderRadius: 5, fontSize: 12, fontWeight: 700, background: isDark ? '#7f1d1d' : '#991b1b', color: '#fff', letterSpacing: '.3px', transition: 'all .15s', opacity: autoGradeMutation.isPending ? 0.7 : 1, cursor: autoGradeMutation.isPending ? 'not-allowed' : 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                                onMouseEnter={e => { if (!autoGradeMutation.isPending) e.currentTarget.style.background = '#b91c1c'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#7f1d1d' : '#991b1b'; }}>
                                {autoGradeMutation.isPending ? <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Grading...</> : <><Zap style={{ width: 14, height: 14 }} /> Auto Grade</>}
                            </button>
                            <div style={{ width: 1, height: 16, background: 'var(--color-border)', margin: '0 6px' }} />
                            {/* Layout toggles */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {[
                                    { label: 'Explorer', active: showExplorer, toggle: () => setShowExplorer(v => !v), icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.2} width={16} height={16}><rect x="1" y="1" width="4.5" height="14" rx="1" fill="currentColor" opacity=".35" /><rect x="1" y="1" width="14" height="14" rx="1.5" /></svg> },
                                    { label: 'Output', active: outputOpen, toggle: () => setOutputOpen(v => !v), icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.2} width={16} height={16}><rect x="1" y="9.5" width="14" height="5.5" rx="1" fill="currentColor" opacity=".35" /><rect x="1" y="1" width="14" height="14" rx="1.5" /></svg> },
                                    { label: 'Panel', active: showInfoPanel, toggle: () => setShowInfoPanel(v => !v), icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.2} width={16} height={16}><rect x="10.5" y="1" width="4.5" height="14" rx="1" fill="currentColor" opacity=".35" /><rect x="1" y="1" width="14" height="14" rx="1.5" /></svg> },
                                ].map(btn => (
                                    <button key={btn.label} onClick={btn.toggle} title={`Toggle ${btn.label}`}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: btn.active ? 'var(--color-text-dark)' : 'var(--color-text-light)', transition: 'background .12s, color .12s' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-dark)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = btn.active ? 'var(--color-text-dark)' : 'var(--color-text-light)'; }}>
                                        {btn.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Code Editor */}
                        <div className="flex-1 overflow-hidden relative" style={{ background: 'var(--color-surface)' }}>
                            {activeFile ? (
                                <CodeEditor language={language} value={code} onChange={() => { }} readOnly />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p style={{ color: 'var(--color-text-mid)', fontSize: '14px' }}>No file content available</p>
                                </div>
                            )}
                        </div>

                        {/* Output Panel */}
                        <div style={{ height: outputOpen ? outputPanelHeight : 0, background: 'var(--color-surface)', borderTop: outputOpen ? '1px solid var(--color-border)' : 'none', overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'column' as const }}>
                            {/* Drag-to-resize handle */}
                            <div
                                onMouseDown={(e) => {
                                    const startY = e.clientY;
                                    const startH = outputPanelHeight;
                                    const onMove = (ev: MouseEvent) => setOutputPanelHeight(Math.max(120, Math.min(700, startH + (startY - ev.clientY))));
                                    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                                    window.addEventListener('mousemove', onMove);
                                    window.addEventListener('mouseup', onUp);
                                }}
                                style={{ height: 5, cursor: 'ns-resize', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-elevated)' }}
                            >
                                <div style={{ width: 28, height: 3, borderRadius: 2, background: 'var(--color-border)' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px', background: 'var(--color-surface-elevated)', borderBottom: '1px solid var(--color-border)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-light)', flexShrink: 0 }}>
                                <span>⬤ TERMINAL OUTPUT</span>
                                <button onClick={() => setOutputOpen(false)} style={{ fontSize: 14, color: 'var(--color-text-light)', padding: '2px 6px', borderRadius: 3, background: 'transparent', border: 'none', cursor: 'pointer' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-border)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>✕</button>
                            </div>
                            <div className="flex-1 min-h-0">
                                <OutputPanel
                                    result={execResult}
                                    isRunning={isExecutingCode}
                                    error={execError}
                                    stdinInput={lastStdinInput}
                                    showInputEditor={showInlineInput}
                                    inputDraft={stdinValue}
                                    onInputDraftChange={setStdinValue}
                                    onRunWithInput={handleRunWithStdin}
                                    isRunWithInputDisabled={isExecutingCode || autoGradeMutation.isPending}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Info Panel ── */}
                    {showInfoPanel && (
                        <div className="flex flex-col overflow-hidden shrink-0"
                            style={{ width: infoPanelWidth, minWidth: infoPanelWidth, background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)', position: 'relative' }}>
                            <div
                                onMouseDown={(e) => {
                                    const startX = e.clientX;
                                    const startWidth = infoPanelWidth;
                                    const onMove = (ev: MouseEvent) => {
                                        const next = Math.max(300, Math.min(760, startWidth + (startX - ev.clientX)));
                                        setInfoPanelWidth(next);
                                    };
                                    const onUp = () => {
                                        window.removeEventListener('mousemove', onMove);
                                        window.removeEventListener('mouseup', onUp);
                                    };
                                    window.addEventListener('mousemove', onMove);
                                    window.addEventListener('mouseup', onUp);
                                }}
                                title="Drag to resize panel"
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 6,
                                    cursor: 'col-resize',
                                    zIndex: 20,
                                    background: 'transparent',
                                }}
                            />
                            {/* Tabs */}
                            <div style={{ display: 'flex', padding: '8px 10px 0', gap: 4, flexShrink: 0 }}>
                                {(['desc', 'tests', 'grading', 'rubric', 'integrity'] as const).map(tab => (
                                    <button key={tab} onClick={() => setInfoTab(tab)}
                                        style={{ padding: '6px 12px', borderRadius: 16, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' as const, transition: 'all .2s', background: infoTab === tab ? '#7f1d1d' : 'transparent', color: infoTab === tab ? '#fff' : 'var(--color-text-light)', border: 'none', cursor: 'pointer' }}
                                        onMouseEnter={e => { if (infoTab !== tab) { e.currentTarget.style.background = 'var(--color-surface-elevated)'; e.currentTarget.style.color = 'var(--color-text-mid)'; } }}
                                        onMouseLeave={e => { if (infoTab !== tab) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-light)'; } }}>
                                        {tab === 'desc' ? '📋 Info' : tab === 'tests' ? '🧪 Tests' : tab === 'grading' ? '📊 Grading' : tab === 'rubric' ? '📚 Rubric' : '🛡 Integrity'}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto" style={{ padding: 16 }}>

                                {/* ── Info Tab ── */}
                                {infoTab === 'desc' && (
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary-light)' }}>
                                                <User className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)' }}>{detail.student.name}</p>
                                                <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>{detail.student.email}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>{detail.assignment.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>Attempt #{detail.attempt_number}</span>
                                            </div>
                                            {detail.submitted_at && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                        Submitted: {new Date(detail.submitted_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            )}
                                            {detail.assignment.due_date && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                                                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                        Due: {new Date(detail.assignment.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                                            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)' }}>🧪 Test Results</h2>
                                            <button onClick={handleRunTests} disabled={runTestsMutation.isPending || autoGradeMutation.isPending}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shadow-sm disabled:opacity-50"
                                                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, cursor: 'pointer' }}>
                                                {runTestsMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                                                Run All Tests
                                            </button>
                                        </div>
                                        {(() => {
                                            if (!displayTests || displayTests.length === 0) {
                                                if (runTestsMutation.isPending) return (
                                                    <div className="flex flex-col items-center justify-center p-8 gap-3">
                                                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
                                                        <p style={{ fontSize: 12, color: 'var(--color-text-mid)' }}>Running tests...</p>
                                                    </div>
                                                );
                                                return <p style={{ fontSize: 13, color: 'var(--color-text-mid)' }}>No test results yet. Run tests to see output.</p>;
                                            }
                                            const passed = displayTests.filter((t: any) => t.passed).length;
                                            return (
                                                <div>
                                                    <span className="px-2.5 py-1 rounded-full mb-4 inline-block"
                                                        style={{ fontSize: '12px', fontWeight: 600, color: passed === displayTests.length ? '#059669' : '#D97706', backgroundColor: passed === displayTests.length ? '#D1FAE5' : '#FEF3C7' }}>
                                                        {passed}/{displayTests.length} passed
                                                    </span>
                                                    <div className="space-y-2">
                                                        {displayTests.map((test: any) => (
                                                            <div key={test.id} className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                                                                <button onClick={() => toggleTest(test.id)} className="w-full flex items-center justify-between px-3 py-2.5 transition-colors"
                                                                    style={{ cursor: 'pointer', background: 'transparent' }}
                                                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-bg)'}
                                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                                    <div className="flex items-center gap-2">
                                                                        {test.passed ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#059669' }} /> : <XCircle className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />}
                                                                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>{test.testcase_name || `Test #${test.testcase_id}`}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {test.points_awarded != null && <span style={{ fontSize: '11px', color: 'var(--color-text-mid)' }}>{test.points_awarded} pts</span>}
                                                                        {expandedTests.has(test.id) ? <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} /> : <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-light)' }} />}
                                                                    </div>
                                                                </button>
                                                                {expandedTests.has(test.id) && (
                                                                    <div className="px-3 py-2 border-t" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-primary-bg)' }}>
                                                                        {test.input_data && (
                                                                            <div className="mb-2">
                                                                                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '4px' }}>Input:</p>
                                                                                <pre className="p-2 rounded text-xs overflow-x-auto" style={{ backgroundColor: '#111827', color: '#E5E7EB', fontFamily: 'monospace', maxHeight: '120px' }}>{test.input_data}</pre>
                                                                            </div>
                                                                        )}
                                                                        {test.expected_output && (
                                                                            <div className="mb-2">
                                                                                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '4px' }}>Expected Output:</p>
                                                                                <pre className="p-2 rounded text-xs overflow-x-auto" style={{ backgroundColor: '#111827', color: '#E5E7EB', fontFamily: 'monospace', maxHeight: '120px' }}>{test.expected_output}</pre>
                                                                            </div>
                                                                        )}
                                                                        {test.output && (
                                                                            <div className="mb-2">
                                                                                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '4px' }}>Output:</p>
                                                                                <pre className="p-2 rounded text-xs overflow-x-auto" style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', maxHeight: '120px' }}>{test.output}</pre>
                                                                            </div>
                                                                        )}
                                                                        {test.error_output && (
                                                                            <div>
                                                                                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, color: '#DC2626', marginBottom: '4px' }}>Error:</p>
                                                                                <pre className="p-2 rounded text-xs overflow-x-auto" style={{ backgroundColor: '#FEF2F2', color: '#991B1B', fontFamily: 'monospace', maxHeight: '120px' }}>{test.error_output}</pre>
                                                                            </div>
                                                                        )}
                                                                        {!test.output && !test.error_output && <p style={{ fontSize: '11px', color: 'var(--color-text-light)', fontStyle: 'italic' }}>No output recorded</p>}
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

                                {/* ── Integrity Tab ── */}
                                {infoTab === 'rubric' && (
                                    <div>
                                        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 12 }}>📚 Rubric &amp; Points</h2>

                                        {rubricSections.length > 0 ? (
                                            <div className="space-y-4">
                                                {rubricSections.map((section: any, sectionIdx: number) => (
                                                    <div key={sectionIdx}>
                                                        {/* Section header */}
                                                        <div style={{
                                                            padding: '10px 12px',
                                                            background: 'var(--color-surface)',
                                                            borderRadius: '6px 6px 0 0',
                                                            borderBottom: '1px solid var(--color-border)',
                                                            fontWeight: 700,
                                                            fontSize: 13,
                                                            color: 'var(--color-text-dark)',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                        }}>
                                                            <span>{section.name}</span>
                                                            {isWeightedRubric && <span style={{ fontSize: 11, color: 'var(--color-text-light)' }}>Weight: {sectionWeightPercent(section.weight).toFixed(1)}%</span>}
                                                        </div>

                                                        {/* Criteria for this section */}
                                                        <div style={{
                                                            borderRadius: '0 0 6px 6px',
                                                            overflow: 'hidden',
                                                            marginBottom: sectionIdx < rubricSections.length - 1 ? 16 : 0,
                                                            border: '1px solid var(--color-border)',
                                                            borderTop: 'none',
                                                        }}>
                                                            {(section.criteria || []).length > 0 ? (
                                                                (section.criteria || []).map((criterion: any, critIdx: number) => {
                                                                    const flatIdx = rubrics.findIndex((r: any) => 
                                                                        r.name === criterion.name && r.section_name === section.name
                                                                    );
                                                                    return (
                                                                        <div
                                                                            key={critIdx}
                                                                            className="rounded-lg p-3"
                                                                            style={{
                                                                                borderBottom: critIdx < ((section.criteria || []).length - 1) ? '1px solid var(--color-border)' : 'none',
                                                                                backgroundColor: 'var(--color-surface-elevated)',
                                                                            }}
                                                                        >
                                                                            <div className="flex items-start justify-between gap-3">
                                                                                <div style={{ flex: 1 }}>
                                                                                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>{criterion.name}</p>
                                                                                    {criterion.description && <p style={{ fontSize: '11px', color: 'var(--color-text-mid)', marginTop: 2 }}>{criterion.description}</p>}
                                                                                    {isWeightedRubric && <p style={{ fontSize: '11px', color: 'var(--color-text-light)', marginTop: 3 }}>
                                                                                        Weight: {((criterion.weight ?? 1) * 100).toFixed(0)}%
                                                                                    </p>}
                                                                                </div>
                                                                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>
                                                                                    {criterion.max_points} pts
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div style={{ padding: '12px 14px', backgroundColor: 'var(--color-surface-elevated)' }}>
                                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-mid)', lineHeight: 1.6 }}>
                                                                        {section.description || 'No criteria were defined for this section.'}
                                                                    </p>
                                                                    {getSectionFallbackPoints(section) !== null && (
                                                                        <p style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700, marginTop: 8 }}>
                                                                            Points: {getSectionFallbackPoints(section)}
                                                                        </p>
                                                                    )}
                                                                    {isWeightedRubric && (
                                                                        <p style={{ fontSize: '11px', color: 'var(--color-text-light)', marginTop: 8 }}>
                                                                            Section Weight: {sectionWeightPercent(section.weight).toFixed(1)}%
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: 13, color: 'var(--color-text-mid)' }}>No rubric has been configured for this assignment.</p>
                                        )}
                                    </div>
                                )}

                                {/* ── Integrity Tab ── */}
                                {infoTab === 'integrity' && (
                                    <div>
                                        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 12 }}>🛡 Integrity Check</h2>

                                        {detail.integrity ? (
                                            <div className="mb-5 rounded-lg p-3" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
                                                <div className="mb-3 p-2 rounded" style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }}>
                                                    <div className="flex items-center justify-between">
                                                        <span style={{ fontSize: '12px', color: 'var(--color-text-dark)', fontWeight: 600 }}>AI-generated likelihood</span>
                                                        <span
                                                            style={{
                                                                ...getRiskTagStyle(detail.integrity.ai_detection.band),
                                                                fontSize: '11px',
                                                                fontWeight: 700,
                                                                padding: '2px 8px',
                                                                borderRadius: 999,
                                                            }}
                                                        >
                                                            {detail.integrity.ai_detection.score}% {getBandLabel(detail.integrity.ai_detection.band)}
                                                        </span>
                                                    </div>
                                                    {detail.integrity.ai_detection.signals.length > 0 && (
                                                        <ul style={{ marginTop: 6, paddingLeft: 16, fontSize: '11px', color: 'var(--color-text-mid)' }}>
                                                            {detail.integrity.ai_detection.signals.slice(0, 3).map((sig, i) => (
                                                                <li key={`${sig}-${i}`}>{sig}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    <p style={{ marginTop: 6, fontSize: '10px', color: 'var(--color-text-light)' }}>
                                                        {detail.integrity.ai_detection.disclaimer}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: 6 }}>
                                                        Similarity with other student submissions
                                                    </p>
                                                    <p style={{ fontSize: '10px', color: 'var(--color-text-light)', marginBottom: 8 }}>
                                                        Compared against {detail.integrity.plagiarism.checked_against} latest submissions from classmates.
                                                    </p>

                                                    {detail.integrity.plagiarism.top_matches.length === 0 ? (
                                                        <p style={{ fontSize: '11px', color: 'var(--color-text-mid)' }}>No comparable submissions found yet.</p>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {detail.integrity.plagiarism.top_matches.map((m) => (
                                                                <div
                                                                    key={m.submission_id}
                                                                    className="rounded-md px-2 py-2"
                                                                    style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span style={{ fontSize: '12px', color: 'var(--color-text-dark)', fontWeight: 600 }}>{m.student_name}</span>
                                                                        <span
                                                                            style={{
                                                                                ...getRiskTagStyle(m.risk),
                                                                                fontSize: '11px',
                                                                                fontWeight: 700,
                                                                                padding: '2px 8px',
                                                                                borderRadius: 999,
                                                                            }}
                                                                        >
                                                                            {m.similarity_percent}% {getBandLabel(m.risk)}
                                                                        </span>
                                                                    </div>
                                                                    <p style={{ fontSize: '10px', color: 'var(--color-text-light)' }}>
                                                                        {m.student_email ?? 'No email'} • submission #{m.submission_id}
                                                                    </p>
                                                                    {m.submitted_at && (
                                                                        <p style={{ fontSize: '10px', color: 'var(--color-text-light)' }}>
                                                                            Submitted {new Date(m.submitted_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                                        </p>
                                                                    )}
                                                                    <button
                                                                        onClick={() => router.push(`/courses/${courseId}/submissions/${m.submission_id}/grade`)}
                                                                        style={{
                                                                            marginTop: 6,
                                                                            fontSize: '11px',
                                                                            fontWeight: 600,
                                                                            color: 'var(--color-primary)',
                                                                            background: 'transparent',
                                                                            border: 'none',
                                                                            padding: 0,
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    >
                                                                        Open matched submission
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <p style={{ marginTop: 8, fontSize: '10px', color: 'var(--color-text-light)' }}>
                                                        {detail.integrity.plagiarism.note}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: 13, color: 'var(--color-text-mid)' }}>Integrity insights are not available for this submission.</p>
                                        )}
                                    </div>
                                )}

                                {/* ── Grading Tab ── */}
                                {infoTab === 'grading' && (
                                    <div>
                                        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: 12 }}>📊 Assess &amp; Grade</h2>

                                        {/* Auto-grade result banner */}
                                        {autoGradeResult && (
                                            <div className="mb-4 px-4 py-3 rounded-lg" style={{ backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7' }}>
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#065F46', marginBottom: '2px' }}>{autoGradeResult.message}</p>
                                                <p style={{ fontSize: '12px', color: '#065F46' }}>
                                                    Auto-score: {autoGradeResult.score ?? '—'} / {autoGradeResult.max_score ?? '—'} ({autoGradeResult.percentage?.toFixed(1)}%)
                                                </p>
                                            </div>
                                        )}

                                        {/* Per-criterion rubric scoring */}
                                        {rubrics.length > 0 ? (
                                            <div className="mb-5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 700, color: 'var(--color-text-mid)' }}>
                                                        Rubric Grading
                                                    </h3>
                                                    <span
                                                        style={{
                                                            fontSize: 11,
                                                            fontWeight: 700,
                                                            letterSpacing: '.35px',
                                                            textTransform: 'uppercase' as const,
                                                            color: isWeightedRubric ? '#6B0000' : '#2D6A2D',
                                                            backgroundColor: isWeightedRubric ? 'rgba(107,0,0,.10)' : 'rgba(45,106,45,.12)',
                                                            border: `1px solid ${isWeightedRubric ? 'rgba(107,0,0,.24)' : 'rgba(45,106,45,.24)'}`,
                                                            borderRadius: 999,
                                                            padding: '3px 9px',
                                                        }}
                                                    >
                                                        {isWeightedRubric ? 'Weighted' : 'Unweighted'}
                                                    </span>
                                                </div>
                                                <div className="space-y-4">
                                                    {rubricSections.map((section: any, sectionIdx: number) => (
                                                        <div key={sectionIdx}>
                                                            {/* Section header */}
                                                            {sectionIdx === 0 || rubricSections[sectionIdx - 1].name !== section.name ? (
                                                                <div style={{
                                                                    padding: '8px 12px',
                                                                    background: 'var(--color-surface)',
                                                                    borderRadius: '6px 6px 0 0',
                                                                    fontWeight: 700,
                                                                    fontSize: 13,
                                                                    color: 'var(--color-text-dark)',
                                                                    marginBottom: 8,
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                }}>
                                                                    <span>{section.name}</span>
                                                                    {isWeightedRubric && <span style={{ fontSize: 11, color: 'var(--color-text-light)' }}>Weight: {(section.weight ?? 1).toFixed(2)}x</span>}
                                                                </div>
                                                            ) : null}

                                                            {/* Criteria in this section */}
                                                            <div style={{
                                                                background: 'var(--color-surface-elevated)',
                                                                borderRadius: '6px',
                                                                border: '1px solid var(--color-border)',
                                                                marginBottom: sectionIdx < rubricSections.length - 1 ? 12 : 0,
                                                                overflow: 'hidden',
                                                            }}>
                                                                {(section.criteria || []).map((criterion: any, critIdx: number, critArray: any[]) => {
                                                                    // Find the index in the flattened rubrics array
                                                                    const flatIdx = rubrics.findIndex((r: any) => 
                                                                        r.name === criterion.name && r.section_name === section.name
                                                                    );
                                                                    return (
                                                                        <div
                                                                            key={critIdx}
                                                                            className="p-3"
                                                                            style={{
                                                                                borderBottom: critIdx < critArray.length - 1 ? '1px solid var(--color-border)' : 'none',
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <div style={{ flex: 1 }}>
                                                                                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>{criterion.name}</p>
                                                                                    {criterion.description && <p style={{ fontSize: '11px', color: 'var(--color-text-mid)', marginTop: 2 }}>{criterion.description}</p>}
                                                                                    {isWeightedRubric && <p style={{ fontSize: '11px', color: 'var(--color-text-light)', marginTop: 3 }}>
                                                                                        Weight: {((criterion.weight ?? 1) * 100).toFixed(0)}%
                                                                                    </p>}
                                                                                </div>
                                                                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0, marginLeft: 8 }}>
                                                                                    {rubricScores[flatIdx] ?? 0} / {criterion.max_points}
                                                                                </span>
                                                                            </div>
                                                                            <input type="number" min={0} max={criterion.max_points}
                                                                                value={rubricScores[flatIdx] ?? 0}
                                                                                onChange={e => flatIdx >= 0 && updateRubricScore(flatIdx, e.target.value)}
                                                                                className="w-full px-3 py-1.5 rounded-md focus:outline-none transition-shadow"
                                                                                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', fontSize: '14px', color: 'var(--color-text-dark)' }} />
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Total Score */}
                                                <div className="mt-4 px-4 py-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }}>
                                                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Total</span>
                                                    <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)' }}>{getTotalScore()} / {getTotalMax()}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Fallback: simple score inputs when no rubric defined */
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', display: 'block', marginBottom: '6px' }}>Score Earned</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={resolvedMaxPoints}
                                                        value={rubricScores[0] ?? detail.score ?? ''}
                                                        onChange={e => {
                                                            const raw = Number(e.target.value);
                                                            const clamped = Math.max(0, Math.min(Number.isFinite(raw) ? raw : 0, resolvedMaxPoints));
                                                            setRubricScores([clamped]);
                                                        }}
                                                        className="w-full px-3 py-2 rounded-lg focus:outline-none"
                                                        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', fontSize: '14px', color: 'var(--color-text-dark)' }} />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', display: 'block', marginBottom: '6px' }}>Max Points</label>
                                                    <input type="number" value={resolvedMaxPoints} readOnly
                                                        className="w-full px-3 py-2 rounded-lg"
                                                        style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', fontSize: '14px', color: 'var(--color-text-mid)', cursor: 'not-allowed' }} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Feedback */}
                                        <div className="mb-5">
                                            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', display: 'block', marginBottom: '6px' }}>Feedback for Student</label>
                                            <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={5}
                                                placeholder="Add comments on their submission..."
                                                className="w-full px-3 py-2 rounded-lg resize-none"
                                                style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)', fontSize: '13px', color: 'var(--color-text-dark)', lineHeight: 1.5 }} />
                                        </div>

                                        {/* Submit / Draft buttons */}
                                        <div className="flex flex-col gap-3">
                                                    <button onClick={() => handleGrade(false)}
                                                disabled={gradeMutation.isPending || (rubrics.length === 0 && (rubricScores[0] == null || Number.isNaN(rubricScores[0])))}
                                                style={{ width: '100%', padding: '12px', borderRadius: 6, fontSize: 13, fontWeight: 700, border: 'none', background: 'linear-gradient(135deg, #15803d, #16a34a)', color: '#fff', textTransform: 'uppercase' as const, letterSpacing: '.5px', cursor: gradeMutation.isPending ? 'not-allowed' : 'pointer', opacity: gradeMutation.isPending ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all .2s' }}
                                                onMouseEnter={e => { if (!gradeMutation.isPending) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(21,128,61,.35)'; } }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                                {gradeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                Submit Final Grade
                                            </button>
                                                    {nextSubmissionId && (
                                                        <button onClick={() => handleGrade(false, true)} disabled={gradeMutation.isPending}
                                                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                                                            style={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-dark)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                                                            <Send className="w-4 h-4" /> Save &amp; Next
                                                        </button>
                                                    )}
                                            <button onClick={() => handleGrade(true)} disabled={gradeMutation.isPending}
                                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                                                style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text-dark)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                                                <Save className="w-4 h-4" /> Save Draft
                                            </button>
                                        </div>

                                        {gradeMutation.isSuccess && (
                                            <div className="mt-4 px-4 py-2 rounded-lg" style={{ backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7' }}>
                                                <p style={{ fontSize: '12px', fontWeight: 500, color: '#065F46' }}>Grade recorded successfully</p>
                                            </div>
                                        )}
                                        {gradeMutation.isError && (
                                            <div className="mt-4 px-4 py-2 rounded-lg" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5' }}>
                                                <p style={{ fontSize: '12px', fontWeight: 500, color: '#991B1B' }}>{getGradeErrorMessage()}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Bar */}
                <div style={{ height: 28, background: '#1e4a7a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: 11, fontWeight: 500, flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '.4px' }}><span style={{ opacity: .7 }}>ROLE:</span> FACULTY</span>
                        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '.4px' }}><span style={{ opacity: .7 }}>LANG:</span> {language.toUpperCase()}</span>
                    </div>
                    <div>
                        <span style={{ opacity: .9 }}>{detail.status === 'graded' ? '✓ SUBMISSION GRADED' : '● NEEDS GRADING'}</span>
                    </div>
                </div>
            </div>

        </PageLayout>
    );
}
