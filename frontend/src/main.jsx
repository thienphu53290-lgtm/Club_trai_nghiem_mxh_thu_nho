import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Khởi tạo giao diện (Theme) ngay từ đầu để tránh lỗi chớp màn hình trắng khi tải lại trang
const savedTheme = localStorage.getItem('app-theme') || 'theme-jollibee';
document.documentElement.className = savedTheme;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
