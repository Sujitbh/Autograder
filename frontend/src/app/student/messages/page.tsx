'use client';

import { PageLayout } from '@/components/PageLayout';
import { MessagingSystem } from '@/components/MessagingSystem';
import { TopNav } from '@/components/TopNav';

export default function StudentMessagesPage() {
    return (
        <PageLayout>
            <TopNav breadcrumbs={[{ label: 'My Courses', href: '/student' }, { label: 'Messages' }]} />
            <div className="p-6 h-full">
                <MessagingSystem currentUserRole="student" />
            </div>
        </PageLayout>
    );
}
