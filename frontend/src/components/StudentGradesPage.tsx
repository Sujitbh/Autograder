'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCourses } from '@/hooks/queries/useCourses';
import { StudentLayout } from './StudentLayout';
import api from '@/services/api/client';
import {
    GradesSummaryCard,
    GradesControls,
    GradeRow,
    GradesEmptyState,
    statusOf,
    type GradesPayload,
    type GradeFilter,
    type GradeSort,
} from './grades';

interface StudentGradesPageProps {
    courseId: string;
}

function GradesSkeleton() {
    return (
        <div className="dash-root">
            <div
                className="h-[196px] w-full rounded-[16px]"
                style={{
                    background: 'var(--dash-surface-2)',
                    boxShadow: 'inset 0 0 0 1px var(--dash-ring-subtle)',
                }}
            >
                <div className="dash-skeleton h-full w-full rounded-[16px]" />
            </div>
            <div className="mt-5 h-[44px] w-full rounded-[10px]">
                <div className="dash-skeleton h-full w-full rounded-[10px]" />
            </div>
            <div className="mt-4 flex flex-col gap-3">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-[86px] w-full rounded-[14px]"
                        style={{
                            background: 'var(--dash-surface-2)',
                            boxShadow: 'inset 0 0 0 1px var(--dash-ring-subtle)',
                        }}
                    >
                        <div className="dash-skeleton h-full w-full rounded-[14px]" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function StudentGradesPage({ courseId }: StudentGradesPageProps) {
    const router = useRouter();
    const { data: courses } = useCourses();
    const course = courses?.find((c) => c.id === courseId);

    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<GradeFilter>('all');
    const [sortBy, setSortBy] = useState<GradeSort>('due_asc');

    const { data, isLoading, isError, refetch } = useQuery<GradesPayload>({
        queryKey: ['courseGrades', courseId],
        queryFn: async () => {
            const { data } = await api.get(`/courses/${courseId}/grades`);
            return data as GradesPayload;
        },
    });

    const assignments = data?.assignments ?? [];

    const counts = useMemo(() => {
        let graded = 0;
        let pending = 0;
        let notSubmitted = 0;
        let overdue = 0;
        for (const a of assignments) {
            const s = statusOf(a);
            if (s === 'Graded') graded++;
            else if (s === 'Pending Grade') pending++;
            else {
                notSubmitted++;
                if (a.is_overdue) overdue++;
            }
        }
        return {
            all: assignments.length,
            graded,
            pending,
            notSubmitted,
            overdue,
        };
    }, [assignments]);

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        const filtered = assignments.filter((a) => {
            const status = statusOf(a);
            const matchesQuery =
                !q || String(a.assignment_name ?? '').toLowerCase().includes(q);
            const matchesFilter =
                filter === 'all' ||
                (filter === 'graded' && status === 'Graded') ||
                (filter === 'pending' && status === 'Pending Grade') ||
                (filter === 'not_submitted' && status === 'Not Submitted');
            return matchesQuery && matchesFilter;
        });

        const statusOrder: Record<string, number> = {
            'Not Submitted': 0,
            'Pending Grade': 1,
            Graded: 2,
        };

        return [...filtered].sort((a, b) => {
            const scoreA = a.percentage ?? -1;
            const scoreB = b.percentage ?? -1;
            const nameA = String(a.assignment_name ?? '');
            const nameB = String(b.assignment_name ?? '');
            const statusA = statusOf(a);
            const statusB = statusOf(b);

            switch (sortBy) {
                case 'due_asc': {
                    // Overdue first, then nearest due (missing dates last).
                    const overdueA = a.is_overdue ? 0 : 1;
                    const overdueB = b.is_overdue ? 0 : 1;
                    if (overdueA !== overdueB) return overdueA - overdueB;
                    const tA = a.due_date
                        ? new Date(a.due_date).getTime()
                        : Number.POSITIVE_INFINITY;
                    const tB = b.due_date
                        ? new Date(b.due_date).getTime()
                        : Number.POSITIVE_INFINITY;
                    if (tA !== tB) return tA - tB;
                    return nameA.localeCompare(nameB);
                }
                case 'name_asc':
                    return nameA.localeCompare(nameB);
                case 'name_desc':
                    return nameB.localeCompare(nameA);
                case 'score_asc':
                    return scoreA - scoreB;
                case 'score_desc':
                    return scoreB - scoreA;
                case 'status':
                    return (statusOrder[statusA] ?? 9) - (statusOrder[statusB] ?? 9);
                default:
                    return 0;
            }
        });
    }, [assignments, filter, query, sortBy]);

    const openAssignment = (id: number) =>
        router.push(`/student/courses/${courseId}/assignments/${id}`);

    const breadcrumbs = [
        { label: course?.name ?? 'Course', href: `/student/courses/${courseId}` },
        { label: 'Grades' },
    ];

    return (
        <StudentLayout activeItem="grades" courseId={courseId} breadcrumbs={breadcrumbs}>
            <div className="dash-root w-full max-w-none pb-8">
                {/* Header */}
                <div className="dash-enter mb-6">
                    <h1
                        className="text-[30px] font-semibold leading-[34px] tracking-[-0.02em] md:text-[34px] md:leading-[38px]"
                        style={{ color: 'var(--dash-ink-1)' }}
                    >
                        My Grades
                    </h1>
                    <p
                        className="mt-1 text-[14px] leading-[20px]"
                        style={{ color: 'var(--dash-ink-3)' }}
                    >
                        Your performance in{' '}
                        <span style={{ color: 'var(--dash-ink-2)', fontWeight: 500 }}>
                            {course?.name ?? 'this course'}
                        </span>
                        .
                    </p>
                </div>

                {isLoading ? (
                    <GradesSkeleton />
                ) : isError ? (
                    <div
                        className="rounded-[16px] p-6 text-center"
                        style={{
                            background: 'var(--dash-danger-tint)',
                            boxShadow:
                                'inset 0 0 0 1px color-mix(in srgb, var(--dash-danger-ink) 22%, transparent)',
                            color: 'var(--dash-danger-ink)',
                        }}
                    >
                        <p className="text-[15px] font-semibold">
                            We couldn't load your grades.
                        </p>
                        <p className="mt-1 text-[13px]" style={{ color: 'var(--dash-ink-3)' }}>
                            Check your connection and try again.
                        </p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-4 inline-flex h-[34px] items-center rounded-full px-4 text-[12.5px] font-semibold"
                            style={{
                                background: 'var(--dash-surface-2)',
                                color: 'var(--dash-ink-1)',
                                boxShadow: 'inset 0 0 0 1px var(--dash-ring-strong)',
                            }}
                        >
                            Retry
                        </button>
                    </div>
                ) : data && data.total_count === 0 ? (
                    <GradesEmptyState
                        variant="no-assignments"
                        title="No assignments yet."
                        hint="When your instructor posts assignments, you'll see your grades and feedback here."
                    />
                ) : data ? (
                    <>
                        <div className="dash-enter" style={{ animationDelay: '40ms' }}>
                            <GradesSummaryCard
                                average={data.averageScore}
                                gradedCount={data.graded_count}
                                totalCount={data.total_count}
                                pendingCount={counts.pending}
                                notSubmittedCount={counts.notSubmitted}
                                overdueCount={counts.overdue}
                                assignments={assignments}
                                onOpenAssignment={openAssignment}
                            />
                        </div>

                        <div
                            className="dash-enter mt-6"
                            style={{ animationDelay: '80ms' }}
                        >
                            <GradesControls
                                query={query}
                                onQueryChange={setQuery}
                                filter={filter}
                                onFilterChange={setFilter}
                                sort={sortBy}
                                onSortChange={setSortBy}
                                counts={counts}
                                overdueCount={counts.overdue}
                            />
                        </div>

                        <div className="mt-5 flex flex-col gap-3">
                            {rows.length === 0 ? (
                                <div
                                    className="dash-enter"
                                    style={{ animationDelay: '120ms' }}
                                >
                                    <GradesEmptyState
                                        variant={query ? 'no-results' : 'filter-empty'}
                                        title={
                                            query
                                                ? `No assignments match "${query}".`
                                                : 'Nothing matches this filter.'
                                        }
                                        hint={
                                            query
                                                ? 'Try a shorter search term or clear it.'
                                                : 'Try a different filter, or switch back to All.'
                                        }
                                        action={{
                                            label: query ? 'Clear search' : 'Show all',
                                            onClick: () => {
                                                setQuery('');
                                                setFilter('all');
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                rows.map((a, i) => (
                                    <div
                                        key={a.assignment_id}
                                        className="dash-enter"
                                        style={{
                                            animationDelay: `${Math.min(120 + i * 28, 320)}ms`,
                                        }}
                                    >
                                        <GradeRow
                                            assignment={a}
                                            onOpen={openAssignment}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </StudentLayout>
    );
}
