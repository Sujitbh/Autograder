'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';

/** Wraps any page that requires authentication. Redirects to /login if not authenticated. */
export function AuthGuard({ children }: { children: ReactNode }) {
    const { isAuthenticated, role, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Wait for local session restoration on hard refresh before enforcing redirects.
        if (isLoading) {
            return;
        }

        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }

        // Minimum UI-level role routing split:
        // - students stay in /student or /ta space (TAs are students with TA enrollment)
        // - faculty/admin stay in /courses or /faculty space
        if (role === 'student' && pathname?.startsWith('/courses')) {
            router.replace('/student');
            return;
        }
        if ((role === 'faculty' || role === 'admin') && pathname?.startsWith('/student')) {
            router.replace(role === 'admin' ? '/admin' : '/courses');
            return;
        }
        if ((role === 'faculty' || role === 'admin') && pathname?.startsWith('/ta')) {
            router.replace(role === 'admin' ? '/admin' : '/courses');
            return;
        }
        if (role !== 'admin' && pathname?.startsWith('/admin')) {
            router.replace(role === 'student' ? '/student' : '/courses');
        }
    }, [isAuthenticated, role, isLoading, pathname, router]);

    if (isLoading || !isAuthenticated) return null;

    return <>{children}</>;
}
