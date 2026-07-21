import axios from 'axios';
import toast from 'react-hot-toast';

let rawBaseURL = import.meta.env.VITE_API_URL || '/';
if (rawBaseURL !== '/' && !rawBaseURL.startsWith('http')) {
  rawBaseURL = 'https://' + rawBaseURL;
}
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

// Interceptor for Responses (Handle 401 or User Not Found 404)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const isUserNotFound = status === 404 && error.response?.data?.message?.toLowerCase().includes('user');

    if (status === 401 || isUserNotFound) {
      // Use Zustand store directly to clear state and local storage globally
      import('../store/store').then((module) => {
        module.useStore.getState().logout();
      });
      
      // Prevent showing error on login page itself
      if (error.config.url !== '/api/auth/login') {
        toast.error('Phiên đăng nhập đã hết hạn hoặc tài khoản không tồn tại. Đã tự động đăng xuất!');
        
        // Redirect to auth if not already there
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
