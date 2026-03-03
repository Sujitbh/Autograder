'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import { StudentGroupsPage } from '@/components/StudentGroupsPage';

export default function StudentCourseGroupsRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <StudentGroupsPage courseId={id} />
    </AuthGuard>
  );
}
