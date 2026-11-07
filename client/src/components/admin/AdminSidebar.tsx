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
  ChevronRight,
  LogOut,
  Building2,
  X,
  FileText,
  UploadCloud,
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

  // Navigation items without distracting tags/badges
  const navItems = [
    {
      name: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Submissions Review',
      href: '/admin/submissions',
      icon: FileCheck2,
    },
    {
      name: 'Academic Structure',
      href: '/admin/academic',
      icon: FolderTree,
    },
    {
      name: 'Upload Material',
      href: '/admin/upload',
      icon: UploadCloud,
    },
    {
      name: 'User Directory',
      href: '/admin/users',
      icon: Users,
    },
  ];

  const handleSignOut = () => {
    clearAuthSession();
    window.location.href = '/signin';
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white text-slate-700 border-r border-slate-200/90 shadow-xs">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-200/90 flex items-center justify-between">
        <Link href="/admin" className="flex flex-col">
          <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight">EduCollab</span>
          <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">Admin</span>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* University Active Scope Banner */}
      <div className="px-4 py-3 mx-4 my-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
        <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target University</p>
          <p className="text-xs font-bold text-slate-900 truncate">FUNAAB (Abeokuta)</p>
        </div>
      </div>

      {/* Navigation Links (Clean: Names only, no tags) */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Management
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
                if (item.href === '/admin/academic') {
                  window.dispatchEvent(new CustomEvent('reset-academic-view'));
                }
              }}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              <ChevronRight
                className={`h-3.5 w-3.5 transition-transform ${
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:translate-x-0.5'
                }`}
              />
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Student Portal
        </div>
        <Link
          href="/dashboard"
          className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
            <span>Student Dashboard</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href="/upload"
          className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
            <span>Student Upload Desk</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Footer / User status */}
      <div className="p-4 border-t border-slate-200/90 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center font-extrabold text-xs text-blue-700">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">Academic Admin</p>
              <p className="text-[11px] text-slate-500 truncate">admin@funaab.edu.ng</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
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
