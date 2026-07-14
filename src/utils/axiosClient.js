import axios from 'axios';
import toast from 'react-hot-toast';

const rawBaseURL = import.meta.env.VITE_API_URL || '/';
// Ensure we don't have double /api if VITE_API_URL is set to end with /api
const cleanBaseURL = rawBaseURL.endsWith('/api') ? rawBaseURL.slice(0, -4) : rawBaseURL;

const axiosClient = axios.create({
  baseURL: cleanBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('🚀 [CD-Store] Frontend is connecting to Backend at:', cleanBaseURL);

// Interceptor for Requests (Attach token)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for Responses (Handle 401)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      
      // Optionally toast error (if it's not the /auth/me call on load)
      if (error.config.url !== '/api/auth/me') {
        toast.error('Session expired. Please login again.');
        window.location.href = '/auth'; // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
