'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import { StudentCourseInterior } from '@/components/StudentCourseInterior';

export default function StudentCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <AuthGuard>
      <StudentCourseInterior courseId={id} />
    </AuthGuard>
  );
}
