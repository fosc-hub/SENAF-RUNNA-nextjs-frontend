import axios from 'axios';
import { handleApiError } from './errorHandler';

// Function to extract CSRF token from cookies
const getCSRFToken = () => {
  const match = document.cookie.match(/csrftoken=([^;]*)/); // Default Django cookie name
  return match ? match[1] : null;
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://web-production-c6370.up.railway.app/api',
  withCredentials: true,
});

// Add a request interceptor to attach CSRF token
axiosInstance.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken(); // Retrieve CSRF token
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken; // Attach CSRF token to headers
  }
  return config;
});

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    const method = error.config?.method?.toUpperCase(); // Determine the HTTP method
    const endpoint = error.config?.url || 'Unknown endpoint';
    const errorDetails = `Código de error: ${error.code}\nRespuesta del servidor: ${JSON.stringify(error?.response?.data)}`;
    // Only handle toasts for non-GET methods
    if (method && method !== 'GET') {
      handleApiError(error, endpoint); // Show toast and log error
    }
    return Promise.reject(error); // Propagate the error
  }
);

export default axiosInstance;
