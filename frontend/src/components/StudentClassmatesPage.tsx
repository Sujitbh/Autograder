'use client';

import { useQuery } from '@tanstack/react-query';
import { useCourses } from '@/hooks/queries/useCourses';
import { Users } from 'lucide-react';
import { StudentLayout } from './StudentLayout';
import api from '@/services/api/client';

interface StudentClassmatesPageProps {
  courseId: string;
}

export function StudentClassmatesPage({ courseId }: StudentClassmatesPageProps) {
  const { data: courses } = useCourses();
  const course = courses?.find((c) => c.id === courseId);

  const { data: classmates = [], isLoading } = useQuery({
    queryKey: ['classmates', courseId],
    queryFn: async () => {
      const { data } = await api.get(`/courses/${courseId}/classmates`);
      return data;
    },
  });

  return (
    <StudentLayout
      activeItem="classmates"
      courseId={courseId}
      breadcrumbs={[
        { label: course?.name ?? 'Course', href: `/student/courses/${courseId}` },
        { label: 'Classmates' },
      ]}
    >
      <div className="max-w-5xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-dark)' }}>Classmates</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-mid)' }}>
            {classmates.length} student{classmates.length !== 1 ? 's' : ''} in {course?.name ?? 'this course'}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full mx-auto" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
            <p className="mt-4" style={{ color: 'var(--color-text-mid)' }}>Loading classmates...</p>
          </div>
        ) : classmates.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-elevated)' }}>
            <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-light)' }} />
            <p className="font-semibold text-lg" style={{ color: 'var(--color-text-dark)' }}>No classmates yet</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-mid)' }}>
              Classmates list will appear here once others join the course.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classmates.map((classmate: any) => (
              <div
                key={classmate.id}
                className="rounded-xl border p-4 hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))' }}
                  >
                    {classmate.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text-dark)' }}>{classmate.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-text-mid)' }}>{classmate.email}</p>
                  </div>
                </div>
                <div className="h-px mt-3 pt-3" style={{ backgroundColor: 'var(--color-border)' }}>
                  <p className="text-xs text-center" style={{ color: 'var(--color-text-light)' }}>Student in this course</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
