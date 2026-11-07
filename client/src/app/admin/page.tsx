'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Eye,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  apiGetAdminStats,
  apiGetAdminSubmissions,
  apiReviewSubmission,
} from '@/lib/api';
import DocumentPreviewModal, { DocumentItem } from '@/components/admin/DocumentPreviewModal';

const CATEGORY_COLORS = ['#2563eb', '#059669', '#d97706', '#7c3aed'];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [pendingSubmissions, setPendingSubmissions] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Selected document for preview modal
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [statsData, submissionsData] = await Promise.all([
        apiGetAdminStats(),
        apiGetAdminSubmissions({ status: 'pending' }),
      ]);
      setStats(statsData);
      setPendingSubmissions(submissionsData.submissions || []);
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000); // 20s sync
    return () => clearInterval(interval);
  }, []);

  const handleQuickApprove = async (doc: DocumentItem) => {
    try {
      await apiReviewSubmission(doc.id, 'approved', 'Verified and approved by Academic Board.');
      setPendingSubmissions((prev) => prev.filter((s) => s.id !== doc.id));
      if (stats) {
        setStats({
          ...stats,
          pendingCount: Math.max(0, stats.pendingCount - 1),
          approvedCount: stats.approvedCount + 1,
        });
      }
      setToastMsg(`Approved "${doc.title || doc.courseCode}" successfully.`);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      setToastMsg(err.message || 'Failed to approve submission.');
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const handleQuickReject = async (doc: DocumentItem) => {
    try {
      await apiReviewSubmission(doc.id, 'rejected', 'Document does not meet quality standards.');
      setPendingSubmissions((prev) => prev.filter((s) => s.id !== doc.id));
      if (stats) {
        setStats({
          ...stats,
          pendingCount: Math.max(0, stats.pendingCount - 1),
          rejectedCount: stats.rejectedCount + 1,
        });
      }
      setToastMsg(`Rejected "${doc.title || doc.courseCode}".`);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      setToastMsg(err.message || 'Failed to reject submission.');
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const handleDocUpdated = (updatedDoc: DocumentItem) => {
    if (updatedDoc.status !== 'pending' && updatedDoc.status !== 'in_progress') {
      setPendingSubmissions((prev) => prev.filter((s) => s.id !== updatedDoc.id));
    } else {
      setPendingSubmissions((prev) =>
        prev.map((s) => (s.id === updatedDoc.id ? updatedDoc : s))
      );
    }
    fetchData();
  };

  const handleDocDeleted = (deletedId: string) => {
    setPendingSubmissions((prev) => prev.filter((s) => s.id !== deletedId));
    fetchData();
  };

  const monthlyData = (stats?.monthlyActivity || []).map((m: any) => ({
    month: m.month,
    uploads: Number(m.uploads ?? m.submissions ?? 0),
    approved: Number(m.approved ?? m.approvals ?? 0),
  }));

  const categoryData = (stats?.categoryBreakdown || []).map((c: any) => ({
    name: c.name,
    value: Number(c.value ?? c.count ?? 0),
    color: c.color,
  }));

  const collegeData = (stats?.collegeBreakdown || []).map((col: any) => ({
    code: col.code || col.college || 'COLPHYS',
    count: Number(col.count ?? col.materials ?? 0),
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            Institutional Governance Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time verification queue, document analytics, and academic curriculum oversight across institutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Live Data'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Registered Students
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {stats ? stats.totalStudents : '...'}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-700 font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Across 8 FUNAAB Colleges</span>
          </div>
        </div>

        {/* Total Uploaded Materials */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Vault Materials
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {stats ? stats.totalMaterials : '...'}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{stats?.approvedCount ?? 0} Live & Verified</span>
          </div>
        </div>

        {/* Pending In Queue */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending in Queue
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            {stats ? stats.pendingCount : '...'}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-700 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Awaiting Faculty Review</span>
          </div>
        </div>

        {/* Approval Rate */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Approval Rate
            </span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {stats ? `${stats.approvalRate}%` : '...'}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-700 font-semibold">
            <span>Verified syllabus compliance</span>
          </div>
        </div>
      </div>

      {/* Main Visualizations Row: Area Line Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Trend Area Chart (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Uploads & Verification Activity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly volume of student submissions vs. approved academic documents
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUploadsLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorApprovedLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '0.75rem',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="uploads"
                    name="Student Submissions"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUploadsLight)"
                  />
                  <Area
                    type="monotone"
                    dataKey="approved"
                    name="Approved to Vault"
                    stroke="#059669"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorApprovedLight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-slate-50 animate-pulse rounded-xl" />
            )}
          </div>
        </div>

        {/* Right: Category Distribution Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-base font-bold text-slate-900">Content Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Distribution by study material category</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '0.75rem',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 w-44 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin" />
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {categoryData.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value} docs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* College Breakdown Bar Chart */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Submissions by College</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Volume of academic materials archived per college across FUNAAB
            </p>
          </div>
          <Link
            href="/admin/academic"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Manage Academic Units</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="h-64 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collegeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="code" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" name="Verified Materials" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-slate-50 animate-pulse rounded-xl" />
          )}
        </div>
      </div>

      {/* Live "Pending Approvals Queue" Table with In-App Preview */}
      <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Pending Verification Queue</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {pendingSubmissions.length} waiting
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Click preview to inspect curriculum details without downloading. Approving or rejecting updates the student immediately.
              </p>
            </div>
          </div>

          <Link
            href="/admin/submissions"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
          >
            <span>Open Full Submissions Desk</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Table / List */}
        {pendingSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">Verification Queue is Clear!</p>
            <p className="text-xs text-slate-500 mt-1">
              All student submissions have been reviewed and published to the vault.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Course / Material</th>
                  <th className="py-3 px-4">College / Dept</th>
                  <th className="py-3 px-4">Uploader</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingSubmissions.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-blue-600">{doc.courseCode}</div>
                      <div className="text-slate-900 font-semibold truncate max-w-xs">{doc.title}</div>
                      <div className="text-[10px] text-slate-400">{doc.fileName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-bold">
                        {doc.college || doc.collegeCode || 'COLPHYS'}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {doc.department || doc.departmentName || 'Computer Science'} &bull; {doc.level}L
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{doc.authorName || 'Student'}</div>
                      <div className="text-slate-400 text-[10px]">{doc.uploadedAt}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {doc.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                        In Queue
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                          title="Preview Document in App"
                        >
                          <Eye className="h-3.5 w-3.5 text-blue-600" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => handleQuickApprove(doc)}
                          className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 transition-colors"
                          title="Quick Approve"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleQuickReject(doc)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-200 transition-colors"
                          title="Quick Reject"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* In-App PDF / Document Preview Modal */}
      <DocumentPreviewModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onUpdated={handleDocUpdated}
        onDeleted={handleDocDeleted}
      />

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
