'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TALayout } from './TALayout';
import { useTAOverview } from '@/hooks/queries/useTADashboard';
import { Input } from './ui/input';
import {
    Search,
    BookOpen,
    ChevronUp,
    ChevronDown,
    Loader2,
    FilterX,
} from 'lucide-react';

type SortField = 'code' | 'name' | 'instructor' | 'students' | 'assignments' | 'pending' | 'status';
type SortOrder = 'asc' | 'desc';

function getStatusBadge(isActive: boolean) {
    const cfg = isActive
        ? { bg: '#E8F5E8', text: '#2D6A2D', label: 'Active' }
        : { bg: '#F5F5F5', text: '#595959', label: 'Inactive' };
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
        return <span style={{ fontSize: '14px', fontWeight: 400, color: '#8A8A8A' }}>0</span>;
    }
    return (
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#D97706' }}>
            {count}
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
                    c.code.toLowerCase().includes(q) ||
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
                case 'code': cmp = a.code.localeCompare(b.code); break;
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

    return (
        <TALayout activeItem="overview">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
                        TA Dashboard
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
                        {courses.length} assigned course{courses.length !== 1 ? 's' : ''} · Manage your teaching assistant responsibilities
                    </p>
                </div>
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
                {/* Search Bar */}
                <div className="mb-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                        <Input
                            placeholder="Search by course name, code, or instructor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-[var(--color-border)]"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 mb-6 border-b-2" style={{ borderColor: 'var(--color-border)' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="px-4 py-3 transition-colors relative flex items-center gap-2"
                            style={{
                                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-mid)',
                                fontSize: '14px',
                                fontWeight: activeTab === tab.id ? 600 : 400,
                            }}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                                        color: activeTab === tab.id ? '#fff' : 'var(--color-text-mid)',
                                        padding: '1px 7px',
                                        borderRadius: '10px',
                                        lineHeight: '16px',
                                    }}
                                >
                                    {tab.count}
                                </span>
                            )}
                            {activeTab === tab.id && (
                                <div
                                    className="absolute bottom-0 left-0 right-0"
                                    style={{ height: '2px', backgroundColor: 'var(--color-primary)' }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Courses Table */}
                {courses.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: '#D9D9D9' }} />
                        <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>
                            No TA Assignments Yet
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                            You will see courses here once a faculty member assigns you as a TA.
                        </p>
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="text-center py-20">
                        <FilterX className="w-12 h-12 mx-auto mb-4" style={{ color: '#D9D9D9' }} />
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
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map((course) => (
                                    <tr
                                        key={course.id}
                                        className="border-b transition-colors"
                                        style={{
                                            borderColor: 'var(--color-border)',
                                            borderLeft: course.pending_grading > 0 ? '4px solid #D97706' : '4px solid transparent',
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
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5EDED')}
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
                                                {course.code}
                                            </span>
                                        </td>

                                        {/* Course Name */}
                                        <td className="px-5 py-4">
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B0000' }}>
                                                {course.name}
                                            </span>
                                        </td>

                                        {/* Instructor */}
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span style={{ fontSize: '13px', color: '#595959' }}>
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
