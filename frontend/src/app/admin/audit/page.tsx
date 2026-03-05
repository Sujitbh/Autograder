'use client';

import { AdminGuard } from '../AdminGuard';
import { AuditLog } from '@/components/admin/AuditLog';

export default function AdminAuditPage() {
  return (
    <AdminGuard>
      <AuditLog />
    </AdminGuard>
  );
}
