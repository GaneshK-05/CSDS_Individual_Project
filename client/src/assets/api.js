/**
 * api.js — Controlled Deadline System
 *
 * Central module for all HTTP communication with the backend.
 * All other JS files import helpers from here.
 */

const BASE_URL = 'http://localhost:10000/api/v1';

/**
 * Core fetch wrapper.
 *
 * @param {string} endpoint   – path after BASE_URL, e.g. '/auth/login'
 * @param {object} options    – fetch options (method, body, headers …)
 * @param {boolean} auth      – attach Bearer token from localStorage when true
 * @returns {Promise<{data, error, status}>}
 */
async function request(endpoint, options = {}, auth = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (auth) {
    const token = localStorage.getItem('cds_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Parse body (may be empty on some responses)
    let data = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      return {
        data: null,
        error: data?.message || `HTTP ${response.status}`,
        status: response.status,
      };
    }

    return { data, error: null, status: response.status };
  } catch (err) {
    return {
      data: null,
      error: err.message || 'Network error — is the server running?',
      status: 0,
    };
  }
}

/* ─── Auth endpoints ──────────────────────────────────────────────────────── */

/** POST /api/v1/auth/register */
export function apiRegister(name, email, password, role = 'USER') {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
}

/** POST /api/v1/auth/login */
export function apiLogin(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/* ─── Submission endpoints ────────────────────────────────────────────────── */

/** GET /api/v1/submission/my  (requires auth) */
export function apiMySubmissions() {
  return request('/submission/my', { method: 'GET' }, true);
}

/** POST /api/v1/submission  (requires auth) */
export function apiSubmit(content) {
  return request(
    '/submission',
    { method: 'POST', body: JSON.stringify({ content }) },
    true,
  );
}

/* ─── Admin endpoints ─────────────────────────────────────────────────────── */

/** GET /api/v1/admin/submissions  (requires ADMIN) */
export function apiAllSubmissions() {
  return request('/admin/submissions', { method: 'GET' }, true);
}

/** POST /api/v1/admin/deadline  (requires ADMIN) */
export function apiSetDeadline(deadline) {
  return request(
    '/admin/deadline',
    { method: 'POST', body: JSON.stringify({ deadline }) },
    true,
  );
}
