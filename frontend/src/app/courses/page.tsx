'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { CoursesLanding } from '@/components/CoursesLanding';

export default function CoursesPage() {
    return (
        <AuthGuard>
            <CoursesLanding />
        </AuthGuard>
    );
}
