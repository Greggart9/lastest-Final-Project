import {
  getUniversities as dbGetUniversities,
  getUniversityById as dbGetUniversityById,
  createUniversity as dbCreateUniversity,
  updateUniversity as dbUpdateUniversity,
  deleteUniversity as dbDeleteUniversity,
  getColleges as dbGetColleges,
  addCollege as dbAddCollege,
  updateCollege as dbUpdateCollege,
  deleteCollege as dbDeleteCollege,
  addDepartment as dbAddDepartment,
  updateDepartment as dbUpdateDepartment,
  setCollegeLevels as dbSetCollegeLevels,
  deleteDepartment as dbDeleteDepartment,
} from '../db.js';
import {
  isSupabaseConfigured,
  supabaseGetUniversities,
  supabaseCreateUniversity,
  supabaseUpdateUniversity,
  supabaseDeleteUniversity,
  supabaseAddCollege,
  supabaseUpdateCollege,
  supabaseDeleteCollege,
  supabaseAddDepartment,
  supabaseUpdateDepartment,
  supabaseSetCollegeLevels,
  supabaseDeleteDepartment,
} from '../db/supabase.js';

// -------------------------------------------------------------
// GET /api/admin/universities & /api/universities
// -------------------------------------------------------------
export async function getUniversities(req, res) {
  const localUnis = dbGetUniversities();
  if (isSupabaseConfigured()) {
    const sbUnis = await supabaseGetUniversities();
    if (sbUnis && sbUnis.length > 0) {
      const merged = sbUnis.map((su) => {
        const local = localUnis.find(
          (lu) =>
            lu.id?.toLowerCase() === su.id?.toLowerCase() ||
            lu.code?.toUpperCase() === su.code?.toUpperCase()
        );
        return {
          ...su,
          academicTerm: su.academicTerm || local?.academicTerm || 'college',
        };
      });
      return res.json({ universities: merged });
    }
  }
  res.json({ universities: localUnis });
}

// -------------------------------------------------------------
// GET /api/admin/universities/:id
// -------------------------------------------------------------
export function getUniversityById(req, res) {
  const uni = dbGetUniversityById(req.params.id);
  if (!uni) return res.status(404).json({ error: 'University not found.' });
  res.json({ university: uni });
}

// -------------------------------------------------------------
// POST /api/admin/universities - Create University
// -------------------------------------------------------------
export async function createUniversity(req, res) {
  try {
    const { name, code, shortName, academicTerm = 'college' } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'University name and code are required.' });
    }

    const term = academicTerm === 'faculty' ? 'faculty' : 'college';

    let newUni = null;
    let sbError = null;
    if (isSupabaseConfigured()) {
      try {
        newUni = await supabaseCreateUniversity({ name, code, shortName, academicTerm: term });
      } catch (e) {
        sbError = e;
      }
    }

    let localUni = null;
    try {
      localUni = dbCreateUniversity({ name, code, shortName, academicTerm: term });
    } catch (localErr) {
      console.warn('[Local DB] createUniversity notice:', localErr.message);
    }

    const created = newUni || localUni;
    if (!created) {
      return res.status(400).json({ error: sbError?.message || 'Failed to create university.' });
    }

    res.status(201).json({ message: 'University created successfully.', university: created });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// PUT /api/admin/universities/:id - Update University
// -------------------------------------------------------------
export async function updateUniversity(req, res) {
  try {
    let updated = null;
    if (isSupabaseConfigured()) {
      updated = await supabaseUpdateUniversity(req.params.id, req.body);
    }
    const localUpdated = dbUpdateUniversity(req.params.id, req.body);
    if (!updated) updated = localUpdated;

    if (!updated) return res.status(404).json({ error: 'University not found.' });
    res.json({ message: 'University updated successfully.', university: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// DELETE /api/admin/universities/:id - Delete University
// -------------------------------------------------------------
export async function deleteUniversity(req, res) {
  try {
    let success = false;
    if (isSupabaseConfigured()) {
      success = await supabaseDeleteUniversity(req.params.id);
    }
    const localSuccess = dbDeleteUniversity(req.params.id);
    if (!success && !localSuccess) return res.status(404).json({ error: 'University not found.' });
    res.json({ message: 'University removed successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// GET /api/academic/colleges - Colleges/Faculties in university
// -------------------------------------------------------------
export async function getColleges(req, res) {
  const universityId = req.query.universityId || 'funaab';
  if (isSupabaseConfigured()) {
    const sbUnis = await supabaseGetUniversities();
    const uni = sbUnis?.find(
      (u) =>
        u.id?.toLowerCase() === universityId.toLowerCase() ||
        u.code?.toLowerCase() === universityId.toLowerCase()
    );
    if (uni && uni.colleges) {
      return res.json({
        university: uni.name,
        academicTerm: uni.academicTerm || 'college',
        colleges: uni.colleges,
      });
    }
  }
  const colleges = dbGetColleges(universityId);
  const uni = dbGetUniversityById(universityId);
  res.json({
    university: uni?.name || 'Federal University of Agriculture, Abeokuta (FUNAAB)',
    academicTerm: uni?.academicTerm || 'college',
    colleges,
  });
}

// -------------------------------------------------------------
// POST /api/admin/colleges - Add College/Faculty
// -------------------------------------------------------------
export async function addCollege(req, res) {
  try {
    const { universityId = 'funaab', code = '', name = '', fullName = '' } = req.body;
    const trimmedCode = code ? code.trim().toUpperCase() : '';
    const trimmedName = name ? name.trim() : '';
    const trimmedFullName = fullName ? fullName.trim() : '';

    if (!trimmedCode && !trimmedName && !trimmedFullName) {
      return res.status(400).json({ error: 'Please enter at least a Full Name, Short Name, or Code.' });
    }

    let newCollege = null;
    let sbError = null;
    if (isSupabaseConfigured()) {
      try {
        newCollege = await supabaseAddCollege({
          universityId,
          code: trimmedCode,
          name: trimmedName,
          fullName: trimmedFullName,
        });
      } catch (e) {
        sbError = e;
      }
    }

    let localCollege = null;
    try {
      localCollege = dbAddCollege({
        universityId,
        code: trimmedCode,
        name: trimmedName,
        fullName: trimmedFullName,
      });
    } catch (localErr) {
      console.warn('[Local DB] addCollege notice:', localErr.message);
    }

    const created = newCollege || localCollege;
    if (!created) {
      return res.status(400).json({ error: sbError?.message || 'Failed to create academic division.' });
    }

    res.status(201).json({ message: 'Created successfully.', college: created });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// PUT /api/admin/colleges/:id - Update College
// -------------------------------------------------------------
export async function updateCollege(req, res) {
  try {
    const { universityId = 'funaab', ...updates } = req.body;
    let updated = null;
    if (isSupabaseConfigured()) {
      updated = await supabaseUpdateCollege(req.params.id, updates, universityId);
    }
    const localUpdated = dbUpdateCollege(req.params.id, updates, universityId);
    if (!updated) updated = localUpdated;

    if (!updated) return res.status(404).json({ error: 'College not found.' });
    res.json({ message: 'College updated successfully.', college: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// DELETE /api/admin/colleges/:id - Delete College
// -------------------------------------------------------------
export async function deleteCollege(req, res) {
  try {
    const universityId = req.query.universityId || 'funaab';
    let success = false;
    if (isSupabaseConfigured()) {
      success = await supabaseDeleteCollege(req.params.id, universityId);
    }
    const localSuccess = dbDeleteCollege(req.params.id, universityId);
    if (!success && !localSuccess) return res.status(404).json({ error: 'College not found.' });
    res.json({ message: 'College removed successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// POST /api/admin/departments - Add Department
// -------------------------------------------------------------
export async function addDepartment(req, res) {
  try {
    const { universityId = 'funaab', collegeCode, name, code, levels } = req.body;
    if (!collegeCode || !name) {
      return res.status(400).json({ error: 'College code and department name are required.' });
    }

    let newDept = null;
    let sbError = null;
    if (isSupabaseConfigured()) {
      try {
        newDept = await supabaseAddDepartment({ universityId, collegeCode, name, code, levels });
      } catch (e) {
        sbError = e;
      }
    }

    let localDept = null;
    try {
      localDept = dbAddDepartment({ universityId, collegeCode, name, code, levels });
    } catch (localErr) {
      console.warn('[Local DB] addDepartment notice:', localErr.message);
    }

    const created = newDept || localDept;
    if (!created) {
      return res.status(400).json({ error: sbError?.message || 'Failed to create department.' });
    }

    res.status(201).json({ message: 'Department created successfully.', department: created });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// PUT /api/admin/departments/:id - Update Department & Levels
// -------------------------------------------------------------
export async function updateDepartment(req, res) {
  try {
    const { universityId = 'funaab', collegeCode, ...updates } = req.body;
    if (!collegeCode) return res.status(400).json({ error: 'College code is required.' });

    let updated = null;
    if (isSupabaseConfigured()) {
      updated = await supabaseUpdateDepartment(req.params.id, updates, collegeCode, universityId);
    }
    const localUpdated = dbUpdateDepartment(req.params.id, updates, collegeCode, universityId);
    if (!updated) updated = localUpdated;

    if (!updated) return res.status(404).json({ error: 'Department not found.' });
    res.json({ message: 'Department updated successfully.', department: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// PUT /api/admin/colleges/:code/levels - Bulk update levels for college
// -------------------------------------------------------------
export async function setCollegeLevels(req, res) {
  try {
    const { levels, universityId = 'funaab' } = req.body;
    if (!Array.isArray(levels) || levels.length === 0) {
      return res.status(400).json({ error: 'Valid levels array is required.' });
    }
    const collegeCode = req.params.code;
    let sbSuccess = false;
    if (isSupabaseConfigured()) {
      sbSuccess = await supabaseSetCollegeLevels(collegeCode, levels, universityId);
    }
    const localSuccess = dbSetCollegeLevels(collegeCode, levels, universityId);
    if (!sbSuccess && !localSuccess) {
      return res.status(404).json({ error: 'College not found.' });
    }
    res.json({ message: `Levels updated for all departments in ${collegeCode.toUpperCase()}.`, levels });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// DELETE /api/admin/departments/:id - Delete Department
// -------------------------------------------------------------
export async function deleteDepartment(req, res) {
  try {
    const { collegeCode, universityId = 'funaab' } = req.query;
    if (!collegeCode) return res.status(400).json({ error: 'College code is required.' });

    let success = false;
    if (isSupabaseConfigured()) {
      success = await supabaseDeleteDepartment(req.params.id, collegeCode, universityId);
    }
    const localSuccess = dbDeleteDepartment(req.params.id, collegeCode, universityId);
    if (!success && !localSuccess) return res.status(404).json({ error: 'Department not found.' });
    res.json({ message: 'Department removed successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
