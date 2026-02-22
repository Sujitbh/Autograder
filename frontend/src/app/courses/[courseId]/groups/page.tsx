'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { GroupsPage } from '@/components/GroupsPage';

export default function GroupsRoutePage() {
    return (
        <AuthGuard>
            <GroupsPage />
        </AuthGuard>
    );
}
