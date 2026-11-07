'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileText,
  Building2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { apiAdminUploadMaterial, apiGetUniversities } from '@/lib/api';

export default function AdminUploadPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedUniId, setSelectedUniId] = useState('funaab');
  const [selectedCollegeCode, setSelectedCollegeCode] = useState('COLPHYS');
  const [selectedDeptName, setSelectedDeptName] = useState('Computer Science');
  const [level, setLevel] = useState('100');
  const [semester, setSemester] = useState('First Semester');
  const [category, setCategory] = useState('course_materials');
  const [courseCode, setCourseCode] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('3.2 MB');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUnis() {
      try {
        setLoading(true);
        const data = await apiGetUniversities();
        setUniversities(data.universities || []);
      } catch (err) {
        console.error('Failed to load universities for upload:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUnis();
  }, []);

  const activeUni = universities.find((u) => u.id === selectedUniId) || universities[0];
  const activeColleges = activeUni?.colleges || [];
  const activeCollege = activeColleges.find((c: any) => c.code === selectedCollegeCode) || activeColleges[0];
  const activeDepartments = activeCollege?.departments || [];
  const activeDept = activeDepartments.find((d: any) => d.name === selectedDeptName || d.code === selectedDeptName) || activeDepartments[0];

  const availableLevels: number[] = Array.isArray(activeDept?.levels) && activeDept.levels.length > 0
    ? [...activeDept.levels].sort((a: number, b: number) => a - b)
    : [100, 200, 300, 400, 500, 600];

  // When college changes, select its first department
  useEffect(() => {
    if (activeDepartments.length > 0) {
      setSelectedDeptName(activeDepartments[0].name);
    }
  }, [selectedCollegeCode]);

  // Keep selected level valid with current department's authorized levels
  useEffect(() => {
    if (availableLevels.length > 0 && !availableLevels.map(String).includes(level)) {
      setLevel(String(availableLevels[0]));
    }
  }, [availableLevels, level]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} MB`);
      if (!title) {
        const generatedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(generatedTitle);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorToast(null);
    setSuccessToast(null);

    if (!courseCode.trim() || !title.trim()) {
      setErrorToast('Course code and document title are required.');
      return;
    }

    const resolvedFileName = fileName.trim() || `${courseCode.trim().toUpperCase()}_Course_Material.pdf`;

    try {
      setIsSubmitting(true);
      await apiAdminUploadMaterial(
        {
          courseCode: courseCode.trim().toUpperCase(),
          title: title.trim(),
          college: selectedCollegeCode,
          department: selectedDeptName,
          level,
          semester,
          category,
          fileName: resolvedFileName,
          fileSize,
          fileType: selectedFile?.type || 'application/pdf',
        },
        selectedFile || undefined
      );

      setSuccessToast(`Material for ${courseCode.toUpperCase()} successfully uploaded and published directly to the project vault!`);
      setCourseCode('');
      setTitle('');
      setSelectedFile(null);
      setFileName('');
    } catch (err: any) {
      setErrorToast(err.message || 'Failed to upload material.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Administrator Direct Publishing Desk</span>
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <UploadCloud className="h-6 w-6 text-blue-600" />
          <span>Upload Academic Material to Repository</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Materials uploaded by an administrator are automatically approved and instantly visible to all students in the vault without needing verification.
        </p>
      </div>

      {/* Success Alert */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <Link
            href="/admin/submissions?status=approved"
            className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors whitespace-nowrap"
          >
            View in Vault
          </Link>
        </div>
      )}

      {/* Error Alert */}
      {errorToast && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Upload Form Card (Light Palette, Spaced Dropdowns) */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Academic Target Selectors */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span>Academic Target Scope</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* University */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">University</label>
              <div className="relative">
                <select
                  value={selectedUniId}
                  onChange={(e) => setSelectedUniId(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} ({uni.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* College */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">College</label>
              <div className="relative">
                <select
                  value={selectedCollegeCode}
                  onChange={(e) => setSelectedCollegeCode(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {activeColleges.map((c: any) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
              <div className="relative">
                <select
                  value={selectedDeptName}
                  onChange={(e) => setSelectedDeptName(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {activeDepartments.map((d: any) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Level, Semester & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Academic Level</label>
            <div className="relative">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {availableLevels.map((lvl) => (
                  <option key={lvl} value={String(lvl)}>
                    {lvl} Level
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Semester</label>
            <div className="relative">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Material Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="course_materials">Course Materials (Lecture Notes)</option>
                <option value="past_questions">Past Questions Archive</option>
                <option value="solutions">Solutions & Tutorials</option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Course Code & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Course Code</label>
            <input
              type="text"
              required
              placeholder="e.g. CSC 101"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 uppercase font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Document / Course Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Introduction to Computer Science & Python Algorithms"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* File Dropzone */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Attach File (PDF, DOCX)</label>
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50 relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">
              {fileName ? fileName : 'Click to select or drag and drop a PDF file'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {fileName ? `${fileSize} • Ready for upload` : 'PDF, DOCX up to 50MB'}
            </p>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Automatic Instant Approval Enabled</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            <span>{isSubmitting ? 'Publishing...' : 'Publish Directly to Vault'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
