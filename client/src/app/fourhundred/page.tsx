'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  BookOpen,
  Database,
  Code2,
  Layers,
  Cpu,
  Brain,
  Boxes,
  Terminal,
} from 'lucide-react';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';

const courses = [
  { id: 'csc405', code: 'CSC 405', title: 'Formal Methods', icon: Terminal, link: '/formalmethod', color: 'text-primary bg-primary-light' },
  { id: 'csc407', code: 'CSC 407', title: 'Database Systems', icon: Database, link: '/formalmethod', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'csc403', code: 'CSC 403', title: 'Object Oriented Programming', icon: Code2, link: '/formalmethod', color: 'text-amber-600 bg-amber-50' },
  { id: 'csc447', code: 'CSC 447', title: 'Org. of Programming Languages', icon: Layers, link: '/formalmethod', color: 'text-purple-600 bg-purple-50' },
  { id: 'csc431', code: 'CSC 431', title: 'Logic Programming', icon: Cpu, link: '/formalmethod', color: 'text-indigo-600 bg-indigo-50' },
  { id: 'csc439', code: 'CSC 439', title: 'System Performance Evaluation', icon: Boxes, link: '/formalmethod', color: 'text-rose-600 bg-rose-50' },
  { id: 'csc435', code: 'CSC 435', title: 'Special Topics in CS', icon: BookOpen, link: '/formalmethod', color: 'text-teal-600 bg-teal-50' },
  { id: 'csc433', code: 'CSC 433', title: 'Artificial Intelligence', icon: Brain, link: '/formalmethod', color: 'text-sky-600 bg-sky-50' },
];

export default function FourHundredPage() {
  const { user, loading } = useAuth(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Sidebar (Responsive: Mobile Drawer + Desktop Permanent) */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 w-full lg:w-[calc(100%-16rem)] lg:ml-64 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 min-w-0">
        {/* Breadcrumb */}
        <section className="flex justify-between items-center pb-6 border-b border-gray-200">
          <p className="font-medium text-gray-700 text-sm md:text-base">
            <Link href="/" className="hover:text-blue-500">
              Home
            </Link>{' '}
            &gt;{' '}
            <Link href="/collegeboard" className="hover:text-blue-500">
              Dashboard
            </Link>{' '}
            &gt;{' '}
            <Link href="/colphysdept" className="hover:text-blue-500">
              Departments
            </Link>{' '}
            &gt;{' '}
            <Link href="/level" className="hover:text-blue-500">
              Level
            </Link>{' '}
            &gt; <span className="text-blue-500 font-semibold">400L Courses</span>
          </p>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer text-gray-600">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-9 w-9 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm shadow">
              GO
            </div>
          </div>
        </section>

        {/* Title & Search */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
          <div>
            <h1 className="font-extrabold text-blue-500 text-2xl md:text-3xl">400 Level Courses</h1>
            <p className="text-gray-500 text-sm">Department of Computer Science • Final Year Curriculum</p>
          </div>

          <div className="flex items-center bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl w-full sm:w-72 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
            <Search className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
            <input
              className="bg-transparent outline-none w-full text-sm text-gray-800 placeholder-gray-400"
              type="search"
              placeholder="Search course code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Courses Grid */}
        <section className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((course) => {
              const Icon = course.icon;
              return (
                <Link key={course.id} href={course.link}>
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group">
                    <div className={`h-20 w-20 rounded-2xl flex items-center justify-center mb-4 transition ${course.color}`}>
                      <Icon className="h-9 w-9" />
                    </div>
                    <h3 className="text-gray-800 font-bold text-base group-hover:text-blue-500 transition line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-blue-500 font-semibold text-xs mt-1">({course.code})</p>
                    <span className="mt-4 text-xs font-semibold text-blue-500 bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-500 group-hover:text-white transition">
                      Access Materials →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
