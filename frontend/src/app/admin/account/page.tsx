'use client';

import { AdminGuard } from '../AdminGuard';
import { AdminAccountSettings } from '@/components/admin/AdminAccountSettings';

export default function AdminAccountPage() {
  return (
    <AdminGuard>
      <AdminAccountSettings />
    </AdminGuard>
  );
}
