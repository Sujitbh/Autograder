'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';

/** Wraps any page that requires authentication. Redirects to /login if not authenticated. */
export function AuthGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, role } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }

        // Minimum UI-level role routing split:
        // - students stay in /student space
        // - faculty/admin stay in /courses or /faculty space
        if (role === 'student' && pathname?.startsWith('/courses')) {
            router.replace('/student');
            return;
        }
        if ((role === 'faculty' || role === 'admin') && pathname?.startsWith('/student')) {
            router.replace('/courses');
        }
    }, [isAuthenticated, role, pathname, router]);

    if (!isAuthenticated) return null;

    return <>{children}</>;
}
