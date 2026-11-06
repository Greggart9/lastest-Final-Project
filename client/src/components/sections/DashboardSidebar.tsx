'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  User,
  Settings,
  LogOut,
  UploadCloud,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const navItems = [
    {
      label: 'My Department',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      active:
        pathname === '/dashboard' ||
        pathname === '/level' ||
        pathname === '/fourhundred' ||
        pathname === '/formalmethod',
    },
    {
      label: 'Colleges',
      href: '/colleges',
      icon: <GraduationCap className="w-5 h-5" />,
      active:
        pathname.startsWith('/colleges') ||
        pathname === '/collegeboard' ||
        pathname === '/colphysdept',
    },
    {
      label: 'Upload Material',
      href: '/upload',
      icon: <UploadCloud className="w-5 h-5" />,
      active: pathname === '/upload',
    },
    {
      label: 'Profile',
      href: '/manageprofile',
      icon: <User className="w-5 h-5" />,
      active: pathname === '/manageprofile',
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: <Settings className="w-5 h-5" />,
      active: pathname === '/settings' || pathname === '/updatepw',
    },
  ];

  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'Student';
  const displayDept = user?.department || 'Computer Science';
  const displayCollege = user?.college || 'COLPHYS';

  return (
    <>
      {/* ======================================================== */}
      {/* 1. MOBILE & TABLET STICKY TOP HEADER (< 1024px)          */}
      {/* ======================================================== */}
      <header className="lg:hidden sticky top-0 left-0 right-0 w-full h-16 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between shadow-lg select-none shrink-0">
        {/* Left: Hamburger Button & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 active:scale-95 transition-all cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex items-center">
            <BrandLogo
              className="h-7 w-7"
              showText={true}
              textClassName="text-lg font-bold text-white tracking-tight"
            />
          </Link>
        </div>

        {/* Right: Quick Campus Badge & Profile Avatar */}
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
            {displayCollege} • {displayDept.slice(0, 15)}
          </span>

          <Link
            href="/manageprofile"
            className="h-9 w-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs shadow-xs hover:scale-105 transition overflow-hidden"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              displayName.slice(0, 2).toUpperCase()
            )}
          </Link>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MOBILE DRAWER (SLIDE-OUT WITH BACKDROP OVERLAY)        */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sliding Drawer Container */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 z-50 flex flex-col justify-between p-5 text-white lg:hidden shadow-2xl select-none"
            >
              <div className="flex flex-col w-full">
                {/* Header: Logo & Close Button */}
                <div className="flex items-center justify-between mb-6 px-1">
                  <Link
                    href="/"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center"
                  >
                    <BrandLogo
                      className="h-7 w-7"
                      showText={true}
                      textClassName="text-lg font-bold text-white tracking-tight"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 active:scale-95 transition cursor-pointer"
                    aria-label="Close navigation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Campus Student Badge */}
                <div className="mb-6 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-2xs">
                  <img
                    src="/Images/funaab.png"
                    alt="FUNAAB logo"
                    className="h-5 w-auto object-contain shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-white truncate">FUNAAB Campus</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {displayCollege} • {displayDept}
                    </p>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="w-full space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl cursor-pointer transition-all text-sm font-semibold ${
                        item.active
                          ? 'bg-primary text-white font-bold shadow-md shadow-primary/25'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className={item.active ? 'text-white' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          item.active ? 'text-white translate-x-0.5' : 'text-slate-600'
                        }`}
                      />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Drawer Bottom: User Profile & Logout */}
              <div className="w-full pt-4 border-t border-slate-800 space-y-3">
                <Link
                  href="/manageprofile"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-900 transition-colors cursor-pointer group"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      displayName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="overflow-hidden flex-1 text-left">
                    <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{displayDept}</p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 rounded-2xl cursor-pointer hover:bg-red-500/15 text-slate-400 hover:text-red-400 transition-all text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 3. DESKTOP PERMANENT SIDEBAR (>= 1024px)                 */}
      {/* ======================================================== */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-slate-950 border-r border-slate-800/80 p-5 text-white flex-col justify-between select-none z-20 shadow-xl">
        <div className="flex flex-col w-full">
          {/* Unified Brand Logo */}
          <Link href="/" className="mb-6 px-2 flex items-center">
            <BrandLogo
              className="h-8 w-8"
              showText={true}
              textClassName="text-xl font-bold text-white tracking-tight"
            />
          </Link>

          {/* FUNAAB Campus Badge */}
          <div className="mb-6 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-2xs">
            <img
              src="/Images/funaab.png"
              alt="FUNAAB logo"
              className="h-4 w-auto object-contain shrink-0"
            />
            <div className="overflow-hidden">
              <p className="font-semibold text-white truncate">FUNAAB Campus</p>
              <p className="text-[10px] text-slate-400 truncate">
                {displayCollege} • {displayDept}
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="w-full space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-medium ${
                  item.active
                    ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className={item.active ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Profile Preview & Logout */}
        <div className="w-full pt-4 border-t border-slate-800/80 space-y-3">
          {/* User Mini Card */}
          <Link
            href="/manageprofile"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                displayName.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="overflow-hidden flex-1 text-left">
              <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{displayDept}</p>
            </div>
          </Link>

          {/* Working Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-500/15 text-slate-400 hover:text-red-400 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
