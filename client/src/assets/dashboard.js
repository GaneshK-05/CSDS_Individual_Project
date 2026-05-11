/**
 * dashboard.js — Controlled Deadline System
 *
 * Fetches and renders data for dashboard.html.
 * Adapts the UI based on the user's role (USER / ADMIN).
 */

import {
  requireAuth,
  logout,
  getCurrentUser,
} from './auth.js';

import {
  apiMySubmissions,
  apiSubmit,
  apiAllSubmissions,
  apiSetDeadline,
} from './api.js';

/* ─── Guard ───────────────────────────────────────────────────────────────── */
requireAuth();

const user = getCurrentUser();  // { id, role, iat, exp }

/* ─── UI helpers ──────────────────────────────────────────────────────────── */

function $(id) { return document.getElementById(id); }

function showAlert(id, msg, type = 'error') {
  const el = $(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 5000);
}

function setLoading(containerId, loading) {
  const el = $(containerId);
  if (!el) return;
  if (loading) {
    el.innerHTML = '<div class="spinner"></div>';
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

/* ─── Navbar ──────────────────────────────────────────────────────────────── */

function initNavbar() {
  const roleEl  = $('user-role');
  const logoutBtn = $('logout-btn');

  if (roleEl) roleEl.textContent = user?.role || 'USER';

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to log out?')) logout();
    });
  }
}

/* ─── Deadline Banner ─────────────────────────────────────────────────────── */

/**
 * We don't have a public /deadline GET endpoint, so we attempt to submit
 * a blank entry and parse the "Deadline passed" vs "Deadline not set" message,
 * OR we simply display the deadline set via admin and stored in sessionStorage.
 * For a clean UX we just maintain a local state from admin's setDeadline response.
 */
function renderDeadlineBanner(deadline) {
  const banner = $('deadline-banner');
  if (!banner) return;

  if (!deadline) {
    banner.className = 'deadline-banner none';
    banner.innerHTML = '⚠️ <span>No deadline has been set yet.</span>';
    return;
  }

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const isPast = now > deadlineDate;

  if (isPast) {
    banner.className = 'deadline-banner expired';
    banner.innerHTML = `🔒 <span>Deadline <strong>closed</strong> on ${formatDate(deadline)}. Submissions are no longer accepted.</span>`;
  } else {
    const diff = deadlineDate - now;
    const hours = Math.floor(diff / 36e5);
    const mins  = Math.floor((diff % 36e5) / 6e4);
    banner.className = 'deadline-banner active';
    banner.innerHTML = `✅ <span>Deadline: <strong>${formatDate(deadline)}</strong> — ${hours}h ${mins}m remaining</span>`;
  }
}

/* ─── Submission Form (USER) ──────────────────────────────────────────────── */

function initSubmissionForm() {
  const form = $('submission-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = form.content.value.trim();
    if (!content) {
      showAlert('submit-alert', 'Content cannot be empty.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    const { data, error } = await apiSubmit(content);

    btn.disabled = false;
    btn.textContent = 'Submit';

    if (error) {
      showAlert('submit-alert', error);
      return;
    }

    showAlert('submit-alert', 'Submission received!', 'success');
    form.reset();
    loadMySubmissions();
  });
}

/* ─── My Submissions (USER) ───────────────────────────────────────────────── */

async function loadMySubmissions() {
  const container = $('my-submissions');
  if (!container) return;

  setLoading('my-submissions', true);

  const { data, error } = await apiMySubmissions();

  if (error) {
    container.innerHTML = `<div class="alert alert-error">${error}</div>`;
    return;
  }

  const countEl = $('submission-count');
  if (countEl) countEl.textContent = data.length;

  if (data.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No submissions yet</h3>
        <p>Use the form above to make your first submission.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="submission-list">
      ${data.map((s, i) => `
        <div class="submission-item">
          <div class="submission-content">${escapeHtml(s.content)}</div>
          <div class="submission-meta">
            <span class="meta-tag">📌 #${i + 1}</span>
            <span class="meta-tag">🕒 ${formatDate(s.submittedAt)}</span>
          </div>
        </div>
      `).join('')}
    </div>`;
}

/* ─── Admin: Set Deadline ─────────────────────────────────────────────────── */

function initDeadlineForm() {
  const form = $('deadline-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const deadlineVal = form.deadline.value;
    if (!deadlineVal) {
      showAlert('admin-alert', 'Please pick a date and time.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving…';

    const { data, error } = await apiSetDeadline(deadlineVal);

    btn.disabled = false;
    btn.textContent = 'Set Deadline';

    if (error) {
      showAlert('admin-alert', error);
      return;
    }

    showAlert('admin-alert', `Deadline set to ${formatDate(data.deadline)}`, 'success');
    sessionStorage.setItem('cds_deadline', data.deadline);
    renderDeadlineBanner(data.deadline);
    loadAllSubmissions();
  });
}

/* ─── Admin: All Submissions ──────────────────────────────────────────────── */

async function loadAllSubmissions() {
  const container = $('all-submissions');
  if (!container) return;

  setLoading('all-submissions', true);

  const { data, error } = await apiAllSubmissions();

  if (error) {
    container.innerHTML = `<div class="alert alert-error">${error}</div>`;
    return;
  }

  const totalEl = $('total-count');
  if (totalEl) totalEl.textContent = data.length;

  if (data.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No submissions yet</h3>
        <p>Users haven't submitted anything.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Content</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((s, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${escapeHtml(s.user?.name || '—')}</td>
              <td>${escapeHtml(s.user?.email || '—')}</td>
              <td>${escapeHtml(s.content)}</td>
              <td>${formatDate(s.submittedAt)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─── Init ────────────────────────────────────────────────────────────────── */

(function init() {
  initNavbar();

  // Restore deadline from sessionStorage (persisted from admin set action)
  const savedDeadline = sessionStorage.getItem('cds_deadline');
  renderDeadlineBanner(savedDeadline);

  if (user?.role === 'ADMIN') {
    // Show admin panel, hide user panel
    const adminPanel = $('admin-panel');
    const userPanel  = $('user-panel');
    if (adminPanel) adminPanel.classList.remove('hidden');
    if (userPanel)  userPanel.classList.add('hidden');

    initDeadlineForm();
    loadAllSubmissions();
  } else {
    // Show user panel, hide admin panel
    const adminPanel = $('admin-panel');
    const userPanel  = $('user-panel');
    if (adminPanel) adminPanel.classList.add('hidden');
    if (userPanel)  userPanel.classList.remove('hidden');

    initSubmissionForm();
    loadMySubmissions();
  }
})();
