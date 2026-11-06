'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Building2, BookOpenCheck, ShieldCheck } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-surface-bg scroll-mt-20">
      <div className="site-container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Visual Showcase (Replaced raster image) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center w-full"
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />

              <div className="bg-surface-card border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary shadow-xs">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-text-main text-lg">FUNAAB Digital Repository</h3>
                    <p className="text-xs text-text-muted">Federated Across 8 Academic Colleges</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-surface-bg border border-border-subtle text-left">
                    <BookOpenCheck className="w-6 h-6 text-primary mb-2" />
                    <p className="text-2xl font-black text-text-main">1,000+</p>
                    <p className="text-xs text-text-muted font-medium mt-0.5">Verified Documents</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-bg border border-border-subtle text-left">
                    <GraduationCap className="w-6 h-6 text-emerald-600 mb-2" />
                    <p className="text-2xl font-black text-text-main">40+</p>
                    <p className="text-xs text-text-muted font-medium mt-0.5">Departments Supported</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-xs text-text-main font-medium">
                    Strict review pipeline before lecture materials or past questions become publicly accessible.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-semibold">
              Academic Mission
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-main tracking-tight">
              <span className="text-primary">About</span> Us
            </h2>

            <p className="text-text-body text-base sm:text-lg leading-relaxed font-normal">
              We empower students and academic faculty by creating a unified digital hub for higher learning. From departmental past questions and verified lecture notes to collaborative course studies, our mission is to eliminate barriers to academic excellence.
            </p>

            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
              Organized seamlessly by colleges, faculties, departments, and academic levels, every undergraduate gains instant access to peer-reviewed study resources, syllabus outlines, and past examination papers.
            </p>

            <div className="pt-2 flex justify-center lg:justify-start">
              <Link href="/collegeboard">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
