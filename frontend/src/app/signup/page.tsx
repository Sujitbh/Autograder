'use client';

import { SignupPage } from '@/components/SignupPage';
import { useAuth } from '@/utils/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

type SignupRole = 'student' | 'faculty' | 'admin';

function dashboardForRole(role: string): string {
    switch (role) {
        case 'student':
            return '/student';
        case 'admin':
            return '/admin';
        case 'faculty':
        default:
            return '/courses';
    }
}

function roleFromQuery(value: string | null): SignupRole {
    if (value === 'admin') return 'admin';
    return value === 'faculty' ? 'faculty' : 'student';
}

function SignupInner() {
    const { isAuthenticated, role: currentRole, signup } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const role = roleFromQuery(searchParams.get('role'));

    useEffect(() => {
        if (isAuthenticated) router.replace(dashboardForRole(currentRole ?? role));
    }, [isAuthenticated, currentRole, role, router]);

    return <SignupPage role={role} onSignup={() => {
        try {
            const stored = sessionStorage.getItem('autograde_current_user');
            if (stored) {
                const userData = JSON.parse(stored);
                signup(userData);
            } else {
                signup();
            }
        } catch {
            signup();
        }
    }} />;
}

export default function Signup() {
    return (
        <Suspense fallback={null}>
            <SignupInner />
        </Suspense>
    );
}
