/**
 * auth.js — Controlled Deadline System
 *
 * Handles login, register, logout and token management.
 * Runs on login.html and register.html.
 */

import { apiLogin, apiRegister } from './api.js';

/* ─── Token helpers ───────────────────────────────────────────────────────── */

const TOKEN_KEY = 'cds_token';

/**
 * Decode a JWT payload without verifying the signature.
 * @param {string} token
 * @returns {object|null}
 */
function decodeToken(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

/** Save JWT to localStorage. */
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Retrieve JWT from localStorage. */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/** Remove JWT (logout). */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** Return decoded payload or null. */
export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}

/** Return true when a valid (non-expired) token exists. */
export function isLoggedIn() {
  const user = getCurrentUser();
  if (!user) return false;
  // JWT exp is in seconds
  if (user.exp && Date.now() / 1000 > user.exp) {
    removeToken();
    return false;
  }
  return true;
}

/** Redirect to dashboard if already authenticated. */
export function redirectIfLoggedIn() {
  if (isLoggedIn()) window.location.href = 'dashboard.html';
}

/** Redirect to login if not authenticated. */
export function requireAuth() {
  if (!isLoggedIn()) window.location.href = 'login.html';
}

/** Logout: clear token and go to login. */
export function logout() {
  removeToken();
  window.location.href = 'login.html';
}

/* ─── UI helpers ──────────────────────────────────────────────────────────── */

function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `alert alert-${type}`;
  el.classList.remove('hidden');
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Please wait…' : btn.dataset.label;
}

/* ─── Login Form ──────────────────────────────────────────────────────────── */

(function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;               // not on login.html — skip

  redirectIfLoggedIn();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.dataset.label = submitBtn.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert('login-alert');

    const email    = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      showAlert('login-alert', 'Please fill in all fields.');
      return;
    }

    setLoading(submitBtn, true);

    const { data, error } = await apiLogin(email, password);

    setLoading(submitBtn, false);

    if (error) {
      showAlert('login-alert', error);
      return;
    }

    saveToken(data.token);
    window.location.href = 'dashboard.html';
  });
})();

/* ─── Register Form ───────────────────────────────────────────────────────── */

(function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;               // not on register.html — skip

  redirectIfLoggedIn();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.dataset.label = submitBtn.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert('register-alert');

    const name     = form.name.value.trim();
    const email    = form.email.value.trim();
    const password = form.password.value;
    const role     = form.role ? form.role.value : 'USER';

    if (!name || !email || !password) {
      showAlert('register-alert', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      showAlert('register-alert', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(submitBtn, true);

    const { error } = await apiRegister(name, email, password, role);

    setLoading(submitBtn, false);

    if (error) {
      showAlert('register-alert', error);
      return;
    }

    showAlert('register-alert', 'Account created! Redirecting to login…', 'success');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  });
})();
