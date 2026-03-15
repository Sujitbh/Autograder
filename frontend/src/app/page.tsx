'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';

function dashboardForRole(role: string): string {
    switch (role) {
        case 'student': return '/student';
        case 'admin': return '/admin';
        case 'faculty':
        default: return '/courses';
    }
}

export default function Home() {
    const { isAuthenticated, role, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (isAuthenticated && role) {
            router.replace(dashboardForRole(role));
        } else {
            router.replace('/login');
        }
    }, [isAuthenticated, role, isLoading, router]);

    return null;
}
