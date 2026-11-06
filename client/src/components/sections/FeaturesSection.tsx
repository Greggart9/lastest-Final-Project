'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  alt: string;
}

const features: FeatureCard[] = [
  {
    title: 'Upload Materials',
    description: 'Share verified lecture summaries, slides, and syllabus updates.',
    icon: '/Images/img3.png',
    alt: 'Upload materials',
  },
  {
    title: 'Access Past Questions',
    description: 'Download previous semester questions across 100L to 500L.',
    icon: '/Images/img4.png',
    alt: 'Access past questions',
  },
  {
    title: 'Study Resources',
    description: 'Comprehensive reference textbooks, lab handouts, and guides.',
    icon: '/Images/img5.png',
    alt: 'Study resources',
  },
  {
    title: 'Open Source Hub',
    description: 'Inter-university peer discussions, projects, and study circles.',
    icon: '/Images/img9.png',
    alt: 'Open source collaboration',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 bg-surface-card border-y border-border-subtle">
      <div className="site-container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 justify-between">
          {/* Left Headline & Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6 text-center lg:text-left"
          >
            <div className="flex justify-center lg:justify-start">
              <img
                src="/Images/img8.png"
                alt="Explore Online Resources"
                className="max-h-56 sm:max-h-64 object-contain rounded-2xl drop-shadow-sm"
              />
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
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center p-8 bg-surface-bg rounded-2xl border border-border-subtle shadow-xs hover:border-primary/40 hover:shadow-md transition-all text-center cursor-default group"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary-subtle transition-colors">
                  <img src={feature.icon} alt={feature.alt} className="h-10 w-10 object-contain" />
                </div>
                <h3 className="font-bold text-text-main text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
