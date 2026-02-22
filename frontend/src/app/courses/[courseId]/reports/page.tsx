'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { ReportsDashboard } from '@/components/ReportsDashboard';

export default function ReportsPage() {
    return (
        <AuthGuard>
            <ReportsDashboard />
        </AuthGuard>
    );
}
