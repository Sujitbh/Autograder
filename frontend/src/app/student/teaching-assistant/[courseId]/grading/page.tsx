'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { TopNav } from '@/components/TopNav';
import { PageLayout } from '@/components/PageLayout';
import { Sidebar } from '@/components/Sidebar';
import { useCourse, useSubmissionsForGrading } from '@/hooks/queries';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function TAGradingPage() {
  const params = useParams() as { courseId: string };
  const router = useRouter();
  const courseId = Number(params.courseId);

  const { data: course, isLoading: isLoadingCourse } = useCourse(params.courseId);
  const { data: submissions = [], isLoading: isLoadingSubmissions } = useSubmissionsForGrading(courseId);

  // Group submissions by assignment - call before any returns
  const submissionsByAssignment = useMemo(() => {
    const grouped: Record<number, any[]> = {};
    submissions.forEach((sub) => {
      if (!grouped[sub.assignment_id]) {
        grouped[sub.assignment_id] = [];
      }
      grouped[sub.assignment_id].push(sub);
    });
    return grouped;
  }, [submissions]);

  const assignmentIds = Object.keys(submissionsByAssignment);

  if (isLoadingCourse || isLoadingSubmissions) {
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
              <p>Loading submissions...</p>
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
          ]}
        />

        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar activeItem="grading" userRole="ta" backPath="/student/teaching-assistant" />

          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1
                  className="text-3xl font-bold mb-2"
                  style={{ color: 'var(--color-text-dark)' }}
                >
                  {course.name} - Grading
                </h1>
                <p style={{ color: 'var(--color-text-mid)' }}>
                  {course.code} • {submissions.length} submission
                  {submissions.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Assignments Grid */}
              {assignmentIds.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-600">No submissions yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignmentIds.map((assignmentId) => {
                    const assignmentSubs = submissionsByAssignment[Number(assignmentId)];
                    const pendingCount = assignmentSubs.filter((s) => s.status === 'submitted').length;
                    const gradedCount = assignmentSubs.filter((s) => s.status === 'graded').length;

                    return (
                      <div
                        key={assignmentId}
                        className="p-4 rounded-lg border"
                        style={{
                          borderColor: 'var(--color-border)',
                          backgroundColor: 'var(--color-surface)',
                        }}
                      >
                        <h3
                          className="font-semibold mb-2"
                          style={{ color: 'var(--color-text-dark)' }}
                        >
                          {assignmentSubs[0]?.assignment_name || `Assignment ${assignmentId}`}
                        </h3>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="p-2 rounded" style={{ backgroundColor: '#fff3cd' }}>
                            <p className="text-xs text-gray-600">Pending:</p>
                            <p className="text-lg font-bold text-gray-900">{pendingCount}</p>
                          </div>
                          <div className="p-2 rounded" style={{ backgroundColor: '#d4edda' }}>
                            <p className="text-xs text-gray-600">Graded:</p>
                            <p className="text-lg font-bold text-gray-900">{gradedCount}</p>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            router.push(
                              `/student/teaching-assistant/${courseId}/assignments/${assignmentId}/grading`
                            )
                          }
                          className="w-full py-2 px-3 rounded text-sm font-medium transition-colors"
                          style={{
                            backgroundColor: '#1967d2',
                            color: 'white',
                          }}
                        >
                          Grade Submissions
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
