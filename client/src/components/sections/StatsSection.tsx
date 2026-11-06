'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileCheck2, GraduationCap } from 'lucide-react';

const stats = [
  {
    icon: BookOpen,
    value: '1K+',
    label: 'Lecture Resources',
    color: 'text-primary bg-primary-light',
  },
  {
    icon: FileCheck2,
    value: '500+',
    label: 'Past Questions',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: GraduationCap,
    value: '100+',
    label: 'Higher Institutions',
    color: 'text-amber-600 bg-amber-50',
  },
];

export default function StatsSection() {
  return (
    <section className="relative z-10 py-12 bg-surface-card border-y border-border-subtle">
      <div className="site-container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="flex items-center justify-center sm:justify-start gap-4 p-5 rounded-2xl bg-surface-bg border border-border-light shadow-2xs hover:shadow-sm transition-all"
              >
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-text-main tracking-tight">{stat.value}</p>
                  <p className="text-sm font-medium text-text-muted">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
