'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id?: string;
  matricNo?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  university?: string;
  college?: string;
  department?: string;
  role?: string;
  avatar?: string;
}

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load and parse user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        // Normalize name / firstName
        if (!parsed.firstName && parsed.name) {
          parsed.firstName = parsed.name.split(' ')[0];
        }
        if (!parsed.college) parsed.college = 'COLPHYS';
        if (!parsed.department) parsed.department = 'Computer Science';
        if (!parsed.university) parsed.university = 'FUNAAB';

        setUser(parsed);
      } else if (requireAuth) {
        // If not logged in, redirect to sign-in page
        router.replace('/signin');
      }
    } catch {
      if (requireAuth) router.replace('/signin');
    } finally {
      setLoading(false);
    }
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
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    sessionStorage.clear();
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
