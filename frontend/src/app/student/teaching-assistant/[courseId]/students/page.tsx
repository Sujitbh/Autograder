'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { TopNav } from '@/components/TopNav';
import { PageLayout } from '@/components/PageLayout';
import { Sidebar } from '@/components/Sidebar';
import { useCourse } from '@/hooks/queries';
import { courseService } from '@/services/api';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Student {
  id: number;
  name: string;
  email: string;
}

export default function TAStudentsPage() {
  const params = useParams() as { courseId: string };
  const courseId = Number(params.courseId);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: course, isLoading: isLoadingCourse } = useCourse(params.courseId);

  // Fetch students for the course
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching students for courseId: ${courseId}`);
        const data = await courseService.getStudentsForTA(courseId);
        console.log('Students fetched:', data);
        setStudents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching students:', err);
        const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
        setError(`Failed to fetch students: ${errorMsg}`);
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId && courseId > 0) {
      fetchStudents();
    }
  }, [courseId]);

  if (isLoadingCourse || isLoading) {
    return (
      <AuthGuard>
        <PageLayout>
          <TopNav
            breadcrumbs={[
              { label: 'Dashboard', href: '/student' },
              { label: 'Teaching Assistant', href: '/student/teaching-assistant' },
              { label: 'Loading...' },
            ]}
          />
          <div className="flex h-[calc(100vh-64px)] items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading students...</p>
            </div>
          </div>
        </PageLayout>
      </AuthGuard>
    );
  }

  if (!course) {
    return (
      <AuthGuard>
        <PageLayout>
          <TopNav breadcrumbs={[{ label: 'Course not found' }]} />
          <div className="flex h-[calc(100vh-64px)] items-center justify-center">
            <p className="text-red-600">Course not found</p>
          </div>
        </PageLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <PageLayout>
        <TopNav
          breadcrumbs={[
            { label: 'Dashboard', href: '/student' },
            { label: 'Teaching Assistant', href: '/student/teaching-assistant' },
            { label: course.name },
            { label: 'Students' },
          ]}
        />

        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar activeItem="students" userRole="ta" backPath="/student/teaching-assistant" />

          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1
                  className="text-3xl font-bold mb-2"
                  style={{ color: 'var(--color-text-dark)' }}
                >
                  {course.name} - Students
                </h1>
                <p style={{ color: 'var(--color-text-mid)' }}>
                  {course.code} • {students.length} student{students.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Students List */}
              {error ? (
                <div className="text-center py-12 px-4 rounded-lg border border-red-300 bg-red-50">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-600">No students enrolled in this course</p>
                </div>
              ) : (
                <div className="rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr
                          style={{
                            borderBottom: `1px solid var(--color-border)`,
                            backgroundColor: 'var(--color-surface)',
                          }}
                        >
                          <th
                            className="px-6 py-3 text-left text-sm font-semibold"
                            style={{ color: 'var(--color-text-dark)' }}
                          >
                            Name
                          </th>
                          <th
                            className="px-6 py-3 text-left text-sm font-semibold"
                            style={{ color: 'var(--color-text-dark)' }}
                          >
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr
                            key={student.id}
                            style={{
                              borderBottom: `1px solid var(--color-border)`,
                              backgroundColor: 'var(--color-surface)',
                            }}
                            className="hover:opacity-75 transition-opacity"
                          >
                            <td
                              className="px-6 py-4 text-sm"
                              style={{ color: 'var(--color-text-dark)' }}
                            >
                              {student.name}
                            </td>
                            <td
                              className="px-6 py-4 text-sm"
                              style={{ color: 'var(--color-text-mid)' }}
                            >
                              {student.email}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
