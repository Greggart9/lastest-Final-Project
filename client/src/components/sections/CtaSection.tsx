'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <div className="site-container pt-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 border border-blue-900/50 rounded-3xl md:rounded-[2.5rem] p-8 sm:p-12 lg:p-16 text-white shadow-xl">
        {/* Ambient decorative lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary-accent/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="max-w-3xl space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-primary text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Learning Today</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Access Verified Study Materials
              <br />
              And Ace Your Semester
            </h2>

            {/* Subtitle */}
            <p className="text-blue-100/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
              Download curated departmental lecture notes, vetted past examination questions, and syllabus guides contributed by lecturers and course representatives.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="w-full lg:w-auto shrink-0 flex items-center">
            <Link href="/colleges" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(255, 255, 255, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-white hover:bg-gray-100 text-slate-950 font-bold text-sm sm:text-base rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5 group"
              >
                <span>Explore Study Materials</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
