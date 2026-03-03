'use client';

import { AdminGuard } from '../AdminGuard';
import { PasswordManagement } from '@/components/admin/PasswordManagement';

export default function AdminPasswordsPage() {
  return (
    <AdminGuard>
      <PasswordManagement />
    </AdminGuard>
  );
}
