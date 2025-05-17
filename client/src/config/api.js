/**
 * API configuration file
 * Contains the base URL for all API requests
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to create full API URLs
export const apiUrl = (endpoint) => `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`; 