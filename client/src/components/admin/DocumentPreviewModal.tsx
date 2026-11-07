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
  ChevronDown,
  Download,
  Eye,
  FileQuestion,
  Image as ImageIcon,
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
  fileUrl?: string;
  fileKey?: string;
  storageProvider?: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base">
                  {document.courseCode}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    document.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : document.status === 'rejected'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {document.status === 'in_progress' ? 'PENDING' : document.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-md sm:max-w-xl">
                {document.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isEditing
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Edit Metadata"
            >
              <Edit3 className="h-4 w-4" />
              <span className="hidden sm:inline">{isEditing ? 'Cancel Edit' : 'Edit'}</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-slate-500 hover:text-slate-900">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Metadata Editor Accordion if Active */}
        {isEditing && (
          <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Course Code</label>
              <input
                type="text"
                value={editFields.courseCode}
                onChange={(e) => setEditFields({ ...editFields, courseCode: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Material Title</label>
              <input
                type="text"
                value={editFields.title}
                onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
              <div className="relative">
                <select
                  value={editFields.category}
                  onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
                  className="w-full appearance-none bg-white border border-slate-300 rounded-xl pl-3 pr-8 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="course_materials">Course Materials</option>
                  <option value="past_questions">Past Questions</option>
                  <option value="solutions">Solutions & Tutorials</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Level</label>
              <div className="relative">
                <select
                  value={editFields.level}
                  onChange={(e) => setEditFields({ ...editFields, level: e.target.value })}
                  className="w-full appearance-none bg-white border border-slate-300 rounded-xl pl-3 pr-8 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                  <option value="500">500 Level</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Banner */}
        {showDeleteConfirm && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>
                Are you sure you want to permanently delete <strong>{document.fileName}</strong>?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold disabled:opacity-50"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}

        {/* Main Body: Document Viewer (Left/Top) + Verification Panel (Right/Bottom) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Document In-App Reader Canvas (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200">
            {/* Viewer Controls Ribbon */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white text-xs text-slate-600 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                  {document.fileName}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {document.fileSize || 'Attached File'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {document.fileUrl && (
                  <div className="flex items-center gap-1.5">
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition"
                      title="Open full document in new tab"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Open Full</span>
                    </a>
                    <a
                      href={document.fileUrl}
                      download={document.fileName}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
                      title="Download file"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                )}

                {/* Zoom controls for Image view */}
                {document.fileUrl &&
                  (document.fileType?.includes('image') ||
                    document.fileName?.match(/\.(png|jpe?g|webp|gif|svg)$/i)) && (
                    <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                      <button
                        onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                        title="Zoom Out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <span className="font-mono text-[11px] text-slate-700 w-10 text-center font-bold">
                        {zoomLevel}%
                      </span>
                      <button
                        onClick={() => setZoomLevel((z) => Math.min(180, z + 15))}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                        title="Zoom In"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>
                  )}
              </div>
            </div>

            {/* Document Preview Canvas: Real File Rendering */}
            <div className="flex-1 min-h-[520px] flex items-center justify-center p-3 bg-slate-900/5 overflow-auto">
              {(() => {
                const url = document.fileUrl;
                const name = (document.fileName || '').toLowerCase();
                const type = (document.fileType || '').toLowerCase();

                const isPdf =
                  type.includes('pdf') ||
                  name.endsWith('.pdf') ||
                  Boolean(url && url.toLowerCase().includes('.pdf'));

                const isImage =
                  type.includes('image') ||
                  Boolean(name.match(/\.(png|jpe?g|webp|gif|svg)$/i)) ||
                  Boolean(url && url.match(/\.(png|jpe?g|webp|gif|svg)(\?|$)/i));

                const isDocx =
                  type.includes('word') ||
                  Boolean(name.match(/\.(docx?)$/i)) ||
                  Boolean(url && url.match(/\.(docx?)(\?|$)/i));

                if (isPdf && url) {
                  return (
                    <div className="w-full h-full min-h-[580px] flex flex-col rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                      <iframe
                        src={`${url}#toolbar=1`}
                        className="w-full h-full min-h-[580px] border-0"
                        title={document.title || document.fileName}
                      />
                    </div>
                  );
                }

                if (isImage && url) {
                  return (
                    <div className="w-full h-full min-h-[480px] flex items-center justify-center overflow-auto p-4">
                      <img
                        src={url}
                        alt={document.title || document.fileName}
                        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
                        className="max-h-[600px] max-w-full object-contain rounded-xl shadow-md border border-slate-200 bg-white transition-transform duration-150"
                      />
                    </div>
                  );
                }

                if (isDocx && url) {
                  return (
                    <div className="w-full h-full min-h-[580px] flex flex-col rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
                        className="w-full h-full min-h-[580px] border-0"
                        title={document.title || document.fileName}
                      />
                    </div>
                  );
                }

                if (url) {
                  return (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto my-auto">
                      <FileText className="h-14 w-14 text-blue-600 mb-3" />
                      <h4 className="text-base font-bold text-slate-800">{document.fileName}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Attached document is available for inspection and review.
                      </p>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Open / Download Real Document</span>
                      </a>
                    </div>
                  );
                }

                // Fallback for mock items created prior to cloud storage
                return (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto my-auto">
                    <FileQuestion className="h-12 w-12 text-amber-500 mb-3" />
                    <h4 className="text-base font-bold text-slate-800">Demo Registry Record</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      This item was registered as sample metadata prior to Cloudflare R2 integration. Real files uploaded by students or admins stream directly to Cloudflare R2 and display in this reader.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Verification & Review Panel (4 Cols) */}
          <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-white space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Submission Metadata
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <User className="h-4 w-4 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400">Uploaded by</p>
                    <p className="font-bold text-slate-800 truncate">
                      {document.authorName || 'Student'}
                    </p>
                    {document.authorEmail && (
                      <p className="text-[10px] text-slate-500 truncate">{document.authorEmail}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <Building2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400">Target College & Department</p>
                    <p className="font-bold text-slate-800 truncate">{collegeName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{deptName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400">Uploaded Timestamp</p>
                    <p className="font-bold text-slate-800">{document.uploadedAt}</p>
                  </div>
                </div>
              </div>

              {/* Review notes input */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Faculty Reviewer Note / Feedback
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Provide approval affirmation or specific rejection reasons for the student..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  This note is shown on the student's dashboard immediately.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleReviewAction('approved')}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve & Publish to Vault</span>
              </button>

              <button
                onClick={() => handleReviewAction('rejected')}
                disabled={isSubmitting}
                className="w-full py-2 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
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
