'use client';

import { useRouter } from 'next/navigation';
import { TALayout } from './TALayout';
import { useTAOverview } from '@/hooks/queries/useTADashboard';
import {
    BookOpen,
    ClipboardList,
    CheckCircle2,
    Users,
    ChevronRight,
    Loader2,
} from 'lucide-react';

export default function TADashboard() {
    const router = useRouter();
    const { data: overview, isLoading, error } = useTAOverview();

    return (
        <TALayout activeItem="overview">
            {/* Page Header */}
            <div className="mb-8">
                <h1
                    style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: 'var(--color-text-dark)',
                        marginBottom: '4px',
                    }}
                >
                    TA Dashboard
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                    Manage your teaching assistant responsibilities
                </p>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            )}

            {error && (
                <div
                    className="rounded-xl p-6 text-center"
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <p style={{ color: 'var(--color-error)', fontSize: '14px' }}>
                        Failed to load TA dashboard. You may not be assigned as a TA to any courses.
                    </p>
                </div>
            )}

            {overview && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            {
                                label: 'Assigned Courses',
                                value: overview.assigned_courses,
                                icon: BookOpen,
                                color: '#6B0000',
                                bg: 'var(--color-primary-light)',
                            },
                            {
                                label: 'Pending Grading',
                                value: overview.pending_grading,
                                icon: ClipboardList,
                                color: '#D97706',
                                bg: '#FEF3C7',
                            },
                            {
                                label: 'Graded This Week',
                                value: overview.graded_this_week,
                                icon: CheckCircle2,
                                color: '#059669',
                                bg: '#D1FAE5',
                            },
                            {
                                label: 'Total Students',
                                value: overview.total_students,
                                icon: Users,
                                color: '#2563EB',
                                bg: '#DBEAFE',
                            },
                        ].map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.label}
                                    className="rounded-xl p-6"
                                    style={{
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: stat.bg }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: stat.color }} />
                                        </div>
                                    </div>
                                    <p
                                        style={{
                                            fontSize: '32px',
                                            fontWeight: 700,
                                            color: 'var(--color-text-dark)',
                                            lineHeight: 1,
                                            marginBottom: '4px',
                                        }}
                                    >
                                        {stat.value}
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Course Cards */}
                    <div className="mb-4">
                        <h2
                            style={{
                                fontSize: '18px',
                                fontWeight: 600,
                                color: 'var(--color-text-dark)',
                                marginBottom: '16px',
                            }}
                        >
                            Your TA Courses
                        </h2>
                    </div>

                    {overview.courses.length === 0 ? (
                        <div
                            className="rounded-xl p-12 text-center"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <BookOpen
                                className="w-12 h-12 mx-auto mb-4"
                                style={{ color: 'var(--color-text-light)' }}
                            />
                            <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-dark)', marginBottom: '4px' }}>
                                No TA assignments yet
                            </p>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                                You will see courses here once a faculty member assigns you as a TA.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {overview.courses.map((course) => (
                                <button
                                    key={course.id}
                                    onClick={() => router.push(`/ta/courses/${course.id}`)}
                                    className="rounded-xl overflow-hidden text-left transition-all hover:shadow-lg group"
                                    style={{
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    {/* Maroon top bar */}
                                    <div style={{ height: '6px', backgroundColor: 'var(--color-primary)' }} />

                                    <div className="p-6">
                                        {/* Course code badge */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span
                                                className="px-2.5 py-1 rounded-md"
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    color: 'var(--color-primary)',
                                                    backgroundColor: 'var(--color-primary-light)',
                                                    letterSpacing: '0.3px',
                                                }}
                                            >
                                                {course.code}
                                            </span>
                                            {course.is_active && (
                                                <span
                                                    className="px-2 py-0.5 rounded-full"
                                                    style={{
                                                        fontSize: '10px',
                                                        fontWeight: 600,
                                                        color: '#059669',
                                                        backgroundColor: '#D1FAE5',
                                                    }}
                                                >
                                                    ACTIVE
                                                </span>
                                            )}
                                        </div>

                                        {/* Course name */}
                                        <h3
                                            className="group-hover:text-[var(--color-primary)] transition-colors"
                                            style={{
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                color: 'var(--color-text-dark)',
                                                marginBottom: '4px',
                                            }}
                                        >
                                            {course.name}
                                        </h3>

                                        {/* Instructor */}
                                        {course.instructor_name && (
                                            <p
                                                style={{
                                                    fontSize: '13px',
                                                    color: 'var(--color-text-mid)',
                                                    marginBottom: '12px',
                                                }}
                                            >
                                                Instructor: {course.instructor_name}
                                            </p>
                                        )}

                                        {/* Stats row */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                {course.student_count} students
                                            </span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                {course.assignment_count} assignments
                                            </span>
                                        </div>

                                        {/* Pending grading notice */}
                                        {course.pending_grading > 0 && (
                                            <div
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                                style={{
                                                    backgroundColor: '#FEF3C7',
                                                    border: '1px solid #FDE68A',
                                                }}
                                            >
                                                <ClipboardList className="w-4 h-4" style={{ color: '#D97706' }} />
                                                <span style={{ fontSize: '12px', fontWeight: 500, color: '#92400E' }}>
                                                    {course.pending_grading} submissions need grading
                                                </span>
                                            </div>
                                        )}

                                        {/* Open button */}
                                        <div
                                            className="flex items-center justify-end mt-4 group-hover:gap-2 transition-all"
                                            style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600 }}
                                        >
                                            Open Course
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </TALayout>
    );
}
