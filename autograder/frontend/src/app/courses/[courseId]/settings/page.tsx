'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { SettingsPage } from '@/components/SettingsPage';

export default function CourseSettingsPage() {
    return (
        <AuthGuard>
            <SettingsPage />
        </AuthGuard>
    );
}
