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

export default api;
