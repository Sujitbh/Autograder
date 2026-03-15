'use client';

import { PageLayout } from '@/components/PageLayout';
import { MessagingSystem } from '@/components/MessagingSystem';
import { TopNav } from '@/components/TopNav';

export default function TAMessagesPage() {
    return (
        <PageLayout>
            <TopNav breadcrumbs={[{ label: 'TA Dashboard', href: '/ta' }, { label: 'Messages' }]} />
            <div className="p-6 h-full">
                <MessagingSystem currentUserRole="ta" />
            </div>
        </PageLayout>
    );
}
