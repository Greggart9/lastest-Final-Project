'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileCheck2,
  FolderTree,
  Users,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Building2,
  X,
  FileText,
} from 'lucide-react';
import { clearAuthSession } from '@/lib/api';

interface AdminSidebarProps {
  pendingCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  pendingCount = 0,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Overview & Analytics',
      href: '/admin',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Submissions Review',
      href: '/admin/submissions',
      icon: FileCheck2,
      badge: pendingCount > 0 ? `${pendingCount} pending` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      name: 'Academic Structure',
      href: '/admin/academic',
      icon: FolderTree,
      badge: null,
      sublabel: 'Universities & Colleges',
    },
    {
      name: 'Student & User Directory',
      href: '/admin/users',
      icon: Users,
      badge: null,
    },
  ];

  const handleSignOut = () => {
    clearAuthSession();
    window.location.href = '/signin';
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#0b1329] text-slate-200 border-r border-slate-800/80">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-6 w-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base">EduCollab</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-400">Institutional Governance</p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* University Active Scope Banner */}
      <div className="px-5 py-3 mx-4 my-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
        <Building2 className="h-4 w-4 text-emerald-400 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target University</p>
          <p className="text-xs font-semibold text-slate-100 truncate">FUNAAB (Abeokuta)</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Management
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <div className="text-left">
                  <div>{item.name}</div>
                  {item.sublabel && (
                    <div className="text-[10px] text-slate-400">{item.sublabel}</div>
                  )}
                </div>
              </div>
              {item.badge && (
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Student Portal
        </div>
        <Link
          href="/dashboard"
          className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-slate-200" />
            <span>Student Dashboard</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href="/upload"
          className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-slate-400 group-hover:text-slate-200" />
            <span>Student Upload Desk</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Footer / User status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Academic Admin</p>
              <p className="text-[11px] text-slate-400 truncate">admin@funaab.edu.ng</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
