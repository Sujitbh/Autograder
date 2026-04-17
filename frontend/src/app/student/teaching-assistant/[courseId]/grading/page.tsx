'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import TASubmissionsPage from '@/components/TASubmissionsPage';

export default function TACompatGradingRoute({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);

  return (
    <AuthGuard>
      <TASubmissionsPage courseId={courseId} />
    </AuthGuard>
  );
}
