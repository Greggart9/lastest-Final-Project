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
  ChevronDown,
  UserPlus,
} from 'lucide-react';
import {
  apiGetAdminUsers,
  apiUpdateUserRole,
  apiDeleteUser,
  apiCreateAdminUser,
  apiGetUniversities,
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

  // Create User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const [newUserForm, setNewUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    matricNo: '',
    role: 'Student',
    university: 'FUNAAB',
    college: 'COLPHYS',
    department: 'Computer Science',
  });
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    async function loadUnis() {
      try {
        const data = await apiGetUniversities();
        const list = data.universities || [];
        setUniversities(list);
        if (list.length > 0) {
          const initUni = list.find((u: any) => u.code?.toUpperCase() === 'FUNAAB') || list[0];
          const initDivs = initUni.colleges || [];
          const firstDiv = initDivs[0];
          setNewUserForm((prev) => ({
            ...prev,
            university: initUni.code || 'FUNAAB',
            college: firstDiv ? firstDiv.code || firstDiv.name : 'COLPHYS',
            department: firstDiv?.departments?.[0]?.name || 'Computer Science',
          }));
        }
      } catch (e) {
        console.error('Failed to load universities:', e);
      }
    }
    loadUnis();
  }, []);

  const activeNewUni = universities.find(
    (u) => u.code?.toUpperCase() === newUserForm.university.toUpperCase() || u.id === newUserForm.university.toLowerCase()
  ) || universities[0] || null;

  const isFaculty = activeNewUni?.academicTerm === 'faculty';
  const divisionTerm = isFaculty ? 'Faculty' : 'College';
  const activeDivisions = activeNewUni?.colleges || [];

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.email.trim() || !newUserForm.password.trim()) {
      setToastMsg('Email and password are required.');
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }
    try {
      setCreatingUser(true);
      await apiCreateAdminUser(newUserForm);
      setShowAddModal(false);
      setNewUserForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        matricNo: '',
        role: 'Student',
        university: activeNewUni?.code || 'FUNAAB',
        college: activeDivisions[0]?.code || activeDivisions[0]?.name || 'COLPHYS',
        department: activeDivisions[0]?.departments?.[0]?.name || 'Computer Science',
      });
      setToastMsg('User account created and saved directly to the database!');
      setTimeout(() => setToastMsg(null), 3000);
      await fetchUsers();
    } catch (err: any) {
      setToastMsg(err.message || 'Failed to create user account.');
      setTimeout(() => setToastMsg(null), 3000);
    } finally {
      setCreatingUser(false);
    }
  };

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
      setToastMsg(err.message || 'Failed to update user role.');
      setTimeout(() => setToastMsg(null), 3000);
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
      setToastMsg(err.message || 'Failed to delete user.');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="h-6 w-6 text-blue-600" />
            <span>Student & User Directory</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search registered students, review enrolled departments, and manage institutional administrative roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Add User</span>
          </button>

          <button
            onClick={fetchUsers}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors self-start sm:self-auto disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh Directory</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter Ribbon with Spaced Select Dropdowns */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, matric number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="Student">Students Only</option>
              <option value="Course Rep">Course Reps</option>
              <option value="admin">Administrators</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="appearance-none pl-3.5 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
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
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* User Table (Light Palette) */}
      <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-sm font-semibold">Loading student roster...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-800">No users found</p>
            <p className="text-xs text-slate-400 mt-1">Try broadening your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Matric No / ID</th>
                  <th className="py-3 px-4">College & Dept</th>
                  <th className="py-3 px-4">Role Designation</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'FUNAAB Student';
                  const initials = (u.firstName?.[0] || 'S') + (u.lastName?.[0] || 'U');
                  const isAdmin = u.role === 'admin';
                  const isRep = u.role === 'Course Rep';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                              isAdmin
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : isRep
                                ? 'bg-sky-100 text-sky-700 border border-sky-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{fullName}</p>
                            <p className="text-[11px] text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {u.matricNo || 'N/A'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-900 font-bold">{u.college || 'COLPHYS'}</div>
                        <div className="text-[11px] text-slate-500">
                          {u.department || 'Computer Science'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="relative inline-block">
                          <select
                            value={u.role || 'Student'}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className={`appearance-none pl-3 pr-8 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              isAdmin
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : isRep
                                ? 'bg-sky-50 text-sky-800 border-sky-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="Student">Student</option>
                            <option value="Course Rep">Course Rep</option>
                            <option value="admin">Administrator</option>
                          </select>
                          <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Register New Account</h3>
                  <p className="text-[11px] text-slate-500">Persists directly to live Supabase database</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel"
                    value={newUserForm.firstName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adeleke"
                    value={newUserForm.lastName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. adeleke@funaab.edu.ng"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Temporary Password</label>
                  <input
                    type="password"
                    required
                    minLength={7}
                    placeholder="Min. 7 characters"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Matric Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 2021/1042"
                    value={newUserForm.matricNo}
                    onChange={(e) => setNewUserForm({ ...newUserForm, matricNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">University</label>
                  <select
                    value={newUserForm.university}
                    onChange={(e) => {
                      const newUniVal = e.target.value;
                      const selectedUni = universities.find(
                        (u) => u.code?.toUpperCase() === newUniVal.toUpperCase() || u.id === newUniVal.toLowerCase()
                      );
                      const divs = selectedUni?.colleges || [];
                      const firstD = divs[0];
                      setNewUserForm({
                        ...newUserForm,
                        university: selectedUni?.code || newUniVal,
                        college: firstD ? (firstD.code || firstD.name) : '',
                        department: firstD?.departments?.[0]?.name || '',
                      });
                    }}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  >
                    {universities.map((uni) => (
                      <option key={uni.id || uni.code} value={uni.code || uni.name}>
                        {uni.name} ({uni.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  >
                    <option value="Student">Student</option>
                    <option value="Course Rep">Course Rep</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{divisionTerm}</label>
                  <select
                    value={newUserForm.college}
                    onChange={(e) => {
                      const colVal = e.target.value;
                      const colObj = activeDivisions.find((d: any) => (d.code || d.name) === colVal);
                      setNewUserForm({
                        ...newUserForm,
                        college: colVal,
                        department: colObj?.departments?.[0]?.name || '',
                      });
                    }}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                  >
                    {activeDivisions.map((div: any) => (
                      <option key={div.id || div.code || div.name} value={div.code || div.name}>
                        {div.fullName || div.name} {div.code ? `(${div.code})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  {(() => {
                    const selCol = activeDivisions.find((d: any) => (d.code || d.name) === newUserForm.college);
                    const depts = selCol?.departments || [];
                    if (depts.length > 0) {
                      return (
                        <select
                          value={newUserForm.department}
                          onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                          className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium"
                        >
                          {depts.map((dept: any) => (
                            <option key={dept.id || dept.name} value={dept.name}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      );
                    }
                    return (
                      <input
                        type="text"
                        placeholder="Department name"
                        value={newUserForm.department}
                        onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                      />
                    );
                  })()}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
                >
                  {creatingUser ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3 text-rose-600">
              <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Remove User Record</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove{' '}
              <strong>
                {userToDelete.firstName || userToDelete.email} ({userToDelete.matricNo || 'Student'})
              </strong>{' '}
              from the institution directory? This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
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
