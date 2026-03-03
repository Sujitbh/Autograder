'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from './PageLayout';
import { TopNav } from './TopNav';
import {
    useTASubmissionDetail,
    useTAGradeSubmission,
    useTACoursePermissions,
} from '@/hooks/queries/useTADashboard';
import {
    ArrowLeft,
    FileCode,
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
} from 'lucide-react';

interface TAGradingPageProps {
    courseId: string;
    submissionId: string;
}

export default function TAGradingPage({ courseId, submissionId }: Readonly<TAGradingPageProps>) {
    const router = useRouter();
    const courseIdNum = Number.parseInt(courseId);
    const submissionIdNum = Number.parseInt(submissionId);

    const { data: permissions } = useTACoursePermissions(courseIdNum);
    const { data: detail, isLoading, error } = useTASubmissionDetail(courseIdNum, submissionIdNum);
    const gradeMutation = useTAGradeSubmission(courseIdNum);

    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [score, setScore] = useState<string>('');
    const [maxScore, setMaxScore] = useState<string>('');
    const [feedback, setFeedback] = useState('');
    const [expandedTests, setExpandedTests] = useState<Set<number>>(new Set());

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

    const activeFile = detail.files[activeFileIndex];
    const passedTests = detail.test_results.filter((t) => t.passed).length;

    return (
        <PageLayout>
            <TopNav breadcrumbs={[{ label: 'TA Dashboard', href: '/ta' }, ...breadcrumbs]} />

            <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
                {/* ═══════════════════════════════════════════════════════════════
           LEFT PANEL — Code Viewer
           ═══════════════════════════════════════════════════════════════ */}
                <div
                    className="flex flex-col border-r"
                    style={{
                        width: '55%',
                        minWidth: '400px',
                        borderColor: 'var(--color-border)',
                    }}
                >
                    {/* File tabs */}
                    <div
                        className="flex items-center gap-1 px-4 py-2 border-b overflow-x-auto"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                    >
                        <button
                            onClick={() => router.push(`/ta/courses/${courseId}/submissions`)}
                            className="flex items-center gap-1 px-2 py-1 rounded mr-2 hover:bg-[var(--color-primary-bg)] transition-colors"
                            style={{ color: 'var(--color-text-mid)', fontSize: '13px' }}
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back
                        </button>
                        <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)', marginRight: '8px' }} />
                        {detail.files.map((file, idx) => (
                            <button
                                key={file.id}
                                onClick={() => setActiveFileIndex(idx)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap"
                                style={{
                                    backgroundColor: idx === activeFileIndex ? 'var(--color-primary-light)' : 'transparent',
                                    color: idx === activeFileIndex ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                    fontSize: '13px',
                                    fontWeight: idx === activeFileIndex ? 600 : 400,
                                }}
                            >
                                <FileCode className="w-3.5 h-3.5" />
                                {file.filename}
                            </button>
                        ))}
                    </div>

                    {/* Code content */}
                    <div className="flex-1 overflow-auto" style={{ backgroundColor: '#1e1e1e' }}>
                        {activeFile?.content ? (
                            <pre
                                className="p-4"
                                style={{
                                    fontSize: '13px',
                                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                                    color: '#d4d4d4',
                                    lineHeight: 1.6,
                                    margin: 0,
                                    whiteSpace: 'pre',
                                    tabSize: 4,
                                }}
                            >
                                {activeFile.content.split('\n').map((line, i) => (
                                    <div key={`line-${i}-${line.length}`} className="flex hover:bg-[rgba(255,255,255,0.05)]">
                                        <span
                                            className="select-none text-right pr-4 flex-shrink-0"
                                            style={{
                                                color: '#858585',
                                                width: '50px',
                                                fontSize: '12px',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {i + 1}
                                        </span>
                                        <code>{line}</code>
                                    </div>
                                ))}
                            </pre>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p style={{ color: '#858585', fontSize: '14px' }}>No file content available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
           RIGHT PANEL — Student Info + Tests + Grading Form
           ═══════════════════════════════════════════════════════════════ */}
                <div
                    className="flex flex-col overflow-y-auto"
                    style={{
                        width: '45%',
                        backgroundColor: 'var(--color-surface)',
                    }}
                >
                    {/* Student Info Card */}
                    <div
                        className="p-6 border-b"
                        style={{ borderColor: 'var(--color-border)' }}
                    >
                        <div className="flex items-center gap-4 mb-4">
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

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                    {detail.assignment.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Hash className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                                <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                    Attempt #{detail.attempt_number}
                                </span>
                            </div>
                            {detail.created_at && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                        {new Date(detail.created_at).toLocaleString('en-US', {
                                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            )}
                            {detail.assignment.due_date && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                        Due: {new Date(detail.assignment.due_date).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Test Results Section */}
                    {detail.test_results.length > 0 && (
                        <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                    Test Results
                                </h3>
                                <span
                                    className="px-2.5 py-1 rounded-full"
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: passedTests === detail.test_results.length ? '#059669' : '#D97706',
                                        backgroundColor: passedTests === detail.test_results.length ? '#D1FAE5' : '#FEF3C7',
                                    }}
                                >
                                    {passedTests}/{detail.test_results.length} passed
                                </span>
                            </div>

                            <div className="space-y-2">
                                {detail.test_results.map((test) => (
                                    <div
                                        key={test.id}
                                        className="rounded-lg overflow-hidden"
                                        style={{ border: '1px solid var(--color-border)' }}
                                    >
                                        <button
                                            onClick={() => toggleTest(test.id)}
                                            className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--color-primary-bg)]"
                                        >
                                            <div className="flex items-center gap-3">
                                                {test.passed ? (
                                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#059669' }} />
                                                ) : (
                                                    <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#DC2626' }} />
                                                )}
                                                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    {test.testcase_name || `Test #${test.testcase_id}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {test.points_awarded != null && (
                                                    <span style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>
                                                        {test.points_awarded} pts
                                                    </span>
                                                )}
                                                {test.execution_time_ms != null && (
                                                    <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                                                        {test.execution_time_ms}ms
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
                                                className="px-4 py-3 border-t"
                                                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-primary-bg)' }}
                                            >
                                                {test.output && (
                                                    <div className="mb-2">
                                                        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-mid)', marginBottom: '4px' }}>
                                                            Output:
                                                        </p>
                                                        <pre
                                                            className="p-2 rounded text-xs overflow-x-auto"
                                                            style={{
                                                                backgroundColor: '#1e1e1e',
                                                                color: '#d4d4d4',
                                                                fontFamily: 'monospace',
                                                                maxHeight: '120px',
                                                                overflowY: 'auto',
                                                            }}
                                                        >
                                                            {test.output}
                                                        </pre>
                                                    </div>
                                                )}
                                                {test.error_output && (
                                                    <div>
                                                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#DC2626', marginBottom: '4px' }}>
                                                            Error:
                                                        </p>
                                                        <pre
                                                            className="p-2 rounded text-xs overflow-x-auto"
                                                            style={{
                                                                backgroundColor: '#FEF2F2',
                                                                color: '#991B1B',
                                                                fontFamily: 'monospace',
                                                                maxHeight: '120px',
                                                                overflowY: 'auto',
                                                            }}
                                                        >
                                                            {test.error_output}
                                                        </pre>
                                                    </div>
                                                )}
                                                {!test.output && !test.error_output && (
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                                                        No output recorded
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rubric Section */}
                    {detail.rubrics.length > 0 && (
                        <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <h3
                                style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '12px' }}
                            >
                                Rubric
                            </h3>
                            <div className="space-y-3">
                                {detail.rubrics.map((rubric) => (
                                    <div
                                        key={rubric.id}
                                        className="flex items-center justify-between px-4 py-3 rounded-lg"
                                        style={{ backgroundColor: 'var(--color-primary-bg)', border: '1px solid var(--color-border)' }}
                                    >
                                        <div>
                                            <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                {rubric.name}
                                            </p>
                                            {rubric.description && (
                                                <p style={{ fontSize: '12px', color: 'var(--color-text-mid)' }}>
                                                    {rubric.description}
                                                </p>
                                            )}
                                        </div>
                                        <span
                                            className="px-2 py-1 rounded-md"
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                color: 'var(--color-text-dark)',
                                                backgroundColor: 'var(--color-surface)',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            {rubric.max_points || 0} pts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Grading Form */}
                    {permissions?.can_grade !== false && (
                        <div className="p-6">
                            <h3
                                style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '16px' }}
                            >
                                Grade Submission
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label
                                        htmlFor="grade-score"
                                        style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)', display: 'block', marginBottom: '6px' }}
                                    >
                                        Score
                                    </label>
                                    <input
                                        id="grade-score"
                                        type="number"
                                        value={score}
                                        onChange={(e) => setScore(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-3 py-2.5 rounded-lg"
                                        style={{
                                            backgroundColor: 'var(--color-primary-bg)',
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
                                        Max Score
                                    </label>
                                    <input
                                        id="grade-max-score"
                                        type="number"
                                        value={maxScore}
                                        onChange={(e) => setMaxScore(e.target.value)}
                                        placeholder="100"
                                        className="w-full px-3 py-2.5 rounded-lg"
                                        style={{
                                            backgroundColor: 'var(--color-primary-bg)',
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
                                    Feedback
                                </label>
                                <textarea
                                    id="grade-feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={5}
                                    placeholder="Write feedback for the student..."
                                    className="w-full px-3 py-2.5 rounded-lg resize-none"
                                    style={{
                                        backgroundColor: 'var(--color-primary-bg)',
                                        border: '1px solid var(--color-border)',
                                        fontSize: '14px',
                                        color: 'var(--color-text-dark)',
                                        lineHeight: 1.5,
                                    }}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleGrade(true)}
                                    disabled={gradeMutation.isPending}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                                    style={{
                                        backgroundColor: 'var(--color-primary-bg)',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-dark)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                    }}
                                >
                                    <Save className="w-4 h-4" />
                                    Save Draft
                                </button>
                                <button
                                    onClick={() => handleGrade(false)}
                                    disabled={gradeMutation.isPending || !score}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
                                    style={{
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'white',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                    }}
                                >
                                    {gradeMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Submit Grade
                                </button>
                            </div>

                            {gradeMutation.isSuccess && (
                                <div
                                    className="mt-4 px-4 py-3 rounded-lg"
                                    style={{ backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7' }}
                                >
                                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#065F46' }}>
                                        Grade saved successfully!
                                    </p>
                                </div>
                            )}

                            {gradeMutation.isError && (
                                <div
                                    className="mt-4 px-4 py-3 rounded-lg"
                                    style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}
                                >
                                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#991B1B' }}>
                                        Failed to save grade. Please try again.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
