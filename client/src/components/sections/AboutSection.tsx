'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-surface-bg scroll-mt-20">
      <div className="site-container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center w-full"
          >
            <div className="relative max-w-md lg:max-w-lg">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
              <img
                src="/Images/img6.png"
                alt="About Platform"
                className="max-h-[24rem] sm:max-h-[30rem] w-auto object-contain rounded-2xl drop-shadow-md"
              />
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
              <Link href="/colleges">
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
