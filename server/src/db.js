import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

const DEFAULT_COLLEGES = [
  {
    id: 'colphys',
    code: 'COLPHYS',
    name: 'Physical Sciences',
    fullName: 'College of Physical Sciences',
    departments: [
      { id: 'csc', code: 'CSC', name: 'Computer Science' },
      { id: 'phs', code: 'PHS', name: 'Physics' },
      { id: 'mts', code: 'MTS', name: 'Mathematics' },
      { id: 'sts', code: 'STS', name: 'Statistics' },
      { id: 'chm', code: 'CHM', name: 'Chemistry' },
    ],
  },
  {
    id: 'colbios',
    code: 'COLBIOS',
    name: 'Biosciences',
    fullName: 'College of Biosciences',
    departments: [
      { id: 'bch', code: 'BCH', name: 'Biochemistry' },
      { id: 'mcb', code: 'MCB', name: 'Microbiology' },
      { id: 'paz', code: 'PAZ', name: 'Pure & Applied Zoology' },
      { id: 'pab', code: 'PAB', name: 'Pure & Applied Botany' },
    ],
  },
  {
    id: 'coleng',
    code: 'COLENG',
    name: 'Engineering',
    fullName: 'College of Engineering',
    departments: [
      { id: 'mce', code: 'MCE', name: 'Mechanical Engineering' },
      { id: 'ele', code: 'ELE', name: 'Electrical & Electronics Engineering' },
      { id: 'cve', code: 'CVE', name: 'Civil Engineering' },
      { id: 'age', code: 'AGE', name: 'Agricultural & Bio-Resources Engineering' },
      { id: 'mte', code: 'MTE', name: 'Mechatronics Engineering' },
    ],
  },
  {
    id: 'colvet',
    code: 'COLVET',
    name: 'Veterinary Medicine',
    fullName: 'College of Veterinary Medicine',
    departments: [
      { id: 'vmd', code: 'VMD', name: 'Veterinary Medicine & Surgery' },
      { id: 'vpa', code: 'VPA', name: 'Veterinary Pathology' },
      { id: 'vpy', code: 'VPY', name: 'Veterinary Physiology & Pharmacology' },
    ],
  },
  {
    id: 'colanim',
    code: 'COLANIM',
    name: 'Animal Science & Livestock Production',
    fullName: 'College of Animal Science & Livestock Production',
    departments: [
      { id: 'aph', code: 'APH', name: 'Animal Production & Health' },
      { id: 'ann', code: 'ANN', name: 'Animal Nutrition' },
      { id: 'abg', code: 'ABG', name: 'Animal Breeding & Genetics' },
    ],
  },
  {
    id: 'colplant',
    code: 'COLPLANT',
    name: 'Plant Science & Crop Production',
    fullName: 'College of Plant Science & Crop Production',
    departments: [
      { id: 'cpt', code: 'CPT', name: 'Crop Protection' },
      { id: 'hrt', code: 'HRT', name: 'Horticulture' },
      { id: 'pbr', code: 'PBR', name: 'Plant Breeding & Seed Technology' },
      { id: 'ssm', code: 'SSM', name: 'Soil Science & Land Management' },
    ],
  },
  {
    id: 'colamrud',
    code: 'COLAMRUD',
    name: 'Agricultural Management & Rural Development',
    fullName: 'College of Agricultural Management & Rural Development',
    departments: [
      { id: 'aed', code: 'AED', name: 'Agricultural Economics & Farm Management' },
      { id: 'aex', code: 'AEX', name: 'Agricultural Extension & Rural Development' },
      { id: 'cca', code: 'CCA', name: 'Communication & General Studies' },
    ],
  },
  {
    id: 'colerm',
    code: 'COLERM',
    name: 'Environmental Resources Management',
    fullName: 'College of Environmental Resources Management',
    departments: [
      { id: 'aqfm', code: 'AQFM', name: 'Aquaculture & Fisheries Management' },
      { id: 'fwm', code: 'FWM', name: 'Forestry & Wildlife Management' },
      { id: 'wrm', code: 'WRM', name: 'Water Resources Management & Agrometeorology' },
      { id: 'emt', code: 'EMT', name: 'Environmental Management & Toxicology' },
    ],
  },
];

// Helper to read DB
export function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      initDb();
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
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

  // Pre-seed an admin and demo student with salted bcrypt hashes
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

  // Prevent overriding ID or Email directly via this endpoint
  const { id: _id, email: _email, ...allowedUpdates } = updates;
  db.users[index] = { ...db.users[index], ...allowedUpdates, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db.users[index];
}

// ----------------------------------------------------------------------
// Academic Operations
// ----------------------------------------------------------------------
export function getColleges() {
  const db = readDb();
  return db.colleges || [];
}

export function addCollege(college) {
  const db = readDb();
  const code = college.code.trim().toUpperCase();
  if (db.colleges.some((c) => c.code.toUpperCase() === code)) {
    throw new Error(`College ${code} already exists.`);
  }
  const newCol = {
    id: code.toLowerCase(),
    code,
    name: college.name.trim(),
    fullName: college.fullName?.trim() || `College of ${college.name.trim()}`,
    departments: college.departments || [],
  };
  db.colleges.push(newCol);
  writeDb(db);
  return newCol;
}

export function addDepartment(collegeCode, dept) {
  const db = readDb();
  const college = db.colleges.find((c) => c.code.toUpperCase() === collegeCode.trim().toUpperCase());
  if (!college) {
    throw new Error(`College ${collegeCode} not found.`);
  }
  const newDept = {
    id: (dept.code || dept.name).toLowerCase().replace(/\s+/g, '-'),
    code: (dept.code || dept.name.slice(0, 3)).toUpperCase(),
    name: dept.name.trim(),
  };
  college.departments.push(newDept);
  writeDb(db);
  return newDept;
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
  if (filter.status) {
    list = list.filter((s) => s.status === filter.status);
  }
  return list;
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
  if (reviewNotes) sub.reviewNotes = reviewNotes;

  writeDb(db);
  return sub;
}

// ----------------------------------------------------------------------
// Password Reset OTPs
// ----------------------------------------------------------------------
export function createPasswordOtp(email, code) {
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  // Filter out expired or existing OTPs for this email
  db.passwordOtps = (db.passwordOtps || []).filter(
    (o) => o.email !== normalized && new Date(o.expiresAt) > new Date()
  );

  const otpRecord = {
    email: normalized,
    code: String(code),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins
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

  // Consume OTP (single use)
  db.passwordOtps.splice(index, 1);
  writeDb(db);
  return true;
}
