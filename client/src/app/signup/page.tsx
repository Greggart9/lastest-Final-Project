'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  Sparkles,
  Building2,
  GraduationCap,
  BookOpen,
  LogIn,
  ChevronDown,
} from 'lucide-react';
import { z } from 'zod';
import { BrandLogo } from '@/components/ui';
import Navbar from '@/components/sections/Navbar';
import { STARTER_COLLEGES, College } from '@/data/funaabStructure';
import { apiSignUp, apiGetUniversities } from '@/lib/api';


// Zod Sign-Up Validation Schema

const signUpStepOneSchema = z
  .object({
    firstName: z
      .string().trim().min(2, 'First name must be at least 2 characters long'),
    lastName: z
      .string().trim().min(2, 'Last name must be at least 2 characters long'),
    email: z
      .string().trim().email('Please enter a valid email address')
      .toLowerCase(),
    password: z
      .string().min(7, 'Password must be at least 7 characters long')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FieldErrors = Partial<Record<'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword', string>>;

export default function SignUpPage() {
  const router = useRouter();

  // Multi-step state: 1 = Basic Info, 2 = Academic Profile, 3 = Success confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: User Credentials
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: Academic Details (Dynamic Institutions & Divisions)
  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedUniId, setSelectedUniId] = useState<string>('');
  const [selectedCollegeCode, setSelectedCollegeCode] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  // Load universities from live database
  useEffect(() => {
    async function loadUniversities() {
      try {
        const data = await apiGetUniversities();
        const list = data.universities || [];
        if (list.length > 0) {
          setUniversities(list);
          const initialUni = list[0];
          setSelectedUniId(initialUni.id || initialUni.code);
          const initialDivisions = initialUni.colleges || [];
          if (initialDivisions.length > 0) {
            const firstDiv = initialDivisions[0];
            setSelectedCollegeCode(firstDiv.code || firstDiv.id);
            if (firstDiv.departments && firstDiv.departments.length > 0) {
              setSelectedDepartment(firstDiv.departments[0].name);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load universities:', err);
      }
    }
    loadUniversities();
  }, []);

  // Form Status
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  // Resolved active University
  const currentUni =
    universities.find(
      (u) =>
        u.id?.toLowerCase() === selectedUniId.toLowerCase() ||
        u.code?.toLowerCase() === selectedUniId.toLowerCase()
    ) || null;

  const isFaculty = currentUni?.academicTerm === 'faculty';
  const termSingular = isFaculty ? 'Faculty' : 'College';
  const termPlural = isFaculty ? 'Faculties' : 'Colleges';

  // Resolved Divisions for active University
  const currentColleges: any[] =
    currentUni?.colleges && currentUni.colleges.length > 0
      ? currentUni.colleges
      : currentUni?.code === 'FUNAAB'
      ? STARTER_COLLEGES
      : [];

  const currentCollege =
    currentColleges.find(
      (c: any) =>
        (c.code && c.code.toLowerCase() === selectedCollegeCode.toLowerCase()) ||
        (c.id && c.id.toLowerCase() === selectedCollegeCode.toLowerCase())
    ) || currentColleges[0] || null;

  const departmentsForCollege = currentCollege?.departments || [];

  const handleUniChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUniId = e.target.value;
    setSelectedUniId(newUniId);
    const matchedUni = universities.find(
      (u) =>
        u.id?.toLowerCase() === newUniId.toLowerCase() ||
        u.code?.toLowerCase() === newUniId.toLowerCase()
    );
    const matchedDivisions = matchedUni?.colleges || [];
    if (matchedDivisions.length > 0) {
      const firstDiv = matchedDivisions[0];
      setSelectedCollegeCode(firstDiv.code || firstDiv.id);
      if (firstDiv.departments && firstDiv.departments.length > 0) {
        setSelectedDepartment(firstDiv.departments[0].name);
      } else {
        setSelectedDepartment('');
      }
    } else {
      setSelectedCollegeCode('');
      setSelectedDepartment('');
    }
  };

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setSelectedCollegeCode(newCode);
    const matched = currentColleges.find(
      (c: any) =>
        (c.code && c.code.toLowerCase() === newCode.toLowerCase()) ||
        (c.id && c.id.toLowerCase() === newCode.toLowerCase())
    );
    if (matched && matched.departments && matched.departments.length > 0) {
      setSelectedDepartment(matched.departments[0].name);
    } else {
      setSelectedDepartment('');
    }
  };

  // Real-Time Password Strength Calculation

  const passwordStrength = useMemo(() => {
    if (!password) {
      return { score: 0, label: '', color: 'bg-surface-muted', hint: '' };
    }
    const hasMinLen = password.length >= 7;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);

    if (!hasMinLen || (!hasLetters && !hasNumbers)) {
      return {
        score: 1,
        label: 'Weak',
        color: 'bg-red-500',
        hint: 'Needs at least 7 characters and alphanumeric characters (letters + numbers).',
      };
    }

    if (hasMinLen && (!hasLetters || !hasNumbers)) {
      return {
        score: 1,
        label: 'Weak',
        color: 'bg-red-500',
        hint: 'Add numbers or letters to make it alphanumeric.',
      };
    }

    if (hasMinLen && hasLetters && hasNumbers && !hasSymbols) {
      return {
        score: 2,
        label: 'Medium',
        color: 'bg-amber-500',
        hint: 'Good alphanumeric mix. Add a special symbol (!@#$) to make it Strong.',
      };
    }

    return {
      score: 3,
      label: 'Strong',
      color: 'bg-emerald-500',
      hint: 'Great password! Contains letters, numbers, and symbols.',
    };
  }, [password]);

  // Real-Time Confirm Password Match Status

  const matchStatus = useMemo(() => {
    if (!confirmPassword) return null;
    if (confirmPassword === password) {
      return { matches: true, message: 'Passwords match' };
    }
    return { matches: false, message: 'Passwords do not match' };
  }, [password, confirmPassword]);

  // Step 1 Validation & Proceed to Step 2

  const handleProceedToStepTwo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    const result = signUpStepOneSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const formattedErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FieldErrors;
        if (fieldName && !formattedErrors[fieldName]) {
          formattedErrors[fieldName] = issue.message;
        }
      });
      setFieldErrors(formattedErrors);
      setGeneralError('Please fix the errors below to continue.');
      return;
    }

    // Move smoothly to Step 2
    setStep(2);
  };

  // Step 2 Final Submission (NO OTP REQUIRED)

  const handleFinalSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError('');

    const uniCode = currentUni?.code || universities[0]?.code || '';
    const divisionVal = selectedCollegeCode || currentCollege?.code || currentCollege?.name || '';

    try {
      // Connect to live secured backend
      await apiSignUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        university: uniCode,
        college: divisionVal,
        department: selectedDepartment,
      });

      // Direct transition to Success state (No OTP)
      setStep(3);
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-subtle selection:text-primary-active">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT SIDE: Fixed Branding & Feature Showcase Panel */}
        <div className="hidden lg:block lg:w-1/2 relative bg-slate-950 overflow-hidden min-h-[calc(100vh-5rem)]">
          <img
            src="/Images/img10.png"
            alt="EduCollab Sign up"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-12 text-white">
            <div className="space-y-4 max-w-md">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Start Your Semester with Verified Study Notes
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Join thousands of undergraduates across accredited universities and departments. Share verified lecture notes, archived past questions, and excel in your exams.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Vetted Course Outlines
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  No Level Restrictions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Multi-Step Form with Transitions */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 bg-surface-bg">
          <div className="max-w-md w-full space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: Student Credentials (First Name, Last Name, Email, Password) */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
                      Create Your Account
                    </h1>
                    <p className="text-sm text-text-muted mt-1.5">
                      Enter your basic student credentials to get started.
                    </p>

                  {/* Stepper Progress */}
                  <div className="mt-5">
                    <div className="flex gap-2">
                      <div className="h-1.5 flex-1 bg-primary rounded-full" />
                      <div className="h-1.5 flex-1 bg-surface-muted rounded-full" />
                    </div>
                    <p className="text-xs text-text-muted font-semibold text-right mt-1.5">
                      Step 1 of 2: Basic Info
                    </p>
                  </div>
                </div>

                {generalError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{generalError}</span>
                  </motion.div>
                )}

                <form onSubmit={handleProceedToStepTwo} className="space-y-4">
                  {/* FIRST NAME & LAST NAME (ON THE SAME LINE) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* First Name */}
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        placeholder="e.g. John"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (fieldErrors.firstName) setFieldErrors({ ...fieldErrors, firstName: '' });
                        }}
                        className={`w-full px-4 py-3 bg-surface-card border rounded-xl focus:outline-none focus:ring-3 text-text-main placeholder-text-placeholder transition text-sm ${
                          fieldErrors.firstName
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                            : 'border-border-subtle focus:border-primary focus:ring-primary/10'
                        }`}
                      />
                      {fieldErrors.firstName && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{fieldErrors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        placeholder="e.g. Doe"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          if (fieldErrors.lastName) setFieldErrors({ ...fieldErrors, lastName: '' });
                        }}
                        className={`w-full px-4 py-3 bg-surface-card border rounded-xl focus:outline-none focus:ring-3 text-text-main placeholder-text-placeholder transition text-sm ${
                          fieldErrors.lastName
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                            : 'border-border-subtle focus:border-primary focus:ring-primary/10'
                        }`}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. student@university.edu.ng"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                      }}
                      className={`w-full px-4 py-3 bg-surface-card border rounded-xl focus:outline-none focus:ring-3 text-text-main placeholder-text-placeholder transition text-sm ${
                        fieldErrors.email
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                          : 'border-border-subtle focus:border-primary focus:ring-primary/10'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                        Password (Min 7 chars, alphanumeric)
                      </label>
                      {passwordStrength.label && (
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            passwordStrength.score === 1
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : passwordStrength.score === 2
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 7 chars, e.g. Pass123!"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                        }}
                        className={`w-full px-4 py-3 pr-12 bg-surface-card border rounded-xl focus:outline-none focus:ring-3 text-text-main placeholder-text-placeholder transition text-sm ${
                          fieldErrors.password
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                            : 'border-border-subtle focus:border-primary focus:ring-primary/10'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-primary transition cursor-pointer rounded-lg hover:bg-surface-muted"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Dynamic Password Strength Visual Meter */}
                    {password && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex gap-1.5 h-1.5 w-full">
                          <div
                            className={`h-full flex-1 rounded-full transition-all duration-300 ${
                              passwordStrength.score >= 1 ? passwordStrength.color : 'bg-surface-muted'
                            }`}
                          />
                          <div
                            className={`h-full flex-1 rounded-full transition-all duration-300 ${
                              passwordStrength.score >= 2 ? passwordStrength.color : 'bg-surface-muted'
                            }`}
                          />
                          <div
                            className={`h-full flex-1 rounded-full transition-all duration-300 ${
                              passwordStrength.score >= 3 ? passwordStrength.color : 'bg-surface-muted'
                            }`}
                          />
                        </div>
                        <p className="text-[11px] text-text-muted flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span>{passwordStrength.hint}</span>
                        </p>
                      </div>
                    )}

                    {fieldErrors.password && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">{fieldErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                        }}
                        className={`w-full px-4 py-3 pr-12 bg-surface-card border rounded-xl focus:outline-none focus:ring-3 text-text-main placeholder-text-placeholder transition text-sm ${
                          matchStatus && !matchStatus.matches
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                            : matchStatus && matchStatus.matches
                            ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100'
                            : 'border-border-subtle focus:border-primary focus:ring-primary/10'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-primary transition cursor-pointer rounded-lg hover:bg-surface-muted"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Live Match Notification */}
                    <AnimatePresence>
                      {matchStatus && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="mt-1.5 flex items-center gap-1.5"
                        >
                          {matchStatus.matches ? (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              <span>Passwords match</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
                              <X className="w-3.5 h-3.5 text-red-500 stroke-[3]" />
                              <span>Password does not match</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {fieldErrors.confirmPassword && !matchStatus && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit Action */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Continue to Academic Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>

                <p className="text-center text-sm text-text-muted pt-2">
                  Already have an account?{' '}
                  <Link href="/signin" className="text-primary font-bold hover:underline">
                    Sign In
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ---------------------------------------------------------------
                STEP 2: Academic Profile (University, Division, Cascading Department)
            ---------------------------------------------------------------- */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <div className="mb-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Step 1</span>
                    </button>
                  </div>

                  <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
                    Academic Profile
                  </h1>
                  <p className="text-sm text-text-muted mt-1.5">
                    {firstName ? `Welcome, ${firstName}! ` : ''}
                    Select your {termSingular.toLowerCase()} and department to configure your courses.
                  </p>

                  {/* Stepper Progress */}
                  <div className="mt-5">
                    <div className="flex gap-2">
                      <div className="h-1.5 flex-1 bg-primary rounded-full" />
                      <div className="h-1.5 flex-1 bg-primary rounded-full" />
                    </div>
                    <p className="text-xs text-primary font-bold text-right mt-1.5">
                      Step 2 of 2: Academic Details
                    </p>
                  </div>
                </div>

                <form onSubmit={handleFinalSignUp} className="space-y-4">
                  {/* Institution / University Selector */}
                  <div>
                    <label htmlFor="university" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                      <span>University / Institution</span>
                    </label>
                    <div className="relative group">
                      <select
                        id="university"
                        value={selectedUniId}
                        onChange={handleUniChange}
                        className="w-full appearance-none pl-4 pr-11 py-3.5 bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 text-text-main transition text-sm font-medium cursor-pointer hover:border-slate-300 shadow-2xs"
                        required
                      >
                        {universities.length > 0 ? (
                          universities.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.code})
                            </option>
                          ))
                        ) : (
                          <option value="">Select an institution...</option>
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted group-hover:text-primary transition-colors">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* College / Faculty Selector */}
                  <div>
                    <label htmlFor="college" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      <span>{termSingular}</span>
                    </label>
                    {currentColleges.length > 0 ? (
                      <div className="relative group">
                        <select
                          id="college"
                          value={selectedCollegeCode}
                          onChange={handleCollegeChange}
                          className="w-full appearance-none pl-4 pr-11 py-3.5 bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 text-text-main transition text-sm font-medium cursor-pointer hover:border-slate-300 shadow-2xs"
                          required
                        >
                          {currentColleges.map((col: any) => {
                            const val = col.code || col.id;
                            const label = col.fullName || col.name || col.code;
                            return (
                              <option key={val} value={val}>
                                {col.code ? `${col.code} — ` : ''}{label}
                              </option>
                            );
                          })}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted group-hover:text-primary transition-colors">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        No {termPlural.toLowerCase()} registered under {currentUni?.name || 'this institution'} yet.
                      </div>
                    )}
                  </div>

                  {/* Department (Cascades from chosen College/Faculty) */}
                  <div>
                    <label htmlFor="department" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      <span>Department</span>
                    </label>
                    {departmentsForCollege.length > 0 ? (
                      <div className="relative group">
                        <select
                          id="department"
                          value={selectedDepartment}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          className="w-full appearance-none pl-4 pr-11 py-3.5 bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 text-text-main transition text-sm font-medium cursor-pointer hover:border-slate-300 shadow-2xs"
                          required
                        >
                          {departmentsForCollege.map((dept: any) => (
                            <option key={dept.id || dept.code || dept.name} value={dept.name}>
                              {dept.name} {dept.code ? `(${dept.code})` : ''}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted group-hover:text-primary transition-colors">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                        {currentColleges.length > 0
                          ? 'No departments listed in this division yet.'
                          : 'Select an institution with registered divisions.'}
                      </div>
                    )}
                  </div>

                  {/* Full Access Note */}
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Full Curriculum Access:</strong> You will have unrestricted access across all study levels, past questions, and lecture materials for {selectedDepartment || 'your department'}.
                    </p>
                  </div>

                  {/* Final Submit Button (NO OTP) */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                  >
                    <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>

                <p className="text-center text-sm text-text-muted pt-2">
                  Already have an Account?{' '}
                  <Link href="/signin" className="text-primary font-bold hover:underline">
                    Sign In
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ---------------------------------------------------------------
                STEP 3: Sign Up Successful & Direct "Log In" Action
            ---------------------------------------------------------------- */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6 py-4"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-extrabold text-text-main tracking-tight">
                    Sign Up Successful!
                  </h2>
                  <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                    Welcome to EduCollab, <strong className="text-text-main">{firstName}</strong>! Your student account has been registered. You can now log in with your email.
                  </p>
                </div>

                {/* Account Summary Chip */}
                <div className="p-4 rounded-2xl bg-surface-card border border-border-subtle text-left space-y-2 text-xs">
                  <div className="flex justify-between text-text-muted">
                    <span>Student:</span>
                    <strong className="text-text-main">{firstName} {lastName}</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Email:</span>
                    <strong className="text-text-main">{email}</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>College:</span>
                    <strong className="text-text-main">{selectedCollegeCode}</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Department:</span>
                    <strong className="text-text-main">{selectedDepartment}</strong>
                  </div>
                </div>

                {/* Direct Log In Button */}
                <Link href="/signin" className="block pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold text-base rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Log In to EduCollab</span>
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </div>
  );
}
