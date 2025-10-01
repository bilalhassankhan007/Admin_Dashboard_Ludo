// C:\BILAL Important\Project_Dashboard\react\src\utils\auth.js
const TOKEN_KEY = 'authToken';
const EMAIL_KEY = 'authEmail';

/**
 * Safely read from localStorage/sessionStorage.
 * Returns null if storage is not available (e.g., private mode) or on error.
 */
const safeGet = (key) => {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch (e) {
    console.error('Error reading from storage:', e);
    return null;
  }
};

/**
 * Remove a key from both storages (best-effort).
 */
const removeEverywhere = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from localStorage:', e);
  }
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from sessionStorage:', e);
  }
};

export const authUtils = {
  // True if a token exists in either storage
  isAuthenticated: () => Boolean(safeGet(TOKEN_KEY)),

  // Get the token (or null)
  getToken: () => safeGet(TOKEN_KEY),

  // Get the current user's email (or null)
  getUserEmail: () => safeGet(EMAIL_KEY),

  /**
   * Persist token/email. If remember=true, use localStorage; else sessionStorage.
   * Also clears duplicates from the other storage.
   */
  setAuthData: (token, email, remember = true) => {
    try {
      const primary = remember ? localStorage : sessionStorage;
      const secondary = remember ? sessionStorage : localStorage;

      primary.setItem(TOKEN_KEY, token);
      primary.setItem(EMAIL_KEY, email);

      // Clear duplicates from the other storage
      secondary.removeItem(TOKEN_KEY);
      secondary.removeItem(EMAIL_KEY);

      // Notify app (optional)
      const ev = new CustomEvent('authStateChanged', { detail: { isAuthenticated: true } });
      window.dispatchEvent(ev);
    } catch (e) {
      console.error('Error setting auth data:', e);
    }
  },

  /**
   * Clear all auth-related keys and attempt to clear client-side cookies.
   */
  logout: () => {
    try {
      removeEverywhere(TOKEN_KEY);
      removeEverywhere(EMAIL_KEY);
      removeEverywhere('authUser');
      removeEverywhere('chartData');

      // Clear non-httpOnly cookies (best-effort). httpOnly cookies cannot be cleared from JS.
      try {
        const parts = document.cookie.split(';');
        for (const c of parts) {
          const name = c.split('=')[0]?.trim();
          if (name) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
          }
        }
      } catch (e) {
        console.error('Error clearing cookies:', e);
      }

      // Broadcast auth change (optional)
      const ev = new CustomEvent('authStateChanged', { detail: { isAuthenticated: false } });
      window.dispatchEvent(ev);

      return true;
    } catch (e) {
      console.error('Error during logout:', e);
      return false;
    }
  }
};

export default authUtils;
