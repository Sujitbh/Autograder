'use client';

import { SignupPage } from '@/components/SignupPage';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FacultySignupPage() {
    const { isAuthenticated, role: currentRole, signup } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) return;
        if (currentRole === 'faculty') {
            router.replace('/courses');
            return;
        }
        if (currentRole === 'admin') {
            router.replace('/admin');
            return;
        }
        router.replace('/student');
    }, [isAuthenticated, currentRole, router]);

    return (
        <SignupPage
            role="faculty"
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
