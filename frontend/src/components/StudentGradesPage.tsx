'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCourses } from '@/hooks/queries/useCourses';
import { TrendingUp, Search, ChevronDown } from 'lucide-react';
import { StudentLayout } from './StudentLayout';
import api from '@/services/api/client';

interface StudentGradesPageProps {
  courseId: string;
}

type GradeFilter = 'all' | 'graded' | 'pending' | 'not_submitted';
type GradeSort = 'name_asc' | 'name_desc' | 'score_desc' | 'score_asc' | 'status';

function getStatusLabel(assignment: any): 'Graded' | 'Pending Grade' | 'Not Submitted' {
  if (assignment.percentage !== null) return 'Graded';
  if (assignment.submitted) return 'Pending Grade';
  return 'Not Submitted';
}

function getScoreColor(percentage: number | null) {
  if (percentage === null) return 'var(--color-text-mid)';
  if (percentage >= 85) return 'var(--color-success)';
  if (percentage >= 70) return 'var(--color-info)';
  if (percentage >= 50) return 'var(--color-warning)';
  return 'var(--color-error)';
}

function getStatusTone(status: 'Graded' | 'Pending Grade' | 'Not Submitted') {
  if (status === 'Graded') {
    return { bg: 'rgba(22,163,74,0.10)', border: 'rgba(22,163,74,0.22)', text: 'var(--color-success)' };
  }
  if (status === 'Pending Grade') {
    return { bg: 'rgba(217,119,6,0.10)', border: 'rgba(217,119,6,0.22)', text: 'var(--color-warning)' };
  }
  return { bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.20)', text: 'var(--color-text-mid)' };
}

export function StudentGradesPage({ courseId }: StudentGradesPageProps) {
  const router = useRouter();
  const { data: courses } = useCourses();
  const course = courses?.find((c) => c.id === courseId);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<GradeFilter>('all');
  const [sortBy, setSortBy] = useState<GradeSort>('score_desc');

  const { data: gradesData, isLoading } = useQuery({
    queryKey: ['courseGrades', courseId],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${courseId}/grades`);
      return data;
    },
  });

  const assignments = gradesData?.assignments ?? [];

  const counts = useMemo(() => {
    const graded = assignments.filter((a: any) => a.percentage !== null).length;
    const pending = assignments.filter((a: any) => a.percentage === null && a.submitted).length;
    const notSubmitted = assignments.filter((a: any) => !a.submitted).length;
    return {
      all: assignments.length,
      graded,
      pending,
      notSubmitted,
    };
  }, [assignments]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = assignments.filter((a: any) => {
      const status = getStatusLabel(a);
      const matchesQuery = !q || String(a.assignment_name ?? '').toLowerCase().includes(q);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'graded' && status === 'Graded') ||
        (filter === 'pending' && status === 'Pending Grade') ||
        (filter === 'not_submitted' && status === 'Not Submitted');
      return matchesQuery && matchesFilter;
    });

    const statusOrder: Record<string, number> = {
      'Graded': 0,
      'Pending Grade': 1,
      'Not Submitted': 2,
    };

    return [...filtered].sort((a: any, b: any) => {
      const scoreA = a.percentage ?? -1;
      const scoreB = b.percentage ?? -1;
      const nameA = String(a.assignment_name ?? '');
      const nameB = String(b.assignment_name ?? '');
      const statusA = getStatusLabel(a);
      const statusB = getStatusLabel(b);

      switch (sortBy) {
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

  return (
    <StudentLayout
      activeItem="grades"
      courseId={courseId}
      breadcrumbs={[
        { label: course?.name ?? 'Course', href: `/student/courses/${courseId}` },
        { label: 'Grades' },
      ]}
    >
      <div className="w-full max-w-none">
        <div className="mb-5">
          <h2 className="text-[36px] leading-tight font-semibold" style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}>My Grades</h2>
          <p className="text-base mt-1" style={{ color: 'var(--color-text-mid)' }}>
            Your performance in {course?.name ?? 'this course'}
          </p>
          <div className="mt-3" style={{ width: 86, height: 3, borderRadius: 999, background: 'linear-gradient(90deg, var(--color-primary), rgba(107,0,0,0.25))' }} />
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full mx-auto" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
            <p className="mt-4" style={{ color: 'var(--color-text-mid)' }}>Loading grades...</p>
          </div>
        ) : gradesData ? (
          <>
            <div
              className="mb-5 pb-4 flex flex-wrap items-center gap-2"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'var(--color-surface)' }}>
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-text-mid)' }} />
                <span style={{ color: 'var(--color-text-mid)', fontSize: '14px' }}>Average:</span>
                <strong style={{ color: 'var(--color-text-dark)', fontSize: '16px' }}>
                  {gradesData.averageScore !== null ? `${gradesData.averageScore}%` : 'No grades yet'}
                </strong>
              </div>
              <div className="px-3 py-1.5 rounded-full" style={{ background: 'var(--color-surface)' }}>
                <span style={{ color: 'var(--color-text-mid)', fontSize: '14px' }}>
                Graded <strong style={{ color: 'var(--color-text-dark)' }}>{gradesData.graded_count}</strong> of <strong style={{ color: 'var(--color-text-dark)' }}>{gradesData.total_count}</strong>
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-full" style={{ background: 'var(--color-surface)' }}>
                <span style={{ color: 'var(--color-text-mid)', fontSize: '14px' }}>
                Pending <strong style={{ color: 'var(--color-text-dark)' }}>{counts.pending}</strong>
                </span>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="relative min-w-[280px] flex-1 max-w-[560px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-light)' }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search assignment name..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none transition"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-dark)',
                  }}
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: 'all', label: 'All', count: counts.all },
                  { id: 'graded', label: 'Graded', count: counts.graded },
                  { id: 'pending', label: 'Pending', count: counts.pending },
                  { id: 'not_submitted', label: 'Not Submitted', count: counts.notSubmitted },
                ].map((f) => {
                  const active = filter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id as GradeFilter)}
                      className="px-3 py-1.5 rounded-full text-sm transition"
                      style={{
                        backgroundColor: active ? 'var(--color-primary)' : 'var(--color-surface)',
                        color: active ? '#FFFFFF' : 'var(--color-text-mid)',
                        border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        fontWeight: 500,
                      }}
                    >
                      {f.label} <span style={{ opacity: 0.85 }}>{f.count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative ml-auto min-w-[190px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as GradeSort)}
                  className="w-full appearance-none rounded-lg border pl-3 pr-8 py-2.5 text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-dark)',
                  }}
                >
                  <option value="score_desc">Sort: Highest score</option>
                  <option value="score_asc">Sort: Lowest score</option>
                  <option value="name_asc">Sort: Name A-Z</option>
                  <option value="name_desc">Sort: Name Z-A</option>
                  <option value="status">Sort: Status</option>
                </select>
                <ChevronDown className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-light)' }} />
              </div>
            </div>

            {rows.length > 0 ? (
              <div>
                <div
                  className="grid px-3 py-2 text-xs"
                  style={{
                    gridTemplateColumns: 'minmax(260px, 1.6fr) minmax(180px, 1fr) minmax(140px, .8fr)',
                    color: 'var(--color-text-light)',
                    textTransform: 'uppercase',
                    letterSpacing: '.05em',
                  }}
                >
                  <span>Assignment</span>
                  <span>Status</span>
                  <span className="text-right">Score</span>
                </div>

                {rows.map((ag: any, idx: number) => {
                  const status = getStatusLabel(ag);
                  const scoreColor = getScoreColor(ag.percentage);
                  const tone = getStatusTone(status);
                  return (
                    <button
                      key={ag.assignment_id}
                      onClick={() => router.push(`/student/courses/${courseId}/assignments/${ag.assignment_id}`)}
                      className="w-full grid items-center px-3 py-3.5 text-left transition-colors"
                      style={{
                        gridTemplateColumns: 'minmax(260px, 1.6fr) minmax(180px, 1fr) minmax(140px, .8fr)',
                        borderTop: '1px solid var(--color-border)',
                        backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(148,163,184,0.03)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'transparent' : 'rgba(148,163,184,0.03)')}
                    >
                      <span className="text-[17px] font-medium" style={{ color: 'var(--color-text-dark)' }}>
                        {ag.assignment_name}
                      </span>
                      <span>
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-[13px]"
                          style={{
                            backgroundColor: tone.bg,
                            border: `1px solid ${tone.border}`,
                            color: tone.text,
                            fontWeight: 500,
                          }}
                        >
                          {status === 'Pending Grade' ? 'Submitted · Pending' : status}
                        </span>
                      </span>
                      <span className="text-right" style={{ color: scoreColor, fontSize: '16px', fontWeight: 600 }}>
                        {ag.percentage !== null ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <span>{`${ag.score}/${ag.max_score}`}</span>
                            <span style={{ fontSize: 13, color: 'var(--color-text-mid)', fontWeight: 500 }}>{`(${ag.percentage}%)`}</span>
                          </span>
                        ) : '—'}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center" style={{ color: 'var(--color-text-mid)' }}>
                No assignments match your current search/filter.
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
            <p className="font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>No grades yet</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-mid)' }}>Grades will appear here once your assignments are graded.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
