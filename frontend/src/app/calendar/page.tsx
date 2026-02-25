'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { CalendarPage } from '@/components/CalendarPage';

export default function CalendarRoutePage() {
    return (
        <AuthGuard>
            <CalendarPage />
        </AuthGuard>
    );
}
