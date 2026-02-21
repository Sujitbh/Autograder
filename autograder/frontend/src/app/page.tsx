'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';

export default function Home() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        router.replace(isAuthenticated ? '/courses' : '/login');
    }, [isAuthenticated, router]);

    return null;
}
