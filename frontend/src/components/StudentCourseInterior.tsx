'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignments } from '@/hooks/queries/useAssignments';
import { useCourses } from '@/hooks/queries/useCourses';
import { StudentLayout } from './StudentLayout';
import { Input } from './ui/input';
import {
  Search,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Loader2,
  ClipboardX,
  FilterX,
} from 'lucide-react';

interface StudentCourseInteriorProps {
  courseId: string;
}

type SortField = 'name' | 'dueDate';
type SortOrder = 'asc' | 'desc';

export function StudentCourseInterior({ courseId }: StudentCourseInteriorProps) {
  const router = useRouter();
  const { data: courses } = useCourses();
  const { data: assignments, isLoading, error: fetchError } = useAssignments(courseId);
  const now = new Date();

  const course = courses?.find((c) => c.id === courseId);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filtered = useMemo(() => {
    return (assignments ?? []).filter((a) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return a.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [assignments, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'dueDate':
          cmp = (a.dueDate ? new Date(a.dueDate).getTime() : 0) - (b.dueDate ? new Date(b.dueDate).getTime() : 0);
          break;
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
    if (sortField !== field) return <ChevronDown className="w-3.5 h-3.5 opacity-35" />;
    return sortOrder === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
      : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />;
  };

  return (
    <StudentLayout
      activeItem="assignments"
      courseId={courseId}
      breadcrumbs={[{ label: course?.name ?? 'Course' }, { label: 'Assignments' }]}
    >
      <main className="flex-1 overflow-auto">
        <div className="mb-7">
          <h1
            style={{
              fontSize: 'clamp(1.25rem, 2.2vw, 1.7rem)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: '1.05',
              color: '#1F2937',
              marginBottom: '10px',
            }}
          >
            Assignments
          </h1>
          <p style={{ fontSize: '16px', color: '#616161', fontWeight: 400 }}>
            {(assignments ?? []).length} assignment{(assignments ?? []).length !== 1 ? 's' : ''} · {course?.code ?? ''} {course?.name ?? ''}
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading assignments…</span>
          </div>
        )}

        {fetchError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-2" style={{ color: '#ef4444' }}>
            <AlertTriangle className="w-6 h-6" />
            <span>Failed to load assignments.</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>{(fetchError as Error).message}</span>
          </div>
        )}

        {!isLoading && !fetchError && (<>
          <div className="mb-5">
            <div className="relative max-w-[760px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-2 focus-visible:ring-0"
                style={{
                  borderColor: '#D6D6D6',
                  backgroundColor: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#1F2937',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
                }}
              />
            </div>
          </div>

          {(assignments ?? []).length === 0 ? (
            <div className="text-center py-20 rounded-2xl" style={{ border: '1px dashed #D8D8D8', backgroundColor: '#FFFFFF' }}>
              <ClipboardX className="w-16 h-16 mx-auto mb-4" style={{ color: '#D9D9D9' }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>
                No Assignments Yet
              </p>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                Your instructor hasn&apos;t posted any assignments for this course.
              </p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 rounded-2xl" style={{ border: '1px dashed #D8D8D8', backgroundColor: '#FFFFFF' }}>
              <FilterX className="w-12 h-12 mx-auto mb-4" style={{ color: '#D9D9D9' }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>
                No Matching Assignments
              </p>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '16px' }}>
                Try a different search term.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}
                className="hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div
              className="overflow-hidden"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E4E4E7',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
              }}
            >
              <table className="w-full">
                <thead style={{ background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)', borderBottom: '1px solid #E5E7EB' }}>
                  <tr>
                    <th className="text-left px-8 py-4">
                      <button onClick={() => handleSort('name')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 600, color: '#374151', letterSpacing: '0', textTransform: 'none' }}>
                        Assignment Name <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-4">
                      <button onClick={() => handleSort('dueDate')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 600, color: '#374151', letterSpacing: '0', textTransform: 'none' }}>
                        Due Date <SortIcon field="dueDate" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-4">
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Status</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((assignment) => {
                    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
                    const isPastDue = !!dueDate && dueDate < now;
                    const isGroupAssignment = Boolean(assignment.isGroup);
                    const baseRowBg = isGroupAssignment
                      ? 'color-mix(in srgb, var(--color-primary) 3%, #FFFFFF)'
                      : '';
                    const hoverRowBg = isGroupAssignment
                      ? 'color-mix(in srgb, var(--color-primary) 8%, #FFFFFF)'
                      : '#FAFAFA';
                    const assignmentStatus =
                      assignment.isActive === false ? 'Closed' : isPastDue ? 'Past Due' : 'Open';
                    const statusTone =
                      assignmentStatus === 'Past Due'
                        ? { bg: '#FEEDEE', text: '#8B0000', border: '#F6C6C8' }
                        : assignmentStatus === 'Closed'
                          ? { bg: '#F8F8F8', text: '#4F4F4F', border: '#E6E6E6' }
                          : { bg: '#EAF7EA', text: '#256D2D', border: '#CBE8CF' };

                    return (
                      <tr
                        key={assignment.id}
                        className="border-b transition-colors"
                        style={{
                          borderColor: '#ECECEE',
                          borderLeft: isGroupAssignment
                            ? '3px solid color-mix(in srgb, var(--color-primary) 70%, transparent)'
                            : '3px solid transparent',
                          boxShadow: isGroupAssignment
                            ? 'inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 16%, transparent)'
                            : 'none',
                          backgroundColor: baseRowBg,
                          cursor: 'pointer',
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View ${assignment.name}`}
                        onClick={() =>
                          router.push(`/student/courses/${courseId}/assignments/${assignment.id}`)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            router.push(`/student/courses/${courseId}/assignments/${assignment.id}`);
                          }
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverRowBg)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = baseRowBg)}
                      >
                        <td className="px-8 py-5">
                          <span style={{ fontSize: '16px', fontWeight: 600, color: '#6B0000', letterSpacing: '-0.01em' }}>
                            {assignment.name}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            style={{
                              fontSize: '16px',
                              color: '#4B5563',
                              fontWeight: 400,
                            }}
                          >
                            {dueDate
                              ? dueDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                              : '—'}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-1"
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              lineHeight: 1,
                              backgroundColor: statusTone.bg,
                              color: statusTone.text,
                              border: `1px solid ${statusTone.border}`,
                            }}
                          >
                            {assignmentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>)}
      </main>
    </StudentLayout>
  );
}
