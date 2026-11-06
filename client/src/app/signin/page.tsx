'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '@/components/ui';
import { apiSignIn } from '@/lib/api';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // Connect to live secured backend
      const data = await apiSignIn(email, password);
      setSuccessMessage('Sign-in successful! Redirecting to dashboard...');
      setTimeout(() => router.push('/dashboard'), 700);
    } catch (err: any) {
      if (err.message && err.message.includes('Failed to fetch')) {
        // Offline demo fallback if backend server is not running
        localStorage.setItem(
          'auth_user',
          JSON.stringify({ email, name: email.split('@')[0], college: 'COLPHYS', department: 'Computer Science' })
        );
        setSuccessMessage('Offline demo sign-in successful! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 700);
      } else {
        setErrorMessage(err.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-primary-subtle selection:text-primary-active">
      {/* Left side branding / visual panel */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-950 overflow-hidden">
        {/* Modern dark mesh gradient pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415518_1px,transparent_1px),linear-gradient(to_bottom,#33415518_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative h-full flex flex-col justify-between p-12 text-white z-10">
          <Link href="/" className="inline-block">
            <BrandLogo className="h-10 w-10" showText={true} textClassName="text-2xl font-bold tracking-tight text-white" />
          </Link>
          <div className="space-y-4 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary-subtle text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-primary-accent" />
              <span>FUNAAB Academic Network</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Welcome Back to EduCollab
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Access your department lecture notes, past questions, and collaborative study groups with zero hassle.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Unrestricted Level Access
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified Course Rep Notes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 bg-surface-bg">
        <div className="max-w-md w-full space-y-6">
          <div>
            <Link href="/" className="lg:hidden inline-block mb-4">
              <BrandLogo className="h-9 w-9" showText={true} />
            </Link>
            <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
              Sign In
            </h1>
            <p className="text-sm text-text-muted mt-1.5">
              Enter your student or lecturer credentials to access your course repository.
            </p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs sm:text-sm font-medium"
            >
              {errorMessage}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="e.g. student@funaab.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 text-text-main placeholder-text-placeholder transition text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                  Password
                </label>
                <Link href="/updatepw" className="text-xs text-primary hover:underline font-semibold">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 text-text-main placeholder-text-placeholder transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <p className="text-center text-sm text-text-muted pt-2">
            Don't have an account yet?{' '}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
