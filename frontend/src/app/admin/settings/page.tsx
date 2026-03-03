'use client';

import { AdminGuard } from '../AdminGuard';
import { SystemSettings } from '@/components/admin/SystemSettings';

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <SystemSettings />
    </AdminGuard>
  );
}
