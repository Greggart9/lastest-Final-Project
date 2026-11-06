'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Building2,
  Folder,
  FolderOpen,
  GraduationCap,
  Layers,
  Plus,
  Trash2,
  Edit3,
  ChevronRight,
  ArrowLeft,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  apiGetUniversities,
  apiCreateUniversity,
  apiUpdateUniversity,
  apiDeleteUniversity,
  apiCreateCollege,
  apiUpdateCollege,
  apiDeleteCollege,
  apiCreateDepartment,
  apiUpdateDepartment,
  apiDeleteDepartment,
} from '@/lib/api';

export default function AcademicHierarchyPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation Drill-Down State
  // Selected University -> Selected College -> Selected Department
  const [selectedUniId, setSelectedUniId] = useState<string>('funaab');
  const [selectedCollegeCode, setSelectedCollegeCode] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Modals & form states
  const [showAddUniModal, setShowAddUniModal] = useState(false);
  const [newUniForm, setNewUniForm] = useState({ name: '', code: '', shortName: '' });

  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [newCollegeForm, setNewCollegeForm] = useState({ code: '', name: '', fullName: '' });

  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({ name: '', code: '' });

  // Inline edit state
  const [editingItem, setEditingItem] = useState<{
    type: 'university' | 'college' | 'department';
    id: string;
    data: any;
  } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiGetUniversities();
      setUniversities(data.universities || []);
    } catch (err) {
      console.error('Failed to load universities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeUni = universities.find((u) => u.id === selectedUniId) || universities[0];
  const activeCollege = activeUni?.colleges?.find(
    (c: any) => c.code === selectedCollegeCode
  );
  const activeDept = activeCollege?.departments?.find(
    (d: any) => d.id === selectedDeptId
  );

  // ----------------------------------------------------
  // University Handlers
  // ----------------------------------------------------
  const handleCreateUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniForm.name || !newUniForm.code) return;
    try {
      await apiCreateUniversity(newUniForm);
      setNewUniForm({ name: '', code: '', shortName: '' });
      setShowAddUniModal(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create university.');
    }
  };

  const handleDeleteUniversity = async (id: string, name: string) => {
    if (id === 'funaab') {
      alert('FUNAAB is the flagship institution and cannot be removed.');
      return;
    }
    if (!confirm(`Are you sure you want to delete "${name}" and all its colleges?`)) return;
    try {
      await apiDeleteUniversity(id);
      if (selectedUniId === id) setSelectedUniId('funaab');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete university.');
    }
  };

  // ----------------------------------------------------
  // College Handlers
  // ----------------------------------------------------
  const handleCreateCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeForm.code || !newCollegeForm.name) return;
    try {
      await apiCreateCollege({
        universityId: activeUni.id,
        code: newCollegeForm.code.toUpperCase(),
        name: newCollegeForm.name,
        fullName: newCollegeForm.fullName || `College of ${newCollegeForm.name}`,
      });
      setNewCollegeForm({ code: '', name: '', fullName: '' });
      setShowAddCollegeModal(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create college.');
    }
  };

  const handleDeleteCollege = async (collegeId: string, collegeName: string) => {
    if (!confirm(`Delete "${collegeName}" and all associated departments?`)) return;
    try {
      await apiDeleteCollege(collegeId, activeUni.id);
      if (selectedCollegeCode === collegeId) setSelectedCollegeCode(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete college.');
    }
  };

  // ----------------------------------------------------
  // Department Handlers
  // ----------------------------------------------------
  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptForm.name || !selectedCollegeCode) return;
    try {
      await apiCreateDepartment({
        universityId: activeUni.id,
        collegeCode: selectedCollegeCode,
        name: newDeptForm.name,
        code: newDeptForm.code,
        levels: [100, 200, 300, 400, 500],
      });
      setNewDeptForm({ name: '', code: '' });
      setShowAddDeptModal(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create department.');
    }
  };

  const handleDeleteDepartment = async (deptId: string, deptName: string) => {
    if (!confirm(`Delete department "${deptName}"?`)) return;
    try {
      await apiDeleteDepartment(deptId, selectedCollegeCode!, activeUni.id);
      if (selectedDeptId === deptId) setSelectedDeptId(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete department.');
    }
  };

  // ----------------------------------------------------
  // Level Management Handlers
  // ----------------------------------------------------
  const handleToggleLevel = async (levelNumber: number) => {
    if (!activeDept || !selectedCollegeCode) return;
    const currentLevels: number[] = activeDept.levels || [100, 200, 300, 400, 500];
    let updatedLevels: number[];

    if (currentLevels.includes(levelNumber)) {
      if (currentLevels.length <= 1) {
        alert('A department must have at least one academic level.');
        return;
      }
      updatedLevels = currentLevels.filter((lvl) => lvl !== levelNumber);
    } else {
      updatedLevels = [...currentLevels, levelNumber].sort((a, b) => a - b);
    }

    try {
      await apiUpdateDepartment(
        activeDept.id,
        { levels: updatedLevels },
        selectedCollegeCode,
        activeUni.id
      );
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update levels.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <FolderTree className="h-6 w-6 text-emerald-400" />
              <span>Academic Structure & Curriculum Hierarchy</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Configure Universities &rarr; Colleges &rarr; Departments &rarr; Academic Levels.
            </p>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reload Hierarchy</span>
          </button>
        </div>

        {/* Drilldown Navigation Breadcrumb Trail */}
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400 overflow-x-auto py-1">
          <button
            onClick={() => {
              setSelectedCollegeCode(null);
              setSelectedDeptId(null);
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
              !selectedCollegeCode
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>{activeUni ? activeUni.shortName || activeUni.code : 'FUNAAB'}</span>
          </button>

          {selectedCollegeCode && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
              <button
                onClick={() => setSelectedDeptId(null)}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                  !selectedDeptId
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'hover:text-white hover:bg-slate-800'
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5 text-amber-400" />
                <span>{selectedCollegeCode}</span>
              </button>
            </>
          )}

          {selectedDeptId && activeDept && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
              <div className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>{activeDept.name}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Universities Directory & Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Universities Directory
                </h3>
              </div>
              <button
                onClick={() => setShowAddUniModal(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New University</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Select an institution to explore or edit its academic colleges and curriculum units.
            </p>

            <div className="space-y-2">
              {universities.map((uni) => {
                const isSelected = activeUni?.id === uni.id;
                const isFlagship = uni.id === 'funaab';

                return (
                  <div
                    key={uni.id}
                    onClick={() => {
                      setSelectedUniId(uni.id);
                      setSelectedCollegeCode(null);
                      setSelectedDeptId(null);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {uni.code.substring(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-white truncate">{uni.name}</p>
                          {isFlagship && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Active Root
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {uni.colleges?.length || 0} Colleges configured
                        </p>
                      </div>
                    </div>

                    {!isFlagship && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUniversity(uni.id, uni.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-opacity"
                        title="Delete University"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Hierarchy Drilldown (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* LEVEL 1: Colleges within selected university */}
          {!selectedCollegeCode && activeUni && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Folder className="h-5 w-5 text-amber-400" />
                    <span>Colleges in {activeUni.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click a college folder to view its academic departments and levels.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddCollegeModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add College</span>
                </button>
              </div>

              {/* Colleges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {activeUni.colleges?.map((college: any) => (
                  <div
                    key={college.code}
                    onClick={() => setSelectedCollegeCode(college.code)}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          {college.code}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCollege(college.code, college.name);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-rose-400 transition-opacity"
                          title="Delete College"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{college.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {college.fullName || college.name}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{college.departments?.length || 0} Departments</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 2: Departments within selected College */}
          {selectedCollegeCode && activeCollege && !selectedDeptId && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCollegeCode(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h3 className="text-base font-bold text-white">
                      Departments in {activeCollege.code} ({activeCollege.name})
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 pl-6">
                    Manage departments and curriculum level authorizations for this college.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddDeptModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Department</span>
                </button>
              </div>

              {/* Department Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {activeCollege.departments?.map((dept: any) => (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-800/80 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <GraduationCap className="h-4 w-4 text-sky-400" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDepartment(dept.id, dept.name);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-rose-400 transition-opacity"
                          title="Delete Department"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{dept.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Active Levels: {(dept.levels || [100, 200, 300, 400, 500]).join(', ')}L
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Configure Levels</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 3: Level Configuration inside Department */}
          {selectedDeptId && activeDept && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDeptId(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {activeDept.name} &bull; Academic Levels
                    </h3>
                    <p className="text-xs text-slate-400">
                      {activeCollege?.code} &bull; {activeUni?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Levels Checklist / Toggles */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Configured Levels for this Department
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Toggle levels to make study materials, past questions, and lecture handbooks available for students of those tiers.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[100, 200, 300, 400, 500, 600].map((lvl) => {
                    const isEnabled = (activeDept.levels || [100, 200, 300, 400, 500]).includes(lvl);
                    return (
                      <div
                        key={lvl}
                        onClick={() => handleToggleLevel(lvl)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isEnabled
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold text-white">{lvl} Level</p>
                          <p className="text-[10px] text-slate-400">
                            {isEnabled ? 'Active in Portal' : 'Disabled'}
                          </p>
                        </div>
                        <div
                          className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isEnabled
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-600'
                          }`}
                        >
                          {isEnabled ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create University */}
      {showAddUniModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-400" />
                <span>Create University Folder</span>
              </h3>
              <button
                onClick={() => setShowAddUniModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUniversity} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">University Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Lagos"
                  value={newUniForm.name}
                  onChange={(e) => setNewUniForm({ ...newUniForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Acronym / Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UNILAG"
                    value={newUniForm.code}
                    onChange={(e) =>
                      setNewUniForm({ ...newUniForm, code: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 uppercase font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Short Name</label>
                  <input
                    type="text"
                    placeholder="e.g. UNILAG (Akoka)"
                    value={newUniForm.shortName}
                    onChange={(e) => setNewUniForm({ ...newUniForm, shortName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUniModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
                >
                  Create University
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create College */}
      {showAddCollegeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Folder className="h-4 w-4 text-emerald-400" />
                <span>Add College to {activeUni?.name}</span>
              </h3>
              <button
                onClick={() => setShowAddCollegeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCollege} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">College Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COLMAS"
                  value={newCollegeForm.code}
                  onChange={(e) =>
                    setNewCollegeForm({ ...newCollegeForm, code: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 uppercase font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Short Name / Core Field</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Management Sciences"
                  value={newCollegeForm.name}
                  onChange={(e) => setNewCollegeForm({ ...newCollegeForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Full Formal College Name</label>
                <input
                  type="text"
                  placeholder="e.g. College of Management Sciences"
                  value={newCollegeForm.fullName}
                  onChange={(e) => setNewCollegeForm({ ...newCollegeForm, fullName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCollegeModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
                >
                  Add College
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Department */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-sky-400" />
                <span>Add Department to {selectedCollegeCode}</span>
              </h3>
              <button
                onClick={() => setShowAddDeptModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accounting"
                  value={newDeptForm.name}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Course Code Prefix (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ACC"
                  value={newDeptForm.code}
                  onChange={(e) =>
                    setNewDeptForm({ ...newDeptForm, code: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 uppercase font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
