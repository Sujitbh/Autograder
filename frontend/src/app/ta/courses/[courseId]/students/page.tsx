'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import TAStudentsPage from '@/components/TAStudentsPage';

export default function TAStudentsRoute({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = use(params);

    return (
        <AuthGuard>
            <TAStudentsPage courseId={courseId} />
        </AuthGuard>
    );
}
