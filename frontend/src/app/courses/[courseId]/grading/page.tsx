'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { GradingQueue } from '@/components/GradingQueue';

export default function GradingQueuePage() {
    return (
        <AuthGuard>
            <GradingQueue />
        </AuthGuard>
    );
}
