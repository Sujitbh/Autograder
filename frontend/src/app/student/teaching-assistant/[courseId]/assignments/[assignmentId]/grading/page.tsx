'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { AssignmentGrading } from '@/components/AssignmentGrading';

export default function TAAssignmentGradingPage() {
    return (
        <AuthGuard>
            <AssignmentGrading />
        </AuthGuard>
    );
}
