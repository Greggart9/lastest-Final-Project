'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Search,
  ArrowLeft,
  Download,
  Eye,
  CheckCircle2,
  FolderOpen,
  Sparkles,
  FileCheck,
  X,
  FileSpreadsheet,
  Clock,
  Share2,
  Bookmark,
} from 'lucide-react';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import StudentDocumentPreviewModal from '@/components/ui/StudentDocumentPreviewModal';
import { useAuth } from '@/hooks/useAuth';
import {
  getCollegeByCodeOrId,
  getDepartmentBySlug,
  getMaterialsForLevel,
  StudyDocument,
  ALL_COLLEGES,
} from '@/data/funaabStructure';
import { apiGetVaultMaterials, apiGetUniversities, apiGetColleges } from '@/lib/api';

interface LevelPageProps {
  params: Promise<{
    collegeId: string;
    departmentId: string;
    level: string;
  }>;
}

export default function LevelRepositoryPage({ params }: LevelPageProps) {
  const resolvedParams = use(params);
  const { collegeId, departmentId, level: levelStr } = resolvedParams;
  const router = useRouter();

  const levelNumber = parseInt(levelStr.replace(/[^0-9]/g, ''), 10) || 100;
  const { user, loading } = useAuth(true);

  const [liveCollege, setLiveCollege] = useState<any>(
    getCollegeByCodeOrId(collegeId) || ALL_COLLEGES[0]
  );
  const [academicTerm, setAcademicTerm] = useState<'college' | 'faculty'>('college');
  const college = liveCollege;

  useEffect(() => {
    async function loadStructure() {
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
    loadStructure();
  }, [collegeId, user, router]);

  const department =
    liveCollege?.departments?.find(
      (d: any) =>
        d.id?.toLowerCase() === decodeURIComponent(departmentId).toLowerCase() ||
        d.code?.toLowerCase() === decodeURIComponent(departmentId).toLowerCase() ||
        d.name?.toLowerCase() === decodeURIComponent(departmentId).toLowerCase() ||
        d.name?.toLowerCase().replace(/\s+/g, '-') === decodeURIComponent(departmentId).toLowerCase()
    ) ||
    getDepartmentBySlug(college, departmentId) ||
    college.departments?.[0] || {
      id: departmentId,
      name: departmentId.replace(/-/g, ' ').toUpperCase(),
      code: 'DEP',
      maxLevel: 400,
    };

  const [activeTab, setActiveTab] = useState<
    'course_materials' | 'past_questions' | 'solutions'
  >('course_materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<StudyDocument | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Fetch live materials from database + R2
  const [liveMaterials, setLiveMaterials] = useState<StudyDocument[]>([]);

  useEffect(() => {
    async function fetchLiveMaterials() {
      try {
        const data = await apiGetVaultMaterials({
          college: college.code || college.id || collegeId,
          department: department.name,
          level: levelNumber,
          university: user?.university || 'FUNAAB',
        });
        if (data?.materials && Array.isArray(data.materials)) {
          const mapped: StudyDocument[] = data.materials.map((m: any) => {
            const rawCat = (m.category || '').toLowerCase().replace(/[\s_-]+/g, '');
            let normCat: 'course_materials' | 'past_questions' | 'solutions' = 'course_materials';
            if (rawCat.includes('past') || rawCat.includes('question') || rawCat.includes('exam')) {
              normCat = 'past_questions';
            } else if (rawCat.includes('solution') || rawCat.includes('answer')) {
              normCat = 'solutions';
            }

            return {
              id: m.id,
              title: m.title,
              courseCode: m.courseCode,
              courseTitle: m.title,
              category: normCat,
              semester: m.semester || 'First Semester',
              fileName: m.fileName || `${m.courseCode}.pdf`,
              fileSize: m.fileSize || '3.2 MB',
              uploadedBy: m.authorName || 'Student',
              verified: true,
              downloads: typeof m.downloads === 'number' ? m.downloads : 48,
              year: m.academicYear || '2025/2026',
              fileUrl: m.fileUrl,
              previewSnippet: `Official curriculum document for ${m.courseCode} (${m.title}). Approved for student study and review.`,
            };
          });
          setLiveMaterials(mapped);
        }
      } catch (err) {
        console.error('Failed to load live vault materials:', err);
      }
    }
    fetchLiveMaterials();
  }, [collegeId, department.name, levelNumber]);

  // Fetch materials for this specific department & level
  const rawMaterials = getMaterialsForLevel(
    department.name,
    department.code,
    levelNumber
  );

  const combinedMaterials = [
    ...liveMaterials,
    ...rawMaterials.filter(
      (rm) => !liveMaterials.some((lm) => lm.id === rm.id || (lm.courseCode === rm.courseCode && lm.title.toLowerCase() === rm.title.toLowerCase()))
    ),
  ];

  // Count items for each folder
  const courseMaterialsCount = combinedMaterials.filter(
    (m) => m.category === 'course_materials'
  ).length;
  const pastQuestionsCount = combinedMaterials.filter(
    (m) => m.category === 'past_questions'
  ).length;
  const solutionsCount = combinedMaterials.filter(
    (m) => m.category === 'solutions'
  ).length;

  // Filter current active folder
  const currentDocs = combinedMaterials.filter((doc) => {
    if (doc.category !== activeTab) return false;
    if (
      selectedSemester !== 'all' &&
      doc.semester.toLowerCase() !== selectedSemester.toLowerCase()
    ) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        doc.title.toLowerCase().includes(q) ||
        doc.courseCode.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q) ||
        doc.courseTitle.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleDownload = (doc: StudyDocument) => {
    const fileUrl = (doc as any).fileUrl;
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadToast(`Downloaded ${doc.fileName}`);
      setTimeout(() => {
        setDownloadToast(null);
      }, 3500);
      return;
    }
    // Simulate real browser PDF download
    const dummyPdfContent = `%PDF-1.4\n% EduCollab FUNAAB Academic Document\n% Department of ${department.name}\n% Course: ${doc.courseCode} - ${doc.courseTitle}\n% Title: ${doc.title}\n% Category: ${doc.category}\n\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 120 >>\nstream\nBT\n/F1 14 Tf\n50 720 Td\n(${doc.title}) Tj\n0 -20 Td\n(${doc.previewSnippet}) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000018 00000 n\n0000000077 00000 n\n0000000133 00000 n\n0000000216 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n388\n%%EOF`;

    const blob = new Blob([dummyPdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`Downloaded ${doc.fileName}`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 selection:bg-primary-subtle selection:text-primary-active">
      {/* Sidebar Navigation (Responsive: Mobile Drawer + Desktop Permanent) */}
      <DashboardSidebar />

      {/* Main Level Repository Area */}
      <main className="flex-1 w-full lg:w-[calc(100%-16rem)] lg:ml-64 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 min-w-0">
        {/* 1-Step Back Crumb Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-border-subtle gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-text-muted">
              <Link href="/colleges" className="hover:text-primary transition-colors">
                {academicTerm === 'faculty' ? 'Faculties' : 'Colleges'}
              </Link>
              <span>/</span>
              <Link
                href={`/colleges/${encodeURIComponent(college.code || college.id || collegeId)}`}
                className="hover:text-primary transition-colors"
              >
                {college.code || college.shortName || college.name}
              </Link>
              <span>/</span>
              <Link
                href={`/colleges/${encodeURIComponent(college.code || college.id || collegeId)}/${encodeURIComponent(department.id || department.code || department.name)}`}
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{department.name}</span>
              </Link>
              <span>/</span>
              <span className="text-text-main font-bold">{levelNumber} Level</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-main tracking-tight">
                {levelNumber} Level Academic Vault
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-primary-light text-primary text-xs font-bold border border-primary-subtle">
                {department.code}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* 1-Step Back to Department Button */}
            <Link
              href={`/colleges/${encodeURIComponent(college.code || college.id || collegeId)}/${encodeURIComponent(department.id || department.code || department.name)}`}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-border-subtle hover:bg-slate-100 text-text-main text-xs font-bold transition shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-primary" />
              <span>Back to All Levels</span>
            </Link>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder" />
              <input
                type="text"
                placeholder="Search PDF documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-border-subtle rounded-xl text-xs sm:text-sm text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              />
            </div>
          </div>
        </header>

        {/* Level Overview Banner */}
        <section className="mt-8 p-6 sm:p-7 rounded-3xl bg-white border border-border-subtle shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-bold uppercase tracking-wider">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>FUNAAB Study Archive</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-text-main">
              {department.name} • {levelNumber} Level Resource Center
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Browse syllabus-aligned course lecture materials, archived semester examination questions, and verified step-by-step solutions for {department.name} students.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="shrink-0 flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSelectedSemester('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSemester === 'all'
                  ? 'bg-white text-text-main shadow-xs'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              All Semesters
            </button>
            <button
              onClick={() => setSelectedSemester('First Semester')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSemester === 'First Semester'
                  ? 'bg-white text-text-main shadow-xs'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              1st Semester
            </button>
            <button
              onClick={() => setSelectedSemester('Second Semester')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSemester === 'Second Semester'
                  ? 'bg-white text-text-main shadow-xs'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              2nd Semester
            </button>
          </div>
        </section>

        {/* The 3 Core Folders (Tabs): Course Materials, Past Questions, Solutions */}
        <div className="mt-8">
          <div className="flex border-b border-border-subtle gap-2 sm:gap-4 overflow-x-auto pb-px">
            {/* Folder 1: Course Materials */}
            <button
              onClick={() => setActiveTab('course_materials')}
              className={`flex items-center gap-2.5 px-4 sm:px-6 py-3.5 text-sm sm:text-base font-bold transition-all relative border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'course_materials'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Course Materials</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  activeTab === 'course_materials'
                    ? 'bg-primary-light text-primary'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {courseMaterialsCount}
              </span>
            </button>

            {/* Folder 2: Past Questions */}
            <button
              onClick={() => setActiveTab('past_questions')}
              className={`flex items-center gap-2.5 px-4 sm:px-6 py-3.5 text-sm sm:text-base font-bold transition-all relative border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'past_questions'
                  ? 'border-amber-600 text-amber-700'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Past Questions</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  activeTab === 'past_questions'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {pastQuestionsCount}
              </span>
            </button>

            {/* Folder 3: Answers to Past Questions / Solutions */}
            <button
              onClick={() => setActiveTab('solutions')}
              className={`flex items-center gap-2.5 px-4 sm:px-6 py-3.5 text-sm sm:text-base font-bold transition-all relative border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'solutions'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Answers & Solutions</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  activeTab === 'solutions'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {solutionsCount}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Context Subtitle */}
        <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
          <p>
            Showing{' '}
            <strong className="text-text-main font-bold">
              {currentDocs.length}
            </strong>{' '}
            PDF file{currentDocs.length === 1 ? '' : 's'} in{' '}
            <span className="font-semibold text-primary capitalize">
              {activeTab.replace('_', ' ')}
            </span>
          </p>
          <span className="text-[11px] font-medium">All documents verified by FUNAAB Academic Reps</span>
        </div>

        {/* Document Grid */}
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentDocs.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white border border-border-subtle rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:border-primary/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 font-extrabold text-xs shadow-2xs shrink-0">
                      PDF
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px] mb-1">
                        {doc.courseCode}
                      </span>
                      <h3 className="font-bold text-text-main text-sm sm:text-base leading-snug group-hover:text-primary transition-colors">
                        {doc.title}
                      </h3>
                    </div>
                  </div>

                  {doc.verified && (
                    <span
                      title="Verified FUNAAB Syllabus Aligned"
                      className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-text-muted space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px] text-slate-700">
                    <span className="truncate max-w-[200px]">{doc.fileName}</span>
                    <span className="font-semibold shrink-0">{doc.fileSize}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                    <span>{doc.semester} {doc.year ? `• ${doc.year}` : ''}</span>
                    <span>{(doc.downloads ?? 0).toLocaleString()} downloads</span>
                  </div>
                </div>

                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {doc.previewSnippet}
                </p>
              </div>

              {/* Action Buttons: Preview & Download */}
              <div className="pt-4 mt-4 border-t border-border-light flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-card hover:bg-slate-100 text-text-main border border-border-subtle text-xs font-bold transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  <span>Preview PDF</span>
                </button>

                <button
                  onClick={() => handleDownload(doc)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs hover:shadow transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </motion.div>
          ))}
        </section>

        {currentDocs.length === 0 && (
          <div className="mt-12 p-12 text-center bg-white border border-border-subtle rounded-3xl space-y-3 max-w-lg mx-auto">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-text-main">No materials found</h3>
            <p className="text-xs text-text-muted">
              No files matching your search in this folder. Try clearing filters or searching with a different term.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSemester('all');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-text-main text-xs font-bold transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Real In-App Document Preview Modal */}
      <StudentDocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDownload={handleDownload}
      />

      {/* Floating Download Toast Feedback */}
      <AnimatePresence>
        {downloadToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 text-xs font-semibold"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span>{downloadToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
