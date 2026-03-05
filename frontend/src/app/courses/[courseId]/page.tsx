'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { CourseInterior } from '@/components/CourseInterior';

export default function CourseDetailPage() {
    return (
        <AuthGuard>
            <CourseInterior />
        </AuthGuard>
    );
}
