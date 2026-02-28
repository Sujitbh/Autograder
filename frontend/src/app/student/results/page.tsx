'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { StudentResultsPage } from '@/components/StudentResultsPage';

export default function StudentResultsRoute() {
  return (
    <AuthGuard>
      <StudentResultsPage />
    </AuthGuard>
  );
}
