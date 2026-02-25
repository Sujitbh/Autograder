'use client';

import { useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/app/AuthGuard';

function Redirect() {
    const router = useRouter();
    const { courseId } = useParams() as { courseId: string };
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') ?? 'submit';

    useEffect(() => {
        router.replace(`/student/courses/${courseId}/assignments?tab=${tab}`);
    }, [courseId, tab, router]);

    return null;
}

export default function StudentCoursePage() {
    return (
        <AuthGuard>
            <Redirect />
        </AuthGuard>
    );
}
