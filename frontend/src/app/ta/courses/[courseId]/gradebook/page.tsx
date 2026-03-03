'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import TAGradebookPage from '@/components/TAGradebookPage';

export default function TAGradebookRoute({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = use(params);

    return (
        <AuthGuard>
            <TAGradebookPage courseId={courseId} />
        </AuthGuard>
    );
}
