'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/utils/AuthContext';
import ModernTechLanding from '@/components/landing/ModernTechLanding';

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

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: 'var(--landing-bg)' }}
      >
        <Loader2
          className="h-9 w-9 animate-spin"
          style={{ color: 'var(--landing-primary)' }}
          aria-hidden
        />
        <span className="text-sm" style={{ color: 'var(--landing-muted)' }}>
          Loading…
        </span>
      </div>
    );
  }

  if (isAuthenticated && role) {
    return null;
  }

  return <ModernTechLanding />;
}
