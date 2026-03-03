'use client';

import { SignupPage } from '@/components/SignupPage';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Signup() {
    const { isAuthenticated, user, login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) return;
        const redirectPath = user?.role === 'student' ? '/student' : '/courses';
        router.replace(redirectPath);
    }, [isAuthenticated, user, router]);

    return <SignupPage onSignup={(userData, token) => {
        login(userData, token);
    }} />;
}
