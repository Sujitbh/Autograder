'use client';

import { AuthGuard } from '@/app/AuthGuard';
import DashboardPage from '@/components/DashboardPage';

export default function Page() {
    return (
        <AuthGuard>
            <DashboardPage />
        </AuthGuard>
    );
}
