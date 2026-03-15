import { useState, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Search, Filter, CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronRight, ArrowUpDown, BarChart3, Loader2, RotateCcw } from 'lucide-react';
import { TopNav } from './TopNav';
import { PageLayout } from './PageLayout';
import { Sidebar } from './Sidebar';
import { useParams, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GradingInterface, type GradingPayload } from './GradingInterface';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { useAssignments } from '@/hooks/queries';
import { submissionService } from '@/services/api';
import type { Submission as ApiSubmission, Assignment, RubricCriterion, TestCaseResult } from '@/types';

/** Local UI row — derived from API Submission + Assignment metadata */
interface QueueSubmission {
    id: string;
    studentName: string;
    studentId: string;
    studentEmail: string | null;
    assignmentName: string;
    assignmentId: string;
    submittedAt: string;
    status: 'pending' | 'graded' | 'in-review' | 'resubmitted';
    score: number | null;
    maxScore: number;
    aiFlag: boolean;
    lateSubmission: boolean;
    /** Raw API submission kept for the grading panel */
    _raw: ApiSubmission;
}

interface QueueSubmissionGroup {
    id: string;
    studentName: string;
    studentId: string;
    studentEmail: string | null;
    assignmentName: string;
    assignmentId: string;
    latest: QueueSubmission;
    attempts: QueueSubmission[];
}

/** Map an API submission + its parent assignment into a queue row */
function toQueueSubmission(sub: ApiSubmission, assignment: Assignment): QueueSubmission {
    const status: QueueSubmission['status'] =
        sub.status === 'graded' ? 'graded'
            : sub.status === 'returned' ? 'graded'
                : 'pending';

    return {
        id: sub.id,
        studentName: sub.studentName ?? `Student ${sub.studentId}`,
        studentId: sub.studentId,
        studentEmail: sub.studentEmail ?? null,
        assignmentName: assignment.name,
        assignmentId: assignment.id,
        submittedAt: sub.submittedAt,
        status,
        score: sub.grade?.totalScore ?? null,
        maxScore: sub.grade?.maxScore ?? assignment.maxPoints,
        aiFlag: false,
        lateSubmission: sub.isLate,
        _raw: sub,
    };
}

function lookupCourseCode(id: string) {
    try { const s = JSON.parse(localStorage.getItem('autograde_courses') || '[]'); const f = s.find((c: any) => c.id === id); if (f) return f.code; } catch { } return id;
}

export function GradingQueue() {
    const { courseId } = useParams() as { courseId: string };
    const router = useRouter();
    const courseCode = lookupCourseCode(courseId ?? '');

    /* ── Fetch assignments for the course ── */
    const {
        data: assignments = [],
        isLoading: assignmentsLoading,
    } = useAssignments(courseId);

    /* ── Fetch submissions for every assignment in parallel ── */
    const submissionQueries = useQueries({
        queries: assignments.map((a) => ({
            queryKey: ['submissions', a.id],
            queryFn: () => submissionService.getSubmissions(a.id),
            enabled: !!a.id,
        })),
    });

    const submissionsLoading = submissionQueries.some((q) => q.isLoading);

    /** Flatten all per-assignment submission lists into a single queue,
     *  preserving every attempt so faculty can regrade historical submissions. */
    const allSubmissions: QueueSubmission[] = useMemo(() => {
        const rows: QueueSubmission[] = [];
        assignments.forEach((assignment, idx) => {
            const queryResult = submissionQueries[idx];
            if (!queryResult?.data) return;
            for (const sub of queryResult.data) {
                rows.push(toQueueSubmission(sub, assignment));
            }
        });
        return rows;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignments, submissionQueries.map((q) => q.dataUpdatedAt).join(',')]);

    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [sortBy, setSortBy] = useState<'date' | 'name' | 'assignment'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
    const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    const groupedSubmissions: QueueSubmissionGroup[] = useMemo(() => {
        const grouped = new Map<string, QueueSubmission[]>();
        for (const sub of allSubmissions) {
            const key = `${sub.assignmentId}::${sub.studentId}`;
            const existing = grouped.get(key) ?? [];
            existing.push(sub);
            grouped.set(key, existing);
        }

        const rows: QueueSubmissionGroup[] = [];
        for (const [key, attemptsRaw] of grouped.entries()) {
            const attempts = [...attemptsRaw].sort(
                (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
            );
            const latest = attempts[0];
            rows.push({
                id: key,
                studentName: latest.studentName,
                studentId: latest.studentId,
                studentEmail: latest.studentEmail,
                assignmentName: latest.assignmentName,
                assignmentId: latest.assignmentId,
                latest,
                attempts,
            });
        }

        return rows;
    }, [allSubmissions]);

    const tabs = [
        { id: 'all', label: 'All', count: groupedSubmissions.length },
        { id: 'pending', label: 'Pending', count: groupedSubmissions.filter(s => s.latest.status === 'pending').length },
        { id: 'in-review', label: 'In Review', count: groupedSubmissions.filter(s => s.latest.status === 'in-review').length },
        { id: 'resubmitted', label: 'Resubmitted', count: groupedSubmissions.filter(s => s.latest.status === 'resubmitted').length },
        { id: 'graded', label: 'Graded', count: groupedSubmissions.filter(s => s.latest.status === 'graded').length },
    ];

    const uniqueAssignments = [...new Set(groupedSubmissions.map(s => s.assignmentName))];

    const filteredSubmissions = groupedSubmissions
        .filter(s => {
            if (activeTab !== 'all' && s.latest.status !== activeTab) return false;
            if (assignmentFilter !== 'all' && s.assignmentName !== assignmentFilter) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return s.studentName.toLowerCase().includes(q) ||
                    s.studentId.toLowerCase().includes(q) ||
                    s.assignmentName.toLowerCase().includes(q);
            }
            return true;
        })
        .sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'date') cmp = new Date(a.latest.submittedAt).getTime() - new Date(b.latest.submittedAt).getTime();
            else if (sortBy === 'name') cmp = a.studentName.localeCompare(b.studentName);
            else if (sortBy === 'assignment') cmp = a.assignmentName.localeCompare(b.assignmentName);
            return sortOrder === 'asc' ? cmp : -cmp;
        });

    const toggleGroupExpanded = (groupId: string) => {
        setExpandedGroups((prev) =>
            prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
        );
    };

    const getStatusBadge = (status: QueueSubmission['status']) => {
        const styles: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: 'var(--color-warning)', text: 'var(--color-surface)', label: 'Pending' },
            graded: { bg: 'var(--color-success)', text: 'var(--color-surface)', label: 'Graded' },
            'in-review': { bg: 'var(--color-info)', text: 'var(--color-surface)', label: 'In Review' },
            resubmitted: { bg: 'var(--color-primary)', text: 'var(--color-surface)', label: 'Resubmitted' },
        };
        const style = styles[status];
        return (
            <span
                className="px-2 py-1 rounded"
                style={{
                    backgroundColor: style.bg,
                    color: style.text,
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                }}
            >
                {style.label}
            </span>
        );
    };

    const toggleSubmissionSelect = (id: string) => {
        setSelectedSubmissions(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedSubmissions.length === filteredSubmissions.length) {
            setSelectedSubmissions([]);
        } else {
            setSelectedSubmissions(filteredSubmissions.map(s => s.id));
        }
    };

    const handleSort = (field: 'date' | 'name' | 'assignment') => {
        if (sortBy === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    /* ── Grading panel helpers ── */
    const gradingSubmission = gradingSubmissionId
        ? filteredSubmissions.find(s => s.id === gradingSubmissionId) ?? allSubmissions.find(s => s.id === gradingSubmissionId) ?? null
        : null;

    const gradingIndex = gradingSubmission
        ? filteredSubmissions.findIndex(s => s.id === gradingSubmission.id)
        : -1;

    const handleOpenGrading = (submissionId: string) => {
        router.push(`/courses/${courseId}/submissions/${submissionId}/grade`);
    };

    const handleGradingPrev = () => {
        if (gradingIndex > 0) {
            setGradingSubmissionId(filteredSubmissions[gradingIndex - 1].id);
        }
    };

    const handleGradingNext = () => {
        if (gradingIndex < filteredSubmissions.length - 1) {
            setGradingSubmissionId(filteredSubmissions[gradingIndex + 1].id);
        }
    };

    const handleSaveDraft = (_data: GradingPayload) => {
        // TODO: call gradeSubmission API with draft status
    };

    const handleSubmitGrade = (_data: GradingPayload) => {
        // Move to next or close
        if (gradingIndex < filteredSubmissions.length - 1) {
            setGradingSubmissionId(filteredSubmissions[gradingIndex + 1].id);
        } else {
            setGradingSubmissionId(null);
        }
    };

    /** Resolve the assignment's rubric for the grading panel */
    const gradingAssignment = gradingSubmission
        ? assignments.find(a => a.id === gradingSubmission.assignmentId)
        : undefined;

    const gradingRubric: RubricCriterion[] = gradingAssignment?.rubric ?? [];

    const isLoading = assignmentsLoading || submissionsLoading;

    return (
        <PageLayout>
            <TopNav breadcrumbs={[
                { label: 'Courses', href: '/courses' },
                { label: courseCode },
                { label: 'Grading' }
            ]} />

            <div className="flex h-[calc(100vh-64px)]">
                <Sidebar activeItem="grading" />

                <main className="flex-1 overflow-auto p-8">
                    {/* Page Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                                Grading
                            </h1>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                                Review and grade student submissions
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="border-[var(--color-border)] flex items-center gap-2"
                                style={{ color: 'var(--color-text-mid)' }}
                                onClick={() => router.push(`/courses/${courseId}/reports`)}
                            >
                                <BarChart3 className="w-4 h-4" />
                                Reports
                            </Button>
                            {selectedSubmissions.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <span style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                                        {selectedSubmissions.length} selected
                                    </span>
                                    <Button
                                        variant="outline"
                                        className="border-[var(--color-border)] text-[var(--color-text-mid)]"
                                        onClick={() => setSelectedSubmissions([])}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1 mb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="px-4 py-3 transition-colors relative flex items-center gap-2"
                                style={{
                                    color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                    fontSize: '14px',
                                    fontWeight: activeTab === tab.id ? 500 : 400
                                }}
                            >
                                {tab.label}
                                <span
                                    className="px-1.5 py-0.5 rounded-full"
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                                        color: activeTab === tab.id ? 'white' : 'var(--color-text-mid)',
                                    }}
                                >
                                    {tab.count}
                                </span>
                                {activeTab === tab.id && (
                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-0.5"
                                        style={{ backgroundColor: 'var(--color-primary)' }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Search & Filters */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                            <Input
                                placeholder="Search by student name, ID, or assignment..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-[var(--color-border)]"
                            />
                        </div>
                        <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                            <SelectTrigger className="w-64 border-[var(--color-border)]">
                                <Filter className="w-4 h-4 mr-2 text-[var(--color-text-light)]" />
                                <SelectValue placeholder="All Assignments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Assignments</SelectItem>
                                {uniqueAssignments.map(name => (
                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                            <span className="ml-3" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                                Loading submissions...
                            </span>
                        </div>
                    )}

                    {/* Submissions Table */}
                    {!isLoading && (
                        <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
                            <table className="w-full">
                                <thead style={{ backgroundColor: 'var(--color-primary-bg)', borderBottom: '1px solid var(--color-border)' }}>
                                    <tr>
                                        <th className="text-left px-4 py-4 w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                                                onChange={toggleSelectAll}
                                                className="rounded border-[var(--color-border)]"
                                                style={{ accentColor: 'var(--color-primary)' }}
                                            />
                                        </th>
                                        <th className="text-left px-4 py-4">
                                            <button onClick={() => handleSort('name')} className="flex items-center gap-1" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                Student
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="text-left px-4 py-4">
                                            <button onClick={() => handleSort('assignment')} className="flex items-center gap-1" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                Assignment
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="text-left px-4 py-4">
                                            <button onClick={() => handleSort('date')} className="flex items-center gap-1" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                Submitted
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                        </th>
                                        <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Score
                                        </th>
                                        <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Flags
                                        </th>
                                        <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Status
                                        </th>
                                        <th className="text-left px-4 py-4" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubmissions.map((submission) => (
                                        <>
                                        <tr
                                            key={submission.id}
                                            className="border-b hover:bg-[var(--color-primary-bg)]/50 transition-colors"
                                            style={{ borderColor: 'var(--color-border)' }}
                                        >
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubmissions.includes(submission.id)}
                                                    onChange={() => toggleSubmissionSelect(submission.id)}
                                                    className="rounded border-[var(--color-border)]"
                                                    style={{ accentColor: 'var(--color-primary)' }}
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                                        style={{ backgroundColor: 'var(--color-primary)', fontSize: '12px', fontWeight: 600 }}
                                                    >
                                                        {submission.studentName.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                            {submission.studentName}
                                                        </p>
                                                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                            {submission.studentEmail ?? submission.studentId}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                                                {submission.assignmentName}
                                            </td>
                                            <td className="px-4 py-4" style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                                                {submission.latest.submittedAt ? (
                                                    <>
                                                        {new Date(submission.latest.submittedAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                        <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                            {new Date(submission.latest.submittedAt).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <span style={{ color: 'var(--color-text-light)' }}>--</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                {submission.latest.score !== null ? (
                                                    <span style={{
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        color: submission.latest.score >= 90 ? 'var(--color-success)' :
                                                            submission.latest.score >= 80 ? 'var(--color-info)' :
                                                                submission.latest.score >= 70 ? 'var(--color-warning)' : 'var(--color-error)'
                                                    }}>
                                                        {submission.latest.score}/{submission.latest.maxScore}
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>--</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {submission.latest.aiFlag && (
                                                        <span
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
                                                            style={{ backgroundColor: 'var(--color-warning-bg, #FFF8E1)', fontSize: '11px', fontWeight: 600, color: 'var(--color-warning)' }}
                                                        >
                                                            <AlertTriangle className="w-3 h-3" />
                                                            AI
                                                        </span>
                                                    )}
                                                    {submission.latest.lateSubmission && (
                                                        <span
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
                                                            style={{ backgroundColor: 'var(--color-error-bg, #FFEBEE)', fontSize: '11px', fontWeight: 600, color: 'var(--color-error)' }}
                                                        >
                                                            <Clock className="w-3 h-3" />
                                                            Late
                                                        </span>
                                                    )}
                                                    {!submission.latest.aiFlag && !submission.latest.lateSubmission && (
                                                        <span style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>--</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                {getStatusBadge(submission.latest.status)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant={submission.latest.status === 'graded' ? 'outline' : 'default'}
                                                        onClick={() => handleOpenGrading(submission.latest.id)}
                                                        className={submission.latest.status === 'graded' ? 'border-[var(--color-border)]' : 'text-white'}
                                                        style={submission.latest.status !== 'graded' ? { backgroundColor: 'var(--color-primary)' } : undefined}
                                                    >
                                                        {submission.latest.status === 'graded' ? (
                                                            <>
                                                                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                                                Regrade
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                                                Grade
                                                            </>
                                                        )}
                                                    </Button>
                                                    {submission.attempts.length > 1 && (
                                                        <button
                                                            onClick={() => toggleGroupExpanded(submission.id)}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded border"
                                                            style={{ borderColor: 'var(--color-border)', fontSize: '12px', color: 'var(--color-text-mid)' }}
                                                        >
                                                            {expandedGroups.includes(submission.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                                            {submission.attempts.length} attempts
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedGroups.includes(submission.id) && submission.attempts.slice(1).map((attempt, idx) => (
                                            <tr
                                                key={`${submission.id}-attempt-${attempt.id}`}
                                                className="border-b"
                                                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-primary-bg)' }}
                                            >
                                                <td className="px-4 py-3">
                                                    <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>#{idx + 2}</span>
                                                </td>
                                                <td className="px-4 py-3" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                    Previous attempt
                                                </td>
                                                <td className="px-4 py-3" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                    {submission.assignmentName}
                                                </td>
                                                <td className="px-4 py-3" style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                    {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    }) : '--'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {attempt.score !== null ? (
                                                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                                                            {attempt.score}/{attempt.maxScore}
                                                        </span>
                                                    ) : (
                                                        <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>--</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                        {attempt.lateSubmission ? 'Late' : '--'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getStatusBadge(attempt.status)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Button
                                                        size="sm"
                                                        variant={attempt.status === 'graded' ? 'outline' : 'default'}
                                                        onClick={() => handleOpenGrading(attempt.id)}
                                                        className={attempt.status === 'graded' ? 'border-[var(--color-border)]' : 'text-white'}
                                                        style={attempt.status !== 'graded' ? { backgroundColor: 'var(--color-primary)' } : undefined}
                                                    >
                                                        {attempt.status === 'graded' ? 'View' : 'Grade'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </>
                                    ))}
                                </tbody>
                            </table>

                            {filteredSubmissions.length === 0 && (
                                <div className="text-center py-16">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-success)' }} />
                                    <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                                        {groupedSubmissions.length === 0 ? 'No submissions yet' : 'All caught up!'}
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                                        {groupedSubmissions.length === 0
                                            ? 'Submissions will appear here once students submit their work.'
                                            : 'No submissions match your current filters.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && (
                        <div className="flex items-center justify-between mt-4">
                            <p style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                                Showing {filteredSubmissions.length} of {groupedSubmissions.length} students
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="border-[var(--color-border)]" disabled>
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    className="text-white"
                                    style={{ backgroundColor: 'var(--color-primary)', minWidth: '32px' }}
                                >
                                    1
                                </Button>
                                <Button variant="outline" size="sm" className="border-[var(--color-border)]" disabled>
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Grading Interface Panel */}
            {gradingSubmission && (
                <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'var(--color-background, #f5f5f5)' }}>
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-6 py-3 border-b" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                        <button
                            onClick={() => setGradingSubmissionId(null)}
                            className="flex items-center gap-1 text-sm hover:underline"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            &larr; Back to Grading Queue
                        </button>
                        <span className="text-sm" style={{ color: 'var(--color-text-mid)' }}>
                            Grading: {gradingSubmission.assignmentName} &mdash; {gradingSubmission.studentName}
                        </span>
                    </div>
                    {/* GradingInterface */}
                    <div className="flex-1 overflow-auto p-6">
                        <GradingInterface
                            submission={{
                                id: gradingSubmission.id,
                                studentName: gradingSubmission.studentName,
                                studentId: gradingSubmission.studentId,
                                code: gradingSubmission._raw.code || '# No code available',
                                language: gradingSubmission._raw.language ?? 'python',
                                submittedAt: gradingSubmission.submittedAt,
                                isLate: gradingSubmission.lateSubmission,
                                testResults: gradingSubmission._raw.testResults,
                            }}
                            rubricCriteria={gradingRubric}
                            autoScore={gradingSubmission.score ?? undefined}
                            maxPoints={gradingSubmission.maxScore}
                            totalSubmissions={filteredSubmissions.length}
                            currentIndex={gradingIndex}
                            onPrevious={handleGradingPrev}
                            onNext={handleGradingNext}
                            onSaveDraft={handleSaveDraft}
                            onSubmitGrade={handleSubmitGrade}
                        />
                    </div>
                </div>
            )}
        </PageLayout>
    );
}
