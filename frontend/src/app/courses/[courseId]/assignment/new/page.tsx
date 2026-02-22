'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { CreateAssignmentPage } from '@/components/CreateAssignmentPage';

export default function NewAssignmentPage() {
    return (
        <AuthGuard>
            <CreateAssignmentPage />
        </AuthGuard>
    );
}
