'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Search, UploadCloud, Download } from 'lucide-react';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';

const topics = [
  { id: 1, title: 'Architectural Design', img: '/Images/img16.png', size: '2.4 MB', type: 'PDF' },
  { id: 2, title: 'Software Reuse', img: '/Images/img17.png', size: '1.8 MB', type: 'PDF' },
  { id: 3, title: 'Configuration Management', img: '/Images/img18.png', size: '3.1 MB', type: 'PDF' },
  { id: 4, title: 'Formal Specification', img: '/Images/img19.png', size: '4.0 MB', type: 'PDF' },
  { id: 5, title: 'Z Notation & Proofs', img: '/Images/img20.png', size: '2.9 MB', type: 'PDF' },
  { id: 6, title: 'Formal Methods Past Questions', img: '/Images/img21.png', size: '5.2 MB', type: 'ZIP' },
];

export default function FormalMethodPage() {
  const { user, loading } = useAuth(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const filtered = topics.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (title: string) => {
    setDownloadSuccess(`Downloaded "${title}" successfully.`);
    setTimeout(() => setDownloadSuccess(''), 3000);
  };

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
            &gt;{' '}
            <Link href="/fourhundred" className="hover:text-blue-500">
              400L
            </Link>{' '}
            &gt; <span className="text-blue-500 font-semibold">Formal Methods (CSC 405)</span>
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

        {/* Title, Search & Upload CTA */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
          <div>
            <h1 className="font-extrabold text-blue-500 text-2xl md:text-3xl">Formal Methods</h1>
            <p className="text-gray-500 text-sm">CSC 405 • Course Materials, Lecture Notes & Past Questions</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl w-full sm:w-60 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
              <Search className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
              <input
                className="bg-transparent outline-none w-full text-sm text-gray-800 placeholder-gray-400"
                type="search"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Link
              href="/upload"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2.5 rounded-full flex items-center gap-2 text-white font-semibold text-sm shadow-sm transition cursor-pointer shrink-0"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Note</span>
            </Link>
          </div>
        </section>

        {downloadSuccess && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
            ✓ {downloadSuccess}
          </div>
        )}

        {/* Materials Grid */}
        <section className="mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((topic) => (
              <div
                key={topic.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-sm hover:shadow-lg transition-all"
              >
                <div className="h-20 w-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                  <img src={topic.img} alt={topic.title} className="h-14 w-14 object-contain" />
                </div>
                <h3 className="text-gray-800 font-bold text-base line-clamp-1">{topic.title}</h3>
                <p className="text-gray-400 text-xs mt-1 font-mono">
                  {topic.type} • {topic.size}
                </p>

                <button
                  onClick={() => handleDownload(topic.title)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full mt-4 font-semibold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download File
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
