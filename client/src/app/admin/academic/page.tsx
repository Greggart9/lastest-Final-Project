'use client';

import React, { useState, useEffect } from 'react';
import {
  Folder,
  FolderOpen,
  Building2,
  GraduationCap,
  Layers,
  Plus,
  Trash2,
  Edit3,
  ChevronRight,
  ArrowLeft,
  Check,
  X,
  RefreshCw,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Search,
  AlertCircle,
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
  apiSetCollegeLevels,
} from '@/lib/api';

export default function AcademicHierarchyPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Drill-down Navigation State (starts at null to show Universities Directory home view)
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const [selectedCollegeCode, setSelectedCollegeCode] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  // Little Notification Toast State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Listen for sidebar click on "Academic Structure" to navigate home
  useEffect(() => {
    const handleReset = () => {
      setSelectedUniId(null);
      setSelectedCollegeCode(null);
      setSelectedDeptId(null);
    };
    window.addEventListener('reset-academic-view', handleReset);
    return () => window.removeEventListener('reset-academic-view', handleReset);
  }, []);

  // Create Modals State
  const [showAddUniModal, setShowAddUniModal] = useState(false);
  const [newUniForm, setNewUniForm] = useState<{
    name: string;
    code: string;
    shortName: string;
    academicTerm: 'college' | 'faculty';
  }>({ name: '', code: '', shortName: '', academicTerm: 'college' });

  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [newCollegeForm, setNewCollegeForm] = useState({ code: '', name: '', fullName: '' });

  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({ name: '', code: '' });

  // Edit Modals State
  const [editingUni, setEditingUni] = useState<{
    id: string;
    name: string;
    code: string;
    shortName: string;
    academicTerm: 'college' | 'faculty';
  } | null>(null);
  const [editingCollege, setEditingCollege] = useState<{
    id?: string;
    code: string;
    name: string;
    fullName: string;
  } | null>(null);
  const [editingDept, setEditingDept] = useState<{ id: string; name: string; code: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiGetUniversities();
      const list = data.universities || [];
      setUniversities(list);
      setSelectedUniId((prev) => {
        if (prev && list.some((u: any) => u.id?.toLowerCase() === prev.toLowerCase() || u.code?.toLowerCase() === prev.toLowerCase())) {
          return prev;
        }
        return null;
      });
    } catch (err) {
      console.error('Failed to load universities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Resolved active entities (resilient case-insensitive matching)
  const activeUni = universities.find(
    (u) =>
      u.id?.toLowerCase() === selectedUniId?.toLowerCase() ||
      u.code?.toLowerCase() === selectedUniId?.toLowerCase()
  ) || null;

  const isFaculty = activeUni?.academicTerm === 'faculty';
  const termSingular = isFaculty ? 'Faculty' : 'College';
  const termPlural = isFaculty ? 'Faculties' : 'Colleges';
  const termLowerSingular = isFaculty ? 'faculty' : 'college';
  const termLowerPlural = isFaculty ? 'faculties' : 'colleges';

  const activeCollege = activeUni?.colleges?.find(
    (c: any) =>
      (c.code && c.code.toLowerCase() === selectedCollegeCode?.toLowerCase()) ||
      (c.id && c.id.toLowerCase() === selectedCollegeCode?.toLowerCase())
  ) || null;

  const activeDept = activeCollege?.departments?.find(
    (d: any) => d.id === selectedDeptId || (d.code && d.code.toLowerCase() === selectedDeptId?.toLowerCase())
  ) || null;

  // ----------------------------------------------------
  // University Handlers
  // ----------------------------------------------------
  const handleCreateUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUniForm.name || !newUniForm.code) return;
    try {
      await apiCreateUniversity(newUniForm);
      const createdName = newUniForm.name;
      setNewUniForm({ name: '', code: '', shortName: '', academicTerm: 'college' });
      setShowAddUniModal(false);
      showToast('success', `University "${createdName}" created successfully!`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create university.');
    }
  };

  const handleUpdateUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUni) return;
    try {
      await apiUpdateUniversity(editingUni.id, {
        name: editingUni.name,
        code: editingUni.code.toUpperCase(),
        shortName: editingUni.shortName,
        academicTerm: editingUni.academicTerm,
      });
      const updatedName = editingUni.name;
      setEditingUni(null);
      showToast('success', `University "${updatedName}" updated successfully!`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update university.');
    }
  };

  const handleDeleteUniversity = async (id: string, name: string) => {
    if (id === 'funaab') {
      showToast('error', 'FUNAAB is the flagship institution and cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to delete "${name}" and all its divisions?`)) return;
    try {
      await apiDeleteUniversity(id);
      if (selectedUniId === id) setSelectedUniId(null);
      showToast('success', `University "${name}" removed successfully.`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete university.');
    }
  };

  // ----------------------------------------------------
  // College/Faculty Handlers
  // ----------------------------------------------------
  const handleCreateCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    const uniId = activeUni?.id || 'funaab';
    const trimmedFullName = newCollegeForm.fullName.trim();
    const trimmedName = newCollegeForm.name.trim();
    const trimmedCode = newCollegeForm.code.trim().toUpperCase();

    if (!trimmedFullName && !trimmedName && !trimmedCode) {
      showToast('error', `Please provide at least a ${termSingular} full name or short name.`);
      return;
    }

    try {
      await apiCreateCollege({
        universityId: uniId,
        code: trimmedCode,
        name: trimmedName,
        fullName: trimmedFullName,
      });
      const displayName = trimmedFullName || trimmedName || trimmedCode;
      setNewCollegeForm({ code: '', name: '', fullName: '' });
      setShowAddCollegeModal(false);
      showToast('success', `${termSingular} "${displayName}" created successfully!`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || `Failed to create ${termLowerSingular}.`);
    }
  };

  const handleUpdateCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    const uniId = activeUni?.id || 'funaab';
    if (!editingCollege) return;
    const targetIdentifier = editingCollege.id || editingCollege.code;
    try {
      await apiUpdateCollege(
        targetIdentifier,
        {
          code: editingCollege.code ? editingCollege.code.trim().toUpperCase() : '',
          name: editingCollege.name ? editingCollege.name.trim() : '',
          fullName: editingCollege.fullName ? editingCollege.fullName.trim() : '',
        },
        uniId
      );
      const displayName = editingCollege.fullName || editingCollege.name || editingCollege.code;
      setEditingCollege(null);
      showToast('success', `${termSingular} "${displayName}" updated successfully!`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || `Failed to update ${termLowerSingular}.`);
    }
  };

  const handleDeleteCollege = async (collegeKey: string, collegeDisplayName: string) => {
    const uniId = activeUni?.id || 'funaab';
    if (!confirm(`Delete ${termLowerSingular} "${collegeDisplayName}" and all its departments?`)) return;
    try {
      await apiDeleteCollege(collegeKey, uniId);
      if (selectedCollegeCode === collegeKey) {
        setSelectedCollegeCode(null);
        setSelectedDeptId(null);
      }
      showToast('success', `${termSingular} "${collegeDisplayName}" removed successfully.`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || `Failed to delete ${termLowerSingular}.`);
    }
  };

  // ----------------------------------------------------
  // Department Handlers
  // ----------------------------------------------------
  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    const uniId = activeUni?.id || 'funaab';
    const collegeIdentifier = activeCollege?.code || activeCollege?.id || selectedCollegeCode;
    if (!newDeptForm.name || !collegeIdentifier) return;
    try {
      await apiCreateDepartment({
        universityId: uniId,
        collegeCode: collegeIdentifier,
        name: newDeptForm.name,
        code: newDeptForm.code ? newDeptForm.code.toUpperCase() : newDeptForm.name.slice(0, 3).toUpperCase(),
        levels: [100, 200, 300, 400],
      });
      const createdName = newDeptForm.name;
      setNewDeptForm({ name: '', code: '' });
      setShowAddDeptModal(false);
      showToast('success', `Department "${createdName}" created successfully!`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create department.');
    }
  };

  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    const uniId = activeUni?.id || 'funaab';
    const collegeIdentifier = activeCollege?.code || activeCollege?.id || selectedCollegeCode;
    if (!editingDept || !collegeIdentifier) return;
    try {
      await apiUpdateDepartment(
        editingDept.id,
        {
          name: editingDept.name,
          code: editingDept.code.toUpperCase(),
        },
        collegeIdentifier,
        uniId
      );
      const updatedName = editingDept.name;
      setEditingDept(null);
      showToast('success', `Department "${updatedName}" updated successfully!`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update department.');
    }
  };

  const handleDeleteDepartment = async (deptId: string, deptName: string) => {
    const uniId = activeUni?.id || 'funaab';
    const collegeIdentifier = activeCollege?.code || activeCollege?.id || selectedCollegeCode;
    if (!collegeIdentifier) return;
    if (!confirm(`Delete department "${deptName}"?`)) return;
    try {
      await apiDeleteDepartment(deptId, collegeIdentifier, uniId);
      if (selectedDeptId === deptId) setSelectedDeptId(null);
      showToast('success', `Department "${deptName}" removed successfully.`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete department.');
    }
  };

  // ----------------------------------------------------
  // Level Management Handlers
  // ----------------------------------------------------
  const handleToggleLevel = async (levelNumber: number) => {
    const uniId = activeUni?.id || 'funaab';
    const collegeIdentifier = activeCollege?.code || activeCollege?.id || selectedCollegeCode;
    if (!activeDept || !collegeIdentifier) return;
    const currentLevels: number[] = activeDept.levels || [100, 200, 300, 400];
    let updatedLevels: number[];

    if (currentLevels.includes(levelNumber)) {
      if (currentLevels.length <= 1) {
        showToast('error', 'A department must have at least one active academic level.');
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
        collegeIdentifier,
        uniId
      );
      const statusText = updatedLevels.includes(levelNumber) ? 'activated' : 'deactivated';
      showToast('success', `${levelNumber} Level ${statusText} for ${activeDept.name}!`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to toggle level.');
    }
  };

  const handleSetCollegeLevels = async (levels: number[]) => {
    const uniId = activeUni?.id || 'funaab';
    const collegeIdentifier = activeCollege?.code || activeCollege?.id || selectedCollegeCode;
    if (!collegeIdentifier) return;
    try {
      await apiSetCollegeLevels(collegeIdentifier, levels, uniId);
      const maxL = Math.max(...levels);
      showToast('success', `All departments configured up to ${maxL}L!`);
      await loadData();
    } catch (err: any) {
      showToast('error', err.message || `Failed to set ${termLowerSingular} levels.`);
    }
  };

  // Determine current active step (Drilldown level)
  const currentStep = selectedDeptId
    ? 'levels'
    : selectedCollegeCode
    ? 'departments'
    : selectedUniId
    ? 'colleges'
    : 'universities';

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification Pill */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold animate-in slide-in-from-top-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-emerald-500/10'
              : 'bg-rose-50 text-rose-900 border-rose-300 shadow-rose-500/10'
          }`}
        >
          {toast.type === 'success' ? (
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-lg hover:bg-black/5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Top Header Card & Breadcrumb (Full Width, Blue & White Palette) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        {/* Breadcrumb Trail */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
          <button
            onClick={() => {
              setSelectedUniId(null);
              setSelectedCollegeCode(null);
              setSelectedDeptId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              currentStep === 'universities'
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-blue-600" />
            <span>Universities</span>
          </button>

          {activeUni && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <button
                onClick={() => {
                  setSelectedCollegeCode(null);
                  setSelectedDeptId(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  currentStep === 'colleges'
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5 text-blue-600" />
                <span>{activeUni.name}</span>
              </button>
            </>
          )}

          {activeCollege && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <button
                onClick={() => setSelectedDeptId(null)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  currentStep === 'departments'
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                <span>
                  {activeCollege.code
                    ? `${activeCollege.code} (${activeCollege.name || activeCollege.fullName})`
                    : activeCollege.fullName || activeCollege.name}
                </span>
              </button>
            </>
          )}

          {activeDept && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200">
                <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                <span>{activeDept.name} • Curriculum Levels</span>
              </div>
            </>
          )}
        </div>

        {/* Dynamic Title & Top Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              {currentStep === 'universities' && (
                <>
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <span>Academic Universities Directory</span>
                </>
              )}
              {currentStep === 'colleges' && (
                <>
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                  <span>{termPlural} in {activeUni?.name}</span>
                </>
              )}
              {currentStep === 'departments' && (
                <>
                  <Layers className="h-6 w-6 text-blue-600" />
                  <span>
                    Departments in {activeCollege?.code ? `${activeCollege.code} - ` : ''}
                    {activeCollege?.name || activeCollege?.fullName}
                  </span>
                </>
              )}
              {currentStep === 'levels' && (
                <>
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  <span>{activeDept?.name} Curriculum Levels</span>
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentStep === 'universities' && 'Select an institution to open all its academic divisions on a dedicated page.'}
              {currentStep === 'colleges' && `Click any ${termLowerSingular} to view all its departments across the full page.`}
              {currentStep === 'departments' && 'Click a department to manage authorized academic levels from 100L up to 600L.'}
              {currentStep === 'levels' && 'Activate or deactivate levels. Activated levels reflect immediately in student vaults and upload forms.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Back Button */}
            {currentStep !== 'universities' && (
              <button
                onClick={() => {
                  if (currentStep === 'levels') setSelectedDeptId(null);
                  else if (currentStep === 'departments') setSelectedCollegeCode(null);
                  else if (currentStep === 'colleges') setSelectedUniId(null);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}

            {/* Contextual Create Button */}
            {currentStep === 'universities' && (
              <button
                onClick={() => setShowAddUniModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add University</span>
              </button>
            )}

            {currentStep === 'colleges' && (
              <button
                onClick={() => setShowAddCollegeModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add {termSingular}</span>
              </button>
            )}

            {currentStep === 'departments' && (
              <button
                onClick={() => setShowAddDeptModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Department</span>
              </button>
            )}

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: UNIVERSITIES DIRECTORY (FULL WIDTH)               */}
      {/* ======================================================== */}
      {currentStep === 'universities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((uni) => {
            const collegesCount = uni.colleges?.length || 0;
            const isFUNAAB = uni.code?.toUpperCase() === 'FUNAAB';
            const uniIsFaculty = uni.academicTerm === 'faculty';
            const uniTermPlural = uniIsFaculty ? 'Faculties' : 'Colleges';

            return (
              <div
                key={uni.id}
                onClick={() => setSelectedUniId(uni.id)}
                className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-105 transition-transform">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {uni.code}
                      </span>
                      {uniIsFaculty && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Faculties
                        </span>
                      )}
                      {/* Edit */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingUni({
                            id: uni.id,
                            name: uni.name,
                            code: uni.code,
                            shortName: uni.shortName || uni.code,
                            academicTerm: uni.academicTerm || 'college',
                          });
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit University"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      {/* Delete */}
                      {!isFUNAAB && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUniversity(uni.id, uni.name);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete University"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {isFUNAAB
                      ? 'Flagship Federal Agriculture Institution • Abeokuta, Ogun State'
                      : uni.shortName || uni.name}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-blue-600" />
                    <span>{collegesCount} Academic {uniTermPlural}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Open {uniTermPlural}</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: COLLEGES / FACULTIES CATALOG (3x3 GRID)           */}
      {/* ======================================================== */}
      {currentStep === 'colleges' && activeUni && (
        <div className="space-y-6">
          {(!activeUni.colleges || activeUni.colleges.length === 0) ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-xs">
              <FolderOpen className="h-12 w-12 text-blue-500 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-slate-800">No {termPlural} Registered</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {activeUni.name} does not have any {termLowerPlural} configured yet. Click the "+ Add {termSingular}" button above to create one.
              </p>
              <button
                onClick={() => setShowAddCollegeModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add {termSingular}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeUni.colleges.map((college: any) => {
                const deptsCount = college.departments?.length || 0;
                const collegeKey = college.code || college.id;
                const displayName = college.fullName || college.name || college.code || 'Academic Division';
                const subtitle = college.name && college.fullName && college.name !== college.fullName ? college.fullName : (college.name || '');

                return (
                  <div
                    key={collegeKey}
                    onClick={() => setSelectedCollegeCode(collegeKey)}
                    className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      {/* Top Bar with Code & Actions */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-105 transition-transform">
                          <Folder className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          {college.code ? (
                            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                              {college.code}
                            </span>
                          ) : null}
                          {/* Edit College/Faculty */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCollege({
                                id: college.id,
                                code: college.code || '',
                                name: college.name || '',
                                fullName: college.fullName || '',
                              });
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title={`Edit ${termSingular}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {/* Delete College/Faculty */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCollege(collegeKey, displayName);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={`Delete ${termSingular}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                        {displayName}
                      </h3>
                      {subtitle && subtitle !== displayName ? (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {subtitle}
                        </p>
                      ) : null}
                    </div>

                    {/* Card Footer */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <span>{deptsCount} Departments</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                        <span>View Departments</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: DEPARTMENTS CATALOG (FULL WIDTH 3x3 GRID)         */}
      {/* ======================================================== */}
      {currentStep === 'departments' && activeCollege && (
        <div className="space-y-6">
          {/* Quick Division Level Presets Toolbar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>
                  Quick {termSingular} Level Authorizations ({activeCollege.code || activeCollege.name || activeCollege.fullName})
                </span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Apply curriculum levels across all departments in {activeCollege.name || activeCollege.fullName || activeCollege.code} in one click:
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSetCollegeLevels([100, 200, 300, 400])}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                100L – 400L
              </button>
              <button
                onClick={() => handleSetCollegeLevels([100, 200, 300, 400, 500])}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
              >
                100L – 500L (Eng/Agric)
              </button>
              <button
                onClick={() => handleSetCollegeLevels([100, 200, 300, 400, 500, 600])}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>100L – 600L (Veterinary)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCollege.departments?.map((dept: any) => {
              const levels: number[] = dept.levels || [100, 200, 300, 400];
              const maxLvl = Math.max(...levels, 100);

              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className="group relative bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    {/* Top Bar with Code & Actions */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-105 transition-transform">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {dept.code || 'DEPT'}
                        </span>
                        {/* Edit */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingDept({
                              id: dept.id,
                              name: dept.name,
                              code: dept.code || '',
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Department"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDepartment(dept.id, dept.name);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Department"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {dept.name}
                    </h3>

                    {/* Active Levels Badge Row */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {levels.map((lvl) => (
                        <span
                          key={lvl}
                          className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold"
                        >
                          {lvl}L
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Configured up to {maxLvl} Level</span>
                    <div className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                      <span>Manage Levels</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 4: LEVELS MANAGEMENT (FULL WIDTH 3x3 GRID)          */}
      {/* ======================================================== */}
      {currentStep === 'levels' && activeDept && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                <span>Level Activation Control Center</span>
              </h3>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
                {activeDept.name} ({activeDept.code})
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Toggle academic levels below. Deactivated levels are hidden from the student dashboard, while active levels allow students to view and upload materials.
            </p>
          </div>

          {/* 3x3 Grid of Academic Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[100, 200, 300, 400, 500, 600].map((lvl) => {
              const currentDeptLevels: number[] = activeDept.levels || [100, 200, 300, 400];
              const isActive = currentDeptLevels.includes(lvl);

              const levelDescriptions: Record<number, string> = {
                100: 'Foundation Year & General Studies (MTS 101, CSC 101, PHS 105)',
                200: 'Core Intermediate Disciplines & Algorithmic Principles',
                300: 'Advanced Specialization & Technical Applied Systems',
                400: 'Final Year Curriculum & Degree Capstone Project Modules',
                500: 'Engineering, Agriculture & Professional Internship Year',
                600: 'Veterinary Medicine & Clinical Rotations Year',
              };

              return (
                <div
                  key={lvl}
                  onClick={() => handleToggleLevel(lvl)}
                  className={`group relative rounded-2xl p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[200px] shadow-xs hover:shadow-md ${
                    isActive
                      ? 'bg-white border-blue-500 shadow-blue-500/10'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div>
                    {/* Level Number & Switch Button */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`h-12 w-12 rounded-2xl flex items-center justify-center font-extrabold text-base shadow-xs transition-transform group-hover:scale-105 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-blue-600/20'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {lvl}L
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-200/80 text-slate-500 border-slate-300'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Active in Vault</span>
                          </>
                        ) : (
                          <>
                            <X className="h-3.5 w-3.5 text-slate-400" />
                            <span>Deactivated</span>
                          </>
                        )}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {lvl} Level Curriculum
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {levelDescriptions[lvl]}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">
                      {isActive ? 'Available for students' : 'Disabled for students'}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isActive ? 'text-blue-600 group-hover:underline' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      {isActive ? 'Click to Deactivate' : 'Click to Activate'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD UNIVERSITY                                    */}
      {/* ======================================================== */}
      {showAddUniModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Add University</span>
              </h3>
              <button
                onClick={() => setShowAddUniModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUniversity} className="space-y-4 text-xs">
              {/* Nomenclature Option Selector */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">Academic Division Nomenclature</label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Choose what term this institution uses for its academic divisions:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewUniForm({ ...newUniForm, academicTerm: 'college' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      newUniForm.academicTerm === 'college'
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Colleges</span>
                      {newUniForm.academicTerm === 'college' && (
                        <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal leading-tight">
                      e.g. FUNAAB (Colleges & College Codes)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewUniForm({ ...newUniForm, academicTerm: 'faculty' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      newUniForm.academicTerm === 'faculty'
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Faculties</span>
                      {newUniForm.academicTerm === 'faculty' && (
                        <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal leading-tight">
                      e.g. UNILAG (Faculties & Faculty Codes)
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Institution Name</label>
                <input
                  type="text"
                  required
                  placeholder={newUniForm.academicTerm === 'faculty' ? 'e.g. University of Lagos' : 'e.g. Federal University of Agriculture'}
                  value={newUniForm.name}
                  onChange={(e) => setNewUniForm({ ...newUniForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Institution Code</label>
                <input
                  type="text"
                  required
                  placeholder={newUniForm.academicTerm === 'faculty' ? 'e.g. UNILAG' : 'e.g. FUNAAB'}
                  value={newUniForm.code}
                  onChange={(e) => setNewUniForm({ ...newUniForm, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 uppercase font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Short Name / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Akoka, Yaba, Lagos State"
                  value={newUniForm.shortName}
                  onChange={(e) => setNewUniForm({ ...newUniForm, shortName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUniModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Create University
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT UNIVERSITY                                  */}
      {/* ======================================================== */}
      {editingUni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-blue-600" />
                <span>Edit University</span>
              </h3>
              <button
                onClick={() => setEditingUni(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUniversity} className="space-y-4 text-xs">
              {/* Nomenclature Option Selector */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">Academic Division Nomenclature</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingUni({ ...editingUni, academicTerm: 'college' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      editingUni.academicTerm === 'college'
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Colleges</span>
                      {editingUni.academicTerm === 'college' && (
                        <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal leading-tight">
                      e.g. FUNAAB (Colleges)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingUni({ ...editingUni, academicTerm: 'faculty' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      editingUni.academicTerm === 'faculty'
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Faculties</span>
                      {editingUni.academicTerm === 'faculty' && (
                        <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-normal leading-tight">
                      e.g. UNILAG (Faculties)
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Institution Name</label>
                <input
                  type="text"
                  required
                  value={editingUni.name}
                  onChange={(e) => setEditingUni({ ...editingUni, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Institution Code</label>
                <input
                  type="text"
                  required
                  value={editingUni.code}
                  onChange={(e) => setEditingUni({ ...editingUni, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 uppercase font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Short Name / Location</label>
                <input
                  type="text"
                  value={editingUni.shortName}
                  onChange={(e) => setEditingUni({ ...editingUni, shortName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUni(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD COLLEGE / FACULTY                              */}
      {/* ======================================================== */}
      {showAddCollegeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-600" />
                <span>Add {termSingular} to {activeUni?.name}</span>
              </h3>
              <button
                onClick={() => setShowAddCollegeModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 bg-blue-50/60 border border-blue-200/60 rounded-xl p-3 leading-relaxed">
              Fill in information for this {termLowerSingular}. All fields are flexible — you can provide just the full name or include short names and codes. Blank fields will not be auto-generated.
            </p>

            <form onSubmit={handleCreateCollege} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">{termSingular} Full Name</label>
                <input
                  type="text"
                  placeholder={isFaculty ? 'e.g. Faculty of Social Sciences' : 'e.g. College of Engineering'}
                  value={newCollegeForm.fullName}
                  onChange={(e) =>
                    setNewCollegeForm({ ...newCollegeForm, fullName: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">{termSingular} Short Name (Optional)</label>
                <input
                  type="text"
                  placeholder={isFaculty ? 'e.g. Social Sciences' : 'e.g. Engineering'}
                  value={newCollegeForm.name}
                  onChange={(e) =>
                    setNewCollegeForm({ ...newCollegeForm, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">{termSingular} Code (Optional)</label>
                <input
                  type="text"
                  placeholder={isFaculty ? 'e.g. FSS' : 'e.g. COLENG'}
                  value={newCollegeForm.code}
                  onChange={(e) =>
                    setNewCollegeForm({ ...newCollegeForm, code: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 uppercase font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCollegeModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Create {termSingular}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT COLLEGE / FACULTY                            */}
      {/* ======================================================== */}
      {editingCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-blue-600" />
                <span>
                  Edit {termSingular}: {editingCollege.fullName || editingCollege.name || editingCollege.code}
                </span>
              </h3>
              <button
                onClick={() => setEditingCollege(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCollege} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">{termSingular} Full Name</label>
                <input
                  type="text"
                  value={editingCollege.fullName}
                  onChange={(e) => setEditingCollege({ ...editingCollege, fullName: e.target.value })}
                  placeholder={isFaculty ? 'e.g. Faculty of Social Sciences' : 'e.g. College of Engineering'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">{termSingular} Short Name (Optional)</label>
                <input
                  type="text"
                  value={editingCollege.name}
                  onChange={(e) => setEditingCollege({ ...editingCollege, name: e.target.value })}
                  placeholder={isFaculty ? 'e.g. Social Sciences' : 'e.g. Engineering'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">{termSingular} Code (Optional)</label>
                <input
                  type="text"
                  value={editingCollege.code}
                  onChange={(e) => setEditingCollege({ ...editingCollege, code: e.target.value.toUpperCase() })}
                  placeholder={isFaculty ? 'e.g. FSS' : 'e.g. COLENG'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 uppercase font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCollege(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD DEPARTMENT                                    */}
      {/* ======================================================== */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span>
                  Add Department to {activeCollege?.code ? `${activeCollege.code} (${activeCollege?.name || activeCollege?.fullName})` : activeCollege?.name || activeCollege?.fullName || selectedCollegeCode}
                </span>
              </h3>
              <button
                onClick={() => setShowAddDeptModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={newDeptForm.name}
                  onChange={(e) =>
                    setNewDeptForm({ ...newDeptForm, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Course Code Prefix (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. CSC"
                  value={newDeptForm.code}
                  onChange={(e) =>
                    setNewDeptForm({ ...newDeptForm, code: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 uppercase font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT DEPARTMENT                                   */}
      {/* ======================================================== */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-slate-900 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-blue-600" />
                <span>Edit Department</span>
              </h3>
              <button
                onClick={() => setEditingDept(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDepartment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Department Name</label>
                <input
                  type="text"
                  required
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Course Code Prefix</label>
                <input
                  type="text"
                  value={editingDept.code}
                  onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 uppercase font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
