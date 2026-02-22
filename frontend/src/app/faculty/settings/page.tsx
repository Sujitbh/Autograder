'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { AccountSettings } from '@/components/AccountSettings';

export default function FacultySettingsPage() {
    return (
        <AuthGuard>
            <AccountSettings />
        </AuthGuard>
    );
}
