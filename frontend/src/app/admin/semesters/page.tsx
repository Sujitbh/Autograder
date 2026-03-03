'use client';

import { AdminGuard } from '../AdminGuard';
import { SemesterManagement } from '@/components/admin/SemesterManagement';

export default function AdminSemestersPage() {
  return (
    <AdminGuard>
      <SemesterManagement />
    </AdminGuard>
  );
}
