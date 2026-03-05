'use client';

import { AdminGuard } from '../AdminGuard';
import { AdminCourseManagement } from '@/components/admin/AdminCourseManagement';

export default function AdminCoursesPage() {
  return (
    <AdminGuard>
      <AdminCourseManagement />
    </AdminGuard>
  );
}
