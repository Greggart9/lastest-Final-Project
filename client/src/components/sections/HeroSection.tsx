'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

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

          {/* Right Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex-1 relative flex items-center justify-center w-full max-w-lg lg:max-w-none"
          >
            {/* Decorative Ring Background */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none opacity-40">
              <img
                src="/Images/img2.png"
                alt="Decorative Halo Ring"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </div>

            {/* Main Student Visual with gentle floating bob */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <img
                src="/Images/img1.png"
                alt="Passionate Student Learning"
                className="max-h-[22rem] sm:max-h-[30rem] lg:max-h-[36rem] w-auto object-contain drop-shadow-xl"
              />

              {/* Micro-Interaction Floating Pill: Verified Notes */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -left-2 sm:left-4 bottom-8 bg-surface-elevated/95 backdrop-blur-md border border-border-subtle p-3 rounded-2xl shadow-lg flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left pr-2">
                  <p className="text-xs font-bold text-text-main">Verified Resources</p>
                  <p className="text-[11px] text-text-muted">Updated for 2026 Curriculum</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
