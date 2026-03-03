'use client';

import { AuthGuard } from '@/app/AuthGuard';
import TADashboard from '@/components/TADashboard';

export default function TAPage() {
    return (
        <AuthGuard>
            <TADashboard />
        </AuthGuard>
    );
}
