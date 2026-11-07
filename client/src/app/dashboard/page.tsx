'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Compass,
  FolderOpen,
} from 'lucide-react';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';
import {
  getCollegeByCodeOrId,
  getDepartmentBySlug,
  ALL_COLLEGES,
} from '@/data/funaabStructure';
import { apiGetColleges } from '@/lib/api';

interface LevelDisplayItem {
  levelNumber: number;
  level: string;
  name: string;
  desc: string;
  coursesCount: number;
  pastQuestionsCount: number;
  solutionsCount: number;
  featuredCourse: string;
  link: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveColleges, setLiveColleges] = useState<any[]>(ALL_COLLEGES);
  const [academicTerm, setAcademicTerm] = useState<'college' | 'faculty'>('college');

  const collegeCode = user?.college || 'COLPHYS';
  const departmentName = user?.department || 'Computer Science';
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Student';

  // Fetch live colleges, departments, and activated levels configured by admin in backend
  useEffect(() => {
    async function fetchLiveStructure() {
      try {
        const uniKey = user?.university?.toLowerCase() || 'funaab';
        const data = await apiGetColleges(uniKey);
        if (data?.colleges && data.colleges.length > 0) {
          setLiveColleges(data.colleges);
          if (data.academicTerm) {
            setAcademicTerm(data.academicTerm === 'faculty' ? 'faculty' : 'college');
          }
        }
      } catch {
        // Retain ALL_COLLEGES fallback
      }
    }
    fetchLiveStructure();
  }, [user]);

  // Find user's resolved College/Faculty and Department from live backend data
  const collegeObj =
    liveColleges.find(
      (c) =>
        (c.code && c.code.toLowerCase() === collegeCode.toLowerCase()) ||
        (c.id && c.id.toLowerCase() === collegeCode.toLowerCase()) ||
        (c.name && c.name.toLowerCase() === collegeCode.toLowerCase())
    ) || liveColleges[0] || ALL_COLLEGES[0];

  const deptObj =
    collegeObj.departments?.find(
      (d: any) =>
        d.name?.toLowerCase() === departmentName.toLowerCase() ||
        d.id?.toLowerCase() === departmentName.toLowerCase() ||
        d.code?.toLowerCase() === departmentName.toLowerCase()
    ) ||
    collegeObj.departments?.[0] || {
      id: 'computer-science',
      code: 'CSC',
      name: 'Computer Science',
      levels: [100, 200, 300, 400],
    };

  const isFaculty = academicTerm === 'faculty';
  const termSingular = isFaculty ? 'Faculty' : 'College';
  const termPlural = isFaculty ? 'Faculties' : 'Colleges';
  const collegeKey = collegeObj.code || collegeObj.id;
  const collegeDisplayName = collegeObj.code || collegeObj.name || collegeObj.fullName;

  // Live active levels configured by admin in backend!
  const levelNumbers: number[] = Array.isArray(deptObj.levels) && deptObj.levels.length > 0
    ? [...deptObj.levels].sort((a: number, b: number) => a - b)
    : deptObj.maxLevel === 500
    ? [100, 200, 300, 400, 500]
    : [100, 200, 300, 400];

  const maxLevel = Math.max(...levelNumbers, 400);

  const levelMeta: Record<
    number,
    { name: string; desc: string; coursesCount: number; pqs: number; sols: number; featured: string }
  > = {
    100: {
      name: 'Foundation & General Studies',
      desc: 'First year introduction to calculus, introductory computing, programming fundamentals, and general studies.',
      coursesCount: 5,
      pqs: 4,
      sols: 4,
      featured: `${deptObj.code} 101 • Introduction to ${deptObj.name}`,
    },
    200: {
      name: 'Core Intermediate Disciplines',
      desc: 'Foundational algorithmic logic, data structures, intermediate mathematics, and departmental lab practicals.',
      coursesCount: 5,
      pqs: 4,
      sols: 4,
      featured: `${deptObj.code} 201 • Intermediate Core`,
    },
    300: {
      name: 'Advanced Systems & SIWES',
      desc: 'Deep technical coursework, database architecture, industrial training preparation, and specialized theory.',
      coursesCount: 5,
      pqs: 4,
      sols: 4,
      featured: `${deptObj.code} 301 • Advanced Systems`,
    },
    400: {
      name: 'Final Year Specializations & Seminars',
      desc: 'Senior capstone modules, formal methods, project seminars, and comprehensive past examinations.',
      coursesCount: 4,
      pqs: 4,
      sols: 4,
      featured: `${deptObj.code} 405 • Senior Specializations`,
    },
    500: {
      name: 'Advanced Professional Practicum',
      desc: 'Extended engineering, clinical rotations, and specialized research defense compendiums.',
      coursesCount: 4,
      pqs: 4,
      sols: 4,
      featured: `${deptObj.code} 501 • Research Capstone`,
    },
    600: {
      name: 'Clinical Rotations & Practicum',
      desc: 'Advanced veterinary clinical rotations, surgical diagnostics, and institutional defense.',
      coursesCount: 4,
      pqs: 4,
      sols: 4,
      featured: `${deptObj.code} 601 • Clinical Practicum`,
    },
  };

  const departmentLevels: LevelDisplayItem[] = levelNumbers.map((lvl) => {
    const meta = levelMeta[lvl];
    return {
      levelNumber: lvl,
      level: `${lvl} Level`,
      name: meta?.name || `${lvl} Level Curriculum`,
      desc: meta?.desc || `Academic repository for ${lvl} Level.`,
      coursesCount: meta?.coursesCount || 5,
      pastQuestionsCount: meta?.pqs || 4,
      solutionsCount: meta?.sols || 4,
      featuredCourse: meta?.featured || `${deptObj.code} ${lvl}1`,
      link: `/colleges/${collegeKey}/${deptObj.id || deptObj.code}/${lvl}`,
    };
  });

  const filteredLevels = departmentLevels.filter(
    (l) =>
      l.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted font-medium">Loading your department dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 selection:bg-primary-subtle selection:text-primary-active">
      {/* Sidebar Navigation (Responsive: Mobile Drawer + Desktop Permanent) */}
      <DashboardSidebar />

      {/* Main Personalized Dashboard Area */}
      <main className="flex-1 w-full lg:w-[calc(100%-16rem)] lg:ml-64 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 min-w-0">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-border-subtle gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-text-muted">
              <Link href="/colleges" className="hover:text-primary transition-colors">
                {termPlural}
              </Link>
              <span>/</span>
              <Link
                href={`/colleges/${collegeKey}`}
                className="hover:text-primary transition-colors"
              >
                {collegeDisplayName}
              </Link>
              <span>/</span>
              <span className="text-text-main font-bold">{deptObj.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-main tracking-tight mt-1">
              Welcome back, <span className="text-primary">{firstName}</span>!
            </h1>
          </div>

          {/* Search Bar & Profile Avatar */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" />
              <input
                type="text"
                placeholder="Search levels or courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-border-subtle rounded-xl text-xs sm:text-sm text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition shadow-2xs"
              />
            </div>

            <Link href="/manageprofile" className="shrink-0 hidden sm:block">
              <div className="h-10 w-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-primary text-sm shadow-xs hover:scale-105 transition overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={firstName} className="h-full w-full object-cover" />
                ) : (
                  firstName.slice(0, 2).toUpperCase()
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Personalized Department Hero Card */}
        <section className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 p-6 sm:p-8 lg:p-10 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 right-1/4 w-60 h-60 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-blue-200 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Your Departmental Vault</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Department of {deptObj.name}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                As a student of <strong className="text-white">{collegeObj.fullName || collegeObj.name} {collegeObj.code ? `(${collegeObj.code})` : ''}</strong>, you have direct access to all course lecture materials, past questions, and step-by-step solutions for 100L to {maxLevel}L.
              </p>

              {/* Badges Row */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-blue-100">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15">
                  <Calendar className="w-3.5 h-3.5 text-cyan-300" />
                  2025/2026 Academic Session
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15">
                  <Layers className="w-3.5 h-3.5 text-emerald-300" />
                  {levelNumbers.length} Academic Levels (100L – {maxLevel}L)
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  {user?.university || 'FUNAAB'} Verified Curriculum
                </span>
              </div>
            </div>

            {/* Quick Link to Browse Other Colleges */}
            <div className="shrink-0 w-full lg:w-auto">
              <Link href="/colleges">
                <button className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 group">
                  <Compass className="w-4 h-4 text-primary" />
                  <span>Explore All {termPlural}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section Title */}
        <div className="mt-10 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
              Academic Levels for {deptObj.name}
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Each level contains 3 dedicated folders: Course Materials, Past Questions, and Solutions.
            </p>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary-light border border-primary-subtle px-3 py-1 rounded-full">
            {/* {filteredLevels.length} Levels Available (100L – {maxLevel}L) */}
          </span>
        </div>

        {/* Academic Levels Grid (100L - 400L for Computer Science) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredLevels.map((lvl, index) => (
            <motion.div
              key={lvl.level}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.07)' }}
              className="bg-white border border-border-subtle rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-4">
                {/* Level Header with Book Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">
                        {lvl.level}
                      </h4>
                      <p className="text-xs text-text-muted font-medium">
                        {deptObj.code} • Year {lvl.levelNumber / 100}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Level Title & Desc */}
                <div>
                  <h5 className="text-sm font-bold text-slate-800">
                    {lvl.name}
                  </h5>
                  <p className="text-text-muted text-xs leading-relaxed mt-1 line-clamp-2">
                    {lvl.desc}
                  </p>
                </div>

                {/* 3 Categories Badges */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 mx-auto mb-0.5" />
                    <p className="text-[10px] font-bold text-blue-900">Course Notes</p>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
                    <FileText className="w-3.5 h-3.5 text-amber-600 mx-auto mb-0.5" />
                    <p className="text-[10px] font-bold text-amber-900">Past Questions</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-0.5" />
                    <p className="text-[10px] font-bold text-emerald-900">Solutions</p>
                  </div>
                </div>

                {/* Featured Course Chip */}
                <div className="p-3 rounded-xl bg-surface-card border border-border-light text-xs text-text-body flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate font-medium">{lvl.featuredCourse}</span>
                </div>
              </div>

              {/* Action Button: Opens dynamic Level Repository */}
              <div className="pt-5 mt-5 border-t border-border-light flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                  <FolderOpen className="w-3.5 h-3.5 text-primary" />
                  PDF Vault
                </span>
                <Link href={lvl.link}>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs hover:shadow transition group-hover:translate-x-0.5 cursor-pointer">
                    <span>Open {lvl.level} Vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Quick Help Desk */}
        <section className="mt-12 p-6 rounded-2xl bg-white border border-border-subtle shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-primary-light flex items-center justify-center text-primary shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-main">Looking for other department materials?</h4>
              <p className="text-xs text-text-muted mt-0.5">
                Browse through all {user?.university || 'university'} {termPlural.toLowerCase()} and their departmental archives anytime.
              </p>
            </div>
          </div>
          <Link href="/colleges" className="shrink-0">
            <button className="px-5 py-2.5 rounded-full border border-primary/30 text-primary hover:bg-primary-light text-xs font-bold transition cursor-pointer">
              Browse {termSingular} Directory
            </button>
          </Link>
        </section>
      </main>
    </div>
  );
}
