'use client';

import { AuthGuard } from '@/app/AuthGuard';
import StudentDashboard from '@/components/StudentDashboard';

export default function StudentPage() {
    return (
        <AuthGuard>
            <StudentDashboard />
        </AuthGuard>
    );
}
