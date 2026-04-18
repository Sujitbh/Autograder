'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useCourses } from '@/hooks/queries/useCourses';
import { Search, ChevronDown, Loader2, TrendingUp, AlertTriangle } from 'lucide-react';
import { StudentLayout } from './StudentLayout';
import api from '@/services/api/client';

interface StudentGradesPageProps {
  courseId: string;
}

type GradeSort = 'name_asc' | 'name_desc' | 'score_desc' | 'score_asc' | 'status';

type GradeStatus = 'Graded' | 'Pending Grade' | 'Past Due' | null;

function getStatusLabel(assignment: any): GradeStatus {
  if (assignment.status === 'missing') return 'Past Due';
  if (assignment.percentage !== null) return 'Graded';
  if (assignment.submitted) return 'Pending Grade';
  return null;
}

function getStatusTone(status: GradeStatus) {
  if (status === null) {
    return null;
  }
  if (status === 'Graded') {
    return { bg: '#EAF7EA', border: '#CBE8CF', text: '#256D2D' };
  }
  if (status === 'Pending Grade') {
    return { bg: '#FFF8EC', border: '#FFE4B5', text: '#8A5700' };
  }
  if (status === 'Past Due') {
    return { bg: '#FEEDEE', border: '#F6C6C8', text: '#8B0000' };
  }
  return { bg: '#F8F8F8', border: '#E6E6E6', text: '#4F4F4F' };
}

function formatLastUpdated(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function StudentGradesPage({ courseId }: StudentGradesPageProps) {
  const router = useRouter();
  const { data: courses } = useCourses();
  const course = courses?.find((c) => c.id === courseId);

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<GradeSort>('score_desc');

  const { data: gradesData, isLoading, error } = useQuery({
    queryKey: ['courseGrades', courseId],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${courseId}/grades`);
      return data;
    },
  });

  const assignments = gradesData?.assignments ?? [];

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = assignments.filter((a: any) => {
      return !q || String(a.assignment_name ?? '').toLowerCase().includes(q);
    });

    const statusOrder: Record<string, number> = {
      Graded: 0,
      'Pending Grade': 1,
      'Past Due': 2,
      '': 3,
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
          return statusOrder[statusA ?? ''] - statusOrder[statusB ?? ''];
        default:
          return 0;
      }
    });
  }, [assignments, query, sortBy]);

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
            Grades
          </h1>
          <p style={{ fontSize: '16px', color: '#616161', fontWeight: 400 }}>
            {(assignments ?? []).length} graded item{(assignments ?? []).length !== 1 ? 's' : ''} · {course?.code ?? ''} {course?.name ?? ''}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'var(--color-text-mid)' }}>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading grades...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2" style={{ color: '#ef4444' }}>
            <AlertTriangle className="w-6 h-6" />
            <span>Failed to load grades.</span>
            <span style={{ fontSize: '12px', opacity: 0.7 }}>{(error as Error).message}</span>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="relative max-w-[760px] min-w-[280px] flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search grades..."
                  className="w-full pl-12 pr-3 h-14 rounded-2xl border-2 outline-none"
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

              <div className="relative min-w-[210px] ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as GradeSort)}
                  className="w-full appearance-none rounded-lg border pl-3 pr-8 py-3 text-sm outline-none"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D6D6D6',
                    color: '#374151',
                  }}
                >
                  <option value="score_desc">Sort: Highest score</option>
                  <option value="score_asc">Sort: Lowest score</option>
                  <option value="name_asc">Sort: Name A-Z</option>
                  <option value="name_desc">Sort: Name Z-A</option>
                  <option value="status">Sort: Status</option>
                </select>
                <ChevronDown className="w-4 h-4 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
              </div>
            </div>

            {rows.length > 0 ? (
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
                      <th className="text-left px-8 py-4" style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                        Assignment Name
                      </th>
                      <th className="text-left px-6 py-4" style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                        Score
                      </th>
                      <th className="text-left px-6 py-4" style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                        Status
                      </th>
                      <th className="text-left px-6 py-4" style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((ag: any) => {
                      const status = getStatusLabel(ag);
                      const tone = getStatusTone(status);

                      return (
                        <tr
                          key={ag.assignment_id}
                          className="border-b transition-colors"
                          style={{ borderColor: '#ECECEE', cursor: 'pointer' }}
                          onClick={() => router.push(`/student/courses/${courseId}/assignments/${ag.assignment_id}`)}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                        >
                          <td className="px-8 py-5">
                            <span style={{ fontSize: '16px', fontWeight: 600, color: '#6B0000', letterSpacing: '-0.01em' }}>
                              {ag.assignment_name}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            {ag.percentage !== null ? (
                              <span style={{ fontSize: '16px', fontWeight: 600, color: '#256D2D' }}>
                                {ag.score}/{ag.max_score}
                                <span style={{ marginLeft: 8, fontSize: '13px', fontWeight: 500, color: '#6B7280' }}>
                                  ({ag.percentage}%)
                                </span>
                              </span>
                            ) : (
                              <span style={{ fontSize: '16px', color: '#9CA3AF' }}>—</span>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            {status && tone ? (
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
                            ) : null}
                          </td>

                          <td className="px-6 py-5">
                            <span style={{ fontSize: '14px', color: '#6B7280' }}>
                              {formatLastUpdated(ag.graded_at)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center" style={{ color: 'var(--color-text-mid)' }}>
                <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
                No grades match your search.
              </div>
            )}
          </>
        )}
      </div>
    </StudentLayout>
  );
}
