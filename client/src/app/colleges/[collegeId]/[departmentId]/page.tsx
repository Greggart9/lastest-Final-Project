'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';
import {
  getCollegeByCodeOrId,
  getDepartmentBySlug,
  ALL_COLLEGES,
} from '@/data/funaabStructure';
import { apiGetColleges, apiGetUniversities } from '@/lib/api';

interface DepartmentPageProps {
  params: Promise<{ collegeId: string; departmentId: string }>;
}

export default function DepartmentLevelsPage({ params }: DepartmentPageProps) {
  const resolvedParams = use(params);
  const { collegeId, departmentId } = resolvedParams;
  const router = useRouter();

  const { user, loading } = useAuth(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveCollege, setLiveCollege] = useState<any>(
    getCollegeByCodeOrId(collegeId) || ALL_COLLEGES[0]
  );
  const [academicTerm, setAcademicTerm] = useState<'college' | 'faculty'>('college');
  const college = liveCollege;

  useEffect(() => {
    async function loadLiveStructure() {
      try {
        const uniData = await apiGetUniversities();
        const unis = uniData?.universities || [];
        const userUniKey = (user?.university || 'FUNAAB').toLowerCase();

        // Scope to student's enrolled university (admins can inspect all)
        const targetUnis = (user?.role === 'admin')
          ? unis
          : unis.filter((u: any) => u.id?.toLowerCase() === userUniKey || u.code?.toLowerCase() === userUniKey);

        for (const u of targetUnis) {
          const found = (u.colleges || []).find(
            (c: any) =>
              c.code?.toLowerCase() === decodeURIComponent(collegeId).toLowerCase() ||
              c.id?.toLowerCase() === decodeURIComponent(collegeId).toLowerCase() ||
              c.name?.toLowerCase() === decodeURIComponent(collegeId).toLowerCase()
          );
          if (found) {
            setLiveCollege(found);
            if (u.academicTerm === 'faculty') setAcademicTerm('faculty');
            return;
          }
        }

        // If user is a student and division is not in their enrolled university, redirect to their colleges directory
        if (user && user.role !== 'admin' && targetUnis.length > 0) {
          router.replace('/colleges');
          return;
        }

        const data = await apiGetColleges(userUniKey);
        if (data?.colleges) {
          const found = data.colleges.find(
            (c: any) =>
              c.code?.toLowerCase() === decodeURIComponent(collegeId).toLowerCase() ||
              c.id?.toLowerCase() === decodeURIComponent(collegeId).toLowerCase() ||
              c.name?.toLowerCase() === decodeURIComponent(collegeId).toLowerCase()
          );
          if (found) setLiveCollege(found);
        }
      } catch {}
    }
    loadLiveStructure();
  }, [collegeId, user, router]);

  const department =
    liveCollege?.departments?.find(
      (d: any) =>
        d.id?.toLowerCase() === departmentId.toLowerCase() ||
        d.code?.toLowerCase() === departmentId.toLowerCase() ||
        d.name?.toLowerCase() === departmentId.toLowerCase() ||
        d.name?.toLowerCase().replace(/\s+/g, '-') === departmentId.toLowerCase()
    ) ||
    getDepartmentBySlug(liveCollege, departmentId) ||
    liveCollege?.departments?.[0] || {
      id: departmentId,
      name: departmentId.replace(/-/g, ' ').toUpperCase(),
      code: 'DEP',
      levels: [100, 200, 300, 400],
    };

  const levelNumbers: number[] =
    Array.isArray(department.levels) && department.levels.length > 0
      ? [...department.levels].sort((a: number, b: number) => a - b)
      : department.maxLevel === 500
      ? [100, 200, 300, 400, 500]
      : [100, 200, 300, 400];

  const levelDescriptions: Record<
    number,
    { title: string; desc: string; courses: string; color: string }
  > = {
    100: {
      title: 'Foundation & Core Introductory Studies',
      desc: 'First year introduction to fundamentals, introductory science, computing logic, and general studies.',
      courses: `${department.code} 101, ${department.code} 102, GNS 101, MTS 101`,
      color: 'from-blue-600 to-indigo-600',
    },
    200: {
      title: 'Intermediate Departmental Core',
      desc: 'Foundational algorithmic logic, data structures, departmental laboratory experiments, and core principles.',
      courses: `${department.code} 201, ${department.code} 202, ${department.code} 205`,
      color: 'from-sky-600 to-blue-700',
    },
    300: {
      title: 'Advanced Systems, Theory & SIWES',
      desc: 'Deep technical specializations, systems architecture, practical assignments, and industrial preparation.',
      courses: `${department.code} 301, ${department.code} 305, ${department.code} 311`,
      color: 'from-indigo-600 to-violet-700',
    },
    400: {
      title: 'Final Year Specializations & Seminars',
      desc: 'Senior capstone project archives, formal methods, advanced electives, and degree examination revision.',
      courses: `${department.code} 405, ${department.code} 411, ${department.code} 421`,
      color: 'from-emerald-600 to-teal-700',
    },
    500: {
      title: 'Advanced Professional Practicum & Defense',
      desc: 'Extended engineering, veterinary clinical rotations, and specialized research defense compendiums.',
      courses: `${department.code} 501, ${department.code} 502, Research Capstone`,
      color: 'from-slate-700 to-slate-900',
    },
    600: {
      title: 'Clinical Rotations & Practicum',
      desc: 'Advanced veterinary clinical rotations, surgical diagnostics, and institutional defense.',
      courses: `${department.code} 601, ${department.code} 605`,
      color: 'from-rose-600 to-pink-700',
    },
  };

  const filteredLevels = levelNumbers.filter((lvl) => {
    const info = levelDescriptions[lvl];
    const text = `${lvl} Level ${info?.title} ${info?.desc}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isUserDept =
    user?.college?.toUpperCase() === college.code.toUpperCase() &&
    user?.department?.toLowerCase() === department.name.toLowerCase();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 selection:bg-primary-subtle selection:text-primary-active">
      {/* Sidebar Navigation (Responsive: Mobile Drawer + Desktop Permanent) */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 w-full lg:w-[calc(100%-16rem)] lg:ml-64 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 min-w-0">
        {/* Breadcrumb Navigation - 1 Step Back to College */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-border-subtle gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-text-muted">
              <Link
                href="/colleges"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                {academicTerm === 'faculty' ? 'Faculties' : 'Colleges'}
              </Link>
              <span>/</span>
              <Link
                href={`/colleges/${encodeURIComponent(college.code || college.id || collegeId)}`}
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{college.code || college.shortName || college.name}</span>
              </Link>
              <span>/</span>
              <span className="text-text-main font-bold">
                {department.name}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-main tracking-tight">
                {department.name}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-primary-light text-primary text-xs font-bold border border-primary-subtle">
                {department.code}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* 1-Step Back Button */}
            <Link
              href={`/colleges/${encodeURIComponent(college.code || college.id || collegeId)}`}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-border-subtle hover:bg-slate-100 text-text-main text-xs font-bold transition shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-primary" />
              <span>Back to {college.code || college.shortName || college.name}</span>
            </Link>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" />
              <input
                type="text"
                placeholder="Search academic levels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-border-subtle rounded-xl text-xs sm:text-sm text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              />
            </div>
          </div>
        </header>

        {/* Department Overview Banner */}
        <section className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-primary-active text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/15">
                  {college.fullName}
                </span>
                {isUserDept && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Your Enrolled Department</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                Academic Curriculum & Study Repositories
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Select your academic level below. Each level contains three dedicated repositories:
                <strong className="text-white ml-1">Course Materials</strong>,{' '}
                <strong className="text-white">Past Questions</strong>, and{' '}
                <strong className="text-white">Detailed Solutions</strong> with verified PDF previews & downloads.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10">
              <GraduationCap className="w-8 h-8 text-primary-light" />
              <div>
                <p className="text-2xl font-black text-white">{levelNumbers.length}</p>
                <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Academic Levels
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Levels Grid (100L, 200L, 300L, 400L) */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLevels.map((lvl, index) => {
            const info = levelDescriptions[lvl];
            return (
              <motion.div
                key={lvl}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-border-subtle rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-text-main group-hover:text-primary transition-colors">
                          {lvl} Level
                        </h3>
                        <p className="text-xs text-text-muted font-medium">
                          {department.code} • Year {lvl / 100}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      3 Folders
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{info?.title}</h4>
                    <p className="text-xs text-text-muted leading-relaxed mt-1">
                      {info?.desc}
                    </p>
                  </div>

                  {/* 3 Categories Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-center">
                      <BookOpen className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-[10px] font-bold text-blue-900 leading-tight">
                        Course Materials
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                      <FileText className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                      <p className="text-[10px] font-bold text-amber-900 leading-tight">
                        Past Questions
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                      <Sparkles className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                      <p className="text-[10px] font-bold text-emerald-900 leading-tight">
                        Solutions
                      </p>
                    </div>
                  </div>

                  {info?.courses && (
                    <div className="text-[11px] text-text-muted bg-surface-card px-3 py-2 rounded-xl border border-border-light">
                      <span className="font-semibold text-text-main">Sample Courses: </span>
                      {info.courses}
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-border-light flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-primary" />
                    Verified PDF Vault
                  </span>

                  <Link
                    href={`/colleges/${encodeURIComponent(college.code || college.id || collegeId)}/${encodeURIComponent(department.id || department.code || department.name)}/${lvl}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm hover:shadow transition group-hover:translate-x-0.5"
                  >
                    <span>Open {lvl}L Vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
