'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { StudentNotifications } from '@/components/StudentNotifications';

export default function StudentNotificationsRoute() {
  return (
    <AuthGuard>
      <StudentNotifications />
    </AuthGuard>
  );
}
