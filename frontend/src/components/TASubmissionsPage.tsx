'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TALayout } from './TALayout';
import {
    useTACourseSubmissions,
    useTACoursePermissions,
    useTACourseAssignments,
} from '@/hooks/queries/useTADashboard';
import {
    Search,
    Filter,
    Loader2,
    Inbox,
    CheckCircle2,
    Clock,
    AlertCircle,
    PenLine,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface TASubmissionsPageProps {
    courseId: string;
    courseName?: string;
}

type TabId = 'all' | 'pending' | 'graded' | 'in_review';

export default function TASubmissionsPage({ courseId, courseName }: Readonly<TASubmissionsPageProps>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialAssignment = searchParams.get('assignment');

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<TabId>('all');
    const [assignmentFilter, setAssignmentFilter] = useState<string>(initialAssignment || 'all');
    const [page, setPage] = useState(0);
    const limit = 20;

    const courseIdNum = Number.parseInt(courseId);
    const { data: permissions } = useTACoursePermissions(courseIdNum);
    const { data: assignments } = useTACourseAssignments(courseIdNum);
    const { data, isLoading } = useTACourseSubmissions(courseIdNum, {
        search: search || undefined,
        status: activeTab === 'all' ? undefined : activeTab,
        assignment_id: assignmentFilter === 'all' ? undefined : Number.parseInt(assignmentFilter),
        skip: page * limit,
        limit,
    });

    const submissions = data?.submissions || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const tabs: { id: TabId; label: string; icon: typeof Inbox }[] = [
        { id: 'all', label: 'All', icon: Inbox },
        { id: 'pending', label: 'Pending', icon: Clock },
        { id: 'in_review', label: 'In Review', icon: AlertCircle },
        { id: 'graded', label: 'Graded', icon: CheckCircle2 },
    ];

    const getStatusBadge = (status: string) => {
        const map: Record<string, { color: string; bg: string; label: string }> = {
            pending: { color: '#D97706', bg: '#FEF3C7', label: 'Pending' },
            submitted: { color: '#D97706', bg: '#FEF3C7', label: 'Submitted' },
            graded: { color: '#059669', bg: '#D1FAE5', label: 'Graded' },
            in_review: { color: '#2563EB', bg: '#DBEAFE', label: 'In Review' },
            failed: { color: '#DC2626', bg: '#FEE2E2', label: 'Failed' },
        };
        const s = map[status] || { color: '#6B7280', bg: '#F3F4F6', label: status };
        return (
            <span
                className="px-2 py-0.5 rounded-full"
                style={{ fontSize: '11px', fontWeight: 600, color: s.color, backgroundColor: s.bg }}
            >
                {s.label}
            </span>
        );
    };

    const breadcrumbs = [
        ...(courseName ? [{ label: courseName, href: `/ta/courses/${courseId}` }] : []),
        { label: 'Submissions' },
    ];

    return (
        <TALayout
            activeItem="submissions"
            courseId={courseId}
            permissions={permissions}
            breadcrumbs={breadcrumbs}
        >
            {/* Header */}
            <div className="mb-6">
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                    Submissions
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                    Review and grade student submissions
                </p>
            </div>

            {/* Tabs */}
            <div
                className="flex gap-1 mb-6 p-1 rounded-lg w-fit"
                style={{ backgroundColor: 'var(--color-border)' }}
            >
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setPage(0); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-md transition-all"
                            style={{
                                backgroundColor: isActive ? 'var(--color-surface)' : 'transparent',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                fontSize: '13px',
                                fontWeight: isActive ? 600 : 400,
                                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: 'var(--color-text-light)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search by student name or email..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            fontSize: '14px',
                            color: 'var(--color-text-dark)',
                        }}
                    />
                </div>
                {assignments && assignments.length > 0 && (
                    <div className="relative">
                        <Filter
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--color-text-light)' }}
                        />
                        <select
                            value={assignmentFilter}
                            onChange={(e) => { setAssignmentFilter(e.target.value); setPage(0); }}
                            className="pl-10 pr-8 py-2.5 rounded-lg appearance-none cursor-pointer"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                fontSize: '14px',
                                color: 'var(--color-text-dark)',
                                minWidth: '200px',
                            }}
                        >
                            <option value="all">All Assignments</option>
                            {assignments.map((a) => (
                                <option key={a.id} value={a.id}>{a.title}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Table */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            )}

            {!isLoading && submissions.length === 0 && (
                <div
                    className="rounded-xl p-12 text-center"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                    <Inbox className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
                    <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        No submissions found
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
                        {activeTab === 'all' ? 'Student submissions will appear here.' : 'Try changing the filter to see more submissions.'}
                    </p>
                </div>
            )}

            {!isLoading && submissions.length > 0 && (
                <>
                    <div
                        className="rounded-xl overflow-hidden"
                        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                    >
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    {['Student', 'Assignment', 'Status', 'Score', 'Tests', 'Submitted', ''].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-4 py-3"
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                color: 'var(--color-text-mid)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        className="cursor-pointer transition-colors hover:bg-[var(--color-primary-bg)]"
                                        style={{ borderBottom: '1px solid var(--color-border)' }}
                                        onClick={() => router.push(`/ta/courses/${courseId}/submissions/${sub.id}/grade`)}
                                    >
                                        <td className="px-4 py-3">
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    {sub.student_name}
                                                </p>
                                                {sub.student_email && (
                                                    <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                        {sub.student_email}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                                                {sub.assignment_title}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(sub.status)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                {sub.score === null || sub.score === undefined ? '—' : `${sub.score}/${sub.max_score || '?'}`}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                {sub.tests_passed}/{sub.tests_total}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                                                {sub.created_at
                                                    ? new Date(sub.created_at).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                                                    })
                                                    : '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-primary-light)]"
                                                style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: 500 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/ta/courses/${courseId}/submissions/${sub.id}/grade`);
                                                }}
                                            >
                                                <PenLine className="w-3.5 h-3.5" />
                                                Grade
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                Showing {page * limit + 1}-{Math.min((page + 1) * limit, total)} of {total}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="p-2 rounded-lg transition-colors hover:bg-[var(--color-primary-bg)] disabled:opacity-40"
                                    style={{ color: 'var(--color-text-mid)' }}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span style={{ fontSize: '13px', color: 'var(--color-text-dark)', fontWeight: 500 }}>
                                    Page {page + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="p-2 rounded-lg transition-colors hover:bg-[var(--color-primary-bg)] disabled:opacity-40"
                                    style={{ color: 'var(--color-text-mid)' }}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </TALayout>
    );
}
