'use client';

/* ═══════════════════════════════════════════════════════════════════
   GradingInterface — Split-view grading panel for faculty
   Left: code viewer + test results | Right: rubric + feedback
   ═══════════════════════════════════════════════════════════════════ */

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Save,
    Send,
    ChevronDown,
    ChevronUp,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import type { RubricCriterion, TestCaseResult, RubricScore } from '@/types';

// ── Types ───────────────────────────────────────────────────────────

interface SubmissionView {
    id: string;
    studentName: string;
    studentId: string;
    code: string;
    language: 'python' | 'java';
    submittedAt: string;
    isLate: boolean;
    testResults?: TestCaseResult[];
    groupMembers?: string[];
}

interface GradingInterfaceProps {
    /** The submission currently being graded. */
    submission: SubmissionView;
    /** The rubric criteria for this assignment. */
    rubricCriteria: RubricCriterion[];
    /** Auto-score derived from test results (0-100%). */
    autoScore?: number;
    /** Max points for the assignment. */
    maxPoints: number;
    /** Navigation: total # of submissions. */
    totalSubmissions: number;
    /** Current index (0-based). */
    currentIndex: number;
    /** Callbacks. */
    onPrevious: () => void;
    onNext: () => void;
    onSaveDraft: (data: GradingPayload) => void;
    onSubmitGrade: (data: GradingPayload) => void;
    /** Existing scores to pre-fill (when editing a draft). */
    existingScores?: RubricScore[];
    existingFeedback?: string;
}

export interface GradingPayload {
    submissionId: string;
    rubricScores: RubricScore[];
    totalScore: number;
    feedback: string;
    applyToGroup: boolean;
}

// ── Component ───────────────────────────────────────────────────────

export function GradingInterface({
    submission,
    rubricCriteria,
    autoScore,
    maxPoints,
    totalSubmissions,
    currentIndex,
    onPrevious,
    onNext,
    onSaveDraft,
    onSubmitGrade,
    existingScores,
    existingFeedback,
}: GradingInterfaceProps) {
    // State
    const [scores, setScores] = useState<Record<string, number>>(() => {
        const initial: Record<string, number> = {};
        rubricCriteria.forEach((c) => {
            const existing = existingScores?.find((s) => s.criterionId === c.id);
            initial[c.id] = existing?.earnedPoints ?? (c.gradingMethod === 'auto' && autoScore != null
                ? Math.round((autoScore / 100) * c.maxPoints)
                : 0);
        });
        return initial;
    });

    const [comments, setComments] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        existingScores?.forEach((s) => {
            if (s.comment) initial[s.criterionId] = s.comment;
        });
        return initial;
    });

    const [feedback, setFeedback] = useState(existingFeedback ?? '');
    const [applyToGroup, setApplyToGroup] = useState(false);
    const [expandedTests, setExpandedTests] = useState(true);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Reset when submission changes
    useEffect(() => {
        const initial: Record<string, number> = {};
        rubricCriteria.forEach((c) => {
            const existing = existingScores?.find((s) => s.criterionId === c.id);
            initial[c.id] = existing?.earnedPoints ?? (c.gradingMethod === 'auto' && autoScore != null
                ? Math.round((autoScore / 100) * c.maxPoints)
                : 0);
        });
        setScores(initial);
        setFeedback(existingFeedback ?? '');
        setComments({});
        existingScores?.forEach((s) => {
            if (s.comment) setComments((prev) => ({ ...prev, [s.criterionId]: s.comment! }));
        });
    }, [submission.id]);

    // Computed
    const totalScore = useMemo(
        () => Object.values(scores).reduce((sum, v) => sum + v, 0),
        [scores]
    );

    const totalMaxPoints = useMemo(
        () => rubricCriteria.reduce((sum, c) => sum + c.maxPoints, 0),
        [rubricCriteria]
    );

    const percentage = totalMaxPoints > 0 ? Math.round((totalScore / totalMaxPoints) * 100) : 0;

    const passedTests = submission.testResults?.filter((t) => t.passed).length ?? 0;
    const totalTests = submission.testResults?.length ?? 0;

    // Build payload
    const buildPayload = useCallback((): GradingPayload => ({
        submissionId: submission.id,
        rubricScores: rubricCriteria.map((c) => ({
            criterionId: c.id,
            earnedPoints: scores[c.id] ?? 0,
            comment: comments[c.id] || undefined,
        })),
        totalScore,
        feedback,
        applyToGroup,
    }), [submission.id, rubricCriteria, scores, comments, totalScore, feedback, applyToGroup]);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                onSaveDraft(buildPayload());
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                setShowConfirmDialog(true);
            }
            if (e.key === 'ArrowLeft' && e.altKey) onPrevious();
            if (e.key === 'ArrowRight' && e.altKey) onNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [buildPayload, onSaveDraft, onPrevious, onNext]);

    return (
        <div className="flex h-full flex-col">
            {/* ── Header / Navigation ── */}
            <div className="flex items-center justify-between border-b bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onPrevious} disabled={currentIndex === 0} aria-label="Previous student">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {submission.studentName}
                        </p>
                        <p className="text-xs text-gray-500">
                            {currentIndex + 1} of {totalSubmissions}
                            {submission.isLate && (
                                <span className="ml-2 text-orange-600">Late Submission</span>
                            )}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onNext} disabled={currentIndex === totalSubmissions - 1} aria-label="Next student">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Ctrl+S save draft</span>
                    <span>•</span>
                    <span>Ctrl+Enter submit</span>
                </div>
            </div>

            {/* ── Body: Split view ── */}
            <div className="flex flex-1 overflow-hidden">
                {/* LEFT PANEL: Code + Tests (60%) */}
                <div className="flex w-3/5 flex-col border-r dark:border-gray-700">
                    {/* Code viewer */}
                    <div className="flex-1 overflow-auto bg-gray-950 p-4">
                        <pre className="text-sm leading-relaxed text-gray-200">
                            <code>{submission.code}</code>
                        </pre>
                    </div>

                    {/* Test results accordion */}
                    <div className="border-t dark:border-gray-700">
                        <button
                            type="button"
                            className="flex w-full items-center justify-between bg-gray-50 px-4 py-2.5 text-sm font-medium dark:bg-gray-800"
                            onClick={() => setExpandedTests((v) => !v)}
                        >
                            <span className="flex items-center gap-2">
                                Test Results
                                {totalTests > 0 && (
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${passedTests === totalTests
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                            }`}
                                    >
                                        {passedTests}/{totalTests} passed
                                    </span>
                                )}
                            </span>
                            {expandedTests ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>

                        {expandedTests && (
                            <div className="max-h-60 overflow-y-auto">
                                {(!submission.testResults || submission.testResults.length === 0) && (
                                    <p className="p-4 text-sm text-gray-400">No test results available.</p>
                                )}
                                {submission.testResults?.map((tr, idx) => (
                                    <TestResultRow key={idx} result={tr} index={idx} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: Score + Rubric + Feedback (40%) */}
                <div className="flex w-2/5 flex-col overflow-y-auto bg-white dark:bg-gray-900">
                    {/* Auto score card */}
                    {autoScore != null && (
                        <div className="border-b bg-blue-50 px-5 py-4 dark:border-gray-700 dark:bg-blue-900/20">
                            <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                                Auto Score (Test Pass Rate)
                            </p>
                            <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-200">
                                {autoScore}%
                            </p>
                        </div>
                    )}

                    {/* Rubric scores */}
                    <div className="flex-1 space-y-4 p-5">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Rubric Grading
                        </h4>

                        {rubricCriteria.map((criterion) => (
                            <div key={criterion.id} className="rounded-lg border p-3 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {criterion.name}
                                        </p>
                                        {criterion.description && (
                                            <p className="text-xs text-gray-400">{criterion.description}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {criterion.gradingMethod === 'auto'
                                            ? 'Auto'
                                            : criterion.gradingMethod === 'hybrid'
                                                ? 'Hybrid'
                                                : 'Manual'}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min={0}
                                        max={criterion.maxPoints}
                                        value={scores[criterion.id] ?? 0}
                                        onChange={(e) =>
                                            setScores((prev) => ({
                                                ...prev,
                                                [criterion.id]: Math.min(
                                                    Number(e.target.value) || 0,
                                                    criterion.maxPoints
                                                ),
                                            }))
                                        }
                                        className="w-20 text-center text-sm"
                                        aria-label={`Score for ${criterion.name}`}
                                    />
                                    <span className="text-sm text-gray-500">
                                        / {criterion.maxPoints}
                                    </span>
                                </div>

                                <Input
                                    placeholder="Optional comment..."
                                    value={comments[criterion.id] ?? ''}
                                    onChange={(e) =>
                                        setComments((prev) => ({
                                            ...prev,
                                            [criterion.id]: e.target.value,
                                        }))
                                    }
                                    className="mt-2 text-xs"
                                />
                            </div>
                        ))}

                        {/* Total */}
                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Total
                            </span>
                            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {totalScore} / {totalMaxPoints}{' '}
                                <span className="text-sm font-normal text-gray-500">
                                    ({percentage}%)
                                </span>
                            </span>
                        </div>

                        {/* Feedback */}
                        <div>
                            <Label className="flex items-center justify-between">
                                <span>Overall Feedback</span>
                                <span className="text-xs text-gray-400">{feedback.length}/500</span>
                            </Label>
                            <Textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
                                rows={4}
                                placeholder="Provide overall feedback to the student..."
                                className="mt-1"
                            />
                        </div>

                        {/* Group assignment controls */}
                        {submission.groupMembers && submission.groupMembers.length > 1 && (
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                        Group Assignment ({submission.groupMembers.length} members)
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <Checkbox
                                        id="applyToGroup"
                                        checked={applyToGroup}
                                        onCheckedChange={(v) => setApplyToGroup(v === true)}
                                    />
                                    <Label htmlFor="applyToGroup" className="mb-0 cursor-pointer text-xs text-blue-700 dark:text-blue-300">
                                        Apply this grade to all group members
                                    </Label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer buttons */}
                    <div className="flex items-center justify-end gap-2 border-t px-5 py-3 dark:border-gray-700">
                        <Button
                            variant="outline"
                            onClick={() => onSaveDraft(buildPayload())}
                        >
                            <Save className="mr-1 h-4 w-4" /> Save Draft
                        </Button>
                        <Button
                            className="bg-[#6B0000] text-white hover:bg-[#8B1A1A]"
                            onClick={() => setShowConfirmDialog(true)}
                        >
                            <Send className="mr-1 h-4 w-4" /> Submit Grade
                        </Button>
                    </div>
                </div>
            </div>

            {/* Submit confirmation dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Grade</DialogTitle>
                        <DialogDescription>
                            You are about to submit a grade of{' '}
                            <strong>
                                {totalScore}/{totalMaxPoints} ({percentage}%)
                            </strong>{' '}
                            for <strong>{submission.studentName}</strong>.
                            {applyToGroup && submission.groupMembers && (
                                <span className="block mt-1">
                                    This grade will also be applied to {submission.groupMembers.length - 1} other
                                    group member(s).
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#6B0000] text-white hover:bg-[#8B1A1A]"
                            onClick={() => {
                                onSubmitGrade(buildPayload());
                                setShowConfirmDialog(false);
                            }}
                        >
                            Confirm & Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ── Sub-component: Test result row ──────────────────────────────────

function TestResultRow({
    result,
    index,
}: {
    result: TestCaseResult;
    index: number;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="border-b last:border-b-0 dark:border-gray-700">
            <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setExpanded((v) => !v)}
            >
                {result.passed ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                ) : (
                    <XCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                )}
                <span className="flex-1 text-gray-700 dark:text-gray-300">
                    {result.testCase.name || `Test ${index + 1}`}
                </span>
                <span className="text-xs text-gray-400">{result.executionTime}ms</span>
                {expanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
                ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                )}
            </button>

            {expanded && (
                <div className="grid gap-2 bg-gray-50 px-4 py-3 text-xs dark:bg-gray-800 md:grid-cols-2">
                    <div>
                        <span className="font-medium text-gray-500">Input</span>
                        <pre className="mt-0.5 whitespace-pre-wrap rounded bg-white p-2 font-mono dark:bg-gray-900">
                            {result.testCase.input || '(none)'}
                        </pre>
                    </div>
                    <div>
                        <span className="font-medium text-gray-500">Expected</span>
                        <pre className="mt-0.5 whitespace-pre-wrap rounded bg-white p-2 font-mono dark:bg-gray-900">
                            {result.expectedOutput}
                        </pre>
                    </div>
                    <div className="md:col-span-2">
                        <span className="font-medium text-gray-500">Actual</span>
                        <pre
                            className={`mt-0.5 whitespace-pre-wrap rounded p-2 font-mono ${result.passed
                                    ? 'bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                    : 'bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                }`}
                        >
                            {result.actualOutput || '(empty)'}
                        </pre>
                    </div>
                    {result.error && (
                        <div className="md:col-span-2 flex items-start gap-1 text-red-600">
                            <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                            {result.error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
