'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminSignupRedirect() {
    const router = useRouter();
    useEffect(() => { router.replace('/signup'); }, [router]);
    return null;
}
