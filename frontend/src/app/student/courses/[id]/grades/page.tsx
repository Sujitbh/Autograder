'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import { StudentGradesPage } from '@/components/StudentGradesPage';

export default function StudentCourseGradesRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <StudentGradesPage courseId={id} />
    </AuthGuard>
  );
}
