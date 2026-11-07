import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getUniversityById,
  createPasswordOtp,
  verifyAndConsumeOtp,
} from '../db.js';
import {
  isSupabaseConfigured,
  supabaseFindUserByEmail,
  supabaseFindUserById,
  supabaseCreateUser,
  supabaseUpdateUser,
} from '../db/supabase.js';
import { JWT_SECRET } from '../middlewares/auth.js';
import { sendWelcomeEmail, sendPasswordOtpEmail } from '../services/emailService.js';

// -------------------------------------------------------------
// POST /api/auth/signup - Register new student account
// -------------------------------------------------------------
export async function signup(req, res) {
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

    let existingUser = null;
    if (isSupabaseConfigured()) {
      existingUser = await supabaseFindUserByEmail(normalizedEmail);
    }
    if (!existingUser) {
      existingUser = findUserByEmail(normalizedEmail);
    }

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const displayName =
      name?.trim() ||
      `${firstName?.trim() || ''} ${lastName?.trim() || ''}`.trim() ||
      normalizedEmail.split('@')[0];

    const userData = {
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
    };

    let newUser = null;
    if (isSupabaseConfigured()) {
      newUser = await supabaseCreateUser(userData);
    }

    // Always keep local database synced as fallback
    const localUser = createUser(userData);
    if (!newUser) newUser = localUser;

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = newUser;
    safeUser.academicTerm = getUniversityById(safeUser.university || 'funaab')?.academicTerm || 'college';

    // Dispatch welcome email asynchronously without blocking signup response
    sendWelcomeEmail({
      to: newUser.email,
      name: newUser.name,
      university: newUser.university,
      college: newUser.college,
      department: newUser.department,
      matricNo: newUser.matricNo,
    }).catch((err) => console.error('[EMAIL DISPATCH ERROR]', err));

    res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('[SIGNUP ERROR]', err);
    res.status(500).json({ error: 'Server error during sign up. Please try again.' });
  }
}

// -------------------------------------------------------------
// POST /api/auth/signin - Authenticate user credentials
// -------------------------------------------------------------
export async function signin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = null;

    if (isSupabaseConfigured()) {
      user = await supabaseFindUserByEmail(normalizedEmail);
    }
    if (!user) {
      user = findUserByEmail(normalizedEmail);
    }

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
    safeUser.academicTerm = getUniversityById(safeUser.university || 'funaab')?.academicTerm || 'college';
    res.json({
      message: 'Authentication successful.',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('[SIGNIN ERROR]', err);
    res.status(500).json({ error: 'Server error during sign in.' });
  }
}

// -------------------------------------------------------------
// GET /api/auth/me - Retrieve current authenticated profile
// -------------------------------------------------------------
export async function getMe(req, res) {
  try {
    let freshUser = null;
    if (isSupabaseConfigured() && req.user?.id) {
      freshUser = await supabaseFindUserById(req.user.id);
    }
    if (!freshUser && req.user?.id) {
      freshUser = findUserById(req.user.id);
    }
    if (!freshUser) {
      freshUser = req.user;
    }
    const { passwordHash: _, ...safeUser } = freshUser;
    safeUser.academicTerm = getUniversityById(safeUser.university || 'funaab')?.academicTerm || 'college';
    res.json({ user: safeUser });
  } catch {
    const fallbackUser = req.user ? { ...req.user } : null;
    if (fallbackUser) {
      fallbackUser.academicTerm = getUniversityById(fallbackUser.university || 'funaab')?.academicTerm || 'college';
    }
    res.json({ user: fallbackUser });
  }
}

// -------------------------------------------------------------
// PUT /api/auth/profile - Update user profile fields
// -------------------------------------------------------------
export async function updateProfile(req, res) {
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

    let updated = null;
    if (isSupabaseConfigured() && req.user?.id) {
      try {
        updated = await supabaseUpdateUser(req.user.id, updates);
      } catch (sbErr) {
        console.error('[Supabase updateProfile error]', sbErr);
      }
    }

    const localUpdated = updateUser(req.user.id, updates);
    if (!updated) updated = localUpdated;

    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { passwordHash: _, ...safeUser } = updated;
    safeUser.academicTerm = getUniversityById(safeUser.university || 'funaab')?.academicTerm || 'college';
    res.json({ message: 'Profile updated successfully.', user: safeUser });
  } catch (err) {
    console.error('[PROFILE UPDATE ERROR]', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
}

// -------------------------------------------------------------
// POST /api/auth/request-password-otp - Generate password reset OTP
// -------------------------------------------------------------
export async function requestPasswordOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const normalized = email.trim().toLowerCase();
    let user = null;
    if (isSupabaseConfigured()) {
      try {
        user = await supabaseFindUserByEmail(normalized);
      } catch {}
    }
    if (!user) {
      user = findUserByEmail(normalized);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    if (user) {
      createPasswordOtp(normalized, code);

      // Dispatch 6-digit OTP verification email asynchronously
      sendPasswordOtpEmail({
        to: normalized,
        name: user.name || user.firstName || 'Student',
        code,
      }).catch((err) => console.error('[EMAIL DISPATCH ERROR]', err));
    }

    res.json({
      message: 'If this email is registered, a 6-digit security code has been sent.',
      demoOtp: code,
    });
  } catch (err) {
    console.error('[REQUEST OTP ERROR]', err);
    res.status(500).json({ error: 'Failed to process security code request.' });
  }
}

// -------------------------------------------------------------
// POST /api/auth/reset-password - Verify OTP and apply new password
// -------------------------------------------------------------
export async function resetPassword(req, res) {
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

    let user = null;
    if (isSupabaseConfigured()) {
      try {
        user = await supabaseFindUserByEmail(normalized);
      } catch {}
    }
    if (!user) {
      user = findUserByEmail(normalized);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    if (isSupabaseConfigured()) {
      try {
        await supabaseUpdateUser(user.id, { passwordHash });
      } catch (sbErr) {
        console.error('[Supabase Update Password Error]', sbErr);
      }
    }
    updateUser(user.id, { passwordHash });

    res.json({ message: 'Password updated successfully. You can now sign in with your new credentials.' });
  } catch (err) {
    console.error('[RESET PASSWORD ERROR]', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
}
