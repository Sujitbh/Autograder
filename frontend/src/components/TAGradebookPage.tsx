'use client';

import { TALayout } from './TALayout';
import { useTAGradebook, useTACoursePermissions } from '@/hooks/queries/useTADashboard';
import { Loader2, BarChart3, Download } from 'lucide-react';

interface TAGradebookPageProps {
    courseId: string;
    courseName?: string;
}

export default function TAGradebookPage({ courseId, courseName }: Readonly<TAGradebookPageProps>) {
    const courseIdNum = Number.parseInt(courseId);
    const { data: permissions } = useTACoursePermissions(courseIdNum);
    const { data: gradebook, isLoading } = useTAGradebook(courseIdNum);

    const breadcrumbs = [
        ...(courseName ? [{ label: courseName, href: `/ta/courses/${courseId}` }] : []),
        { label: 'Gradebook' },
    ];

    const getGradeColor = (score: number, maxScore: number) => {
        const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
        if (pct >= 90) return '#059669';
        if (pct >= 70) return '#D97706';
        return '#DC2626';
    };

    const getGradeBg = (score: number, maxScore: number) => {
        const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
        if (pct >= 90) return '#D1FAE5';
        if (pct >= 70) return '#FEF3C7';
        return '#FEE2E2';
    };

    return (
        <TALayout
            activeItem="gradebook"
            courseId={courseId}
            permissions={permissions}
            breadcrumbs={breadcrumbs}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                        Gradebook
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                        {gradebook?.course?.name || 'Course'} — grade overview for all students
                    </p>
                </div>
                {permissions?.can_export_grades && (
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors hover:opacity-90"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 500,
                        }}
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                )}
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            )}

            {!isLoading && gradebook?.students.length === 0 && (
                <div
                    className="rounded-xl p-12 text-center"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                    <BarChart3 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
                    <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        No grade data available
                    </p>
                </div>
            )}

            {!isLoading && gradebook && gradebook.students.length > 0 && (
                <div
                    className="rounded-xl overflow-hidden"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th
                                        className="text-left px-4 py-3 sticky left-0"
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: 'var(--color-text-mid)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            backgroundColor: 'var(--color-surface)',
                                            minWidth: '200px',
                                        }}
                                    >
                                        Student
                                    </th>
                                    {gradebook.assignments.map((a) => (
                                        <th
                                            key={a.id}
                                            className="text-center px-3 py-3"
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: 'var(--color-text-mid)',
                                                minWidth: '100px',
                                                maxWidth: '120px',
                                            }}
                                        >
                                            <div className="truncate" title={a.title}>{a.title}</div>
                                            <div style={{ fontSize: '10px', color: 'var(--color-text-light)', fontWeight: 400 }}>
                                                {a.max_points} pts
                                            </div>
                                        </th>
                                    ))}
                                    <th
                                        className="text-center px-4 py-3"
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: 'var(--color-text-mid)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            minWidth: '100px',
                                        }}
                                    >
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {gradebook.students.map((student) => {
                                    const totalPct = student.total_possible > 0
                                        ? Math.round((student.total_earned / student.total_possible) * 100)
                                        : 0;

                                    return (
                                        <tr
                                            key={student.id}
                                            className="transition-colors hover:bg-[var(--color-primary-bg)]"
                                            style={{ borderBottom: '1px solid var(--color-border)' }}
                                        >
                                            <td
                                                className="px-4 py-3 sticky left-0"
                                                style={{ backgroundColor: 'var(--color-surface)' }}
                                            >
                                                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                    {student.name}
                                                </p>
                                                <p style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                    {student.email}
                                                </p>
                                            </td>
                                            {gradebook.assignments.map((a) => {
                                                const grade = student.grades[a.id.toString()];
                                                return (
                                                    <td key={a.id} className="text-center px-3 py-3">
                                                        {grade ? (
                                                            <span
                                                                className="px-2 py-1 rounded-md"
                                                                style={{
                                                                    fontSize: '13px',
                                                                    fontWeight: 600,
                                                                    color: getGradeColor(grade.score, grade.max_score),
                                                                    backgroundColor: getGradeBg(grade.score, grade.max_score),
                                                                }}
                                                            >
                                                                {grade.score}/{grade.max_score}
                                                            </span>
                                                        ) : (
                                                            <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>—</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="text-center px-4 py-3">
                                                <div>
                                                    <span
                                                        style={{
                                                            fontSize: '14px',
                                                            fontWeight: 700,
                                                            color: getGradeColor(student.total_earned, student.total_possible),
                                                        }}
                                                    >
                                                        {totalPct}%
                                                    </span>
                                                    <p style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                                                        {student.total_earned}/{student.total_possible}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </TALayout>
    );
}
