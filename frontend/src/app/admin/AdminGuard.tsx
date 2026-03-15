'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';

export function AdminGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, role, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }
        if (role !== 'admin') {
            router.replace(role === 'student' ? '/student' : '/courses');
        }
    }, [isAuthenticated, role, isLoading, router]);

    if (isLoading || !isAuthenticated || role !== 'admin') return null;

    return <>{children}</>;
}
