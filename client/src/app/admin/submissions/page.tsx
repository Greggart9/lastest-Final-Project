'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Edit3,
  RefreshCw,
  Building2,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  apiGetAdminSubmissions,
  apiReviewSubmission,
  apiDeleteSubmission,
} from '@/lib/api';
import DocumentPreviewModal, { DocumentItem } from '@/components/admin/DocumentPreviewModal';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'course_materials' | 'past_questions' | 'solutions'>('all');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadSubmissions = async () => {
    try {
      setRefreshing(true);
      const data = await apiGetAdminSubmissions({
        status: statusFilter,
        category: categoryFilter,
        query: searchQuery,
      });
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter, categoryFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadSubmissions();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleQuickApprove = async (doc: DocumentItem) => {
    try {
      await apiReviewSubmission(doc.id, 'approved', 'Approved by Academic Board.');
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === doc.id
            ? { ...s, status: 'approved', reviewNotes: 'Approved by Academic Board.' }
            : s
        )
      );
    } catch (err: any) {
      alert(err.message || 'Failed to approve');
    }
  };

  const handleQuickReject = async (doc: DocumentItem) => {
    const reason = prompt('Reason for rejection:', 'Does not meet curriculum criteria.');
    if (reason === null) return;
    try {
      await apiReviewSubmission(doc.id, 'rejected', reason || 'Rejected.');
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === doc.id ? { ...s, status: 'rejected', reviewNotes: reason || 'Rejected.' } : s
        )
      );
    } catch (err: any) {
      alert(err.message || 'Failed to reject');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this material?')) return;
    try {
      await apiDeleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleDocUpdated = (updated: DocumentItem) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDocDeleted = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  // Status counters
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(
    (s) => s.status === 'pending' || s.status === 'in_progress'
  ).length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="h-6 w-6 text-emerald-400" />
            <span>Materials Verification Desk</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review uploaded lecture notes, examination archives, and solutions in-app without downloading.
          </p>
        </div>

        <button
          onClick={loadSubmissions}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Sync Desk</span>
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Status Tab buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Submissions
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>Pending Review</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/30 text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              statusFilter === 'approved'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Approved Vault</span>
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              statusFilter === 'rejected'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </button>
        </div>

        {/* Search & Category dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course, title, student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e: any) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="course_materials">Course Materials</option>
            <option value="past_questions">Past Questions</option>
            <option value="solutions">Solutions & Tutorials</option>
          </select>
        </div>
      </div>

      {/* Submissions List / Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm font-semibold">Loading submissions desk...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
          <FileText className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">No matching submissions found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query, status tab, or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {submissions.map((doc) => {
            const isPending = doc.status === 'pending' || doc.status === 'in_progress';
            const isApproved = doc.status === 'approved';
            const isRejected = doc.status === 'rejected';

            return (
              <div
                key={doc.id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between transition-all group shadow-lg"
              >
                <div>
                  {/* Top Bar: Status pill & course code */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono font-bold text-sm text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {doc.courseCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        isApproved
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : isRejected
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {isPending ? 'Pending Review' : doc.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                    {doc.title}
                  </h4>

                  {/* File & Meta */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.fileName}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">
                        {doc.college || doc.collegeCode || 'COLPHYS'} &bull;{' '}
                        {doc.department || doc.departmentName || 'Computer Science'} ({doc.level}L)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Uploader: {doc.authorName || 'Student'}</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                  </div>

                  {/* Review comment preview if exists */}
                  {(doc.reviewNotes || doc.adminComment) && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300">
                      <span className="font-semibold text-slate-400">Note: </span>
                      {doc.reviewNotes || doc.adminComment}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 text-emerald-400" />
                    <span>In-App Preview</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {!isApproved && (
                      <button
                        onClick={() => handleQuickApprove(doc)}
                        className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 transition-colors"
                        title="Approve Material"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                    {!isRejected && (
                      <button
                        onClick={() => handleQuickReject(doc)}
                        className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-colors"
                        title="Reject Material"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-App Document Preview Modal */}
      <DocumentPreviewModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onUpdated={handleDocUpdated}
        onDeleted={handleDocDeleted}
      />
    </div>
  );
}
