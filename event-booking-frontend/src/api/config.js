/**
 * API Configuration — Centralized URL for Web
 * 
 * Uses VITE_API_URL env var if set, otherwise auto-detects from current hostname
 */

const getApiBaseUrl = () => {
  // Priority 1: Environment variable (set in .env)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Priority 2: Use relative path to leverage Vite proxy in development
  return '';
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
