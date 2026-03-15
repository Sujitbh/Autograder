'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import FacultyGradingPage from '@/components/FacultyGradingPage';

export default function FacultyGradingRoute({
    params,
}: {
    params: Promise<{ courseId: string; submissionId: string }>;
}) {
    const { courseId, submissionId } = use(params);
    return (
        <AuthGuard>
            <FacultyGradingPage courseId={courseId} submissionId={submissionId} />
        </AuthGuard>
    );
}
