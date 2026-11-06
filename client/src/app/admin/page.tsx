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

const CATEGORY_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [pendingSubmissions, setPendingSubmissions] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Selected document for preview modal
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

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
    const interval = setInterval(fetchData, 20000); // 20s live sync
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
    } catch (err: any) {
      alert(err.message || 'Failed to approve');
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
    } catch (err: any) {
      alert(err.message || 'Failed to reject');
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

  // Default fallback chart data if empty
  const monthlyData = stats?.monthlyActivity?.length
    ? stats.monthlyActivity
    : [
        { month: 'Oct', uploads: 12, approved: 10 },
        { month: 'Nov', uploads: 28, approved: 24 },
        { month: 'Dec', uploads: 19, approved: 17 },
        { month: 'Jan', uploads: 35, approved: 30 },
        { month: 'Feb', uploads: 48, approved: 42 },
        { month: 'Mar', uploads: 54, approved: 49 },
      ];

  const categoryData = stats?.categoryBreakdown?.length
    ? stats.categoryBreakdown
    : [
        { name: 'Course Materials', value: 45 },
        { name: 'Past Questions', value: 35 },
        { name: 'Solutions & Notes', value: 20 },
      ];

  const collegeData = stats?.collegeBreakdown?.length
    ? stats.collegeBreakdown
    : [
        { code: 'COLPHYS', count: 28 },
        { code: 'COLBIOS', count: 18 },
        { code: 'COLENG', count: 22 },
        { code: 'COLAMRUD', count: 12 },
        { code: 'COLPLANT', count: 9 },
        { code: 'COLVET', count: 6 },
      ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Institutional Governance Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time verification queue, document analytics, and FUNAAB curriculum oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Live Data'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 p-5 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Registered Students
            </span>
            <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats ? stats.totalStudents : '...'}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-sky-400 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Across 8 FUNAAB Colleges</span>
          </div>
        </div>

        {/* Total Uploaded Materials */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 p-5 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Vault Materials
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats ? stats.totalMaterials : '...'}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{stats?.approvedCount ?? 0} Live & Verified</span>
          </div>
        </div>

        {/* Pending In Queue */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 p-5 border border-slate-800 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pending in Queue
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-300">
            {stats ? stats.pendingCount : '...'}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Awaiting Faculty Review</span>
          </div>
        </div>

        {/* Approval Rate */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 p-5 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Approval Rate
            </span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats ? `${stats.approvalRate}%` : '...'}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-400 font-medium">
            <span>Verified syllabus compliance</span>
          </div>
        </div>
      </div>

      {/* Main Visualizations Row: Area Line Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Trend Area Chart (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Uploads & Verification Activity</span>
              </h3>
              <p className="text-xs text-slate-400">
                Monthly volume of student submissions vs. approved academic documents
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="uploads"
                  name="Student Submissions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUploads)"
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  name="Approved to Vault"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApproved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Category Distribution Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-base font-bold text-white">Content Breakdown</h3>
            <p className="text-xs text-slate-400">Distribution by study material classification</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
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
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
            {categoryData.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold text-slate-200">{item.value} docs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* College Breakdown Bar Chart */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Submissions by College</h3>
            <p className="text-xs text-slate-400">
              Volume of academic materials archived per college across FUNAAB
            </p>
          </div>
          <Link
            href="/admin/academic"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Manage Academic Units</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={collegeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="code" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" name="Verified Materials" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live "Pending Approvals Queue" Table with In-App Preview */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d1426]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Pending Verification Queue</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pendingSubmissions.length} waiting
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Click preview to inspect curriculum details without downloading. Approving or rejecting updates the student immediately.
              </p>
            </div>
          </div>

          <Link
            href="/admin/submissions"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Open Full Submissions Desk</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Table / List */}
        {pendingSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="h-10 w-10 text-emerald-500/50 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-200">Verification Queue is Clear!</p>
            <p className="text-xs text-slate-500 mt-1">
              All student submissions have been reviewed and published to the vault.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Course / Material</th>
                  <th className="py-3 px-4">College / Dept</th>
                  <th className="py-3 px-4">Uploader</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {pendingSubmissions.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-emerald-400">{doc.courseCode}</div>
                      <div className="text-slate-200 font-medium truncate max-w-xs">{doc.title}</div>
                      <div className="text-[10px] text-slate-500">{doc.fileName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-semibold">
                        {doc.college || doc.collegeCode || 'COLPHYS'}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {doc.department || doc.departmentName || 'Computer Science'} &bull; {doc.level}L
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200">{doc.authorName || 'Student'}</div>
                      <div className="text-slate-500 text-[10px]">{doc.uploadedAt}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                        {doc.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        In Queue
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1 transition-colors"
                          title="Preview Document in App"
                        >
                          <Eye className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => handleQuickApprove(doc)}
                          className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 transition-colors"
                          title="Quick Approve"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleQuickReject(doc)}
                          className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-colors"
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
    </div>
  );
}
