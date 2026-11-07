'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Bell,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Check,
  X,
  CheckCheck,
  Layers,
} from 'lucide-react';

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [clearedNotifications, setClearedNotifications] = useState(false);

  const activeAlertsCount = clearedNotifications ? 0 : pendingCount;

  const handleClearNotifications = () => {
    setClearedNotifications(true);
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {onOpenMobile && (
          <button
            onClick={onOpenMobile}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live sync pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold">Vault Sync Live</span>
        </div>

        {/* Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {activeAlertsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {activeAlertsCount}
                    </span>
                  )}
                </div>

                {activeAlertsCount > 0 && (
                  <button
                    onClick={handleClearNotifications}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              <div className="py-3 space-y-2.5 max-h-60 overflow-y-auto">
                {activeAlertsCount > 0 ? (
                  <Link
                    href="/admin/submissions"
                    onClick={() => setShowNotifications(false)}
                    className="block p-3 rounded-xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200/80 transition-colors"
                  >
                    <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                      <span>{pendingCount} Pending Submissions</span>
                    </p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      New student study materials are waiting in the verification queue.
                    </p>
                  </Link>
                ) : (
                  <div className="py-6 text-center text-slate-400">
                    <Check className="h-7 w-7 text-emerald-500 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-slate-600">All notifications cleared</p>
                    <p className="text-[10px] text-slate-400">No unread alerts in your inbox.</p>
                  </div>
                )}
              </div>

              {activeAlertsCount > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={handleClearNotifications}
                    className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Mark All as Read & Clear
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Link back to student dashboard */}
        <Link
          href="/dashboard"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
          <span>Student View</span>
        </Link>
      </div>
    </header>
  );
}
