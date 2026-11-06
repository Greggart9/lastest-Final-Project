import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

const DEFAULT_LEVELS = [100, 200, 300, 400, 500];

const DEFAULT_COLLEGES = [
  {
    id: 'colphys',
    code: 'COLPHYS',
    name: 'Physical Sciences',
    fullName: 'College of Physical Sciences',
    departments: [
      { id: 'csc', code: 'CSC', name: 'Computer Science', levels: [100, 200, 300, 400] },
      { id: 'phs', code: 'PHS', name: 'Physics', levels: [100, 200, 300, 400] },
      { id: 'mts', code: 'MTS', name: 'Mathematics', levels: [100, 200, 300, 400] },
      { id: 'sts', code: 'STS', name: 'Statistics', levels: [100, 200, 300, 400] },
      { id: 'chm', code: 'CHM', name: 'Chemistry', levels: [100, 200, 300, 400] },
    ],
  },
  {
    id: 'colbios',
    code: 'COLBIOS',
    name: 'Biosciences',
    fullName: 'College of Biosciences',
    departments: [
      { id: 'bch', code: 'BCH', name: 'Biochemistry', levels: [100, 200, 300, 400] },
      { id: 'mcb', code: 'MCB', name: 'Microbiology', levels: [100, 200, 300, 400] },
      { id: 'paz', code: 'PAZ', name: 'Pure & Applied Zoology', levels: [100, 200, 300, 400] },
      { id: 'pab', code: 'PAB', name: 'Pure & Applied Botany', levels: [100, 200, 300, 400] },
    ],
  },
  {
    id: 'coleng',
    code: 'COLENG',
    name: 'Engineering',
    fullName: 'College of Engineering',
    departments: [
      { id: 'mce', code: 'MCE', name: 'Mechanical Engineering', levels: [100, 200, 300, 400, 500] },
      { id: 'ele', code: 'ELE', name: 'Electrical & Electronics Engineering', levels: [100, 200, 300, 400, 500] },
      { id: 'cve', code: 'CVE', name: 'Civil Engineering', levels: [100, 200, 300, 400, 500] },
      { id: 'age', code: 'AGE', name: 'Agricultural & Bio-Resources Engineering', levels: [100, 200, 300, 400, 500] },
      { id: 'mte', code: 'MTE', name: 'Mechatronics Engineering', levels: [100, 200, 300, 400, 500] },
    ],
  },
  {
    id: 'colvet',
    code: 'COLVET',
    name: 'Veterinary Medicine',
    fullName: 'College of Veterinary Medicine',
    departments: [
      { id: 'vmd', code: 'VMD', name: 'Veterinary Medicine & Surgery', levels: [100, 200, 300, 400, 500, 600] },
      { id: 'vpa', code: 'VPA', name: 'Veterinary Pathology', levels: [100, 200, 300, 400, 500] },
      { id: 'vpy', code: 'VPY', name: 'Veterinary Physiology & Pharmacology', levels: [100, 200, 300, 400, 500] },
    ],
  },
  {
    id: 'colanim',
    code: 'COLANIM',
    name: 'Animal Science & Livestock Production',
    fullName: 'College of Animal Science & Livestock Production',
    departments: [
      { id: 'aph', code: 'APH', name: 'Animal Production & Health', levels: [100, 200, 300, 400, 500] },
      { id: 'ann', code: 'ANN', name: 'Animal Nutrition', levels: [100, 200, 300, 400, 500] },
      { id: 'abg', code: 'ABG', name: 'Animal Breeding & Genetics', levels: [100, 200, 300, 400, 500] },
    ],
  },
  {
    id: 'colplant',
    code: 'COLPLANT',
    name: 'Plant Science & Crop Production',
    fullName: 'College of Plant Science & Crop Production',
    departments: [
      { id: 'cpt', code: 'CPT', name: 'Crop Protection', levels: [100, 200, 300, 400, 500] },
      { id: 'hrt', code: 'HRT', name: 'Horticulture', levels: [100, 200, 300, 400, 500] },
      { id: 'pbr', code: 'PBR', name: 'Plant Breeding & Seed Technology', levels: [100, 200, 300, 400, 500] },
      { id: 'ssm', code: 'SSM', name: 'Soil Science & Land Management', levels: [100, 200, 300, 400, 500] },
    ],
  },
  {
    id: 'colamrud',
    code: 'COLAMRUD',
    name: 'Agricultural Management & Rural Development',
    fullName: 'College of Agricultural Management & Rural Development',
    departments: [
      { id: 'aed', code: 'AED', name: 'Agricultural Economics & Farm Management', levels: [100, 200, 300, 400, 500] },
      { id: 'aex', code: 'AEX', name: 'Agricultural Extension & Rural Development', levels: [100, 200, 300, 400, 500] },
      { id: 'cca', code: 'CCA', name: 'Communication & General Studies', levels: [100, 200] },
    ],
  },
  {
    id: 'colerm',
    code: 'COLERM',
    name: 'Environmental Resources Management',
    fullName: 'College of Environmental Resources Management',
    departments: [
      { id: 'aqfm', code: 'AQFM', name: 'Aquaculture & Fisheries Management', levels: [100, 200, 300, 400, 500] },
      { id: 'fwm', code: 'FWM', name: 'Forestry & Wildlife Management', levels: [100, 200, 300, 400, 500] },
      { id: 'wrm', code: 'WRM', name: 'Water Resources Management & Agrometeorology', levels: [100, 200, 300, 400, 500] },
      { id: 'emt', code: 'EMT', name: 'Environmental Management & Toxicology', levels: [100, 200, 300, 400, 500] },
    ],
  },
];

const DEFAULT_UNIVERSITIES = [
  {
    id: 'funaab',
    code: 'FUNAAB',
    name: 'Federal University of Agriculture, Abeokuta',
    shortName: 'FUNAAB',
    status: 'active',
    colleges: DEFAULT_COLLEGES,
    createdAt: new Date().toISOString(),
  },
];

// Helper to read DB and auto-migrate missing fields
export function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return initDb();
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);

    let needsWrite = false;

    // Ensure universities array exists
    if (!data.universities || !Array.isArray(data.universities) || data.universities.length === 0) {
      data.universities = DEFAULT_UNIVERSITIES;
      needsWrite = true;
    } else {
      // Ensure FUNAAB has colleges and departments with levels
      const funaab = data.universities.find((u) => u.code === 'FUNAAB');
      if (funaab && (!funaab.colleges || funaab.colleges.length === 0)) {
        funaab.colleges = data.colleges || DEFAULT_COLLEGES;
        needsWrite = true;
      }
    }

    // Keep data.colleges in sync for backwards compatibility
    if (!data.colleges) {
      const funaab = data.universities.find((u) => u.code === 'FUNAAB');
      data.colleges = funaab ? funaab.colleges : DEFAULT_COLLEGES;
      needsWrite = true;
    }

    if (!data.submissions) {
      data.submissions = [];
      needsWrite = true;
    }

    if (needsWrite) {
      writeDb(data);
    }

    return data;
  } catch (err) {
    console.error('[DB] Read error, re-initializing database:', err);
    return initDb();
  }
}

// Helper to write DB atomically
export function writeDb(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('[DB] Write error:', err);
    throw new Error('Database persistence error');
  }
}

// Initial DB Setup
export function initDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const salt = bcrypt.genSaltSync(10);
  const demoStudentHash = bcrypt.hashSync('Student@123', salt);
  const adminHash = bcrypt.hashSync('Admin@2026Secure', salt);

  const initialData = {
    users: [
      {
        id: 'usr_student_1',
        matricNo: '2021/1042',
        firstName: 'Damilare',
        lastName: 'Ogundare',
        name: 'Damilare Ogundare',
        email: 'student@funaab.edu.ng',
        passwordHash: demoStudentHash,
        university: 'FUNAAB',
        college: 'COLPHYS',
        department: 'Computer Science',
        role: 'Student',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr_admin_1',
        matricNo: 'ADM/001',
        firstName: 'System',
        lastName: 'Administrator',
        name: 'System Administrator',
        email: 'admin@funaab.edu.ng',
        passwordHash: adminHash,
        university: 'FUNAAB',
        college: 'COLPHYS',
        department: 'Computer Science',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ],
    universities: DEFAULT_UNIVERSITIES,
    colleges: DEFAULT_COLLEGES,
    submissions: [
      {
        id: 'sub_1',
        userId: 'usr_student_1',
        authorName: 'Damilare Ogundare',
        authorEmail: 'student@funaab.edu.ng',
        courseCode: 'CSC 111',
        title: 'Introduction to Computer Science & Flowcharts Lecture Notes',
        college: 'COLPHYS',
        department: 'Computer Science',
        level: '100 Level',
        semester: 'First Semester',
        category: 'Course Materials',
        fileName: 'CSC111_Introduction_Lecture_Week1_4.pdf',
        fileSize: '3.4 MB',
        fileType: 'application/pdf',
        status: 'approved',
        submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        reviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        reviewedBy: 'Academic Board (COLPHYS)',
        reviewNotes: 'High quality official departmental notes. Verified.',
      },
      {
        id: 'sub_2',
        userId: 'usr_student_1',
        authorName: 'Damilare Ogundare',
        authorEmail: 'student@funaab.edu.ng',
        courseCode: 'MTS 101',
        title: '2023/2024 Algebra and Trigonometry Past Questions with Steps',
        college: 'COLPHYS',
        department: 'Mathematics',
        level: '100 Level',
        semester: 'First Semester',
        category: 'Past Questions',
        fileName: 'MTS101_2023_PastQuestions_Exam.pdf',
        fileSize: '4.8 MB',
        fileType: 'application/pdf',
        status: 'pending',
        submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        reviewNotes: 'Awaiting HOD / Course Rep verification.',
      },
      {
        id: 'sub_3',
        userId: 'usr_student_1',
        authorName: 'Damilare Ogundare',
        authorEmail: 'student@funaab.edu.ng',
        courseCode: 'PHY 101',
        title: 'General Physics Mechanics & Heat Handout Solutions',
        college: 'COLPHYS',
        department: 'Physics',
        level: '100 Level',
        semester: 'First Semester',
        category: 'Solutions',
        fileName: 'PHY101_Mechanics_Solutions.pdf',
        fileSize: '2.9 MB',
        fileType: 'application/pdf',
        status: 'pending',
        submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        reviewNotes: 'Contains detailed handwritten proofs and steps.',
      },
    ],
    passwordOtps: [],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  console.log('[DB] Database seeded successfully at', DB_FILE);
  return initialData;
}

// ----------------------------------------------------------------------
// User Operations
// ----------------------------------------------------------------------
export function findUserByEmail(email) {
  if (!email) return null;
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function findUserById(id) {
  if (!id) return null;
  const db = readDb();
  return db.users.find((u) => u.id === id) || null;
}

export function getAllUsers(filter = {}) {
  const db = readDb();
  let list = db.users || [];
  if (filter.query) {
    const q = filter.query.trim().toLowerCase();
    list = list.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.matricNo && u.matricNo.toLowerCase().includes(q)) ||
        (u.department && u.department.toLowerCase().includes(q)) ||
        (u.college && u.college.toLowerCase().includes(q))
    );
  }
  if (filter.role) {
    list = list.filter((u) => u.role?.toLowerCase() === filter.role.toLowerCase());
  }
  if (filter.college) {
    list = list.filter((u) => u.college?.toUpperCase() === filter.college.toUpperCase());
  }
  return list.map(({ passwordHash: _, ...safeUser }) => safeUser);
}

export function createUser(userData) {
  const db = readDb();
  const normalized = userData.email.trim().toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === normalized)) {
    throw new Error('A user with this email already exists.');
  }
  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    ...userData,
    email: normalized,
    role: userData.role || 'Student',
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function updateUser(id, updates) {
  const db = readDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const { id: _id, email: _email, ...allowedUpdates } = updates;
  db.users[index] = { ...db.users[index], ...allowedUpdates, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db.users[index];
}

export function deleteUser(id) {
  const db = readDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  db.users.splice(index, 1);
  writeDb(db);
  return true;
}

// ----------------------------------------------------------------------
// Universities & Academic Hierarchy
// ----------------------------------------------------------------------
export function getUniversities() {
  const db = readDb();
  return db.universities || DEFAULT_UNIVERSITIES;
}

export function getUniversityById(id) {
  const db = readDb();
  const normalizedId = id.trim().toLowerCase();
  return db.universities?.find((u) => u.id.toLowerCase() === normalizedId || u.code.toLowerCase() === normalizedId) || null;
}

export function createUniversity({ name, code, shortName }) {
  const db = readDb();
  if (!name || !code) throw new Error('University name and code are required.');

  const normalizedCode = code.trim().toUpperCase();
  if (db.universities.some((u) => u.code.toUpperCase() === normalizedCode)) {
    throw new Error(`University with code ${normalizedCode} already exists.`);
  }

  const newUni = {
    id: (shortName || normalizedCode).toLowerCase().replace(/\s+/g, '-'),
    code: normalizedCode,
    name: name.trim(),
    shortName: shortName?.trim() || normalizedCode,
    status: 'active',
    colleges: [],
    createdAt: new Date().toISOString(),
  };

  db.universities.push(newUni);
  writeDb(db);
  return newUni;
}

export function updateUniversity(id, updates) {
  const db = readDb();
  const uni = db.universities.find((u) => u.id === id || u.code === id);
  if (!uni) return null;

  if (updates.name) uni.name = updates.name.trim();
  if (updates.shortName) uni.shortName = updates.shortName.trim();
  if (updates.code) uni.code = updates.code.trim().toUpperCase();
  if (updates.status) uni.status = updates.status;

  writeDb(db);
  return uni;
}

export function deleteUniversity(id) {
  const db = readDb();
  const index = db.universities.findIndex((u) => u.id === id || u.code === id);
  if (index === -1) return false;

  const uni = db.universities[index];
  if (uni.code === 'FUNAAB') {
    throw new Error('Default University (FUNAAB) cannot be deleted.');
  }

  db.universities.splice(index, 1);
  writeDb(db);
  return true;
}

// ----------------------------------------------------------------------
// College CRUD inside University
// ----------------------------------------------------------------------
export function getColleges(universityId = 'funaab') {
  const db = readDb();
  const uni = db.universities?.find(
    (u) => u.id.toLowerCase() === universityId.toLowerCase() || u.code.toLowerCase() === universityId.toLowerCase()
  );
  if (uni && uni.colleges) return uni.colleges;
  return db.colleges || [];
}

export function addCollege({ universityId = 'funaab', code, name, fullName }) {
  const db = readDb();
  const uni = db.universities?.find(
    (u) => u.id.toLowerCase() === universityId.toLowerCase() || u.code.toLowerCase() === universityId.toLowerCase()
  );

  const targetUni = uni || db.universities[0];
  const normalizedCode = code.trim().toUpperCase();

  if (targetUni.colleges.some((c) => c.code.toUpperCase() === normalizedCode)) {
    throw new Error(`College ${normalizedCode} already exists in ${targetUni.code}.`);
  }

  const newCol = {
    id: normalizedCode.toLowerCase(),
    code: normalizedCode,
    name: name.trim(),
    fullName: fullName?.trim() || `College of ${name.trim()}`,
    departments: [],
  };

  targetUni.colleges.push(newCol);

  // Sync root colleges if funaab
  if (targetUni.code === 'FUNAAB') {
    db.colleges = targetUni.colleges;
  }

  writeDb(db);
  return newCol;
}

export function updateCollege(collegeId, updates, universityId = 'funaab') {
  const db = readDb();
  const uni = db.universities?.find(
    (u) => u.id.toLowerCase() === universityId.toLowerCase() || u.code.toLowerCase() === universityId.toLowerCase()
  );
  const targetUni = uni || db.universities[0];
  const col = targetUni.colleges.find((c) => c.id === collegeId || c.code.toLowerCase() === collegeId.toLowerCase());
  if (!col) return null;

  if (updates.name) col.name = updates.name.trim();
  if (updates.fullName) col.fullName = updates.fullName.trim();
  if (updates.code) col.code = updates.code.trim().toUpperCase();

  if (targetUni.code === 'FUNAAB') {
    db.colleges = targetUni.colleges;
  }

  writeDb(db);
  return col;
}

export function deleteCollege(collegeId, universityId = 'funaab') {
  const db = readDb();
  const uni = db.universities?.find(
    (u) => u.id.toLowerCase() === universityId.toLowerCase() || u.code.toLowerCase() === universityId.toLowerCase()
  );
  const targetUni = uni || db.universities[0];
  const index = targetUni.colleges.findIndex(
    (c) => c.id === collegeId || c.code.toLowerCase() === collegeId.toLowerCase()
  );
  if (index === -1) return false;

  targetUni.colleges.splice(index, 1);
  if (targetUni.code === 'FUNAAB') {
    db.colleges = targetUni.colleges;
  }
  writeDb(db);
  return true;
}

// ----------------------------------------------------------------------
// Department CRUD & Level Management
// ----------------------------------------------------------------------
export function addDepartment({ universityId = 'funaab', collegeCode, name, code, levels }) {
  const db = readDb();
  const uni = db.universities?.find(
    (u) => u.id.toLowerCase() === universityId.toLowerCase() || u.code.toLowerCase() === universityId.toLowerCase()
  );
  const targetUni = uni || db.universities[0];
  const college = targetUni.colleges.find((c) => c.code.toUpperCase() === collegeCode.trim().toUpperCase());
  if (!college) {
    throw new Error(`College ${collegeCode} not found in ${targetUni.code}.`);
  }

  const newDept = {
    id: (code || name).toLowerCase().replace(/\s+/g, '-'),
    code: (code || name.slice(0, 3)).toUpperCase(),
    name: name.trim(),
    levels: Array.isArray(levels) && levels.length > 0 ? levels : [100, 200, 300, 400],
  };

  college.departments.push(newDept);
  if (targetUni.code === 'FUNAAB') {
    db.colleges = targetUni.colleges;
  }
  writeDb(db);
  return newDept;
}

export function updateDepartment(deptId, updates, collegeCode, universityId = 'funaab') {
  const db = readDb();
  const uni = db.universities?.find(
    (u) => u.id.toLowerCase() === universityId.toLowerCase() || u.code.toLowerCase() === universityId.toLowerCase()
  );
  const targetUni = uni || db.universities[0];
  const college = targetUni.colleges.find((c) => c.code.toUpperCase() === collegeCode.trim().toUpperCase());
  if (!college) return null;

  const dept = college.departments.find((d) => d.id === deptId || d.code.toLowerCase() === deptId.toLowerCase());
  if (!dept) return null;

  if (updates.name) dept.name = updates.name.trim();
  if (updates.code) dept.code = updates.code.trim().toUpperCase();
  if (Array.isArray(updates.levels)) dept.levels = updates.levels;

  if (targetUni.code === 'FUNAAB') {
    db.colleges = targetUni.colleges;
  }
  writeDb(db);
  return dept;
}

export function deleteDepartment(deptId, collegeCode, universityId = 'funaab') {
  const db = readDb();
  const uni = db.universities?.find(
    (u) => u.id.toLowerCase() === universityId.toLowerCase() || u.code.toLowerCase() === universityId.toLowerCase()
  );
  const targetUni = uni || db.universities[0];
  const college = targetUni.colleges.find((c) => c.code.toUpperCase() === collegeCode.trim().toUpperCase());
  if (!college) return false;

  const index = college.departments.findIndex(
    (d) => d.id === deptId || d.code.toLowerCase() === deptId.toLowerCase()
  );
  if (index === -1) return false;

  college.departments.splice(index, 1);
  if (targetUni.code === 'FUNAAB') {
    db.colleges = targetUni.colleges;
  }
  writeDb(db);
  return true;
}

// ----------------------------------------------------------------------
// Material Submissions
// ----------------------------------------------------------------------
export function getSubmissions(filter = {}) {
  const db = readDb();
  let list = db.submissions || [];
  if (filter.userId) {
    list = list.filter((s) => s.userId === filter.userId);
  }
  if (filter.status && filter.status !== 'all') {
    list = list.filter((s) => s.status?.toLowerCase() === filter.status.toLowerCase());
  }
  if (filter.category && filter.category !== 'all') {
    list = list.filter((s) => s.category?.toLowerCase() === filter.category.toLowerCase());
  }
  if (filter.query) {
    const q = filter.query.trim().toLowerCase();
    list = list.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.courseCode?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q) ||
        s.college?.toLowerCase().includes(q) ||
        s.authorName?.toLowerCase().includes(q)
    );
  }
  return list;
}

export function getSubmissionById(id) {
  const db = readDb();
  return db.submissions?.find((s) => s.id === id) || null;
}

export function createSubmission(sub) {
  const db = readDb();
  const newSub = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    ...sub,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  db.submissions.unshift(newSub);
  writeDb(db);
  return newSub;
}

export function reviewSubmission(id, { status, reviewer, reviewNotes }) {
  const db = readDb();
  const sub = db.submissions.find((s) => s.id === id);
  if (!sub) return null;

  sub.status = status; // 'approved' or 'rejected'
  sub.reviewedAt = new Date().toISOString();
  if (reviewer) sub.reviewedBy = reviewer;
  if (reviewNotes !== undefined) sub.reviewNotes = reviewNotes;

  writeDb(db);
  return sub;
}

export function updateSubmission(id, updates) {
  const db = readDb();
  const index = db.submissions.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const { id: _id, ...safeUpdates } = updates;
  db.submissions[index] = { ...db.submissions[index], ...safeUpdates, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db.submissions[index];
}

export function deleteSubmission(id) {
  const db = readDb();
  const index = db.submissions.findIndex((s) => s.id === id);
  if (index === -1) return false;
  db.submissions.splice(index, 1);
  writeDb(db);
  return true;
}

// ----------------------------------------------------------------------
// Analytics & Statistics Aggregator
// ----------------------------------------------------------------------
export function getAdminStats() {
  const db = readDb();
  const submissions = db.submissions || [];
  const users = db.users || [];

  const totalStudents = users.filter((u) => u.role !== 'admin').length;
  const totalMaterials = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

  const approvalRate = totalMaterials > 0 ? Math.round((approvedCount / (approvedCount + rejectedCount || 1)) * 100) : 100;

  // Monthly activity trend
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyActivity = [
    { month: 'Jun', submissions: 14, approvals: 12, pending: 2 },
    { month: 'Jul', submissions: 22, approvals: 19, pending: 3 },
    { month: 'Aug', submissions: 35, approvals: 30, pending: 5 },
    { month: 'Sep', submissions: 48, approvals: 41, pending: 7 },
    { month: 'Oct', submissions: 65, approvals: 58, pending: 7 },
    { month: 'Nov', submissions: totalMaterials, approvals: approvedCount, pending: pendingCount },
  ];

  // Category breakdown for Pie Chart
  const pastQuestionsCount = submissions.filter((s) => s.category?.toLowerCase().includes('past') || s.category === 'Past Questions').length;
  const courseMaterialsCount = submissions.filter((s) => s.category?.toLowerCase().includes('course') || s.category === 'Course Materials').length;
  const solutionsCount = submissions.filter((s) => s.category?.toLowerCase().includes('solution') || s.category === 'Solutions').length;

  const categoryBreakdown = [
    { name: 'Course Materials', count: courseMaterialsCount || 1, color: '#3b82f6' },
    { name: 'Past Questions', count: pastQuestionsCount || 1, color: '#10b981' },
    { name: 'Answers & Solutions', count: solutionsCount || 1, color: '#f59e0b' },
  ];

  // Top Colleges activity distribution
  const collegeMap = {};
  submissions.forEach((s) => {
    const col = s.college?.toUpperCase() || 'COLPHYS';
    collegeMap[col] = (collegeMap[col] || 0) + 1;
  });

  const collegeBreakdown = Object.keys(collegeMap).map((col) => ({
    college: col,
    materials: collegeMap[col],
    students: users.filter((u) => u.college?.toUpperCase() === col).length || 1,
  }));

  if (collegeBreakdown.length === 0) {
    collegeBreakdown.push(
      { college: 'COLPHYS', materials: 5, students: 8 },
      { college: 'COLENG', materials: 3, students: 6 },
      { college: 'COLBIOS', materials: 2, students: 4 }
    );
  }

  return {
    totalStudents,
    totalMaterials,
    pendingCount,
    approvedCount,
    rejectedCount,
    approvalRate,
    monthlyActivity,
    categoryBreakdown,
    collegeBreakdown,
  };
}

// ----------------------------------------------------------------------
// Password Reset OTPs
// ----------------------------------------------------------------------
export function createPasswordOtp(email, code) {
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  db.passwordOtps = (db.passwordOtps || []).filter(
    (o) => o.email !== normalized && new Date(o.expiresAt) > new Date()
  );

  const otpRecord = {
    email: normalized,
    code: String(code),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  db.passwordOtps.push(otpRecord);
  writeDb(db);
  return otpRecord;
}

export function verifyAndConsumeOtp(email, code) {
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  const now = new Date();

  const index = (db.passwordOtps || []).findIndex(
    (o) => o.email === normalized && o.code === String(code) && new Date(o.expiresAt) > now
  );

  if (index === -1) {
    return false;
  }

  db.passwordOtps.splice(index, 1);
  writeDb(db);
  return true;
}
