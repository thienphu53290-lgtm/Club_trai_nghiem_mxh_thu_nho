import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://club-trai-nghiem-mxh-thu-nho.onrender.com/api' : 'http://localhost:8000/api');

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
  (error) => Promise.reject(error)
);

export default api;
