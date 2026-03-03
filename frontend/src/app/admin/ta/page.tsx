'use client';

import { AdminGuard } from '../AdminGuard';
import { AdminTAManagement } from '@/components/admin/AdminTAManagement';

export default function AdminTAPage() {
  return (
    <AdminGuard>
      <AdminTAManagement />
    </AdminGuard>
  );
}
