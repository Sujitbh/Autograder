'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/utils/AuthContext';
import ModernTechLanding from '@/components/landing/ModernTechLanding';

function dashboardForRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'student':
    case 'faculty':
    default:
      return '/dashboard';
  }
}

export default function Home() {
  const { isAuthenticated, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated && role) {
      router.replace(dashboardForRole(role));
    }
  }, [isAuthenticated, role, isLoading, router]);

  if (isAuthenticated && role) {
    return null;
  }

  return <ModernTechLanding />;
}
