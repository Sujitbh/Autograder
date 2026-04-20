'use client';

import { LoginPage } from '@/components/LoginPage';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import type { UserRole } from '@/types';

/** Return the post-login home path for a given role. */
function homeForRole(role: UserRole): string {
    switch (role) {
        case 'admin': return '/admin';
        case 'student': return '/student';
        case 'faculty':
        default: return '/courses';
    }
}

function LoginContent() {
    const { isAuthenticated, role, login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && role) router.replace(homeForRole(role));
    }, [isAuthenticated, role, router]);

    return <LoginPage onLogin={(userData, token, rememberMe) => {
        login(userData, token, rememberMe);
        router.push(homeForRole(userData.role));
    }} />;
}

export default function Login() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
