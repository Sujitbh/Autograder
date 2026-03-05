'use client';

import { AuthGuard } from '@/app/AuthGuard';
import { CalendarPage } from '@/components/CalendarPage';

export default function FacultyCalendarPage() {
    return (
        <AuthGuard>
            <CalendarPage />
        </AuthGuard>
    );
}
