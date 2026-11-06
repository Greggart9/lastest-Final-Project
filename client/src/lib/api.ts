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
