'use client';

import { AdminGuard } from '../AdminGuard';
import { UserManagement } from '@/components/admin/UserManagement';

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <UserManagement />
    </AdminGuard>
  );
}
