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

    return <LoginPage onLogin={(userData, token, rememberMe) => {
        login(userData, token, rememberMe);
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
