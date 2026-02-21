'use client';

import { LoginPage } from '@/components/LoginPage';
import { useAuth } from '@/utils/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function LoginContent() {
    const { isAuthenticated, login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) router.replace('/courses');
    }, [isAuthenticated, router]);

    return <LoginPage onLogin={() => {
        // Read the user data that LoginPage saved to localStorage
        try {
            const stored = localStorage.getItem('autograde_current_user');
            if (stored) {
                const userData = JSON.parse(stored);
                login(userData);
            } else {
                login();
            }
        } catch {
            login();
        }
        router.push('/courses');
    }} />;
}

export default function Login() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
