'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import { StudentClassmatesPage } from '@/components/StudentClassmatesPage';

export default function StudentCourseClassmatesRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <StudentClassmatesPage courseId={id} />
    </AuthGuard>
  );
}
