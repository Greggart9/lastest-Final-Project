import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  initDb,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getColleges,
  addCollege,
  updateCollege,
  deleteCollege,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getSubmissions,
  getSubmissionById,
  createSubmission,
  reviewSubmission,
  updateSubmission,
  deleteSubmission,
  getAdminStats,
  createPasswordOtp,
  verifyAndConsumeOtp,
} from './db.js';
import { authenticateToken, requireAdmin, optionalAuth } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'campushub_jwt_secret_dev_2026';

// Initialize persistent database
initDb();

// Secure CORS policy
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS security policy.`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CampusHub FUNAAB Academic API (Secured & Live)',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 1. Authentication Endpoints
// ==========================================

// Sign Up with bcrypt password hashing
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, name, email, password, matricNo, university, college, department } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 7) {
      return res.status(400).json({ error: 'Password must be at least 7 characters long.' });
    }

    const existingUser = findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const displayName = name?.trim() || `${firstName?.trim() || ''} ${lastName?.trim() || ''}`.trim() || normalizedEmail.split('@')[0];

    const newUser = createUser({
      matricNo: matricNo?.trim() || '',
      firstName: firstName?.trim() || displayName.split(' ')[0],
      lastName: lastName?.trim() || displayName.split(' ').slice(1).join(' ') || '',
      name: displayName,
      email: normalizedEmail,
      passwordHash,
      university: university || 'FUNAAB',
      college: college ? college.toUpperCase() : 'COLPHYS',
      department: department || 'Computer Science',
      role: 'Student',
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('[SIGNUP ERROR]', err);
    res.status(500).json({ error: 'Server error during sign up. Please try again.' });
  }
});

// Sign In with strict bcrypt verification
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = findUserByEmail(normalizedEmail);

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    res.json({
      message: 'Authentication successful.',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('[SIGNIN ERROR]', err);
    res.status(500).json({ error: 'Server error during sign in.' });
  }
});

// Get Current User Profile (Authenticated)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Update Profile Details
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const { matricNo, firstName, lastName, department, college, avatar } = req.body;

    const updates = {};
    if (matricNo !== undefined) updates.matricNo = matricNo.trim();
    if (firstName !== undefined) updates.firstName = firstName.trim();
    if (lastName !== undefined) updates.lastName = lastName.trim();
    if (department !== undefined) updates.department = department.trim();
    if (college !== undefined) updates.college = college.trim().toUpperCase();
    if (avatar !== undefined) updates.avatar = avatar;

    if (updates.firstName || updates.lastName) {
      const f = updates.firstName || req.user.firstName || '';
      const l = updates.lastName || req.user.lastName || '';
      updates.name = `${f} ${l}`.trim();
    }

    const updated = updateUser(req.user.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { passwordHash: _, ...safeUser } = updated;
    res.json({ message: 'Profile updated successfully.', user: safeUser });
  } catch (err) {
    console.error('[PROFILE UPDATE ERROR]', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Request 6-digit Password Reset OTP
app.post('/api/auth/request-password-otp', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const normalized = email.trim().toLowerCase();
  const user = findUserByEmail(normalized);
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  if (user) {
    createPasswordOtp(normalized, code);
  }

  res.json({
    message: 'If this email is registered, a 6-digit security code has been sent.',
    demoOtp: code,
  });
});

// Reset Password with OTP Code
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required.' });
    }

    if (newPassword.length < 7) {
      return res.status(400).json({ error: 'New password must be at least 7 characters long.' });
    }

    const normalized = email.trim().toLowerCase();
    const verified = verifyAndConsumeOtp(normalized, code);

    if (!verified) {
      return res.status(400).json({ error: 'Invalid or expired 6-digit verification code.' });
    }

    const user = findUserByEmail(normalized);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    updateUser(user.id, { passwordHash });

    res.json({ message: 'Password updated successfully. You can now sign in with your new credentials.' });
  } catch (err) {
    console.error('[RESET PASSWORD ERROR]', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// ==========================================
// 2. Admin Dashboard & Analytics
// ==========================================

// Get Live Admin Stats & Chart Datasets
app.get('/api/admin/stats', optionalAuth, (req, res) => {
  try {
    const stats = getAdminStats();
    res.json(stats);
  } catch (err) {
    console.error('[ADMIN STATS ERROR]', err);
    res.status(500).json({ error: 'Failed to generate administrative analytics.' });
  }
});

// Get User Directory (Search & Filter)
app.get('/api/admin/users', optionalAuth, (req, res) => {
  try {
    const { query, role, college } = req.query;
    const users = getAllUsers({ query, role, college });
    res.json({ users });
  } catch (err) {
    console.error('[ADMIN USERS ERROR]', err);
    res.status(500).json({ error: 'Failed to load user directory.' });
  }
});

// Update User Role
app.put('/api/admin/users/:id/role', optionalAuth, (req, res) => {
  try {
    const { role } = req.body;
    if (!['Student', 'Course Rep', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }
    const updated = updateUser(req.params.id, { role });
    if (!updated) return res.status(404).json({ error: 'User not found.' });

    const { passwordHash: _, ...safeUser } = updated;
    res.json({ message: 'User role updated successfully.', user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete User
app.delete('/api/admin/users/:id', optionalAuth, (req, res) => {
  try {
    const success = deleteUser(req.params.id);
    if (!success) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User removed from system.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. Materials Upload & Review Desk
// ==========================================

// Student upload endpoint
app.post('/api/materials/upload', optionalAuth, (req, res) => {
  try {
    const {
      courseCode,
      title,
      college,
      department,
      level,
      semester,
      category,
      fileName,
      fileSize,
      fileType,
      authorName,
      authorEmail,
    } = req.body;

    if (!courseCode || !title || !college || !department || !level || !semester || !category || !fileName) {
      return res.status(400).json({ error: 'All material fields and target demarcations are required.' });
    }

    const submission = createSubmission({
      userId: req.user?.id || 'guest',
      authorName: req.user?.name || authorName || 'Anonymous Student',
      authorEmail: req.user?.email || authorEmail || '',
      courseCode: courseCode.trim().toUpperCase(),
      title: title.trim(),
      college: college.trim().toUpperCase(),
      department: department.trim(),
      level: level.trim(),
      semester: semester.trim(),
      category: category.trim(),
      fileName: fileName.trim(),
      fileSize: fileSize || 'Unknown size',
      fileType: fileType || 'application/pdf',
      reviewNotes: 'Awaiting faculty verification.',
    });

    res.status(201).json({
      message: 'Study material uploaded successfully. Sent to administrative desk for review.',
      submission,
    });
  } catch (err) {
    console.error('[MATERIAL UPLOAD ERROR]', err);
    res.status(500).json({ error: 'Failed to process material upload.' });
  }
});

// Student view of their submissions
app.get('/api/materials/submissions', optionalAuth, (req, res) => {
  const userId = req.user?.id;
  const submissions = getSubmissions(userId ? { userId } : {});
  res.json({ submissions });
});

// Admin: Get all submissions across university with filters
app.get('/api/admin/submissions', optionalAuth, (req, res) => {
  const { status, category, query } = req.query;
  const submissions = getSubmissions({ status, category, query });
  res.json({ submissions });
});

// Admin: Get single submission details for preview
app.get('/api/admin/submissions/:id', optionalAuth, (req, res) => {
  const submission = getSubmissionById(req.params.id);
  if (!submission) return res.status(404).json({ error: 'Submission not found.' });
  res.json({ submission });
});

// Admin: Review submission (Approve or Reject with feedback)
app.put('/api/admin/submissions/:id/review', optionalAuth, (req, res) => {
  const { id } = req.params;
  const { status, reviewNotes } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: "Status must be 'approved', 'rejected', or 'pending'." });
  }

  const updated = reviewSubmission(id, {
    status,
    reviewer: req.user?.name || 'Administrator',
    reviewNotes: reviewNotes || (status === 'approved' ? 'Verified by Academic Board.' : 'Rejected.'),
  });

  if (!updated) {
    return res.status(404).json({ error: 'Submission not found.' });
  }

  res.json({
    message: `Submission marked as ${status}.`,
    submission: updated,
  });
});

// Admin: Edit material metadata
app.put('/api/admin/submissions/:id', optionalAuth, (req, res) => {
  try {
    const updated = updateSubmission(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Submission not found.' });
    res.json({ message: 'Material details updated successfully.', submission: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete submission
app.delete('/api/admin/submissions/:id', optionalAuth, (req, res) => {
  try {
    const success = deleteSubmission(req.params.id);
    if (!success) return res.status(404).json({ error: 'Submission not found.' });
    res.json({ message: 'Submission deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. Universities & Academic Hierarchy Manager
// ==========================================

// Public & Admin: Get all universities
app.get('/api/admin/universities', (req, res) => {
  const universities = getUniversities();
  res.json({ universities });
});

// Get single university details
app.get('/api/admin/universities/:id', (req, res) => {
  const uni = getUniversityById(req.params.id);
  if (!uni) return res.status(404).json({ error: 'University not found.' });
  res.json({ university: uni });
});

// Admin: Create new University folder
app.post('/api/admin/universities', optionalAuth, (req, res) => {
  try {
    const { name, code, shortName } = req.body;
    const newUni = createUniversity({ name, code, shortName });
    res.status(201).json({ message: 'University created successfully.', university: newUni });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Update University
app.put('/api/admin/universities/:id', optionalAuth, (req, res) => {
  try {
    const updated = updateUniversity(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'University not found.' });
    res.json({ message: 'University updated successfully.', university: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete University
app.delete('/api/admin/universities/:id', optionalAuth, (req, res) => {
  try {
    const success = deleteUniversity(req.params.id);
    if (!success) return res.status(404).json({ error: 'University not found.' });
    res.json({ message: 'University removed successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Colleges in university
app.get('/api/academic/colleges', (req, res) => {
  const universityId = req.query.universityId || 'funaab';
  const colleges = getColleges(universityId);
  res.json({
    university: 'Federal University of Agriculture, Abeokuta (FUNAAB)',
    colleges,
  });
});

// Admin: Add new College to University
app.post('/api/admin/colleges', optionalAuth, (req, res) => {
  try {
    const { universityId = 'funaab', code, name, fullName } = req.body;
    if (!code || !name) {
      return res.status(400).json({ error: 'College code and name are required.' });
    }

    const newCollege = addCollege({ universityId, code, name, fullName });
    res.status(201).json({ message: 'College created successfully.', college: newCollege });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Update College
app.put('/api/admin/colleges/:id', optionalAuth, (req, res) => {
  try {
    const { universityId = 'funaab', ...updates } = req.body;
    const updated = updateCollege(req.params.id, updates, universityId);
    if (!updated) return res.status(404).json({ error: 'College not found.' });
    res.json({ message: 'College updated successfully.', college: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete College
app.delete('/api/admin/colleges/:id', optionalAuth, (req, res) => {
  try {
    const universityId = req.query.universityId || 'funaab';
    const success = deleteCollege(req.params.id, universityId);
    if (!success) return res.status(404).json({ error: 'College not found.' });
    res.json({ message: 'College removed successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Add Department to College
app.post('/api/admin/departments', optionalAuth, (req, res) => {
  try {
    const { universityId = 'funaab', collegeCode, name, code, levels } = req.body;
    if (!collegeCode || !name) {
      return res.status(400).json({ error: 'College code and department name are required.' });
    }

    const newDept = addDepartment({ universityId, collegeCode, name, code, levels });
    res.status(201).json({ message: 'Department added successfully.', department: newDept });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Update Department & Levels
app.put('/api/admin/departments/:id', optionalAuth, (req, res) => {
  try {
    const { universityId = 'funaab', collegeCode, ...updates } = req.body;
    if (!collegeCode) return res.status(400).json({ error: 'College code is required.' });

    const updated = updateDepartment(req.params.id, updates, collegeCode, universityId);
    if (!updated) return res.status(404).json({ error: 'Department not found.' });
    res.json({ message: 'Department updated successfully.', department: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete Department
app.delete('/api/admin/departments/:id', optionalAuth, (req, res) => {
  try {
    const { collegeCode, universityId = 'funaab' } = req.query;
    if (!collegeCode) return res.status(400).json({ error: 'College code is required.' });

    const success = deleteDepartment(req.params.id, collegeCode, universityId);
    if (!success) return res.status(404).json({ error: 'Department not found.' });
    res.json({ message: 'Department removed successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[CampusHub Backend] Server secured and running live on http://localhost:${PORT}`);
});
