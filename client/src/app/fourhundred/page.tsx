'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';

const courses = [
  { id: 'csc405', code: 'CSC 405', title: 'Formal Methods', img: '/Images/img16.png', link: '/formalmethod', active: true },
  { id: 'csc407', code: 'CSC 407', title: 'Database Systems', img: '/Images/img17.png', link: '/formalmethod', active: false },
  { id: 'csc403', code: 'CSC 403', title: 'Object Oriented Programming', img: '/Images/img18.png', link: '/formalmethod', active: false },
  { id: 'csc447', code: 'CSC 447', title: 'Org. of Programming Languages', img: '/Images/img19.png', link: '/formalmethod', active: false },
  { id: 'csc431', code: 'CSC 431', title: 'Logic Programming', img: '/Images/img20.png', link: '/formalmethod', active: false },
  { id: 'csc439', code: 'CSC 439', title: 'System Performance Evaluation', img: '/Images/img21.png', link: '/formalmethod', active: false },
  { id: 'csc435', code: 'CSC 435', title: 'Special Topics in CS', img: '/Images/img18.png', link: '/formalmethod', active: false },
  { id: 'csc433', code: 'CSC 433', title: 'Artificial Intelligence', img: '/Images/img17.png', link: '/formalmethod', active: false },
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
            <button className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer">
              <img className="h-6 w-6 object-contain" src="/Images/icon6.png" alt="notification" />
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

          <div className="flex items-center bg-white border border-gray-200 px-3 py-2 rounded-xl w-full sm:w-72 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
            <img className="h-4 w-4 mr-2 opacity-60" src="/Images/icon7.png" alt="search" />
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
            {filtered.map((course) => (
              <Link key={course.id} href={course.link}>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group">
                  <div className="h-20 w-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                    <img src={course.img} alt={course.title} className="h-14 w-14 object-contain" />
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
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
