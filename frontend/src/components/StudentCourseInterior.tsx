'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueries } from '@tanstack/react-query';
import { useAssignments } from '@/hooks/queries/useAssignments';
import { useCourses } from '@/hooks/queries/useCourses';
import { submissionService } from '@/services/api';
import { StudentLayout } from './StudentLayout';
import { Input } from './ui/input';
import {
  Search,
  FileText,
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

type StudentStatus = 'not_submitted' | 'submitted' | 'grading' | 'graded';
type SortField = 'name' | 'dueDate' | 'status' | 'score';
type SortOrder = 'asc' | 'desc';

const STATUS_ORDER: Record<StudentStatus, number> = {
  not_submitted: 0,
  grading: 1,
  submitted: 2,
  graded: 3,
};

function getStudentStatus(
  submissionStatus: string | null,
): StudentStatus {
  if (!submissionStatus) return 'not_submitted';
  if (submissionStatus === 'graded') return 'graded';
  if (submissionStatus === 'grading') return 'grading';
  return 'submitted';
}

function getStatusBadge(status: StudentStatus) {
  const cfg: Record<StudentStatus, { bg: string; text: string; label: string }> = {
    not_submitted: { bg: '#F5F5F5', text: '#595959', label: 'Not Submitted' },
    submitted: { bg: '#E8F0FF', text: '#1A4D7A', label: 'Submitted' },
    grading: { bg: '#FFF7E6', text: '#8A5700', label: 'Grading' },
    graded: { bg: '#E8F5E8', text: '#2D6A2D', label: 'Graded' },
  };
  const s = cfg[status];
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: s.bg,
        color: s.text,
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        padding: '4px 10px',
        borderRadius: '12px',
        lineHeight: '14px',
        letterSpacing: '0.5px',
      }}
    >
      {s.label}
    </span>
  );
}

export function StudentCourseInterior({ courseId }: StudentCourseInteriorProps) {
  const router = useRouter();
  const { data: courses } = useCourses();
  const { data: assignments, isLoading, error: fetchError } = useAssignments(courseId);

  const course = courses?.find((c) => c.id === courseId);
  const now = new Date();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Fetch submissions for each assignment to determine status
  const submissionQueries = useQueries({
    queries: (assignments ?? []).map((a) => ({
      queryKey: ['submissions', a.id],
      queryFn: () => submissionService.getSubmissions(a.id),
      enabled: !!a.id,
    })),
  });

  // Build a map: assignmentId → latest submission
  const submissionMap = useMemo(() => {
    const map: Record<string, { status: string; score: number | null; maxScore: number | null }> = {};
    (assignments ?? []).forEach((a, idx) => {
      const q = submissionQueries[idx];
      if (q?.data && q.data.length > 0) {
        const latest = q.data[0];
        map[a.id] = {
          status: latest.status,
          score: latest.grade?.totalScore ?? null,
          maxScore: latest.grade?.maxScore ?? null,
        };
      }
    });
    return map;
  }, [assignments, submissionQueries]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const all = assignments ?? [];
    const allCount = all.length;
    const notSubmitted = all.filter((a) => !submissionMap[a.id]).length;
    const submitted = all.filter(
      (a) => submissionMap[a.id] && submissionMap[a.id].status !== 'graded'
    ).length;
    const graded = all.filter((a) => submissionMap[a.id]?.status === 'graded').length;
    return { all: allCount, notSubmitted, submitted, graded };
  }, [assignments, submissionMap]);

  const tabs = [
    { id: 'all', label: 'All', count: tabCounts.all },
    { id: 'not_submitted', label: 'To Do', count: tabCounts.notSubmitted },
    { id: 'submitted', label: 'Submitted', count: tabCounts.submitted },
    { id: 'graded', label: 'Graded', count: tabCounts.graded },
  ];

  // Filter
  const filtered = useMemo(() => {
    return (assignments ?? []).filter((a) => {
      const status = getStudentStatus(submissionMap[a.id]?.status ?? null);
      if (activeTab === 'not_submitted' && status !== 'not_submitted') return false;
      if (activeTab === 'submitted' && status !== 'submitted' && status !== 'grading') return false;
      if (activeTab === 'graded' && status !== 'graded') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return a.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [assignments, activeTab, searchQuery, submissionMap]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      const aSub = submissionMap[a.id];
      const bSub = submissionMap[b.id];
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'dueDate':
          cmp = (a.dueDate ? new Date(a.dueDate).getTime() : 0) - (b.dueDate ? new Date(b.dueDate).getTime() : 0);
          break;
        case 'status':
          cmp = (STATUS_ORDER[getStudentStatus(aSub?.status ?? null)] ?? 9) -
            (STATUS_ORDER[getStudentStatus(bSub?.status ?? null)] ?? 9);
          break;
        case 'score':
          cmp = (aSub?.score ?? -1) - (bSub?.score ?? -1);
          break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortOrder, submissionMap]);

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
    <StudentLayout
      activeItem="assignments"
      courseId={courseId}
      breadcrumbs={[{ label: course?.name ?? 'Course' }, { label: 'Assignments' }]}
    >
      <main className="flex-1 overflow-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: 'var(--color-text-dark)' }}>
              Assignments
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginTop: '8px' }}>
              {(assignments ?? []).length} assignment{(assignments ?? []).length !== 1 ? 's' : ''} · {course?.code ?? ''} {course?.name ?? ''}
            </p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading assignments…</span>
          </div>
        )}

        {/* Error state */}
        {fetchError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-2" style={{ color: '#ef4444' }}>
            <AlertTriangle className="w-6 h-6" />
            <span>Failed to load assignments.</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>{(fetchError as Error).message}</span>
          </div>
        )}

        {!isLoading && !fetchError && (<>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
              <Input
                placeholder="Search assignments..."
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

          {/* Assignments Table */}
          {(assignments ?? []).length === 0 ? (
            <div className="text-center py-20">
              <ClipboardX className="w-16 h-16 mx-auto mb-4" style={{ color: '#D9D9D9' }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>
                No Assignments Yet
              </p>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)' }}>
                Your instructor hasn&apos;t posted any assignments for this course.
              </p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20">
              <FilterX className="w-12 h-12 mx-auto mb-4" style={{ color: '#D9D9D9' }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '8px' }}>
                No {tabs.find((t) => t.id === activeTab)?.label} Assignments
              </p>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '16px' }}>
                Try selecting a different filter.
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
                      <button onClick={() => handleSort('name')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        Assignment Name <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-4">
                      <button onClick={() => handleSort('dueDate')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        Due Date <SortIcon field="dueDate" />
                      </button>
                    </th>
                    <th className="text-left px-5 py-4">
                      <button onClick={() => handleSort('score')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                        Score <SortIcon field="score" />
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
                  {sorted.map((assignment) => {
                    const sub = submissionMap[assignment.id];
                    const status = getStudentStatus(sub?.status ?? null);
                    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
                    const isOverdue = dueDate && dueDate < now && status === 'not_submitted';

                    return (
                      <tr
                        key={assignment.id}
                        className="border-b transition-colors"
                        style={{
                          borderColor: 'var(--color-border)',
                          borderLeft: isOverdue ? '4px solid #8B0000' : '4px solid transparent',
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
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5EDED')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                      >
                        {/* Assignment Name */}
                        <td className="px-6 py-4">
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#6B0000' }}>
                            {assignment.name}
                          </span>
                        </td>

                        {/* Due Date */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            {isOverdue && (
                              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#8B0000' }} />
                            )}
                            <span
                              style={{
                                fontSize: '13px',
                                color: isOverdue ? '#8B0000' : '#595959',
                                fontWeight: isOverdue ? 500 : 400,
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
                          </div>
                        </td>

                        {/* Score */}
                        <td className="px-5 py-4">
                          {sub?.score != null ? (
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D6A2D' }}>
                              {sub.score} / {sub.maxScore ?? '?'}
                            </span>
                          ) : (
                            <span style={{ fontSize: '14px', fontWeight: 400, color: '#8A8A8A' }}>—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {getStatusBadge(status)}
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
