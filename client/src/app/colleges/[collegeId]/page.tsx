'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Search,
  ArrowRight,
  ArrowLeft,
  Building2,
  BookOpen,
} from 'lucide-react';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';
import { getCollegeByCodeOrId, ALL_COLLEGES } from '@/data/funaabStructure';

interface CollegePageProps {
  params: Promise<{ collegeId: string }>;
}

export default function CollegeDetailPage({ params }: CollegePageProps) {
  const resolvedParams = use(params);
  const collegeId = resolvedParams.collegeId;

  const { user, loading } = useAuth(true);
  const [searchQuery, setSearchQuery] = useState('');

  const college = getCollegeByCodeOrId(collegeId) || ALL_COLLEGES[0];

  const filteredDepts = college.departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-text-muted">
              <Link href="/colleges" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Colleges</span>
              </Link>
              <span>/</span>
              <span className="text-text-main font-bold">{college.code} Departments</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-main tracking-tight mt-1">
              {college.fullName} ({college.code})
            </h1>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-placeholder" />
            <input
              type="text"
              placeholder={`Search in ${college.code}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-subtle rounded-xl text-xs sm:text-sm text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition shadow-2xs"
            />
          </div>
        </header>

        {/* College Header Banner */}
        <section className="mt-8 p-6 sm:p-8 rounded-3xl bg-white border border-border-subtle shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-bold tracking-wide uppercase">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Departmental Directory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-main">
              Departments under {college.code}
            </h2>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
              Select any department below to view its academic curriculum levels (100L to {college.departments[0]?.maxLevel || 400}L), lecture notes, and past examination question archives.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-surface-card border border-border-light text-center">
            <span className="text-3xl font-extrabold text-primary">{college.departments.length}</span>
            <p className="text-xs font-semibold text-text-muted mt-0.5">Departments</p>
          </div>
        </section>

        {/* Departments Grid */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepts.map((d, index) => {
            const isUserDept =
              user?.college?.toUpperCase() === college.code.toUpperCase() &&
              user?.department?.toLowerCase() === d.name.toLowerCase();

            return (
              <Link
                key={d.id}
                href={`/colleges/${college.code}/${d.id}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)' }}
                  className="bg-white border border-border-subtle rounded-2xl p-6 flex flex-col justify-between transition-all group relative h-full"
                >
                  {isUserDept && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                      Your Department
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary font-extrabold text-sm group-hover:scale-105 transition-transform">
                      {d.code}
                    </div>

                    <div>
                      <h3 className="font-bold text-text-main text-lg group-hover:text-primary transition-colors">
                        {d.name}
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5 font-medium">
                        Levels: 100L – {d.maxLevel || 400}L
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border-light flex items-center justify-between">
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      Course Vault
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                      <span>View Levels</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
