'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Mail,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { BrandLogo } from '@/components/ui';
import { apiRequestPasswordOtp, apiResetPassword } from '@/lib/api';

export default function ResetPasswordPage() {
  const router = useRouter();

  // Steps: 'email' | 'otp' | 'success'
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');

  // Form State
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown countdown effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Request OTP Code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequestPasswordOtp(trimmed);
      if (data?.demoOtp) {
        setDemoCode(data.demoOtp);
      }
      setStep('otp');
      setResendCooldown(60);
      setSuccessMessage('A 6-digit verification code has been generated for your account.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    if (newPassword.length < 7) {
      setErrorMessage('Password must be at least 7 characters long.');
      return;
    }

    if (!/[0-9]/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
      setErrorMessage('Password must contain both letters and numbers.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    setLoading(true);
    try {
      await apiResetPassword(email.trim().toLowerCase(), otpCode.trim(), newPassword);
      setStep('success');
      setSuccessMessage('Password reset successfully! You can now log in.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-primary-subtle selection:text-primary-active">
      {/* Left side visual panel */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-950 overflow-hidden">
        <img
          src="/Images/img10.png"
          alt="Password reset background"
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-between p-12 text-white">
          <Link href="/" className="inline-block">
            <BrandLogo
              className="h-10 w-10"
              showText={true}
              textClassName="text-2xl font-bold tracking-tight text-white"
            />
          </Link>
          <div className="space-y-4 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary-subtle text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-primary-accent" />
              <span>Campus Security & Verification</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Account Access Recovery
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Verify your student or staff email with a one-time 6-digit security code to update your password securely.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Encrypted Credentials
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Instant Database Sync
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side interactive card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 bg-surface-bg">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div>
            <Link href="/" className="lg:hidden inline-block mb-4">
              <BrandLogo className="h-9 w-9" showText={true} />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight flex items-center gap-2.5">
              <KeyRound className="w-7 h-7 text-primary shrink-0" />
              <span>Reset Password</span>
            </h1>
            <p className="text-sm text-text-muted mt-1.5">
              {step === 'email' && 'Enter your account email to receive a 6-digit recovery code.'}
              {step === 'otp' && `Enter the 6-digit code sent for ${email} and choose a new password.`}
              {step === 'success' && 'Your credentials have been updated securely.'}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && step !== 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Demo OTP Banner (for local dev / sandbox environments) */}
          {demoCode && step === 'otp' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between"
            >
              <span className="font-medium">Verification Code:</span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-bold tracking-widest text-sm">
                {demoCode}
              </span>
            </motion.div>
          )}

          {/* STEP 1: Enter Email Form */}
          {step === 'email' && (
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleRequestOtp}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>Your Registered Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@funaab.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-medium placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Security Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* STEP 2: Enter OTP & New Password Form */}
          {step === 'otp' && (
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleResetPassword}
              className="space-y-4"
            >
              {/* 6-Digit OTP Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                    6-Digit Security Code
                  </label>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleRequestOtp}
                    className="text-xs text-primary font-bold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-center font-mono text-lg font-bold tracking-widest text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition shadow-2xs"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 7 characters with letters & numbers"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-medium placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-main transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>Confirm New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-medium placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-main transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Apply New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center bg-white border border-border-subtle rounded-2xl shadow-sm space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Password Reset Complete!</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Your new password has been verified and saved directly to the database. You can now log into your account.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/signin"
                  className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Bottom Footer Link */}
          {step !== 'success' && (
            <p className="text-center text-sm text-text-muted pt-2">
              Remember your password?{' '}
              <Link href="/signin" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
