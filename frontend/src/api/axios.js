import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Đường dẫn tới Backend Laravel
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
