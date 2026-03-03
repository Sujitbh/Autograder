'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import TAGradingPage from '@/components/TAGradingPage';

export default function TAGradingRoute({
    params,
}: {
    params: Promise<{ courseId: string; submissionId: string }>;
}) {
    const { courseId, submissionId } = use(params);

    return (
        <AuthGuard>
            <TAGradingPage courseId={courseId} submissionId={submissionId} />
        </AuthGuard>
    );
}
