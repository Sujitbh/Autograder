'use client';

import { useState } from 'react';
import { TALayout } from './TALayout';
import { useTACourseStudents, useTACoursePermissions } from '@/hooks/queries/useTADashboard';
import { Search, Loader2, Users, User, Mail } from 'lucide-react';

function getGradeColor(grade: number) {
    if (grade >= 90) return '#059669';
    if (grade >= 70) return '#D97706';
    return '#DC2626';
}

function getGradeBg(grade: number) {
    if (grade >= 90) return '#D1FAE5';
    if (grade >= 70) return '#FEF3C7';
    return '#FEE2E2';
}

interface TAStudentsPageProps {
    courseId: string;
    courseName?: string;
}

interface StudentRowStudent {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    submissions_count: number;
    total_assignments: number;
    average_grade: number | null;
}

function StudentRow({ student }: Readonly<{ student: StudentRowStudent }>) {
    const progressPct = student.total_assignments > 0
        ? Math.round((student.submissions_count / student.total_assignments) * 100)
        : 0;

    return (
        <tr
            className="transition-colors hover:bg-[var(--color-primary-bg)]"
            style={{ borderBottom: '1px solid var(--color-border)' }}
        >
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-primary-light)' }}
                    >
                        <User className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        {student.name}
                    </span>
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" style={{ color: 'var(--color-text-light)' }} />
                    <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                        {student.email}
                    </span>
                </div>
            </td>
            <td className="px-4 py-3">
                <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                    {student.submissions_count}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-20 rounded-full overflow-hidden"
                        style={{ height: '6px', backgroundColor: 'var(--color-border)' }}
                    >
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${progressPct}%`,
                                backgroundColor: progressPct === 100 ? '#059669' : 'var(--color-primary)',
                            }}
                        />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                        {student.submissions_count}/{student.total_assignments}
                    </span>
                </div>
            </td>
            <td className="px-4 py-3">
                {student.average_grade === null || student.average_grade === undefined ? (
                    <span style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>—</span>
                ) : (
                    <span
                        className="px-2 py-1 rounded-md"
                        style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: getGradeColor(student.average_grade),
                            backgroundColor: getGradeBg(student.average_grade),
                        }}
                    >
                        {student.average_grade.toFixed(1)}%
                    </span>
                )}
            </td>
            <td className="px-4 py-3">
                <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: student.is_active ? '#059669' : '#6B7280',
                        backgroundColor: student.is_active ? '#D1FAE5' : '#F3F4F6',
                    }}
                >
                    {student.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
        </tr>
    );
}

export default function TAStudentsPage({ courseId, courseName }: Readonly<TAStudentsPageProps>) {
    const [search, setSearch] = useState('');
    const courseIdNum = Number.parseInt(courseId);
    const { data: permissions } = useTACoursePermissions(courseIdNum);
    const { data: students, isLoading } = useTACourseStudents(courseIdNum, {
        search: search || undefined,
    });

    const breadcrumbs = [
        ...(courseName ? [{ label: courseName, href: `/ta/courses/${courseId}` }] : []),
        { label: 'Students' },
    ];

    return (
        <TALayout
            activeItem="students"
            courseId={courseId}
            permissions={permissions}
            breadcrumbs={breadcrumbs}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                        Students
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                        {students ? `${students.length} students enrolled` : 'Loading...'}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--color-text-light)' }}
                />
                <input
                    type="text"
                    placeholder="Search students..."
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

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            )}

            {!isLoading && students?.length === 0 && (
                <div
                    className="rounded-xl p-12 text-center"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                    <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
                    <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        No students found
                    </p>
                </div>
            )}

            {!isLoading && students && students.length > 0 && (
                <div
                    className="rounded-xl overflow-hidden"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                {['Student', 'Email', 'Submissions', 'Progress', 'Average', 'Status'].map((h) => (
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
                            {students.map((student) => (
                                <StudentRow key={student.id} student={student} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </TALayout>
    );
}
