'use client';

import { PageLayout } from '@/components/PageLayout';
import { MessagingSystem } from '@/components/MessagingSystem';
import { TopNav } from '@/components/TopNav';

export default function FacultyMessagesPage() {
    return (
        <PageLayout>
            <TopNav breadcrumbs={[{ label: 'My Courses', href: '/courses' }, { label: 'Messages' }]} />
            <div className="p-6 h-full">
                <MessagingSystem currentUserRole="faculty" />
            </div>
        </PageLayout>
    );
}
