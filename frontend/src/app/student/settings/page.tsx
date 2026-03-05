'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { StudentAccountSettings } from '@/components/StudentAccountSettings';

export default function StudentSettingsRoute() {
  return (
    <AuthGuard>
      <StudentAccountSettings />
    </AuthGuard>
  );
}
