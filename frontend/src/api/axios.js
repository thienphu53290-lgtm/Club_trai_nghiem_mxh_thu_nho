import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://club-trai-nghiem-mxh-thu-nho.onrender.com/api' : 'http://localhost:8000/api');
export const BACKEND_URL = API_BASE_URL.replace('/api', '');
export const DEFAULT_AVATAR = `${BACKEND_URL}/avt/avatar-mac-dinh.jpg`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Interceptor tự động gán Token (Sanctum) vào tiêu đề Authorization khi gọi API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    try {
      const method = response.config?.method?.toLowerCase();
      const url = response.config?.url || '';
      if (['post', 'put', 'delete'].includes(method)) {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('club_live_sync');
          if (url.includes('/feed/posts') || url.includes('/posts/') || url.includes('/comments/')) {
            bc.postMessage({ type: 'sync_feed', time: Date.now() });
          }
          if (url.includes('/chat/')) {
            bc.postMessage({ type: 'sync_chat', time: Date.now(), data: response.data });
          }
          bc.close();
        }
      }
    } catch (e) {}
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const url = error.response.config?.url || '';
      if (!url.includes('/login')) {
        const hadToken = localStorage.getItem('auth_token');
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        window.dispatchEvent(new Event('user_auth_change'));
        
        if (error.response.data?.message === 'account_locked') {
          localStorage.setItem('account_locked', 'true');
        }
        
        // Chỉ redirect nếu user đang có token (bị hết hạn/bị xóa) hoặc tài khoản bị khóa
        if (hadToken || error.response.data?.message === 'account_locked') {
          window.location.href = error.response.data?.message === 'account_locked' ? '/' : '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
