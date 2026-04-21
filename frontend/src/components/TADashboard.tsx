'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TALayout } from './TALayout';
import { useTAOverview } from '@/hooks/queries/useTADashboard';
import { Input } from './ui/input';
import { KpiCard } from './dashboard/KpiCard';
import {
    Search,
    BookOpen,
    ChevronUp,
    ChevronDown,
    ChevronRight,
    Loader2,
    FilterX,
    ClipboardList,
} from 'lucide-react';

type SortField = 'code' | 'name' | 'instructor' | 'students' | 'assignments' | 'pending' | 'status';
type SortOrder = 'asc' | 'desc';

function getStatusBadge(isActive: boolean) {
    const cfg = isActive
        ? { bg: 'var(--color-success-bg)', text: 'var(--color-success)', label: 'Active' }
        : { bg: 'var(--color-surface-elevated)', text: 'var(--color-text-mid)', label: 'Inactive' };
    return (
        <span
            style={{
                display: 'inline-block',
                backgroundColor: cfg.bg,
                color: cfg.text,
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase' as const,
                padding: '4px 10px',
                borderRadius: '12px',
                lineHeight: '14px',
                letterSpacing: '0.5px',
            }}
        >
            {cfg.label}
        </span>
    );
}

function getPendingBadge(count: number) {
    if (count === 0) {
        return (
            <span
                style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--color-text-light)',
                    fontStyle: 'italic',
                }}
            >
                All clear
            </span>
        );
    }
    return (
        <span
            className="inline-flex items-center"
            style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-warning)',
                backgroundColor: 'var(--color-warning-bg, rgba(217,119,6,0.12))',
                padding: '3px 10px',
                borderRadius: '999px',
                letterSpacing: '0.2px',
            }}
        >
            {count} to review
        </span>
    );
}

export default function TADashboard() {
    const router = useRouter();
    const { data: overview, isLoading, error } = useTAOverview();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const courses = overview?.courses ?? [];

    // Tab counts
    const tabCounts = useMemo(() => {
        return {
            all: courses.length,
            active: courses.filter((c) => c.is_active).length,
            inactive: courses.filter((c) => !c.is_active).length,
        };
    }, [courses]);

    const tabs = [
        { id: 'all', label: 'All', count: tabCounts.all },
        { id: 'active', label: 'Active', count: tabCounts.active },
        { id: 'inactive', label: 'Inactive', count: tabCounts.inactive },
    ];

    // Filter
    const filtered = useMemo(() => {
        return courses.filter((c) => {
            if (activeTab === 'active' && !c.is_active) return false;
            if (activeTab === 'inactive' && c.is_active) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return (
                    c.name.toLowerCase().includes(q) ||
                    (c.code ?? '').toLowerCase().includes(q) ||
                    (c.instructor_name ?? '').toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [courses, activeTab, searchQuery]);

    // Sort
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let cmp = 0;
            switch (sortField) {
                case 'code': cmp = (a.code ?? '').localeCompare(b.code ?? ''); break;
                case 'name': cmp = a.name.localeCompare(b.name); break;
                case 'instructor': cmp = (a.instructor_name ?? '').localeCompare(b.instructor_name ?? ''); break;
                case 'students': cmp = a.student_count - b.student_count; break;
                case 'assignments': cmp = a.assignment_count - b.assignment_count; break;
                case 'pending': cmp = a.pending_grading - b.pending_grading; break;
                case 'status': cmp = (a.is_active ? 0 : 1) - (b.is_active ? 0 : 1); break;
            }
            return sortOrder === 'asc' ? cmp : -cmp;
        });
    }, [filtered, sortField, sortOrder]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ChevronDown className="w-3.5 h-3.5 opacity-30" />;
        return sortOrder === 'asc'
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />;
    };

    const topPendingCourse = useMemo(() => {
        return [...courses]
            .filter((c) => c.is_active && c.pending_grading > 0)
            .sort((a, b) => b.pending_grading - a.pending_grading)[0];
    }, [courses]);

    return (
        <TALayout activeItem="overview">
            {/* Page Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5"
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.4px',
                                textTransform: 'uppercase',
                                backgroundColor: 'var(--color-primary-light)',
                                color: 'var(--color-primary)',
                            }}
                        >
                            Teaching Assistant
                        </span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                        TA Dashboard
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '4px' }}>
                        Review grading queues, track progress, and open the courses you support.
                    </p>
                </div>

                {topPendingCourse && (
                    <button
                        onClick={() => router.push(`/ta/courses/${topPendingCourse.id}/grading`)}
                        className="inline-flex items-center gap-2 rounded-full transition-colors"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            color: '#fff',
                            fontSize: '13px',
                            fontWeight: 600,
                            padding: '9px 18px',
                            boxShadow: 'var(--shadow-card)',
                        }}
                    >
                        <ClipboardList className="w-4 h-4" />
                        Open grading queue
                        <span
                            className="rounded-full"
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                padding: '1px 7px',
                                lineHeight: '16px',
                            }}
                        >
                            {overview?.pending_grading ?? 0}
                        </span>
                    </button>
                )}
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading TA dashboard…</span>
                </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
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

            {overview && !isLoading && (<>
                {/* KPI strip */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 mb-6" aria-label="TA key metrics">
                    <KpiCard
                        label="Assigned courses"
                        value={overview.assigned_courses}
                        tone="primary"
                    />
                    <KpiCard
                        label="Students supported"
                        value={overview.total_students}
                        tone="info"
                    />
                    <KpiCard
                        label="Graded this week"
                        value={overview.graded_this_week}
                        tone="ok"
                        footer={overview.graded_this_week > 0 ? 'Nice pace' : undefined}
                    />
                    <KpiCard
                        label="Pending review"
                        value={overview.pending_grading}
                        tone={overview.pending_grading > 0 ? 'warn' : 'neutral'}
                    />
                </div>

                {/* Toolbar: search + tabs */}
                <div
                    className="rounded-xl mb-6"
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        padding: '12px 16px',
                    }}
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="relative flex-1 min-w-[240px] max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                            <Input
                                placeholder="Search courses, codes, or instructors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-[var(--color-border)]"
                            />
                        </div>

                        <div
                            className="inline-flex rounded-full p-1"
                            style={{ backgroundColor: 'var(--color-primary-bg)' }}
                            role="tablist"
                            aria-label="Course status filter"
                        >
                            {tabs.map((tab) => {
                                const active = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setActiveTab(tab.id)}
                                        className="inline-flex items-center gap-2 rounded-full transition-colors"
                                        style={{
                                            padding: '6px 14px',
                                            fontSize: '13px',
                                            fontWeight: active ? 600 : 500,
                                            color: active ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                            backgroundColor: active ? 'var(--color-surface)' : 'transparent',
                                            boxShadow: active ? 'var(--shadow-card)' : 'none',
                                        }}
                                    >
                                        {tab.label}
                                        <span
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                minWidth: '18px',
                                                textAlign: 'center',
                                                color: active ? 'var(--color-primary)' : 'var(--color-text-light)',
                                            }}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Courses Table */}
                {courses.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
                        <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>
                            No TA Assignments Yet
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                            You will see courses here once a faculty member assigns you as a TA.
                        </p>
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="text-center py-20">
                        <FilterX className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
                        <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>
                            No Matching Courses
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '16px' }}>
                            Try selecting a different filter or adjusting your search.
                        </p>
                        <button
                            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                            style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary)' }}
                            className="hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}>
                        <table className="w-full">
                            <thead style={{ backgroundColor: 'var(--color-primary-bg)', borderBottom: '1px solid var(--color-border)' }}>
                                <tr>
                                    <th className="text-left px-6 py-4">
                                        <button onClick={() => handleSort('code')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Code <SortIcon field="code" />
                                        </button>
                                    </th>
                                    <th className="text-left px-5 py-4">
                                        <button onClick={() => handleSort('name')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Course Name <SortIcon field="name" />
                                        </button>
                                    </th>
                                    <th className="text-left px-5 py-4 hidden md:table-cell">
                                        <button onClick={() => handleSort('instructor')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Instructor <SortIcon field="instructor" />
                                        </button>
                                    </th>
                                    <th className="text-left px-5 py-4">
                                        <button onClick={() => handleSort('students')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Students <SortIcon field="students" />
                                        </button>
                                    </th>
                                    <th className="text-left px-5 py-4">
                                        <button onClick={() => handleSort('assignments')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Assignments <SortIcon field="assignments" />
                                        </button>
                                    </th>
                                    <th className="text-left px-5 py-4">
                                        <button onClick={() => handleSort('pending')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Pending <SortIcon field="pending" />
                                        </button>
                                    </th>
                                    <th className="text-left px-5 py-4">
                                        <button onClick={() => handleSort('status')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                            Status <SortIcon field="status" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-4 w-10" aria-hidden="true" />
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map((course, idx) => (
                                    <tr
                                        key={course.id}
                                        className="group transition-colors"
                                        style={{
                                            borderBottom: idx === sorted.length - 1 ? 'none' : '1px solid var(--color-border)',
                                            cursor: 'pointer',
                                        }}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Open ${course.name}`}
                                        onClick={() => router.push(`/ta/courses/${course.id}`)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                router.push(`/ta/courses/${course.id}`);
                                            }
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                                    >
                                        {/* Course Code */}
                                        <td className="px-6 py-4">
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
                                                {course.code ?? '—'}
                                            </span>
                                        </td>

                                        {/* Course Name */}
                                        <td className="px-5 py-4">
                                            <span
                                                className="ta-course-name group-hover:underline"
                                                style={{
                                                    fontSize: '15px',
                                                    fontWeight: 600,
                                                    color: 'var(--color-primary)',
                                                    letterSpacing: '-0.01em',
                                                    textUnderlineOffset: '3px',
                                                    textDecorationThickness: '1.5px',
                                                }}
                                            >
                                                {course.name}
                                            </span>
                                            {course.description && (
                                                <span
                                                    className="block"
                                                    style={{
                                                        fontSize: '12px',
                                                        color: 'var(--color-text-light)',
                                                        marginTop: '2px',
                                                        maxWidth: '360px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {course.description}
                                                </span>
                                            )}
                                        </td>

                                        {/* Instructor */}
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span style={{ fontSize: '13px', color: 'var(--color-text-mid)' }}>
                                                {course.instructor_name ?? '—'}
                                            </span>
                                        </td>

                                        {/* Students */}
                                        <td className="px-5 py-4">
                                            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                {course.student_count}
                                            </span>
                                        </td>

                                        {/* Assignments */}
                                        <td className="px-5 py-4">
                                            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                                                {course.assignment_count}
                                            </span>
                                        </td>

                                        {/* Pending Grading */}
                                        <td className="px-5 py-4">
                                            {getPendingBadge(course.pending_grading)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            {getStatusBadge(course.is_active)}
                                        </td>

                                        {/* Open affordance */}
                                        <td className="px-4 py-4 text-right">
                                            <ChevronRight
                                                className="w-4 h-4 inline-block opacity-40 group-hover:opacity-80 transition-opacity"
                                                style={{ color: 'var(--color-text-mid)' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </>)}
        </TALayout>
    );
}
