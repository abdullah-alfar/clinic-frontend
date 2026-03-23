'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { getMe } from '@/lib/api/auth';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, user, setUser, logout } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login');
      return;
    }

    if (user) {
      setChecking(false);
      return;
    }

    // Token exists but no user yet — validate via /me
    getMe()
      .then((u) => {
        setUser(u);
        setChecking(false);
      })
      .catch(() => {
        logout();
        router.replace('/login');
      });
  }, [accessToken, user, router, setUser, logout]);

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
