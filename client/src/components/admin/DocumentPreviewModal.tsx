'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  GraduationCap,
  Calendar,
  Clock,
  User,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Edit3,
  Save,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { apiReviewSubmission, apiUpdateSubmission, apiDeleteSubmission } from '@/lib/api';

export interface DocumentItem {
  id: string;
  courseCode: string;
  title: string;
  college?: string;
  collegeCode?: string;
  department?: string;
  departmentName?: string;
  level?: string | number;
  semester?: string;
  category: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  authorName?: string;
  authorEmail?: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress';
  reviewNotes?: string;
  adminComment?: string;
}

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onUpdated: (updatedDoc: DocumentItem) => void;
  onDeleted: (id: string) => void;
}

export default function DocumentPreviewModal({
  document,
  onClose,
  onUpdated,
  onDeleted,
}: DocumentPreviewModalProps) {
  if (!document) return null;

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 14;

  // Review status & notes state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewNotes, setReviewNotes] = useState(
    document.reviewNotes || document.adminComment || ''
  );
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({
    title: document.title,
    courseCode: document.courseCode,
    category: document.category,
    level: String(document.level || '100'),
    semester: document.semester || 'First Semester',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const collegeName = document.college || document.collegeCode || 'COLPHYS';
  const deptName = document.department || document.departmentName || 'Computer Science';

  // Handle Approve or Reject
  const handleReviewAction = async (newStatus: 'approved' | 'rejected') => {
    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      const defaultNote =
        newStatus === 'approved'
          ? 'Verified against FUNAAB academic syllabus. Approved for institutional repository.'
          : 'Submission rejected: Please verify document clarity and completeness before resubmitting.';

      const finalNote = reviewNotes.trim() ? reviewNotes.trim() : defaultNote;
      await apiReviewSubmission(document.id, newStatus, finalNote);

      const updated: DocumentItem = {
        ...document,
        status: newStatus,
        reviewNotes: finalNote,
        adminComment: finalNote,
      };
      onUpdated(updated);
      setFeedbackMsg({
        type: 'success',
        text: `Document successfully marked as ${newStatus.toUpperCase()}. Student portal updated.`,
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to update review status.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Metadata Save
  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      await apiUpdateSubmission(document.id, {
        title: editFields.title,
        courseCode: editFields.courseCode.toUpperCase(),
        category: editFields.category,
        level: editFields.level,
        semester: editFields.semester,
      });

      const updated: DocumentItem = {
        ...document,
        title: editFields.title,
        courseCode: editFields.courseCode.toUpperCase(),
        category: editFields.category,
        level: editFields.level,
        semester: editFields.semester,
      };
      onUpdated(updated);
      setIsEditing(false);
      setFeedbackMsg({
        type: 'success',
        text: 'Material metadata successfully updated.',
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to update metadata.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await apiDeleteSubmission(document.id);
      onDeleted(document.id);
      onClose();
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.message || 'Failed to delete submission.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">
                  {document.courseCode}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                    document.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : document.status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {document.status === 'in_progress' ? 'PENDING' : document.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md sm:max-w-xl">
                {document.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isEditing
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Edit Metadata"
            >
              <Edit3 className="h-4 w-4" />
              <span className="hidden sm:inline">{isEditing ? 'Cancel Edit' : 'Edit'}</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div
            className={`px-6 py-2.5 text-xs font-medium border-b flex items-center justify-between ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Metadata Editor Accordion if Active */}
        {isEditing && (
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Course Code</label>
              <input
                type="text"
                value={editFields.courseCode}
                onChange={(e) => setEditFields({ ...editFields, courseCode: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Material Title</label>
              <input
                type="text"
                value={editFields.title}
                onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
              <select
                value={editFields.category}
                onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="course_materials">Course Materials</option>
                <option value="past_questions">Past Questions</option>
                <option value="solutions">Solutions & Tutorials</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Level</label>
              <select
                value={editFields.level}
                onChange={(e) => setEditFields({ ...editFields, level: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Banner */}
        {showDeleteConfirm && (
          <div className="p-4 bg-rose-950/80 border-b border-rose-800/80 flex items-center justify-between text-xs text-rose-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>
                Are you sure you want to permanently delete <strong>{document.fileName}</strong>?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold disabled:opacity-50"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}

        {/* Main Body: Document Viewer (Left/Top) + Verification Panel (Right/Bottom) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Document In-App Reader Canvas (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col bg-slate-950/70 border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Viewer Controls Ribbon */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-300">{document.fileName}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {document.fileSize || '2.4 MB'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
                  className="p-1 rounded hover:bg-slate-800 text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="font-mono text-[11px] text-slate-300 w-10 text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                  className="p-1 rounded hover:bg-slate-800 text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <span className="h-3 w-px bg-slate-700 mx-1" />
                <span className="text-[11px]">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>

            {/* Simulated High-Res Document Preview Canvas */}
            <div className="flex-1 min-h-[380px] p-6 flex items-center justify-center overflow-auto bg-slate-950">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full max-w-xl bg-white text-slate-900 rounded-lg shadow-2xl p-8 md:p-10 border border-slate-300 select-none transition-transform duration-100"
              >
                {/* Simulated Document Header */}
                <div className="text-center border-b pb-4 mb-6 border-slate-200">
                  <div className="flex justify-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                      UA
                    </div>
                  </div>
                  <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                    Federal University of Agriculture, Abeokuta
                  </h2>
                  <p className="text-[11px] text-slate-500 font-semibold">{collegeName}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{deptName}</p>
                </div>

                {/* Course & Document Title */}
                <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono font-bold text-emerald-800 px-2 py-0.5 rounded bg-emerald-100">
                      {document.courseCode}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      {document.level} Level &bull; {document.semester || 'First Semester'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mt-2">
                    {document.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 capitalize">
                    Classification: {document.category.replace('_', ' ')}
                  </p>
                </div>

                {/* Sample Document Body preview */}
                <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-serif">
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider font-sans">
                    Module 1: Foundational Principles & Scope
                  </h4>
                  <p>
                    1.1 Definition and Conceptual Framework: This syllabus overview covers the prerequisite
                    principles for {document.courseCode}. Students are expected to comprehend computational
                    theory, algorithmic complexity, structured analysis, and empirical evaluation methods.
                  </p>
                  <div className="p-3 bg-slate-100/90 rounded border-l-2 border-emerald-600 font-mono text-[11px] text-slate-800">
                    &bull; Core Objective: Systematic mastery of course syllabus units.
                    <br />
                    &bull; Academic Standard: Aligned with FUNAAB Departmental Benchmarks.
                    <br />
                    &bull; Status: Document verified against digital repository signature.
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    ... [Pages 2 through {totalPages} contain complete lecture modules, annotated proofs,
                    solved examination questions, and supplementary references] ...
                  </p>
                </div>

                {/* Document Footer */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>EduCollab Digital Archive &bull; FUNAAB</span>
                  <span>Verified Document Checksum #68a2-f901</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification & Review Panel (4 Cols) */}
          <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-slate-900/90 space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Submission Metadata
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
                  <User className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400">Uploaded by</p>
                    <p className="font-semibold text-slate-200 truncate">
                      {document.authorName || 'Student'}
                    </p>
                    {document.authorEmail && (
                      <p className="text-[10px] text-slate-400 truncate">{document.authorEmail}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
                  <Building2 className="h-4 w-4 text-sky-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400">Target College & Department</p>
                    <p className="font-semibold text-slate-200 truncate">{collegeName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{deptName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-800">
                  <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400">Uploaded Timestamp</p>
                    <p className="font-semibold text-slate-200">{document.uploadedAt}</p>
                  </div>
                </div>
              </div>

              {/* Review notes input */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Faculty Reviewer Note / Feedback
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Provide approval affirmation or specific rejection reasons for the student..."
                  rows={3}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  This note is shown on the student's dashboard immediately.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleReviewAction('approved')}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve & Publish to Vault</span>
              </button>

              <button
                onClick={() => handleReviewAction('rejected')}
                disabled={isSubmitting}
                className="w-full py-2 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject with Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
