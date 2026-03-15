'use client';

import { AdminGuard } from '../../AdminGuard';
import { CreateCourse } from '@/components/CreateCourse';

export default function AdminNewCoursePage() {
    return (
        <AdminGuard>
            <CreateCourse isAdmin />
        </AdminGuard>
    );
}
