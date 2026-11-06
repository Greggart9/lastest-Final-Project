'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, ArrowLeft, Search, BookOpen, FileText } from 'lucide-react';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';

const levels = [
  { id: '100', label: '100 Level', desc: 'Foundational First Year General Science & Mathematics', courses: '12 Courses', pastQs: '45 Papers', link: '/fourhundred' },
  { id: '200', label: '200 Level', desc: 'Intermediate Algorithms, Data Structures & Applied Labs', courses: '14 Courses', pastQs: '52 Papers', link: '/fourhundred' },
  { id: '300', label: '300 Level', desc: 'Advanced Systems, Theory of Computation & SIWES', courses: '16 Courses', pastQs: '68 Papers', link: '/fourhundred' },
  { id: '400', label: '400 Level', desc: 'Final Year Specializations, Formal Methods & Seminars', courses: '10 Courses', pastQs: '84 Papers', link: '/fourhundred' },
  { id: '500', label: '500 Level', desc: 'Advanced Engineering Practicum & Capstone Projects', courses: '8 Courses', pastQs: '36 Papers', link: '/fourhundred' },
];

export default function LevelPage() {
  const { user, loading } = useAuth(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = levels.filter((l) =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deptName = user?.department || 'Computer Science';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 selection:bg-primary-subtle selection:text-primary-active">
      {/* Sidebar (Responsive: Mobile Drawer + Desktop Permanent) */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 w-full lg:w-[calc(100%-16rem)] lg:ml-64 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 min-w-0">
        {/* Breadcrumb Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-border-subtle gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span>/</span>
              <span className="text-text-main font-bold">{deptName} Levels</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight mt-1">
              {deptName} Curriculum Levels
            </h1>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-placeholder" />
            <input
              type="text"
              placeholder="Search levels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-subtle rounded-xl text-xs sm:text-sm text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition shadow-2xs"
            />
          </div>
        </header>

        {/* Levels Grid */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((l, index) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)' }}
              className="bg-white border border-border-subtle rounded-2xl p-6 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-light text-primary font-bold text-xs">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{l.label}</span>
                  </span>
                  <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    {l.pastQs}
                  </span>
                </div>

                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {l.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border-light flex items-center justify-between">
                <span className="text-xs text-text-muted font-semibold">{l.courses}</span>
                <Link href={l.link}>
                  <button className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline cursor-pointer">
                    <span>Explore Courses</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
