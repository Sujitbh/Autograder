'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { StudentAccountSettings } from '@/components/StudentAccountSettings';

export default function TASettingsRoute() {
  return (
    <AuthGuard>
      <StudentAccountSettings />
    </AuthGuard>
  );
}
