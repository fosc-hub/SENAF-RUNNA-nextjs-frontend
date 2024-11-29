import axios from 'axios';

// Function to extract CSRF token from cookies
const getCSRFToken = () => {
  const match = document.cookie.match(/csrftoken=([^;]*)/); // Default Django cookie name
  return match ? match[1] : null;
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
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

export default axiosInstance;
