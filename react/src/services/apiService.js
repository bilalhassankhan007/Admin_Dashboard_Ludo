// C:\BILAL Important\Project_Dashboard\react\src\services\apiService.js
import api from '../config/api';

// Respect your prefix from .env (defaults to /admin if missing)
const prefix = import.meta.env.VITE_ADMIN_PREFIX || '/admin';

// Optional: if your backend has a health endpoint, put it in .env as VITE_API_WARMUP_PATH=/health
// If not set, we'll ping the baseURL (harmless 404 is fine; it still wakes the dyno).
const warmupPath = import.meta.env.VITE_API_WARMUP_PATH ?? '';

/* --------------------------------- Helpers -------------------------------- */

// Sleep (ms)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Retry on cold start/timeout/network hiccup/5xx
const shouldRetry = (err) => {
  if (!err) return false;
  if (err.code === 'ECONNABORTED') return true; // timeout
  if (!err.response) return true; // no response (network)
  const s = err.response.status;
  return s >= 500; // server errors
};

/** Execute request with (at most) one retry for transient errors */
const withRetry = async (fn, { retries = 1 } = {}) => {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < retries && shouldRetry(err)) {
        await sleep(1500);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
};

/** Token extractor to handle many backend shapes */
export const extractToken = (res) => {
  const d = res?.data || {};
  return (
    d.token || d.accessToken || d.jwt || d.authToken || d.idToken || d?.data?.token || d?.data?.accessToken || d?.result?.token || null
  );
};

/* ----------------------------------- APIs ---------------------------------- */

// Warm-up: best-effort GET to wake a cold server. Never throws here.
export const systemAPI = {
  warmup: () => api.get(warmupPath, { timeout: 5000, validateStatus: () => true })
};

// Auth API calls (longer timeouts + one retry)
export const authAPI = {
  login: (credentials) => withRetry(() => api.post(`${prefix}/login`, credentials, { timeout: 30000 }), { retries: 1 }),

  register: (userData) => withRetry(() => api.post(`${prefix}/register`, userData, { timeout: 45000 }), { retries: 1 })
};

// Dashboard API calls
export const dashboardAPI = {
  getDashboardData: () => api.get(`${prefix}/dashboard-live`)
};

// Leaderboard API calls
export const leaderboardAPI = {
  getLeaderboard: () => api.get(`${prefix}/leaderboard`)
};

export default {
  system: systemAPI,
  auth: authAPI,
  dashboard: dashboardAPI,
  leaderboard: leaderboardAPI
};
