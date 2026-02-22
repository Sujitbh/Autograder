'use client';

import { LoginPage } from '@/components/LoginPage';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

/** Return the dashboard path for a given role. */
function dashboardForRole(role: string): string {
    switch (role) {
        case 'student': return '/student';
        case 'admin': return '/admin';
        case 'faculty':
        default: return '/courses';
    }
}

function LoginContent() {
    const { isAuthenticated, role, login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && role) router.replace(dashboardForRole(role));
    }, [isAuthenticated, role, router]);

    return <LoginPage onLogin={(userData, token) => {
        // authService already stored the JWT in localStorage.
        // Now persist user info in AuthContext so the app knows who is logged in.
        login({
            id: userData.id,
            firstName: userData.name?.split(' ')[0] ?? '',
            lastName: userData.name?.split(' ').slice(1).join(' ') ?? '',
            email: userData.email,
            role: userData.role as any,
        }, token);
        router.push(dashboardForRole(userData.role));
    }} />;
}

export default function Login() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
