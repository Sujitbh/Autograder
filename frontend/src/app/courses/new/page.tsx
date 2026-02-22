'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { CreateCourse } from '@/components/CreateCourse';

export default function NewCoursePage() {
    return (
        <AuthGuard>
            <CreateCourse />
        </AuthGuard>
    );
}
