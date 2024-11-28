import axios from 'axios';

// Function to extract CSRF token from cookies
const getCSRFToken = () => {
  const match = document.cookie.match(/csrftoken=([^;]*)/); // Default Django cookie name
  return match ? match[1] : null;
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // Your API base URL
  withCredentials: true, // Include credentials (cookies) in requests
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
