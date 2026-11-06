'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, ArrowRight } from 'lucide-react';
import { BrandLogo, RegisterModal } from '@/components/ui';

export default function RegisterUniPage() {
  const [universityName, setUniversityName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!universityName.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowModal(true);
    }, 500);
  };

  return (
    <>
      <div className="min-h-screen flex selection:bg-primary-subtle selection:text-primary-active">
        {/* Left side illustration */}
        <div className="hidden lg:block lg:w-1/2 relative bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415518_1px,transparent_1px),linear-gradient(to_bottom,#33415518_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          <div className="relative h-full flex flex-col justify-between p-12 text-white z-10">
            <Link href="/" className="inline-block">
              <BrandLogo className="h-10 w-10" showText={true} textClassName="text-2xl font-bold tracking-tight text-white" />
            </Link>
            <div className="space-y-3 max-w-md">
              <h2 className="text-3xl font-extrabold tracking-tight">Expand the Academic Network</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Register your institution to unlock dedicated past question repositories and departmental courses for your students.
              </p>
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
                Register University
              </h1>
              <p className="text-sm text-text-muted mt-1">Submit your institution for platform inclusion.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label htmlFor="uniName" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span>University Name</span>
                </label>
                <input
                  id="uniName"
                  type="text"
                  required
                  placeholder="e.g. Obafemi Awolowo University"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 text-text-main placeholder-text-placeholder transition text-sm"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
              >
                <span>{loading ? 'Submitting...' : 'Submit University'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>

            <p className="text-center text-sm text-text-muted pt-2">
              <Link href="/collegeboard" className="text-primary font-bold hover:underline">
                Back to Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>

      <RegisterModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
