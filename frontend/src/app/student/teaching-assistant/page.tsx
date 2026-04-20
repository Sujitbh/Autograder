'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { PageLayout } from '@/components/PageLayout';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';
import { TADashboardOverview } from '@/components/TADashboardOverview';
import { useTAOverview, useTACourseSubmissions } from '@/hooks/queries';
import type { Course } from '@/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeachingAssistantDashboard() {
  const router = useRouter();
  const { data: overview, isLoading: isLoadingCourses } = useTAOverview();
  const taCourses = overview?.courses ?? [];
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { data: submissionResp, isLoading: isLoadingSubmissions } = useTACourseSubmissions(
    selectedCourseId ?? 0
  );
  const submissions = submissionResp?.submissions ?? [];

  useEffect(() => {
    if (selectedCourseId == null && taCourses.length > 0) {
      setSelectedCourseId(taCourses[0].id);
    }
  }, [selectedCourseId, taCourses]);

  const dashboardCourses: Course[] = taCourses.map((c) => ({
    id: String(c.id),
    code: c.code ?? '',
    name: c.name,
    semester: '',
    section: '',
    description: c.description ?? '',
    facultyId: '',
    enrollmentCode: '',
    enrollmentCodeActive: false,
    enrollmentPolicy: 'code',
    status: c.is_active ? 'active' : 'archived',
    studentCount: c.student_count,
    assignmentCount: c.assignment_count,
    pendingGrades: c.pending_grading,
    createdAt: '',
    updatedAt: '',
  }));

  const dashboardSubmissions = submissions.map((s) => ({
    id: Number(s.id),
    assignment_id: Number(s.assignment_id),
    assignment_name: s.assignment_title,
    student_id: Number(s.student_id),
    student_name: s.student_name,
    student_email: s.student_email ?? '',
    status: (s.status === 'graded' || s.status === 'grading' ? s.status : 'submitted') as
      | 'submitted'
      | 'grading'
      | 'graded',
    score: s.score ?? null,
    max_score: s.max_score ?? null,
    created_at: s.created_at ?? new Date().toISOString(),
  }));

  const handleSelectCourse = (courseId: string) => {
    const numId = Number(courseId);
    setSelectedCourseId(numId);
    router.push(`/student/teaching-assistant/${courseId}/grading`);
  };

  return (
    <AuthGuard>
      <PageLayout>
        <TopNav
          breadcrumbs={[
            { label: 'Dashboard', href: '/student' },
            { label: 'Teaching Assistant' },
          ]}
        />

        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar activeItem="ta-dashboard" />

          <main className="flex-1 overflow-auto p-8">
            <TADashboardOverview
              courses={dashboardCourses}
              submissions={dashboardSubmissions}
              isLoadingCourses={isLoadingCourses}
              isLoadingSubmissions={isLoadingSubmissions}
              onSelectCourse={handleSelectCourse}
            />
          </main>
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
