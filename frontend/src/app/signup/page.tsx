'use client';

import { SignupPage } from '@/components/SignupPage';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

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

function SignupInner() {
    const { isAuthenticated, role: currentRole, signup } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && currentRole) {
            router.replace(dashboardForRole(currentRole));
        }
    }, [isAuthenticated, currentRole, router]);

    return <SignupPage onSignup={() => {
        try {
            const stored = localStorage.getItem('autograde_current_user');
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
