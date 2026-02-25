'use client';

import { AuthGuard } from '@/app/AuthGuard';
import StudentCourseView from '@/components/StudentCourseView';

/**
 * /student/courses/[courseId]/assignments
 * Assignment list + submission / rubric / grades / tests tabbed interface.
 */
export default function AssignmentsPage() {
    return (
        <AuthGuard>
            <StudentCourseView />
        </AuthGuard>
    );
}
