/**
 * API Configuration — Centralized URL for both Web & Capacitor (Mobile)
 * 
 * On web: uses current hostname (e.g., localhost:4000)
 * On mobile (Capacitor): uses VITE_API_URL env var or fallback to LAN IP
 */

const getApiBaseUrl = () => {
  // Priority 1: Environment variable (set in .env)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Priority 2: Capacitor native app — need explicit IP since localhost won't work
  if (window.Capacitor?.isNativePlatform()) {
    // Change this to your computer's LAN IP when testing on real device
    return 'http://192.168.1.16:4000';
  }

  // Priority 3: Web browser — use current hostname
  return `http://${window.location.hostname}:4000`;
};

export const API_URL = getApiBaseUrl();
export const GRAPHQL_URL = `${API_URL}/graphql`;
export const UPLOAD_AVATAR_URL = `${API_URL}/upload-avatar`;
export const UPLOAD_CONTRACT_URL = `${API_URL}/upload-contract`;

/**
 * Helper to resolve server file URLs (avatars, contracts, etc.)
 * @param {string} path - Server path like "/uploads/avatars/avatar_123.jpg"
 * @returns {string} Full URL
 */
export const resolveFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};
