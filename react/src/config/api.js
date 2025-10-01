import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use environment variable for base URL
  // ❗ Do NOT force a global Content-Type. We'll set it conditionally in the interceptor.
  // headers: { 'Content-Type': 'application/json' },
  timeout: 10000 // 10 second timeout
});

// Request interceptor to add auth token and set Content-Type appropriately
api.interceptors.request.use(
  (config) => {
    // Ensure headers object exists
    config.headers = config.headers || {};

    // If caller didn't explicitly set Content-Type:
    // - For plain objects → set JSON
    // - For FormData → let the browser set multipart boundary automatically (do not override)
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

    // Only set JSON when not FormData and header not already supplied by the caller
    if (!isFormData && !config.headers['Content-Type'] && !config.headers['content-type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Get token from localStorage or sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Bearer token to headers
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      sessionStorage.removeItem('authUser');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
