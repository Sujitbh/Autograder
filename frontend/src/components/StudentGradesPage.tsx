'use client';

import { useQuery } from '@tanstack/react-query';
import { useCourses } from '@/hooks/queries/useCourses';
import { TrendingUp, CheckCircle2 } from 'lucide-react';
import { StudentLayout } from './StudentLayout';
import api from '@/services/api/client';

interface StudentGradesPageProps {
  courseId: string;
}

export function StudentGradesPage({ courseId }: StudentGradesPageProps) {
  const { data: courses } = useCourses();
  const course = courses?.find((c) => c.id === courseId);

  const { data: gradesData, isLoading } = useQuery({
    queryKey: ['courseGrades', courseId],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${courseId}/grades`);
      return data;
    },
  });

  return (
    <StudentLayout
      activeItem="grades"
      courseId={courseId}
      breadcrumbs={[
        { label: course?.name ?? 'Course', href: `/student/courses/${courseId}` },
        { label: 'Grades' },
      ]}
    >
      <div className="max-w-5xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-dark)' }}>My Grades</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>
            Your performance in {course?.name ?? 'this course'}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full mx-auto" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
            <p className="mt-4" style={{ color: 'var(--color-text-mid)' }}>Loading grades...</p>
          </div>
        ) : gradesData ? (
          <>
            {/* Grade Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--color-success-bg)', borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6" style={{ color: 'var(--color-success)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-dark)' }}>Average Score</p>
                </div>
                {gradesData.averageScore !== null ? (
                  <p className="text-4xl font-bold" style={{ color: 'var(--color-success)' }}>{gradesData.averageScore}%</p>
                ) : (
                  <p className="text-lg" style={{ color: 'var(--color-text-mid)' }}>No grades yet</p>
                )}
              </div>

              <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--color-info-bg)', borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--color-info)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-dark)' }}>Graded</p>
                </div>
                <p className="text-4xl font-bold" style={{ color: 'var(--color-info)' }}>
                  {gradesData.graded_count}/{gradesData.total_count}
                </p>
                <p className="text-xs mt-2" style={{ color: 'var(--color-text-mid)' }}>assignments graded</p>
              </div>
            </div>

            {/* Assignment Grades */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-dark)' }}>Assignment Breakdown</h3>
              {gradesData.assignments && gradesData.assignments.length > 0 ? (
                <div className="space-y-3">
                  {gradesData.assignments.map((ag: any) => {
                    const gradeColor = ag.percentage !== null
                      ? ag.percentage >= 70 ? 'var(--color-success)' : ag.percentage >= 50 ? 'var(--color-warning)' : 'var(--color-error)'
                      : 'var(--color-text-mid)';
                    return (
                      <div
                        key={ag.assignment_id}
                        className="rounded-xl border p-4 hover:shadow-md transition-shadow"
                        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold" style={{ color: 'var(--color-text-dark)' }}>{ag.assignment_name}</h4>
                          </div>
                          {ag.percentage !== null ? (
                            <div className="text-right">
                              <p className="text-2xl font-bold" style={{ color: gradeColor }}>{ag.percentage}%</p>
                              <p className="text-xs" style={{ color: 'var(--color-text-mid)' }}>{ag.score}/{ag.max_score}</p>
                            </div>
                          ) : ag.submitted ? (
                            <div className="text-right">
                              <p className="text-sm font-semibold" style={{ color: 'var(--color-text-mid)' }}>Submitted</p>
                              <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>Pending grade</p>
                            </div>
                          ) : (
                            <div className="text-right">
                              <p className="text-sm font-semibold" style={{ color: 'var(--color-warning)' }}>Not submitted</p>
                            </div>
                          )}
                        </div>
                        {ag.percentage !== null && (
                          <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--color-border)' }}>
                            <div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ width: `${ag.percentage}%`, backgroundColor: gradeColor }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-mid)' }}>No grades available yet.</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
            <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
            <p className="font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>No grades yet</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-mid)' }}>Grades will appear here once your assignments are graded.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
