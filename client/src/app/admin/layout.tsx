'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { apiGetAdminStats } from '@/lib/api';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await apiGetAdminStats();
        if (stats && typeof stats.pendingCount === 'number') {
          setPendingCount(stats.pendingCount);
        }
      } catch {
        // Fallback or unauthenticated
      }
    }
    loadStats();
    const interval = setInterval(loadStats, 15000); // 15s poll for live sync
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar */}
      <AdminSidebar
        pendingCount={pendingCount}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 min-h-screen">
        <AdminHeader
          title="Administrative Portal"
          subtitle="Academic Vault Control Center"
          pendingCount={pendingCount}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
