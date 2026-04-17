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
  const cfg: Record<StudentStatus, { bg: string; text: string; border: string; label: string }> = {
    not_submitted: { bg: '#F8F8F8', text: '#4F4F4F', border: '#E6E6E6', label: 'Not Submitted' },
    submitted: { bg: '#EEF4FF', text: '#1A4D7A', border: '#D7E6FF', label: 'Submitted' },
    grading: { bg: '#FFF8EC', text: '#8A5700', border: '#FFE4B5', label: 'In Review' },
    graded: { bg: '#EAF7EA', text: '#256D2D', border: '#CBE8CF', label: 'Graded' },
  };
  const s = cfg[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'none',
        padding: '5px 11px',
        borderRadius: '999px',
        lineHeight: '14px',
        letterSpacing: '0',
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

  const submissionQueries = useQueries({
    queries: (assignments ?? []).map((a) => ({
      queryKey: ['submissions', a.id],
      queryFn: () => submissionService.getSubmissions(a.id),
      enabled: !!a.id,
    })),
  });

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

          <div className="flex flex-wrap gap-3 mb-5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="transition-all relative flex items-center gap-2.5 rounded-full"
                  style={{
                    padding: '8px 14px',
                    backgroundColor: isActive ? '#6B0000' : '#FFFFFF',
                    border: isActive ? '1px solid #6B0000' : '1px solid #D3D6DB',
                    color: isActive ? '#FFFFFF' : '#4B5563',
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: 1,
                    boxShadow: isActive ? '0 8px 16px rgba(107, 0, 0, 0.16)' : '0 1px 2px rgba(17, 24, 39, 0.05)',
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        minWidth: '22px',
                        height: '22px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        borderRadius: '999px',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
                        color: isActive ? '#FFFFFF' : '#4B5563',
                        padding: '0 6px',
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
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
                No {tabs.find((t) => t.id === activeTab)?.label} Assignments
              </p>
              <p style={{ fontSize: '14px', color: 'var(--color-text-mid)', marginBottom: '16px' }}>
                Try selecting a different filter.
              </p>
              <button
                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}
                className="hover:underline"
              >
                Clear filters
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
                      <button onClick={() => handleSort('score')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 600, color: '#374151', letterSpacing: '0', textTransform: 'none' }}>
                        Score <SortIcon field="score" />
                      </button>
                    </th>
                    <th className="text-left px-6 py-4">
                      <button onClick={() => handleSort('status')} className="flex items-center gap-1.5" style={{ fontSize: '13px', fontWeight: 600, color: '#374151', letterSpacing: '0', textTransform: 'none' }}>
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
                          borderColor: '#ECECEE',
                          borderLeft: isOverdue ? '3px solid #8B0000' : '3px solid transparent',
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
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                      >
                        <td className="px-8 py-5">
                          <span style={{ fontSize: '16px', fontWeight: 600, color: '#6B0000', letterSpacing: '-0.01em' }}>
                            {assignment.name}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {isOverdue && (
                              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#8B0000' }} />
                            )}
                            <span
                              style={{
                                fontSize: '16px',
                                color: isOverdue ? '#8B0000' : '#4B5563',
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

                        <td className="px-6 py-5">
                          {sub?.score != null ? (
                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#256D2D' }}>
                              {sub.score} / {sub.maxScore ?? '?'}
                            </span>
                          ) : (
                            <span style={{ fontSize: '16px', fontWeight: 400, color: '#9CA3AF' }}>—</span>
                          )}
                        </td>

                        <td className="px-6 py-5">
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
