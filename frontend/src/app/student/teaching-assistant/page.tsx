'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { PageLayout } from '@/components/PageLayout';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';
import { TADashboardOverview } from '@/components/TADashboardOverview';
import { useTACourses, useSubmissionsForGrading } from '@/hooks/queries';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeachingAssistantDashboard() {
  const router = useRouter();
  const { data: taCourses = [], isLoading: isLoadingCourses } = useTACourses();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
    taCourses.length > 0 ? Number(taCourses[0].id) : null
  );

  const { data: submissions = [], isLoading: isLoadingSubmissions } = useSubmissionsForGrading(
    selectedCourseId ?? undefined
  );

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
              courses={taCourses.map((c) => ({
                ...c,
                id: String(c.id),
              }))}
              submissions={submissions.map((s) => ({
                ...s,
                student_id: Number(s.student_id),
              }))}
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
