'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  Trash2,
  RefreshCw,
  Building2,
  GraduationCap,
  Mail,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  apiGetAdminUsers,
  apiUpdateUserRole,
  apiDeleteUser,
} from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('all');

  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const data = await apiGetAdminUsers({
        query: searchQuery,
        role: roleFilter,
        college: collegeFilter,
      });
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, collegeFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiUpdateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setToastMsg(`User role updated to ${newRole}`);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await apiDeleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setToastMsg(`User ${userToDelete.firstName || userToDelete.email} removed from directory.`);
      setUserToDelete(null);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="h-6 w-6 text-emerald-400" />
            <span>Student & User Directory</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Search registered students, review enrolled departments, and manage institutional administrative roles.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter Ribbon */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, matric number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          >
          </input>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Roles</option>
            <option value="Student">Students Only</option>
            <option value="Course Rep">Course Reps</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Colleges</option>
            <option value="COLPHYS">COLPHYS</option>
            <option value="COLBIOS">COLBIOS</option>
            <option value="COLENG">COLENG</option>
            <option value="COLAMRUD">COLAMRUD</option>
            <option value="COLPLANT">COLPLANT</option>
            <option value="COLANIM">COLANIM</option>
            <option value="COLVET">COLVET</option>
            <option value="COLFHEC">COLFHEC</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-semibold">Loading student roster...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-300">No users found</p>
            <p className="text-xs text-slate-500 mt-1">Try broadening your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Matric No / ID</th>
                  <th className="py-3 px-4">College & Dept</th>
                  <th className="py-3 px-4">Role Designation</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((u) => {
                  const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'FUNAAB Student';
                  const initials = (u.firstName?.[0] || 'S') + (u.lastName?.[0] || 'U');
                  const isAdmin = u.role === 'admin';
                  const isRep = u.role === 'Course Rep';

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                              isAdmin
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : isRep
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{fullName}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-300">
                        {u.matricNo || 'N/A'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-semibold">{u.college || 'COLPHYS'}</div>
                        <div className="text-[11px] text-slate-400">
                          {u.department || 'Computer Science'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={u.role || 'Student'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            isAdmin
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : isRep
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="Student">Student</option>
                          <option value="Course Rep">Course Rep</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3 text-rose-400">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-base">Remove User Record</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove{' '}
              <strong>
                {userToDelete.firstName || userToDelete.email} ({userToDelete.matricNo || 'Student'})
              </strong>{' '}
              from the institution directory? This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
