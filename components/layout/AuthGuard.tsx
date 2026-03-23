'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { getMe } from '@/lib/api/auth';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, user, setUser, logout, _hasHydrated } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait until Zustand has hydrated from localStorage
    if (!_hasHydrated) return;

    if (!accessToken) {
      setChecking(false);
      router.replace('/login');
      return;
    }

    if (user) {
      setChecking(false);
      return;
    }

    // Token exists but no user yet — validate via /me
    setChecking(true);
    getMe()
      .then((u) => {
        setUser(u);
        setChecking(false);
      })
      .catch((err) => {
        // If it's a 403 (Forbidden), the token is valid but the user lacks permissions 
        // or is disabled. We shouldn't blindly logout if the token is still "good" 
        // for other things, but for AuthGuard specifically, if /me fails, we can't proceed.
        if (err.response?.status === 403) {
          console.error('Access forbidden:', err);
          // For now, redirect to login as well, but we could show a distinct error page.
          logout();
          router.replace('/login?error=forbidden');
        } else {
          logout();
          router.replace('/login');
        }
      });
  }, [accessToken, user, router, setUser, logout, _hasHydrated]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="space-y-3 w-48">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
