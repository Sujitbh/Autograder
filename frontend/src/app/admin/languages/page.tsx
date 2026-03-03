'use client';

import { AdminGuard } from '../AdminGuard';
import { LanguageManagement } from '@/components/admin/LanguageManagement';

export default function AdminLanguagesPage() {
  return (
    <AdminGuard>
      <LanguageManagement />
    </AdminGuard>
  );
}
