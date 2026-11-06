export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setAuthSession(token: string, user: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  sessionStorage.clear();
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

// --------------------------------------------------------
// Authentication Services
// --------------------------------------------------------
export async function apiSignUp(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  college?: string;
  department?: string;
  matricNo?: string;
}) {
  const res = await apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to sign up.');
  }

  if (data.token && data.user) {
    setAuthSession(data.token, data.user);
  }
  return data;
}

export async function apiSignIn(email: string, password: string) {
  const res = await apiFetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid email or password.');
  }

  if (data.token && data.user) {
    setAuthSession(data.token, data.user);
  }
  return data;
}

export async function apiGetProfile() {
  const res = await apiFetch('/api/auth/me');
  if (!res.ok) {
    throw new Error('Failed to fetch profile.');
  }
  return res.json();
}

export async function apiUpdateProfile(updates: {
  matricNo?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  college?: string;
  avatar?: string;
}) {
  const res = await apiFetch('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update profile.');
  }

  if (data.user) {
    // Keep local stored user updated
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  }
  return data;
}

export async function apiRequestPasswordOtp(email: string) {
  const res = await apiFetch('/api/auth/request-password-otp', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send OTP.');
  }
  return data;
}

export async function apiResetPassword(email: string, code: string, newPassword: string) {
  const res = await apiFetch('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), code, newPassword }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to reset password.');
  }
  return data;
}

// --------------------------------------------------------
// Material Upload & Submissions
// --------------------------------------------------------
export async function apiUploadMaterial(payload: {
  courseCode: string;
  title: string;
  college: string;
  department: string;
  level: string;
  semester: string;
  category: string;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  authorName?: string;
  authorEmail?: string;
}) {
  const res = await apiFetch('/api/materials/upload', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload study material.');
  }
  return data;
}

export async function apiGetSubmissions() {
  const res = await apiFetch('/api/materials/submissions');
  if (!res.ok) {
    throw new Error('Failed to fetch submissions.');
  }
  return res.json();
}

// --------------------------------------------------------
// Admin Services
// --------------------------------------------------------
export async function apiGetAdminStats() {
  const res = await apiFetch('/api/admin/stats');
  if (!res.ok) {
    throw new Error('Failed to fetch admin stats.');
  }
  return res.json();
}

export async function apiGetAdminSubmissions(params?: {
  status?: string;
  category?: string;
  query?: string;
}) {
  const q = new URLSearchParams();
  if (params?.status && params.status !== 'all') q.set('status', params.status);
  if (params?.category && params.category !== 'all') q.set('category', params.category);
  if (params?.query) q.set('query', params.query);

  const queryStr = q.toString() ? `?${q.toString()}` : '';
  const res = await apiFetch(`/api/admin/submissions${queryStr}`);
  if (!res.ok) {
    throw new Error('Failed to fetch admin submissions.');
  }
  return res.json();
}

export async function apiGetAdminSubmissionById(id: string) {
  const res = await apiFetch(`/api/admin/submissions/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch submission details.');
  }
  return res.json();
}

export async function apiReviewSubmission(
  id: string,
  status: 'approved' | 'rejected' | 'pending',
  reviewNotes?: string
) {
  const res = await apiFetch(`/api/admin/submissions/${id}/review`, {
    method: 'PUT',
    body: JSON.stringify({ status, reviewNotes }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to review submission.');
  }
  return data;
}

export async function apiUpdateSubmission(id: string, updates: Record<string, any>) {
  const res = await apiFetch(`/api/admin/submissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update submission.');
  }
  return data;
}

export async function apiDeleteSubmission(id: string) {
  const res = await apiFetch(`/api/admin/submissions/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete submission.');
  }
  return data;
}

export async function apiGetAdminUsers(params?: {
  query?: string;
  role?: string;
  college?: string;
}) {
  const q = new URLSearchParams();
  if (params?.query) q.set('query', params.query);
  if (params?.role && params.role !== 'all') q.set('role', params.role);
  if (params?.college && params.college !== 'all') q.set('college', params.college);

  const queryStr = q.toString() ? `?${q.toString()}` : '';
  const res = await apiFetch(`/api/admin/users${queryStr}`);
  if (!res.ok) {
    throw new Error('Failed to load user directory.');
  }
  return res.json();
}

export async function apiUpdateUserRole(id: string, role: string) {
  const res = await apiFetch(`/api/admin/users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update user role.');
  }
  return data;
}

export async function apiDeleteUser(id: string) {
  const res = await apiFetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete user.');
  }
  return data;
}

export async function apiGetUniversities() {
  const res = await apiFetch('/api/admin/universities');
  if (!res.ok) {
    throw new Error('Failed to load universities.');
  }
  return res.json();
}

export async function apiCreateUniversity(payload: { name: string; code: string; shortName?: string }) {
  const res = await apiFetch('/api/admin/universities', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create university.');
  }
  return data;
}

export async function apiUpdateUniversity(id: string, payload: Record<string, any>) {
  const res = await apiFetch(`/api/admin/universities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update university.');
  }
  return data;
}

export async function apiDeleteUniversity(id: string) {
  const res = await apiFetch(`/api/admin/universities/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete university.');
  }
  return data;
}

export async function apiCreateCollege(payload: {
  universityId?: string;
  code: string;
  name: string;
  fullName?: string;
}) {
  const res = await apiFetch('/api/admin/colleges', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create college.');
  }
  return data;
}

export async function apiUpdateCollege(
  id: string,
  payload: Record<string, any>,
  universityId?: string
) {
  const res = await apiFetch(`/api/admin/colleges/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...payload, universityId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update college.');
  }
  return data;
}

export async function apiDeleteCollege(id: string, universityId: string = 'funaab') {
  const res = await apiFetch(`/api/admin/colleges/${id}?universityId=${encodeURIComponent(universityId)}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete college.');
  }
  return data;
}

export async function apiCreateDepartment(payload: {
  universityId?: string;
  collegeCode: string;
  name: string;
  code?: string;
  levels?: number[];
}) {
  const res = await apiFetch('/api/admin/departments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create department.');
  }
  return data;
}

export async function apiUpdateDepartment(
  id: string,
  payload: Record<string, any>,
  collegeCode: string,
  universityId: string = 'funaab'
) {
  const res = await apiFetch(`/api/admin/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...payload, collegeCode, universityId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update department.');
  }
  return data;
}

export async function apiDeleteDepartment(
  id: string,
  collegeCode: string,
  universityId: string = 'funaab'
) {
  const res = await apiFetch(
    `/api/admin/departments/${id}?collegeCode=${encodeURIComponent(collegeCode)}&universityId=${encodeURIComponent(universityId)}`,
    {
      method: 'DELETE',
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete department.');
  }
  return data;
}
