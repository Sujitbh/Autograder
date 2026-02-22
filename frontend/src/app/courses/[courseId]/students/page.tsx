'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { StudentRoster } from '@/components/StudentRoster';

export default function StudentsPage() {
    return (
        <AuthGuard>
            <StudentRoster />
        </AuthGuard>
    );
}
