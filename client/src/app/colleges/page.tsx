'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Search,
  ArrowRight,
  Building2,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';
import { ALL_COLLEGES } from '@/data/funaabStructure';
import { apiGetColleges, apiGetUniversities } from '@/lib/api';

export default function CollegesIndexPage() {
  const { user, loading } = useAuth(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [universities, setUniversities] = useState<any[]>([]);
  const userUniCode = (user?.university || 'FUNAAB').toLowerCase();
  const [selectedUniId, setSelectedUniId] = useState<string>(userUniCode);
  const [collegesList, setCollegesList] = useState<any[]>(ALL_COLLEGES || []);
  const [academicTerm, setAcademicTerm] = useState<'college' | 'faculty'>('college');

  // Enforce university scoping: Students are strictly locked to their enrolled university!
  const effectiveUniId = user?.role === 'admin' ? selectedUniId : userUniCode;

  // Load universities
  useEffect(() => {
    async function loadUnis() {
      try {
        const data = await apiGetUniversities();
        const list = data.universities || [];
        if (list.length > 0) {
          setUniversities(list);
          const matched = list.find(
            (u: any) => u.id?.toLowerCase() === userUniCode || u.code?.toLowerCase() === userUniCode
          );
          if (matched) {
            setSelectedUniId(matched.id || matched.code);
          }
        }
      } catch (err) {
        console.error('Failed to load universities:', err);
      }
    }
    loadUnis();
  }, [userUniCode]);

  // Load colleges/faculties for effective university
  useEffect(() => {
    async function loadColleges() {
      try {
        const data = await apiGetColleges(effectiveUniId);
        if (data?.colleges) {
          setCollegesList(data.colleges);
          setAcademicTerm(data.academicTerm === 'faculty' ? 'faculty' : 'college');
        }
      } catch {
        // Retain fallback
      }
    }
    loadColleges();
  }, [effectiveUniId]);

  const activeUni = universities.find(
    (u) =>
      u.id?.toLowerCase() === effectiveUniId.toLowerCase() ||
      u.code?.toLowerCase() === effectiveUniId.toLowerCase()
  ) || null;

  const isFaculty = academicTerm === 'faculty' || activeUni?.academicTerm === 'faculty';
  const termSingular = isFaculty ? 'Faculty' : 'College';
  const termPlural = isFaculty ? 'Faculties' : 'Colleges';
  const termLowerSingular = isFaculty ? 'faculty' : 'college';
  const isFUNAAB = (activeUni?.code || selectedUniId)?.toUpperCase() === 'FUNAAB';

  const filteredColleges = collegesList.filter(
    (c) =>
      c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.fullName && c.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase()))
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
              <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>My Department ({user?.department || 'Computer Science'})</span>
              </Link>
              <span>/</span>
              <span className="text-text-main font-bold">All {termPlural}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-main tracking-tight mt-1">
              {activeUni?.name ? `${activeUni.name} ${termPlural}` : `${termPlural} Directory`}
            </h1>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-placeholder" />
            <input
              type="text"
              placeholder={`Search ${termPlural.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-subtle rounded-xl text-xs sm:text-sm text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition shadow-2xs"
            />
          </div>
        </header>

        {/* University Switcher Tabs: ONLY FOR ADMINISTRATOR VIEW */}
        {user?.role === 'admin' && universities.length > 1 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Admin Switcher:
            </span>
            {universities.map((u) => {
              const isSelected =
                u.id?.toLowerCase() === selectedUniId.toLowerCase() ||
                u.code?.toLowerCase() === selectedUniId.toLowerCase();
              const uTerm = u.academicTerm === 'faculty' ? 'Faculties' : 'Colleges';
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUniId(u.id || u.code)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white border border-border-subtle text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{u.code}</span>
                  <span className={`text-[10px] font-normal opacity-80`}>({uTerm})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Directory Intro Banner */}
        <section className="mt-6 p-6 sm:p-8 rounded-3xl bg-white border border-border-subtle shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-bold tracking-wide uppercase">
              <Building2 className="w-3.5 h-3.5" />
              <span>Campus {termPlural}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-main">
              Select Any {termSingular} to View Its Departments
            </h2>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
              Click on any {termLowerSingular} to inspect its departmental archives, lecture handouts, and past examination papers across all study levels.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-surface-card border border-border-light text-center">
            <span className="text-3xl font-extrabold text-primary">{collegesList.length}</span>
            <p className="text-xs font-semibold text-text-muted mt-0.5">{termPlural} Active</p>
          </div>
        </section>

        {/* Colleges/Faculties Grid */}
        <section className="mt-8">
          {filteredColleges.length === 0 ? (
            <div className="p-12 text-center bg-white border border-border-subtle rounded-3xl shadow-xs">
              <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-text-main">No {termPlural} Found</h3>
              <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
                No academic divisions matching your criteria are registered under {activeUni?.name || 'this institution'}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredColleges.map((col, index) => {
                const colKey = col.code || col.id;
                const isUserCollege =
                  user?.college &&
                  col.code &&
                  user.college.toUpperCase() === col.code.toUpperCase();
                const displayName = col.fullName || col.name || col.code;

                return (
                  <Link key={col.id || col.code} href={`/colleges/${colKey}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.25 }}
                      whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)' }}
                      className="bg-white border border-border-subtle rounded-2xl p-6 flex flex-col justify-between text-center transition-all cursor-pointer group relative h-full"
                    >
                      {isUserCollege && (
                        <div className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                          Enrolled
                        </div>
                      )}

                      <div>
                        <div className="h-16 w-16 mx-auto rounded-2xl bg-primary-light flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                          {isFUNAAB ? (
                            <img src="/Images/funaab.png" alt="FUNAAB logo" className="h-10 w-10 object-contain" />
                          ) : (
                            <GraduationCap className="h-8 w-8 text-primary" />
                          )}
                        </div>

                        <h3 className="text-text-main font-bold text-lg group-hover:text-primary transition-colors">
                          {col.code ? col.code : displayName}
                        </h3>

                        <p className="text-text-muted text-xs mt-1.5 leading-snug line-clamp-2">
                          {col.fullName || col.name || col.code}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-border-light flex items-center justify-between">
                        <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          {col.departments?.length || 0} Departments
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
