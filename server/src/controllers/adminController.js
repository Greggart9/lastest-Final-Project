import bcrypt from 'bcryptjs';
import {
  findUserByEmail,
  createUser as dbCreateUser,
  updateUser as dbUpdateUser,
  deleteUser as dbDeleteUser,
  getAllUsers,
  getAdminStats,
} from '../db.js';
import {
  isSupabaseConfigured,
  supabaseGetAllUsers,
  supabaseUpdateUser,
  supabaseDeleteUser,
  supabaseFindUserByEmail,
  supabaseCreateUser,
  supabaseGetAdminStats,
} from '../db/supabase.js';

// -------------------------------------------------------------
// GET /api/admin/stats - Live Analytics & Chart Metrics
// -------------------------------------------------------------
export async function getStats(req, res) {
  try {
    let stats = null;
    if (isSupabaseConfigured()) {
      stats = await supabaseGetAdminStats();
    }
    if (!stats) {
      stats = getAdminStats();
    }
    res.json(stats);
  } catch (err) {
    console.error('[ADMIN STATS ERROR]', err);
    res.status(500).json({ error: 'Failed to generate administrative analytics.' });
  }
}

// -------------------------------------------------------------
// GET /api/admin/users - User Directory (Search & Filter)
// -------------------------------------------------------------
export async function getUsers(req, res) {
  try {
    const { query, role, college } = req.query;
    let users = null;
    if (isSupabaseConfigured()) {
      users = await supabaseGetAllUsers({ query, role, college });
    }
    if (!users) {
      users = getAllUsers({ query, role, college });
    }
    res.json({ users });
  } catch (err) {
    console.error('[ADMIN USERS ERROR]', err);
    res.status(500).json({ error: 'Failed to load user directory.' });
  }
}

// -------------------------------------------------------------
// PUT /api/admin/users/:id/role - Update User Role
// -------------------------------------------------------------
export async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    if (!['Student', 'Course Rep', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }
    let updated = null;
    if (isSupabaseConfigured()) {
      updated = await supabaseUpdateUser(req.params.id, { role });
    }
    const localUpdated = dbUpdateUser(req.params.id, { role });
    if (!updated) updated = localUpdated;

    if (!updated) return res.status(404).json({ error: 'User not found.' });

    const { passwordHash: _, ...safeUser } = updated;
    res.json({ message: 'User role updated successfully.', user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// DELETE /api/admin/users/:id - Delete User
// -------------------------------------------------------------
export async function deleteUser(req, res) {
  try {
    let success = false;
    if (isSupabaseConfigured()) {
      success = await supabaseDeleteUser(req.params.id);
    }
    const localSuccess = dbDeleteUser(req.params.id);
    if (!success && !localSuccess) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User removed from system.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// -------------------------------------------------------------
// POST /api/admin/users - Admin Create New User Account
// -------------------------------------------------------------
export async function createUser(req, res) {
  try {
    const {
      firstName,
      lastName,
      name,
      email,
      password,
      matricNo,
      role = 'Student',
      university = 'FUNAAB',
      college = 'COLPHYS',
      department = 'Computer Science',
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let existing = null;
    if (isSupabaseConfigured()) {
      existing = await supabaseFindUserByEmail(normalizedEmail);
    }
    if (!existing) {
      existing = findUserByEmail(normalizedEmail);
    }
    if (existing) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
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
      college: college.toUpperCase(),
      department,
      role,
    };

    let created = null;
    if (isSupabaseConfigured()) {
      created = await supabaseCreateUser(userData);
    }
    const localUser = dbCreateUser(userData);
    if (!created) created = localUser;

    const { passwordHash: _, ...safeUser } = created;
    res.status(201).json({ message: 'User created successfully.', user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
