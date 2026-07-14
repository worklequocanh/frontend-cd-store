import axios from 'axios';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
