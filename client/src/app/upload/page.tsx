'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  X,
  FileCheck,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  Building2,
  GraduationCap,
  FolderOpen,
  ChevronDown,
  Eye,
} from 'lucide-react';
import DashboardSidebar from '@/components/sections/DashboardSidebar';
import StudentDocumentPreviewModal from '@/components/ui/StudentDocumentPreviewModal';
import { useAuth } from '@/hooks/useAuth';
import { ALL_COLLEGES, College, Department, StudyDocument } from '@/data/funaabStructure';
import { apiUploadMaterial, apiGetSubmissions, apiGetColleges, apiGetUniversities } from '@/lib/api';

export interface StudentSubmission {
  id: string;
  title: string;
  courseCode: string;
  courseTitle: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  collegeCode: string;
  departmentName: string;
  departmentId: string;
  level: number;
  semester: 'First Semester' | 'Second Semester';
  category: 'course_materials' | 'past_questions' | 'solutions';
  academicYear: string;
  notes?: string;
  uploadedAt: string;
  status: 'in_progress' | 'approved' | 'rejected';
  progress: number;
  adminComment?: string;
}

export default function MaterialUploadPage() {
  const { user, loading } = useAuth(true);

  // Active view tab: 'upload_form' | 'my_submissions'
  const [activeTab, setActiveTab] = useState<'upload_form' | 'my_submissions'>('upload_form');

  // Dynamic universities, colleges/faculties & departments
  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedUniId, setSelectedUniId] = useState<string>('funaab');
  const [collegesList, setCollegesList] = useState<any[]>(ALL_COLLEGES);
  const [academicTerm, setAcademicTerm] = useState<'college' | 'faculty'>('college');

  // Load universities
  useEffect(() => {
    async function loadUnis() {
      try {
        const data = await apiGetUniversities();
        const list = data.universities || [];
        if (list.length > 0) {
          setUniversities(list);
          const userUni = user?.university?.toLowerCase();
          const matched = list.find((u: any) => u.id?.toLowerCase() === userUni || u.code?.toLowerCase() === userUni);
          if (matched) {
            setSelectedUniId(matched.id || matched.code);
          }
        }
      } catch (err) {
        console.error('Failed to load universities:', err);
      }
    }
    loadUnis();
  }, [user]);

  const userUniCode = (user?.university || 'FUNAAB').toLowerCase();
  const effectiveUniId = user?.role === 'admin' ? selectedUniId : userUniCode;

  // Load colleges/faculties for effective university
  useEffect(() => {
    async function loadLiveColleges() {
      try {
        const data = await apiGetColleges(effectiveUniId);
        if (data?.colleges && data.colleges.length > 0) {
          setCollegesList(data.colleges);
          if (data.academicTerm) {
            setAcademicTerm(data.academicTerm === 'faculty' ? 'faculty' : 'college');
          }
          const matchingUserCol = data.colleges.find(
            (c: any) =>
              c.code?.toLowerCase() === (user?.college || '').toLowerCase() ||
              c.name?.toLowerCase() === (user?.college || '').toLowerCase()
          );
          const initialDiv = matchingUserCol || data.colleges[0];
          setSelectedCollegeCode(initialDiv.code || initialDiv.id);

          const matchingUserDept = (initialDiv.departments || []).find(
            (d: any) => d.name?.toLowerCase() === (user?.department || '').toLowerCase()
          );
          const initialDept = matchingUserDept || initialDiv.departments?.[0];
          if (initialDept) {
            setSelectedDeptId(initialDept.id || initialDept.code || initialDept.name);
          }
        }
      } catch (err) {
        console.error('Failed to load colleges in upload page:', err);
      }
    }
    loadLiveColleges();
  }, [effectiveUniId, user]);

  const activeUni = universities.find(
    (u) =>
      u.id?.toLowerCase() === effectiveUniId.toLowerCase() ||
      u.code?.toLowerCase() === effectiveUniId.toLowerCase()
  ) || null;

  const isFaculty = academicTerm === 'faculty' || activeUni?.academicTerm === 'faculty';
  const termSingular = isFaculty ? 'Faculty' : 'College';
  const termPlural = isFaculty ? 'Faculties' : 'Colleges';

  const [selectedCollegeCode, setSelectedCollegeCode] = useState<string>('COLPHYS');
  const activeCollege = collegesList.find(
    (c) =>
      (c.code && c.code.toLowerCase() === selectedCollegeCode.toLowerCase()) ||
      (c.id && c.id.toLowerCase() === selectedCollegeCode.toLowerCase())
  ) || collegesList[0] || ALL_COLLEGES[0];

  const collegeDepts = activeCollege?.departments || [];
  const defaultDept = collegeDepts.find(
    (d: any) => d.name?.toLowerCase() === (user?.department || 'Computer Science').toLowerCase()
  ) || collegeDepts[0];

  const [selectedDeptId, setSelectedDeptId] = useState<string>(defaultDept?.id || 'computer-science');
  const activeDept = collegeDepts.find(
    (d: any) =>
      d.id === selectedDeptId ||
      d.code?.toLowerCase() === selectedDeptId?.toLowerCase() ||
      d.name?.toLowerCase() === selectedDeptId?.toLowerCase()
  ) || collegeDepts[0] || { id: 'default', name: 'General', levels: [100, 200, 300, 400] };

  // Upload Form Fields
  const [level, setLevel] = useState<number>(100);
  const [semester, setSemester] = useState<'First Semester' | 'Second Semester'>('First Semester');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [category, setCategory] = useState<'course_materials' | 'past_questions' | 'solutions'>('course_materials');
  const [courseCode, setCourseCode] = useState('');
  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [notes, setNotes] = useState('');

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);

  // Submissions State (persisted to localStorage)
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<StudyDocument | null>(null);

  // Initialize submissions from live backend API or fallback to localStorage
  useEffect(() => {
    async function loadLiveSubmissions() {
      try {
        const data = await apiGetSubmissions();
        if (data && data.submissions && data.submissions.length > 0) {
          const mapped: StudentSubmission[] = data.submissions.map((s: any) => ({
            id: s.id,
            title: s.title,
            courseCode: s.courseCode,
            courseTitle: s.title,
            fileName: s.fileName,
            fileSize: s.fileSize || '2.4 MB',
            collegeCode: s.college || s.collegeCode || 'COLPHYS',
            departmentName: s.department || s.departmentName || 'Computer Science',
            departmentId: s.departmentId || 'computer-science',
            level: Number(s.level) || 100,
            semester: s.semester || 'First Semester',
            category: s.category || 'course_materials',
            academicYear: s.academicYear || '2025/2026',
            uploadedAt: s.uploadedAt || 'Recently',
            status: s.status === 'pending' ? 'in_progress' : s.status,
            progress: s.status === 'approved' ? 100 : s.status === 'rejected' ? 100 : 65,
            adminComment: s.reviewNotes || s.adminComment,
          }));
          setSubmissions(mapped);
          localStorage.setItem('funaab_student_uploads', JSON.stringify(mapped));
          return;
        }
      } catch {
        // Fallback to local storage
      }

      try {
        const stored = localStorage.getItem('funaab_student_uploads');
        if (stored) {
          setSubmissions(JSON.parse(stored));
        } else {
          const initialSubmissions: StudentSubmission[] = [
            {
              id: 'sub-sample-1',
              title: 'CSC 102 - Complete Modern JavaScript Handbook & DOM Guide',
              courseCode: 'CSC 102',
              courseTitle: 'Web Fundamentals & JavaScript',
              fileName: 'CSC_102_JavaScript_Guide.pdf',
              fileSize: '3.8 MB',
              collegeCode: 'COLPHYS',
              departmentName: 'Computer Science',
              departmentId: 'computer-science',
              level: 100,
              semester: 'Second Semester',
              category: 'course_materials',
              academicYear: '2025/2026',
              uploadedAt: 'Today at 09:30 AM',
              status: 'approved',
              progress: 100,
              adminComment: 'Approved by Course Rep. Document verified against FUNAAB curriculum and published to the vault.',
            },
            {
              id: 'sub-sample-2',
              title: 'MTS 101 - 2023/2024 First Semester Examination Paper Archive',
              courseCode: 'MTS 101',
              courseTitle: 'Elementary Mathematics I (Calculus & Algebra)',
              fileName: 'MTS_101_Exam_2023_2024.pdf',
              fileSize: '2.1 MB',
              collegeCode: 'COLPHYS',
              departmentName: 'Computer Science',
              departmentId: 'computer-science',
              level: 100,
              semester: 'First Semester',
              category: 'past_questions',
              academicYear: '2024/2025',
              uploadedAt: 'Yesterday at 04:15 PM',
              status: 'in_progress',
              progress: 65,
            },
            {
              id: 'sub-sample-3',
              title: 'PHS 105 - 2022 General Physics Exam Paper & Solutions Draft',
              courseCode: 'PHS 105',
              courseTitle: 'General Physics I',
              fileName: 'PHS_105_Exam_Draft_2022.pdf',
              fileSize: '1.9 MB',
              collegeCode: 'COLPHYS',
              departmentName: 'Physics',
              departmentId: 'physics',
              level: 100,
              semester: 'First Semester',
              category: 'solutions',
              academicYear: '2023/2024',
              uploadedAt: '2 days ago',
              status: 'rejected',
              progress: 100,
              adminComment: 'Rejected: Pages 3 and 4 are blurry and illegible. Please scan with adequate lighting and re-upload.',
            },
          ];
          setSubmissions(initialSubmissions);
          localStorage.setItem('funaab_student_uploads', JSON.stringify(initialSubmissions));
        }
      } catch {
        // Fallback
      }
    }

    loadLiveSubmissions();
  }, []);

  const saveSubmissions = (newItems: StudentSubmission[]) => {
    setSubmissions(newItems);
    try {
      localStorage.setItem('funaab_student_uploads', JSON.stringify(newItems));
    } catch {
      // Ignore
    }
  };

  // Sync department when college changes
  const handleCollegeChange = (cCode: string) => {
    setSelectedCollegeCode(cCode);
    const col = collegesList.find(
      (c) =>
        (c.code && c.code.toLowerCase() === cCode.toLowerCase()) ||
        (c.id && c.id.toLowerCase() === cCode.toLowerCase())
    );
    if (col && col.departments && col.departments.length > 0) {
      setSelectedDeptId(col.departments[0].id || col.departments[0].code || col.departments[0].name);
    }
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const allowed = ['pdf', 'png', 'jpg', 'jpeg', 'docx'];
      if (!ext || !allowed.includes(ext)) {
        setToastMsg('Invalid file format. Only PDF, PNG, JPEG, and DOCX files are accepted.');
        setTimeout(() => setToastMsg(null), 3500);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setToastMsg('File size exceeds the 10MB limit. Please upload a file under 10MB.');
        setTimeout(() => setToastMsg(null), 3500);
        return;
      }
      setSelectedFile(file);
    }
  };

  // Helper to get file extension badge style
  const getFileBadge = (filename: string) => {
    const ext = filename.split('.').pop()?.toUpperCase() || 'FILE';
    if (ext === 'PDF') {
      return { label: 'PDF', bg: 'bg-red-100 text-red-600 border-red-200' };
    }
    if (ext === 'DOCX' || ext === 'DOC') {
      return { label: 'DOCX', bg: 'bg-blue-100 text-blue-600 border-blue-200' };
    }
    if (ext === 'PNG' || ext === 'JPG' || ext === 'JPEG') {
      return { label: ext, bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    }
    return { label: ext, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  // Handle Form Submission
  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setToastMsg('Please choose a file (PDF, PNG, JPEG, or DOCX) to upload.');
      setTimeout(() => setToastMsg(null), 3500);
      return;
    }

    if (!courseCode.trim() || !title.trim()) {
      setToastMsg('Please enter the course code and material title.');
      setTimeout(() => setToastMsg(null), 3500);
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    // Simulated progress steps
    const t1 = setTimeout(() => setUploadProgress(45), 300);
    const t2 = setTimeout(() => setUploadProgress(80), 700);
    const t3 = setTimeout(() => {
      setUploadProgress(100);

      const newSubmission: StudentSubmission = {
        id: `sub-${Date.now()}`,
        title: title.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        courseTitle: `${courseCode.trim().toUpperCase()} Study Document`,
        fileName: selectedFile.name,
        fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        collegeCode: selectedCollegeCode,
        departmentName: activeDept?.name || 'Computer Science',
        departmentId: activeDept?.id || 'computer-science',
        level,
        semester,
        category,
        academicYear,
        notes: notes.trim(),
        uploadedAt: 'Just now',
        status: 'in_progress',
        progress: 50,
      };

      const updated = [newSubmission, ...submissions];
      saveSubmissions(updated);

      // Persist to live secured backend (Cloudflare R2 + Supabase)
      apiUploadMaterial(
        {
          university: activeUni?.code || 'FUNAAB',
          courseCode: courseCode.trim().toUpperCase(),
          title: title.trim(),
          college: selectedCollegeCode,
          department: activeDept?.name || 'Computer Science',
          level: `${level} Level`,
          semester,
          category: category === 'past_questions' ? 'Past Questions' : category === 'solutions' ? 'Solutions' : 'Course Materials',
          fileName: selectedFile.name,
          fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          fileType: selectedFile.type,
          authorName: user?.name,
          authorEmail: user?.email,
        },
        selectedFile
      )
        .then((res) => {
          if (res?.submission) {
            setSubmissions((prev) => {
              const updatedWithCloud = prev.map((s) =>
                s.id === newSubmission.id
                  ? { ...s, id: res.submission.id, fileUrl: res.submission.fileUrl }
                  : s
              );
              saveSubmissions(updatedWithCloud);
              return updatedWithCloud;
            });
          }
        })
        .catch(() => null);

      setIsUploading(false);
      setSelectedFile(null);
      setCourseCode('');
      setTitle('');
      setNotes('');
      setUploadSuccessToast('Material submitted successfully! Sent to admin for review.');
      setActiveTab('my_submissions');

      setTimeout(() => {
        setUploadSuccessToast(null);
      }, 5000);
    }, 1100);
  };

  const handlePrefillForResubmit = (sub: StudentSubmission) => {
    setSelectedCollegeCode(sub.collegeCode);
    setSelectedDeptId(sub.departmentId);
    setLevel(sub.level);
    setSemester(sub.semester);
    setCategory(sub.category);
    setCourseCode(sub.courseCode);
    setTitle(`${sub.title} (Revised)`);
    setAcademicYear(sub.academicYear);
    setActiveTab('upload_form');
  };

  const availableLevels: number[] =
    Array.isArray((activeDept as any)?.levels) && (activeDept as any).levels.length > 0
      ? [...(activeDept as any).levels].sort((a: number, b: number) => a - b)
      : (activeDept?.maxLevel === 600 ? [100, 200, 300, 400, 500, 600] : activeDept?.maxLevel === 500 ? [100, 200, 300, 400, 500] : [100, 200, 300, 400]);

  // Keep selected level valid whenever department or availableLevels changes
  useEffect(() => {
    if (availableLevels.length > 0 && !availableLevels.includes(level)) {
      setLevel(availableLevels[0]);
    }
  }, [availableLevels, level]);

  const inProgressCount = submissions.filter((s) => s.status === 'in_progress').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

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

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:w-[calc(100%-16rem)] lg:ml-64 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 min-w-0">
        {/* Breadcrumb Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-border-subtle gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-text-muted">
              <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span>/</span>
              <span className="text-text-main font-bold">Upload Study Material</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-main tracking-tight mt-1">
              Student Resource Upload Desk
            </h1>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-start sm:justify-end">
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {inProgressCount} In Review
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {approvedCount} Approved
            </span>
          </div>
        </header>

        {/* View Tabs */}
        <div className="mt-8 flex border-b border-border-subtle gap-3 sm:gap-6 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('upload_form')}
            className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload_form'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Material</span>
          </button>

          <button
            onClick={() => setActiveTab('my_submissions')}
            className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'my_submissions'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>My Submissions & Approval Tracker</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                activeTab === 'my_submissions'
                  ? 'bg-primary-light text-primary'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {submissions.length}
            </span>
          </button>
        </div>

        {/* Toast Notification */}
        {uploadSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadSuccessToast}</span>
          </motion.div>
        )}

        {/* TAB 1: UPLOAD FORM */}
        {activeTab === 'upload_form' && (
          <section className="mt-8 bg-white border border-border-subtle rounded-3xl p-6 sm:p-8 lg:p-9 shadow-xs space-y-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-bold uppercase tracking-wider">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Tailored Material Demarcation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-main">
                Contribute Academic Materials to {activeUni?.name || 'Academic Vault'}
              </h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Specify the exact institution, {termSingular.toLowerCase()}, department, level, semester, and category for this material. Once submitted, your upload will be sent to the admin for verification before going live.
              </p>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-6">
              {/* Institution Display (For students: Locked to their enrolled campus; For Admin: Selector) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span>Target University / Institution</span>
                </label>
                {user?.role === 'admin' ? (
                  <div className="relative group">
                    <select
                      value={selectedUniId}
                      onChange={(e) => setSelectedUniId(e.target.value)}
                      className="w-full appearance-none pl-4 pr-11 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition cursor-pointer hover:border-slate-300 shadow-2xs"
                    >
                      {universities.length > 0 ? (
                        universities.map((u) => (
                          <option key={u.id} value={u.id || u.code}>
                            {u.name} ({u.code})
                          </option>
                        ))
                      ) : (
                        <option value="funaab">Federal University of Agriculture, Abeokuta (FUNAAB)</option>
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted group-hover:text-primary transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {activeUni?.code || user?.university || 'UNI'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {activeUni?.name || user?.university || 'Federal University of Agriculture, Abeokuta'}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Enrolled Campus: {activeUni?.code || user?.university || 'FUNAAB'}
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-primary text-[11px] font-bold">
                      Enrolled Campus
                    </span>
                  </div>
                )}
              </div>

              {/* College & Department Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* College / Faculty Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    <span>Target {termSingular}</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedCollegeCode}
                      onChange={(e) => handleCollegeChange(e.target.value)}
                      className="w-full appearance-none pl-4 pr-11 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition cursor-pointer hover:border-slate-300 shadow-2xs"
                    >
                      {collegesList.map((c) => {
                        const val = c.code || c.id;
                        const label = c.fullName || c.name || c.code;
                        return (
                          <option key={val} value={val}>
                            {c.code ? `${c.code} — ` : ''}{label}
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted group-hover:text-primary transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Department Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    <span>Target Department</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="w-full appearance-none pl-4 pr-11 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition cursor-pointer hover:border-slate-300 shadow-2xs"
                    >
                      {(activeCollege.departments || []).map((d: any) => {
                        const val = d.id || d.code || d.name;
                        return (
                          <option key={val} value={val}>
                            {d.name} {d.code ? `(${d.code})` : ''}
                          </option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted group-hover:text-primary transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Level, Semester & Category Grid (3 Essential Filters) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Academic Level */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Academic Level
                  </label>
                  <div className="relative group">
                    <select
                      value={level}
                      onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                      className="w-full appearance-none pl-4 pr-11 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition cursor-pointer hover:border-slate-300 shadow-2xs"
                    >
                      {availableLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl} Level
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted group-hover:text-primary transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Semester Demarcation */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Semester Demarcation
                  </label>
                  <div className="relative group">
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value as 'First Semester' | 'Second Semester')}
                      className="w-full appearance-none pl-4 pr-11 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition cursor-pointer hover:border-slate-300 shadow-2xs"
                    >
                      <option value="First Semester">First Semester</option>
                      <option value="Second Semester">Second Semester</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted group-hover:text-primary transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Category (The 3 Core Repositories) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Repository Folder Category
                  </label>
                  <div className="relative group">
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as 'course_materials' | 'past_questions' | 'solutions')
                      }
                      className="w-full appearance-none pl-4 pr-11 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition cursor-pointer hover:border-slate-300 shadow-2xs"
                    >
                      <option value="course_materials">Course Materials (Lecture Notes & Slides)</option>
                      <option value="past_questions">Past Questions (Finals & Quizzes)</option>
                      <option value="solutions">Answers & Detailed Solutions</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted group-hover:text-primary transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Code & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Course Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSC 102"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-bold uppercase focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />
                </div>

                {/* Material Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Material / Document Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JavaScript & Web Programming Handbook with Practicals"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />
                </div>
              </div>

              {/* Academic Year & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Academic Session / Year
                  </label>
                  <div className="relative group">
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full appearance-none pl-4 pr-11 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition cursor-pointer hover:border-slate-300 shadow-2xs"
                    >
                      <option value="2025/2026">2025/2026</option>
                      <option value="2024/2025">2024/2025</option>
                      <option value="2023/2024">2023/2024</option>
                      <option value="2022/2023">2022/2023</option>
                      <option value="2021/2022">2021/2022</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted group-hover:text-primary transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Additional Notes for Course Rep / Admin (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verified against Professor's syllabus; includes solutions to Question 4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />
                </div>
              </div>

              {/* File Drag and Drop / Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Document Attachment (PDF, PNG, JPEG, or DOCX)
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
                    selectedFile
                      ? 'border-primary bg-primary-light/30'
                      : 'border-border-subtle hover:border-primary/60 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.docx,application/pdf,image/png,image/jpeg,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-2xl border font-extrabold flex items-center justify-center text-xs shadow-2xs ${getFileBadge(selectedFile.name).bg}`}>
                        {getFileBadge(selectedFile.name).label}
                      </div>
                      <p className="font-bold text-text-main text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-text-muted font-mono">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to Upload
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="mt-2 text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-text-main text-sm">
                          Click to browse or drag and drop your study material
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          Supports PDF, PNG, JPEG, and DOCX • Maximum file size 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Progress Bar if Uploading */}
              {isUploading && (
                <div className="space-y-2 p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="flex justify-between text-xs font-bold text-blue-900">
                    <span>Uploading document & registering submission...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className={`px-8 py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                    isUploading || !selectedFile
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20 hover:scale-[1.01]'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading...' : 'Submit Material for Admin Review'}</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TAB 2: MY SUBMISSIONS & APPROVAL TRACKER */}
        {activeTab === 'my_submissions' && (
          <section className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-text-main">
                  My Upload Submissions ({submissions.length})
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Track the verification status of your uploaded lecture notes, past questions, and solutions.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('upload_form')}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Another Material</span>
              </button>
            </div>

            {/* Submissions List */}
            <div className="space-y-5">
              {submissions.map((sub) => {
                const isApproved = sub.status === 'approved';
                const isRejected = sub.status === 'rejected';
                const isInProgress = sub.status === 'in_progress';

                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-border-subtle rounded-3xl p-6 sm:p-7 shadow-xs space-y-5 transition-all"
                  >
                    {/* Header: Title, Category, Status Badge */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-mono font-bold">
                            {sub.courseCode}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-bold uppercase">
                            {sub.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-text-muted font-medium">
                            {sub.level}L • {sub.semester}
                          </span>
                        </div>
                        <h3 className="font-bold text-text-main text-base sm:text-lg">
                          {sub.title}
                        </h3>
                        <p className="text-xs text-text-muted">
                          Target: {sub.collegeCode} • Department of {sub.departmentName} ({sub.academicYear})
                        </p>
                      </div>

                      {/* Status Chip */}
                      <div>
                        {isInProgress && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span>In Progress • Sent to Admin</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Approved & Live</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Rejected by Admin</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar Component */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold text-text-muted">
                        <span>Workflow Progress</span>
                        <span>
                          {isInProgress ? 'Step 2 of 3: Under Review' : isApproved ? 'Complete (Published)' : 'Changes Requested'}
                        </span>
                      </div>

                      {/* Visual 3-Stage Progress Indicator */}
                      <div className="relative pt-2 pb-1">
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isApproved
                                ? 'bg-emerald-500'
                                : isRejected
                                ? 'bg-red-500'
                                : 'bg-amber-500'
                            }`}
                            style={{
                              width: isInProgress ? '65%' : '100%',
                            }}
                          />
                        </div>

                        <div className="flex justify-between text-[11px] font-medium text-slate-500 mt-2">
                          <span className="text-emerald-700 font-bold">✓ 1. Uploaded</span>
                          <span className={isInProgress ? 'text-amber-700 font-bold' : 'text-slate-600 font-semibold'}>
                            {isInProgress ? '● 2. Sent to Admin (Reviewing)' : '✓ 2. Admin Inspected'}
                          </span>
                          <span
                            className={
                              isApproved
                                ? 'text-emerald-700 font-bold'
                                : isRejected
                                ? 'text-red-700 font-bold'
                                : 'text-slate-400'
                            }
                          >
                            {isApproved ? '✓ 3. Approved & Vault Live' : isRejected ? '✕ 3. Rejected' : '3. Vault Publish'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* File info banner */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-text-muted px-1 gap-2">
                      <div className="flex items-center gap-2 font-mono flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getFileBadge(sub.fileName).bg}`}>
                          {getFileBadge(sub.fileName).label}
                        </span>
                        <span className="truncate max-w-[180px] sm:max-w-xs">{sub.fileName}</span>
                        <span>•</span>
                        <span>{sub.fileSize}</span>
                        {sub.fileUrl && (
                          <div className="flex items-center gap-2 ml-2">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedPreviewDoc({
                                  id: sub.id,
                                  title: sub.title,
                                  courseCode: sub.courseCode,
                                  courseTitle: sub.courseTitle,
                                  fileName: sub.fileName,
                                  fileSize: sub.fileSize,
                                  category: sub.category,
                                  semester: sub.semester,
                                  year: sub.academicYear,
                                  uploadedBy: user?.name || 'You',
                                  verified: sub.status === 'approved',
                                  downloads: 48,
                                  previewSnippet: sub.title,
                                  fileUrl: sub.fileUrl,
                                })
                              }
                              className="inline-flex items-center gap-1 font-sans text-xs font-bold text-primary hover:underline cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-sans text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Full</span>
                            </a>
                          </div>
                        )}
                      </div>
                      <span>Submitted: {sub.uploadedAt}</span>
                    </div>

                    {/* Approved Banner */}
                    {isApproved && (
                      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Published!</strong> {sub.adminComment || 'Document has been verified and added to the departmental vault.'}
                          </span>
                        </div>
                        <Link
                          href={`/colleges/${sub.collegeCode}/${sub.departmentId}/${sub.level}`}
                          className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0"
                        >
                          <span>View in Department Vault</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}

                    {/* Rejected Banner with Admin Comment */}
                    {isRejected && (
                      <div className="p-4 rounded-2xl bg-red-50/90 border border-red-200 text-red-900 text-xs space-y-2">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-red-800">Admin Rejection Feedback:</p>
                            <p className="text-red-700 mt-0.5 leading-relaxed">
                              &quot;{sub.adminComment || 'The document does not meet syllabus verification standards. Please check pages and re-upload.'}&quot;
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-red-200/60 flex justify-end">
                          <button
                            onClick={() => handlePrefillForResubmit(sub)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Edit & Resubmit Material</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Status note when pending review */}
                    {isInProgress && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Submitted for verification by Department Course Rep / Admin</span>
                        </span>
                        <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          In Queue
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* In-App Document Preview Modal */}
      <StudentDocumentPreviewModal
        document={selectedPreviewDoc}
        onClose={() => setSelectedPreviewDoc(null)}
      />
    </div>
  );
}
