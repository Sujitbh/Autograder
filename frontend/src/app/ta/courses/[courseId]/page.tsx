'use client';

import { use } from 'react';
import { AuthGuard } from '@/app/AuthGuard';
import TAAssignmentsPage from '@/components/TAAssignmentsPage';

export default function TACourseAssignmentsPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = use(params);

    return (
        <AuthGuard>
            <TAAssignmentsPage courseId={courseId} />
        </AuthGuard>
    );
}
