'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiGetProfile, getAuthToken, clearAuthSession } from '@/lib/api';

export interface UserProfile {
  id?: string;
  matricNo?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  university?: string;
  academicTerm?: 'college' | 'faculty';
  college?: string;
  department?: string;
  role?: string;
  avatar?: string;
}

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Authenticate user directly against live database via API
  useEffect(() => {
    let isCancelled = false;

    async function verifyUser() {
      const token = getAuthToken();

      if (!token) {
        if (!isCancelled) {
          setUser(null);
          setLoading(false);
          if (requireAuth) router.replace('/signin');
        }
        return;
      }

      try {
        const data = await apiGetProfile();
        if (!isCancelled && data?.user) {
          const liveUser = data.user;
          if (!liveUser.firstName && liveUser.name) {
            liveUser.firstName = liveUser.name.split(' ')[0];
          }
          if (!liveUser.college) liveUser.college = 'COLPHYS';
          if (!liveUser.department) liveUser.department = 'Computer Science';
          if (!liveUser.university) liveUser.university = 'FUNAAB';

          setUser(liveUser);
          localStorage.setItem('auth_user', JSON.stringify(liveUser));
        } else if (!isCancelled && requireAuth) {
          clearAuthSession();
          setUser(null);
          router.replace('/signin');
        }
      } catch {
        if (!isCancelled) {
          // Fall back to cached user only if network is offline, else redirect if strictly required
          const stored = localStorage.getItem('auth_user');
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch {
              if (requireAuth) {
                clearAuthSession();
                router.replace('/signin');
              }
            }
          } else if (requireAuth) {
            clearAuthSession();
            router.replace('/signin');
          }
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    verifyUser();

    return () => {
      isCancelled = true;
    };
  }, [requireAuth, router]);

  // Update profile in localStorage and state
  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...updates };
      localStorage.setItem('auth_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
    router.replace('/signin');
  }, [router]);

  return {
    user,
    loading,
    updateUser,
    logout,
    isAuthenticated: !!user,
  };
}
