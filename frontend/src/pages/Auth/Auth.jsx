import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import AuthOverlay from './AuthOverlay';
import './Auth.css'; // Import các class đổ bóng đặc thù

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen animated-auth-bg flex items-center justify-center p-5 relative overflow-hidden">
      {/* Nền động (Animated Background) với đốm sáng lơ lửng và hiệu ứng hạt hình học */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Các đốm sáng mờ (Aurora floating blobs) */}
        <div className="floating-blob blob-1"></div>
        <div className="floating-blob blob-2"></div>
        <div className="floating-blob blob-3"></div>
        <div className="floating-blob blob-4"></div>

        {/* Các khối hình học lơ lửng chuyển động */}
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
        <div className="particle particle-7"></div>
        <div className="particle particle-8"></div>

        {/* Lưới viền công nghệ chìm */}
        <div className="bg-grid-pattern absolute inset-0 opacity-25"></div>
      </div>

      {/* 
        Sử dụng class 'right-panel-active' để kích hoạt animation CSS.
        Khi isSignUp = true -> form chuyển sang chế độ đăng ký.
      */}
      <div className={`auth-container neu-bg z-10 ${isSignUp ? 'right-panel-active' : ''}`}>
        
        <Link 
          to="/" 
          className="absolute top-6 left-6 neu-convex w-11 h-11 rounded-full flex items-center justify-center text-[#4a5568] hover:text-primary transition-colors no-underline z-[1000]"
          title="Về Trang chủ"
        >
          <ArrowLeft size={22} />
        </Link>
        
        {/* Form Đăng ký (Nằm dưới cùng, ẩn đi mặc định) */}
        <SignUpForm />

        {/* Form Đăng nhập (Nằm trên, hiển thị mặc định) */}
        <SignInForm />

        {/* Lớp phủ chuyển động che một nửa container */}
        <AuthOverlay toggleAuthMode={toggleAuthMode} />
        
      </div>
    </div>
  );
};

export default Auth;
