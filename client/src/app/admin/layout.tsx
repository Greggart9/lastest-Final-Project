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
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500 selection:text-slate-950">
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
          subtitle="FUNAAB Academic Vault Control Center"
          pendingCount={pendingCount}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
