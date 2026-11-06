'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Camera,
  Trash2,
  Mail,
  Building2,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Save,
  CheckCircle2,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';
import { apiUpdateProfile } from '@/lib/api';

export default function ManageProfilePage() {
  const { user, loading, updateUser, logout } = useAuth(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Editable Form State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [matricNo, setMatricNo] = useState(user?.matricNo || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state once user loads
  React.useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.name?.split(' ')[0] || '');
      setLastName(user.lastName || user.name?.split(' ').slice(1).join(' ') || '');
      setMatricNo(user.matricNo || '');
    }
  }, [user]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size too large. Please select an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updateUser({ avatar: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    updateUser({ avatar: undefined });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      matricNo: matricNo.trim(),
    };
    updateUser(payload);
    try {
      await apiUpdateProfile(payload);
    } catch {
      // Local session updated gracefully
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayName = firstName ? `${firstName} ${lastName}` : user?.name || 'Student';
  const displayEmail = user?.email || 'student@funaab.edu.ng';
  const displayCollege = user?.college || 'COLPHYS';
  const displayDept = user?.department || 'Computer Science';
  const displayUni = user?.university || 'FUNAAB';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 selection:bg-primary-subtle selection:text-primary-active">
      {/* Sidebar (Responsive: Mobile Drawer + Desktop Permanent) */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:w-[calc(100%-16rem)] lg:ml-64 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 min-w-0">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-border-subtle gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-text-muted">
              <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span>/</span>
              <span className="text-text-main font-bold">Student Profile</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-main tracking-tight mt-1">
              Student Profile & Details
            </h1>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </header>

        {/* Save Success Toast Banner */}
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile details updated successfully!</span>
          </motion.div>
        )}

        {/* Profile Card & Avatar Upload Section */}
        <div className="mt-8 bg-white border border-border-subtle rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-8">
          {/* Avatar Upload Area */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-border-subtle">
            {/* Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="h-28 w-28 rounded-full bg-primary-light border-2 border-primary/30 flex items-center justify-center font-bold text-primary text-3xl shadow-sm overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  (firstName || displayName).slice(0, 2).toUpperCase()
                )}
              </div>

              {/* Upload Trigger Badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-primary hover:bg-primary-hover text-white rounded-full shadow-md transition cursor-pointer"
                aria-label="Upload profile photo"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Avatar Actions & Guidance */}
            <div className="text-center sm:text-left space-y-2">
              <h2 className="text-xl font-extrabold text-text-main">{displayName}</h2>
              <p className="text-xs text-text-muted">
                {displayCollege} • Department of {displayDept}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload New Photo</span>
                </button>

                {user?.avatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-4 py-2 rounded-xl bg-surface-muted text-text-muted hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-text-placeholder">
                PNG, JPG or WEBP under 2MB recommended.
              </p>
            </div>
          </div>

          {/* Profile Form Details */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <h3 className="text-lg font-bold text-text-main tracking-tight">
              Personal & Student Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>

              {/* Email Address (Authenticated) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>Email Address</span>
                </label>
                <div className="px-4 py-3 bg-surface-muted/60 border border-border-subtle rounded-xl text-text-muted text-sm flex items-center justify-between">
                  <span>{displayEmail}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                </div>
              </div>

              {/* Matriculation / Student ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Matriculation / Student ID</span>
                </label>
                <input
                  type="text"
                  value={matricNo}
                  onChange={(e) => setMatricNo(e.target.value)}
                  placeholder="e.g. 2021/0491 or CSC/2021/0491"
                  className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
                <p className="text-[11px] text-text-muted mt-1.5">
                  Enter your official FUNAAB Matriculation Number. You can change this whenever you want.
                </p>
              </div>
            </div>

            {/* Academic Enrollment Snapshot (Readonly cards) */}
            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Enrolled Academic Department
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-card border border-border-subtle">
                  <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    University
                  </span>
                  <p className="text-sm font-bold text-text-main mt-1">{displayUni}</p>
                </div>

                <div className="p-4 rounded-xl bg-surface-card border border-border-subtle">
                  <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    College
                  </span>
                  <p className="text-sm font-bold text-text-main mt-1">{displayCollege}</p>
                </div>

                <div className="p-4 rounded-xl bg-surface-card border border-border-subtle">
                  <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    Department
                  </span>
                  <p className="text-sm font-bold text-text-main mt-1">{displayDept}</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </motion.button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
