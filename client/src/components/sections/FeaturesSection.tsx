'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  BookOpen,
  Users2,
  CheckCircle2,
  Sparkles,
  Download,
} from 'lucide-react';

const features = [
  {
    title: 'Upload Materials',
    description: 'Share verified lecture summaries, slides, and syllabus updates.',
    icon: UploadCloud,
    color: 'text-primary bg-primary-light',
  },
  {
    title: 'Access Past Questions',
    description: 'Download previous semester questions across 100L to 500L.',
    icon: FileText,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    title: 'Study Resources',
    description: 'Comprehensive reference textbooks, lab handouts, and guides.',
    icon: BookOpen,
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    title: 'Open Source Hub',
    description: 'Inter-university peer discussions, projects, and study circles.',
    icon: Users2,
    color: 'text-amber-600 bg-amber-50',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-surface-card border-y border-border-subtle">
      <div className="site-container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 justify-between">
          {/* Left Headline & Interactive Graphic Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6 text-center lg:text-left"
          >
            {/* Sleek Visual Card replacing raster image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-full max-w-md p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xl border border-slate-800 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-accent" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Curriculum Repository</span>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live 2025/2026
                  </span>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary-accent">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">CSC 111 Lecture Slides</p>
                        <p className="text-[10px] text-slate-400">Computer Science • 100L</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">MTS 101 Past Questions</p>
                        <p className="text-[10px] text-slate-400">Mathematics • 100L</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight leading-snug">
              Explore 1k+ Free <span className="text-primary">Online Resources</span>
            </h2>

            <p className="text-text-body text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
              Gain verified access to comprehensive curriculum packages, past examination repositories, and collaborative peer notes.
            </p>
          </motion.div>

          {/* Right 2x2 Feature Bento Cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center p-8 bg-surface-bg rounded-2xl border border-border-subtle shadow-xs hover:border-primary/40 hover:shadow-md transition-all text-center cursor-default group"
                >
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${feature.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-text-main text-lg group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted text-xs sm:text-sm mt-1.5 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
