'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  FileText,
  Users2,
  ShieldCheck,
} from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-primary-accent/15 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="site-container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* Left Content / Typography */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-left space-y-6 md:space-y-8"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs sm:text-sm font-semibold shadow-2xs">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Smart Academic Network for Higher Education</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-text-main tracking-tight leading-[1.12]">
              <span className="text-primary">Power Your</span>
              <br />
              Education, <span className="text-primary">Elevate</span>
              <br />
              Your Learning
              <br />
              Journey
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              The Ultimate Collaboration Hub for Students and Lecturers to Expand Knowledge and Sharpen Skills.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-9 py-4 bg-primary hover:bg-primary-hover text-white font-bold text-base rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href="/collegeboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-7 py-4 border border-border-subtle bg-surface-bg hover:bg-surface-card text-text-main font-semibold text-base rounded-full shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Browse Colleges</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right Hero Interactive Visual Hub (Replaced raster images) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex-1 relative flex items-center justify-center w-full max-w-lg lg:max-w-none"
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-3xl blur-2xl -z-10" />

              {/* Main Interactive Hub Card */}
              <div className="bg-surface-card border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-text-main text-base sm:text-lg">EduCollab Academic Desk</h3>
                      <p className="text-xs text-text-muted">FUNAAB • Multi-Faculty Repository</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active 2026</span>
                  </div>
                </div>

                {/* Level Quick Badges */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {['100L', '200L', '300L', '400L'].map((lvl) => (
                    <div key={lvl} className="p-2.5 rounded-xl bg-surface-bg border border-border-light text-center">
                      <p className="font-extrabold text-xs text-primary">{lvl}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">Courses</p>
                    </div>
                  ))}
                </div>

                {/* Feed Items */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-bg border border-border-subtle">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary-light text-primary">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-main">Lecture Notes & Handouts</p>
                        <p className="text-[11px] text-text-muted">Verified departmental syllabi</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-bg border border-border-subtle">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-main">Past Examination Solutions</p>
                        <p className="text-[11px] text-text-muted">Step-by-step marking schemes</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  </div>
                </div>

                {/* Trust Footer */}
                <div className="pt-2 flex items-center justify-between text-xs text-text-muted border-t border-border-subtle">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Zero-Trust Verified Files
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users2 className="w-4 h-4 text-emerald-600" />
                    100% Peer-Reviewed
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
