'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TALayout } from './TALayout';
import {
    useTACourseAssignments,
    useTACoursePermissions,
} from '@/hooks/queries/useTADashboard';
import {
    FileText,
    Search,
    Filter,
    Loader2,
    Calendar,
    CheckCircle2,
    Clock,
} from 'lucide-react';

interface TAAssignmentsPageProps {
    courseId: string;
    courseName?: string;
}

export default function TAAssignmentsPage({ courseId, courseName }: Readonly<TAAssignmentsPageProps>) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const courseIdNum = Number.parseInt(courseId);
    const { data: permissions } = useTACoursePermissions(courseIdNum);
    const { data: assignments, isLoading } = useTACourseAssignments(courseIdNum, {
        search: search || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
    });

    const breadcrumbs = [
        ...(courseName ? [{ label: courseName, href: `/ta/courses/${courseId}` }] : []),
        { label: 'Assignments' },
    ];

    return (
        <TALayout
            activeItem="assignments"
            courseId={courseId}
            permissions={permissions}
            breadcrumbs={breadcrumbs}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                        Assignments
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                        View and manage course assignments
                    </p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: 'var(--color-text-light)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            fontSize: '14px',
                            color: 'var(--color-text-dark)',
                        }}
                    />
                </div>
                <div className="relative">
                    <Filter
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: 'var(--color-text-light)' }}
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-10 pr-8 py-2.5 rounded-lg appearance-none cursor-pointer"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            fontSize: '14px',
                            color: 'var(--color-text-dark)',
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            )}

            {!isLoading && assignments?.length === 0 && (
                <div
                    className="rounded-xl p-12 text-center"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                    <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
                    <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        No assignments found
                    </p>
                </div>
            )}

            {!isLoading && assignments && assignments.length > 0 && (
                <div className="space-y-4">
                    {assignments.map((assignment) => {
                        const progressPct = assignment.total_students > 0
                            ? Math.round((assignment.graded_count / assignment.total_students) * 100)
                            : 0;
                        const isPastDue = assignment.due_date && new Date(assignment.due_date) < new Date();

                        return (
                            <button
                                key={assignment.id}
                                type="button"
                                className="rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md text-left w-full"
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                }}
                                onClick={() => router.push(`/ta/courses/${courseId}/submissions?assignment=${assignment.id}`)}
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3
                                                    style={{
                                                        fontSize: '16px',
                                                        fontWeight: 600,
                                                        color: 'var(--color-text-dark)',
                                                    }}
                                                >
                                                    {assignment.title}
                                                </h3>
                                                <span
                                                    className="px-2 py-0.5 rounded-full"
                                                    style={{
                                                        fontSize: '10px',
                                                        fontWeight: 600,
                                                        color: assignment.is_active ? '#059669' : '#6B7280',
                                                        backgroundColor: assignment.is_active ? '#D1FAE5' : '#F3F4F6',
                                                    }}
                                                >
                                                    {assignment.is_active ? 'ACTIVE' : 'INACTIVE'}
                                                </span>
                                            </div>
                                            {assignment.description && (
                                                <p
                                                    className="line-clamp-1"
                                                    style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}
                                                >
                                                    {assignment.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Meta row */}
                                    <div className="flex items-center gap-6 mb-4">
                                        {assignment.due_date && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" style={{ color: isPastDue ? '#DC2626' : 'var(--color-text-light)' }} />
                                                <span style={{ fontSize: '12px', color: isPastDue ? '#DC2626' : 'var(--color-text-light)' }}>
                                                    {isPastDue ? 'Past due: ' : 'Due: '}
                                                    {new Date(assignment.due_date).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                {assignment.total_submissions} submissions
                                            </span>
                                        </div>
                                        {assignment.testcase_count > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                    {assignment.testcase_count} test cases
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Grading progress bar */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-mid)' }}>
                                                Grading Progress
                                            </span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                {assignment.graded_count} / {assignment.total_students} graded
                                            </span>
                                        </div>
                                        <div
                                            className="w-full rounded-full overflow-hidden"
                                            style={{ height: '6px', backgroundColor: 'var(--color-border)' }}
                                        >
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${progressPct}%`,
                                                    backgroundColor: progressPct === 100 ? '#059669' : 'var(--color-primary)',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Pending notice */}
                                    {assignment.pending_count > 0 && (
                                        <div
                                            className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg"
                                            style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}
                                        >
                                            <Clock className="w-3.5 h-3.5" style={{ color: '#D97706' }} />
                                            <span style={{ fontSize: '12px', fontWeight: 500, color: '#92400E' }}>
                                                {assignment.pending_count} submissions awaiting grading
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </TALayout>
    );
}
