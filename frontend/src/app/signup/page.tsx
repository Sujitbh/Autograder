'use client';

import { SignupPage } from '@/components/SignupPage';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Signup() {
    const { isAuthenticated, signup } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) router.replace('/courses');
    }, [isAuthenticated, router]);

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
        router.push('/courses');
    }} />;
}
