'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatItem {
  icon: string;
  value: string;
  label: string;
  alt: string;
}

const stats: StatItem[] = [
  {
    icon: '/Images/img3.png',
    value: '1K+',
    label: 'Lecture Resources',
    alt: 'Resources Icon',
  },
  {
    icon: '/Images/img4.png',
    value: '500+',
    label: 'Past Questions',
    alt: 'Past Questions Icon',
  },
  {
    icon: '/Images/img5.png',
    value: '100+',
    label: 'Higher Institutions',
    alt: 'Universities Icon',
  },
];

export default function StatsSection() {
  return (
    <section className="relative z-10 py-12 bg-surface-card border-y border-border-subtle">
      <div className="site-container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="flex items-center justify-center sm:justify-start gap-4 p-5 rounded-2xl bg-surface-bg border border-border-light shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary-light flex items-center justify-center shrink-0">
                <img src={stat.icon} alt={stat.alt} className="h-10 w-10 object-contain" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-text-main tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-text-muted">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
