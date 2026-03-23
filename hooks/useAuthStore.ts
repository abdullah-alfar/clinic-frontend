'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  _hasHydrated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      _hasHydrated: false,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'clinic-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
