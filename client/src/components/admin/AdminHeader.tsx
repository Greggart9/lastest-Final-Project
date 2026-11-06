'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Bell, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobile?: () => void;
  pendingCount?: number;
}

export default function AdminHeader({
  title,
  subtitle,
  onOpenMobile,
  pendingCount = 0,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-[#0b1329]/90 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {onOpenMobile && (
          <button
            onClick={onOpenMobile}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live sync pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium">Vault Sync Live</span>
        </div>

        {/* Pending submissions badge */}
        {pendingCount > 0 && (
          <Link
            href="/admin/submissions"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition-colors"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span>{pendingCount} Pending</span>
          </Link>
        )}

        {/* Link back to student dashboard */}
        <Link
          href="/dashboard"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          <span>Student View</span>
        </Link>
      </div>
    </header>
  );
}
