import axios from 'axios';

/**
 * Base Axios instance for the Mana Vyapar storefront.
 * Configured for multi-tenant merchant queries and centralized error handling.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.manavyapar.com/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor for unified loading and error states
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
