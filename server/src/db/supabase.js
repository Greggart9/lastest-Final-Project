import { createClient } from '@supabase/supabase-js';

export function isSupabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
  );
}

let supabaseClient = null;

export function getSupabase() {
  if (!isSupabaseConfigured()) return null;

  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL.trim();
    // Prefer service role key on backend to bypass RLS for administrative operations
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY).trim();
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[Supabase] Client initialized successfully for', url);
  }
  return supabaseClient;
}

// ----------------------------------------------------
// Universities Service
// ----------------------------------------------------
export async function supabaseGetUniversities() {
  const client = getSupabase();
  if (!client) return null;

  const { data: unis, error: uniErr } = await client
    .from('universities')
    .select('*')
    .order('created_at', { ascending: true });

  if (uniErr) {
    console.error('[Supabase] Failed to get universities:', uniErr);
    return null;
  }

  const { data: colleges, error: colErr } = await client
    .from('colleges')
    .select('*');

  const { data: departments, error: deptErr } = await client
    .from('departments')
    .select('*');

  // Nest colleges and departments
  return unis.map((u) => {
    const uniColleges = (colleges || [])
      .filter((c) => c.university_id === u.id)
      .map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        fullName: c.full_name,
        departments: (departments || [])
          .filter((d) => d.college_id === c.id || d.college_code?.toUpperCase() === c.code?.toUpperCase())
          .map((d) => ({
            id: d.id,
            code: d.code,
            name: d.name,
            levels: d.levels || [100, 200, 300, 400],
          })),
      }));

    const isFaculty = u.status?.includes('faculty');
    const cleanStatus = u.status?.split(':')[0] || 'active';
    const academicTerm = isFaculty ? 'faculty' : 'college';

    return {
      id: u.id,
      code: u.code,
      name: u.name,
      shortName: u.short_name,
      status: cleanStatus,
      academicTerm,
      colleges: uniColleges,
    };
  });
}

export async function supabaseCreateUniversity({ name, code, shortName, academicTerm = 'college' }) {
  const client = getSupabase();
  if (!client) return null;

  const normalizedCode = code.trim().toUpperCase();
  const uniId = normalizedCode.toLowerCase();
  const term = academicTerm === 'faculty' ? 'faculty' : 'college';

  const row = {
    id: uniId,
    code: normalizedCode,
    name: name.trim(),
    short_name: shortName?.trim() || normalizedCode,
    status: `active:${term}`,
  };

  const { data, error } = await client
    .from('universities')
    .upsert([row], { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Create university error:', error);
    return null;
  }

  return {
    id: data.id,
    code: data.code,
    name: data.name,
    shortName: data.short_name,
    status: 'active',
    academicTerm: term,
    colleges: [],
  };
}

export async function supabaseUpdateUniversity(id, updates) {
  const client = getSupabase();
  if (!client) return null;

  const rowUpdates = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name) rowUpdates.name = updates.name.trim();
  if (updates.code) rowUpdates.code = updates.code.trim().toUpperCase();
  if (updates.shortName) rowUpdates.short_name = updates.shortName.trim();
  if (updates.status || updates.academicTerm) {
    const term = updates.academicTerm
      ? (updates.academicTerm === 'faculty' ? 'faculty' : 'college')
      : (updates.status?.includes('faculty') ? 'faculty' : 'college');
    const baseStatus = updates.status?.split(':')[0] || 'active';
    rowUpdates.status = `${baseStatus}:${term}`;
  }

  const { data, error } = await client
    .from('universities')
    .update(rowUpdates)
    .or(`id.eq.${id.toLowerCase()},code.ilike.${id}`)
    .select()
    .maybeSingle();

  if (error) {
    console.error('[Supabase] Update university error:', error);
    return null;
  }

  if (!data) return null;

  const isFaculty = data.status?.includes('faculty');
  const cleanStatus = data.status?.split(':')[0] || 'active';
  const academicTerm = isFaculty ? 'faculty' : 'college';

  return {
    id: data.id,
    code: data.code,
    name: data.name,
    shortName: data.short_name,
    status: cleanStatus,
    academicTerm,
  };
}

export async function supabaseDeleteUniversity(id) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from('universities')
    .delete()
    .or(`id.eq.${id.toLowerCase()},code.ilike.${id}`);

  if (error) {
    console.error('[Supabase] Delete university error:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------
// Colleges Service
// ----------------------------------------------------
export async function supabaseAddCollege({ universityId = 'funaab', code = '', name = '', fullName = '' }) {
  const client = getSupabase();
  if (!client) return null;

  const normalizedUniId = universityId.toLowerCase();
  const normalizedCode = code ? code.trim().toUpperCase() : '';
  const trimmedName = name ? name.trim() : '';
  const trimmedFullName = fullName ? fullName.trim() : '';

  const collegeId = normalizedCode
    ? normalizedCode.toLowerCase()
    : (trimmedName || trimmedFullName || 'division')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .slice(0, 30) + '-' + Date.now().toString(36);

  const row = {
    id: collegeId,
    university_id: normalizedUniId,
    code: normalizedCode, // only what user provided, never fabricated
    name: trimmedName,     // only what user provided
    full_name: trimmedFullName, // only what user provided
  };

  const { data, error } = await client
    .from('colleges')
    .upsert([row], { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Add college error:', error);
    return null;
  }

  return {
    id: data.id,
    code: data.code,
    name: data.name,
    fullName: data.full_name,
    departments: [],
  };
}

export async function supabaseUpdateCollege(codeOrId, updates, universityId = 'funaab') {
  const client = getSupabase();
  if (!client) return null;

  const rowUpdates = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) rowUpdates.name = updates.name.trim();
  if (updates.fullName !== undefined) rowUpdates.full_name = updates.fullName.trim();
  if (updates.code !== undefined) rowUpdates.code = updates.code.trim().toUpperCase();

  const { data, error } = await client
    .from('colleges')
    .update(rowUpdates)
    .or(`id.eq.${codeOrId.toLowerCase()},code.ilike.${codeOrId}`)
    .select()
    .maybeSingle();

  if (error) {
    console.error('[Supabase] Update college error:', error);
    return null;
  }

  return data ? {
    id: data.id,
    code: data.code,
    name: data.name,
    fullName: data.full_name,
  } : null;
}

export async function supabaseDeleteCollege(codeOrId, universityId = 'funaab') {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from('colleges')
    .delete()
    .or(`id.eq.${codeOrId.toLowerCase()},code.ilike.${codeOrId}`);

  if (error) {
    console.error('[Supabase] Delete college error:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------
// Departments Service
// ----------------------------------------------------
export async function supabaseAddDepartment({ universityId = 'funaab', collegeCode, name, code, levels = [100, 200, 300, 400] }) {
  const client = getSupabase();
  if (!client) return null;

  const normalizedUniId = universityId.toLowerCase();
  const normalizedCollegeCode = collegeCode.trim().toUpperCase();
  const deptCode = (code || name.substring(0, 3)).trim().toUpperCase();
  const deptId = (code ? code.toLowerCase() : name.toLowerCase().replace(/[^a-z0-9]/g, '-')).trim();

  // Find college id
  const { data: col } = await client
    .from('colleges')
    .select('id, code')
    .eq('university_id', normalizedUniId)
    .ilike('code', normalizedCollegeCode)
    .maybeSingle();

  const collegeId = col?.id || normalizedCollegeCode.toLowerCase();

  const row = {
    id: deptId,
    college_id: collegeId,
    college_code: normalizedCollegeCode,
    university_id: normalizedUniId,
    code: deptCode,
    name: name.trim(),
    levels: levels || [100, 200, 300, 400],
  };

  const { data, error } = await client
    .from('departments')
    .upsert([row], { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Add department error:', error);
    return null;
  }

  return {
    id: data.id,
    code: data.code,
    name: data.name,
    levels: data.levels,
  };
}

export async function supabaseUpdateDepartment(deptId, updates, collegeCode, universityId = 'funaab') {
  const client = getSupabase();
  if (!client) return null;

  const rowUpdates = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name) rowUpdates.name = updates.name.trim();
  if (updates.code) rowUpdates.code = updates.code.trim().toUpperCase();
  if (Array.isArray(updates.levels)) rowUpdates.levels = updates.levels;

  // Try updating with exact id match first
  let { data, error } = await client
    .from('departments')
    .update(rowUpdates)
    .eq('id', deptId)
    .select()
    .maybeSingle();

  // If no match by id, try matching by code within this college
  if (!data && collegeCode) {
    const res = await client
      .from('departments')
      .update(rowUpdates)
      .ilike('college_code', collegeCode)
      .ilike('code', deptId)
      .select()
      .maybeSingle();
    data = res.data;
    error = res.error;
  }

  // If still no row found in Supabase, upsert it so it's guaranteed to be saved
  if (!data && collegeCode) {
    const newRow = {
      id: deptId.toLowerCase().replace(/\s+/g, '-'),
      college_id: collegeCode.toLowerCase(),
      college_code: collegeCode.toUpperCase(),
      university_id: universityId.toLowerCase(),
      code: (updates.code || deptId.slice(0, 3)).toUpperCase(),
      name: updates.name || deptId,
      levels: updates.levels || [100, 200, 300, 400],
      updated_at: new Date().toISOString(),
    };
    const upsertRes = await client
      .from('departments')
      .upsert([newRow], { onConflict: 'id' })
      .select()
      .maybeSingle();
    data = upsertRes.data;
    error = upsertRes.error;
  }

  if (error) {
    console.error('[Supabase] Update department error:', error);
    return null;
  }

  return data ? {
    id: data.id,
    code: data.code,
    name: data.name,
    levels: data.levels,
  } : null;
}

export async function supabaseSetCollegeLevels(collegeCode, levels, universityId = 'funaab') {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from('departments')
    .update({ levels, updated_at: new Date().toISOString() })
    .ilike('college_code', collegeCode);

  if (error) {
    console.error('[Supabase] Set college levels error:', error);
    return false;
  }
  return true;
}

export async function supabaseDeleteDepartment(deptId, collegeCode, universityId = 'funaab') {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from('departments')
    .delete()
    .or(`id.eq.${deptId},code.ilike.${deptId}`);

  if (error) {
    console.error('[Supabase] Delete department error:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------
// Submissions & Materials Service
// ----------------------------------------------------
export async function supabaseCreateSubmission(sub) {
  const client = getSupabase();
  if (!client) return null;

  const row = {
    id: sub.id,
    user_id: sub.userId,
    author_name: sub.authorName,
    author_email: sub.authorEmail,
    course_code: sub.courseCode,
    title: sub.title,
    college: sub.college,
    department: sub.department,
    level: String(sub.level),
    semester: sub.semester,
    category: sub.category,
    file_name: sub.fileName,
    file_size: sub.fileSize,
    file_type: sub.fileType,
    file_url: sub.fileUrl,
    file_key: sub.fileKey,
    storage_provider: sub.storageProvider || 'cloudflare_r2',
    status: sub.status || 'pending',
    reviewer: sub.reviewedBy,
    review_notes: sub.reviewNotes,
    reviewed_at: sub.reviewedAt,
    submitted_at: sub.submittedAt || new Date().toISOString(),
  };

  const { data, error } = await client
    .from('submissions')
    .insert([row])
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Create submission error:', error);
    return null;
  }
  return data;
}

export async function supabaseGetSubmissions(filters = {}) {
  const client = getSupabase();
  if (!client) return null;

  let query = client.from('submissions').select('*').order('submitted_at', { ascending: false });

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters.university && filters.university !== 'all') {
    query = query.ilike('university', filters.university);
  }
  if (filters.college && filters.college !== 'all') {
    query = query.ilike('college', filters.college);
  }
  if (filters.department && filters.department !== 'all') {
    const cleanDept = filters.department.trim().replace(/-/g, ' ');
    query = query.ilike('department', `%${cleanDept}%`);
  }
  if (filters.level && filters.level !== 'all') {
    const lvlNum = String(filters.level).replace(/[^0-9]/g, '');
    if (lvlNum) {
      query = query.ilike('level', `%${lvlNum}%`);
    } else {
      query = query.ilike('level', `%${filters.level}%`);
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error('[Supabase] Get submissions error:', error);
    return null;
  }

  return (data || []).map((s) => ({
    id: s.id,
    userId: s.user_id,
    authorName: s.author_name,
    authorEmail: s.author_email,
    courseCode: s.course_code,
    title: s.title,
    college: s.college,
    department: s.department,
    level: s.level,
    semester: s.semester,
    category: s.category,
    fileName: s.file_name,
    fileSize: s.file_size,
    fileType: s.file_type,
    fileUrl: s.file_url,
    fileKey: s.file_key,
    storageProvider: s.storage_provider,
    status: s.status,
    reviewer: s.reviewer,
    reviewNotes: s.review_notes,
    submittedAt: s.submitted_at,
    uploadedAt: s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : 'Recently',
  }));
}

export async function supabaseReviewSubmission(id, { status, reviewer, reviewNotes }) {
  const client = getSupabase();
  if (!client) return null;

  const updates = {
    status,
    reviewer,
    review_notes: reviewNotes,
    reviewed_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from('submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Review submission error:', error);
    return null;
  }
  return data;
}

export async function supabaseUpdateSubmission(id, fields) {
  const client = getSupabase();
  if (!client) return null;

  const rowUpdates = {};
  if (fields.title !== undefined) rowUpdates.title = fields.title;
  if (fields.courseCode !== undefined) rowUpdates.course_code = fields.courseCode;
  if (fields.category !== undefined) rowUpdates.category = fields.category;
  if (fields.level !== undefined) rowUpdates.level = String(fields.level);
  if (fields.semester !== undefined) rowUpdates.semester = fields.semester;
  if (fields.college !== undefined) rowUpdates.college = fields.college;
  if (fields.department !== undefined) rowUpdates.department = fields.department;

  const { data, error } = await client
    .from('submissions')
    .update(rowUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Update submission error:', error);
    return null;
  }
  return data;
}

export async function supabaseGetSubmissionById(id) {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client.from('submissions').select('*').eq('id', id).single();
  if (error || !data) return null;
  return {
    id: data.id,
    fileKey: data.file_key,
    fileUrl: data.file_url,
  };
}

export async function supabaseDeleteSubmission(id) {
  const client = getSupabase();
  if (!client) return false;
  const { error } = await client.from('submissions').delete().eq('id', id);
  if (error) {
    console.error('[Supabase] Delete submission error:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------
// User Authentication & Directory Service
// ----------------------------------------------------
function mapUserFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    matricNo: row.matric_no,
    firstName: row.first_name,
    lastName: row.last_name,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role || 'Student',
    university: row.university || 'FUNAAB',
    college: row.college || 'COLPHYS',
    department: row.department || 'Computer Science',
    avatar: row.avatar,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function supabaseFindUserByEmail(email) {
  const client = getSupabase();
  if (!client || !email) return null;
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (error || !data) return null;
  return mapUserFromRow(data);
}

export async function supabaseFindUserById(id) {
  const client = getSupabase();
  if (!client || !id) return null;
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return mapUserFromRow(data);
}

export async function supabaseCreateUser(u) {
  const client = getSupabase();
  if (!client) return null;

  const row = {
    id: u.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    matric_no: u.matricNo || null,
    first_name: u.firstName || null,
    last_name: u.lastName || null,
    name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email.split('@')[0],
    email: u.email.trim().toLowerCase(),
    password_hash: u.passwordHash,
    role: u.role || 'Student',
    university: u.university || 'FUNAAB',
    college: u.college || 'COLPHYS',
    department: u.department || 'Computer Science',
    avatar: u.avatar || null,
  };

  const { data, error } = await client
    .from('users')
    .insert([row])
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Create user error:', error);
    return null;
  }
  return mapUserFromRow(data);
}

export async function supabaseGetAllUsers(filters = {}) {
  const client = getSupabase();
  if (!client) return null;

  let query = client.from('users').select('*').order('created_at', { ascending: false });

  if (filters.role && filters.role !== 'all') {
    query = query.eq('role', filters.role);
  }
  if (filters.college && filters.college !== 'all') {
    query = query.eq('college', filters.college);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[Supabase] Get users error:', error);
    return null;
  }

  let list = (data || []).map(mapUserFromRow);

  if (filters.query) {
    const q = filters.query.trim().toLowerCase();
    list = list.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.matricNo?.toLowerCase().includes(q) ||
        u.department?.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function supabaseUpdateUser(id, updates) {
  const client = getSupabase();
  if (!client) return null;

  const rowUpdates = {};
  if (updates.role !== undefined) rowUpdates.role = updates.role;
  if (updates.firstName !== undefined) rowUpdates.first_name = updates.firstName;
  if (updates.lastName !== undefined) rowUpdates.last_name = updates.lastName;
  if (updates.name !== undefined) rowUpdates.name = updates.name;
  if (updates.matricNo !== undefined) rowUpdates.matric_no = updates.matricNo;
  if (updates.avatar !== undefined) rowUpdates.avatar = updates.avatar;
  if (updates.university !== undefined) rowUpdates.university = updates.university;
  if (updates.college !== undefined) rowUpdates.college = updates.college;
  if (updates.department !== undefined) rowUpdates.department = updates.department;
  if (updates.passwordHash !== undefined) rowUpdates.password_hash = updates.passwordHash;
  rowUpdates.updated_at = new Date().toISOString();

  const { data, error } = await client
    .from('users')
    .update(rowUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Update user error:', error);
    return null;
  }
  return mapUserFromRow(data);
}

export async function supabaseDeleteUser(id) {
  const client = getSupabase();
  if (!client) return false;
  const { error } = await client.from('users').delete().eq('id', id);
  if (error) {
    console.error('[Supabase] Delete user error:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------
// Live Admin Stats & Real-time Analytics from Supabase
// ----------------------------------------------------
export async function supabaseGetAdminStats() {
  const client = getSupabase();
  if (!client) return null;

  const [{ data: users }, { data: subs }] = await Promise.all([
    client.from('users').select('*'),
    client.from('submissions').select('*'),
  ]);

  const allUsers = users || [];
  const allSubs = subs || [];

  const totalStudents = allUsers.filter((u) => u.role !== 'admin').length;
  const totalMaterials = allSubs.length;
  const pendingCount = allSubs.filter((s) => s.status === 'pending').length;
  const approvedCount = allSubs.filter((s) => s.status === 'approved').length;
  const rejectedCount = allSubs.filter((s) => s.status === 'rejected').length;

  const approvalRate =
    totalMaterials > 0
      ? Math.round((approvedCount / (approvedCount + rejectedCount || 1)) * 100)
      : 100;

  // Dynamic monthly activity trend (past 6 calendar months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6Months.push({
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
      month: monthNames[d.getMonth()],
      uploads: 0,
      approved: 0,
      submissions: 0,
      approvals: 0,
    });
  }

  allSubs.forEach((s) => {
    const dateStr = s.createdAt || s.created_at;
    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const target = last6Months.find(
          (m) => m.year === d.getFullYear() && m.monthIndex === d.getMonth()
        );
        if (target) {
          target.uploads += 1;
          target.submissions += 1;
          if (s.status === 'approved') {
            target.approved += 1;
            target.approvals += 1;
          }
        }
      }
    }
  });

  const monthlyActivity = last6Months.map(({ month, uploads, approved, submissions, approvals }) => ({
    month,
    uploads,
    approved,
    submissions,
    approvals,
  }));

  // Real category breakdown for Pie Chart
  const pqCount = allSubs.filter(
    (s) => (s.category || '').toLowerCase().includes('past')
  ).length;
  const cmCount = allSubs.filter(
    (s) => (s.category || '').toLowerCase().includes('course')
  ).length;
  const solCount = allSubs.filter(
    (s) => (s.category || '').toLowerCase().includes('solution')
  ).length;

  const categoryBreakdown = [
    { name: 'Course Materials', value: cmCount, count: cmCount, color: '#3b82f6' },
    { name: 'Past Questions', value: pqCount, count: pqCount, color: '#10b981' },
    { name: 'Solutions & Notes', value: solCount, count: solCount, color: '#f59e0b' },
  ];

  // College & Faculty distribution for Bar Chart
  const collegeMap = {};
  allSubs.forEach((s) => {
    const c = (s.college || 'Other').toUpperCase();
    collegeMap[c] = (collegeMap[c] || 0) + 1;
  });

  allUsers.forEach((u) => {
    const c = (u.college || '').toUpperCase();
    if (c && !collegeMap[c]) {
      collegeMap[c] = 0;
    }
  });

  const collegeBreakdown = Object.keys(collegeMap).map((col) => ({
    code: col,
    college: col,
    count: collegeMap[col],
    materials: collegeMap[col],
    students: allUsers.filter((u) => (u.college || '').toUpperCase() === col).length,
  }));

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
