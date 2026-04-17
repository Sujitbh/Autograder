'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { CourseDefaultRubricEditor } from '@/components/rubric/CourseDefaultRubricEditor';
import { PageLayout } from '@/components/PageLayout';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { useParams } from 'next/navigation';

export default function CourseDefaultRubricPage() {
    const { courseId } = useParams() as { courseId: string };
    const cid = courseId ?? '';

    return (
        <AuthGuard>
            <PageLayout>
                <TopNav
                    breadcrumbs={[
                        { label: 'Courses', href: '/courses' },
                        { label: cid, href: `/courses/${cid}` },
                        { label: 'Default rubric' },
                    ]}
                />
                <div className="flex h-[calc(100vh-64px)]">
                    <Sidebar activeItem="settings" />
                    <main className="flex-1 overflow-auto p-4 sm:p-8">
                        <CourseDefaultRubricEditor courseId={cid} />
                    </main>
                </div>
            </PageLayout>
        </AuthGuard>
    );
}
