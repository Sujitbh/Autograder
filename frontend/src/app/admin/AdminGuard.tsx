'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';

export function AdminGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }
        if (role !== 'admin') {
            router.replace(role === 'student' ? '/student' : '/courses');
        }
    }, [isAuthenticated, role, router]);

    if (!isAuthenticated || role !== 'admin') return null;

    return <>{children}</>;
}
