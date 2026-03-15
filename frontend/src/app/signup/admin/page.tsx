'use client';

import { SignupPage } from '@/components/SignupPage';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminSignupPage() {
    const { isAuthenticated, role: currentRole, signup } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) return;
        if (currentRole === 'admin') {
            router.replace('/admin');
            return;
        }
        if (currentRole === 'student') {
            router.replace('/student');
            return;
        }
        router.replace('/courses');
    }, [isAuthenticated, currentRole, router]);

    return (
        <SignupPage
            role="admin"
            onSignup={() => {
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
            }}
        />
    );
}
