import React from 'react';

const AuthOverlay = ({ toggleAuthMode }) => {
  return (
    <div className="overlay-container">
      <div className="overlay neu-bg">
        
        {/* Lớp phủ bên trái (hiển thị khi đang ở form Sign In) */}
        <div className="overlay-panel overlay-left">
          <div className="deco-circle deco-circle-1"></div>
          <div className="deco-circle deco-circle-2"></div>
          <h1 className="font-extrabold text-4xl mb-4 text-[#4a5568] z-10">Welcome Back!</h1>
          <p className="text-[15px] text-[#718096] font-medium leading-relaxed mb-8 px-10 z-10">
            Để duy trì kết nối, vui lòng đăng nhập bằng thông tin cá nhân của bạn.
          </p>
          <button 
            onClick={toggleAuthMode}
            className="neu-convex bg-transparent border-none text-[#4a5568] font-bold text-[14px] uppercase tracking-wider px-12 py-3.5 rounded-[20px] cursor-pointer hover:text-primary transition-colors z-10"
          >
            Sign In
          </button>
        </div>

        {/* Lớp phủ bên phải (hiển thị khi đang ở form Sign Up) */}
        <div className="overlay-panel overlay-right">
          <div className="deco-circle deco-circle-1"></div>
          <div className="deco-circle deco-circle-2"></div>
          <h1 className="font-extrabold text-4xl mb-4 text-[#4a5568] z-10">Hello, Friend!</h1>
          <p className="text-[15px] text-[#718096] font-medium leading-relaxed mb-8 px-10 z-10">
            Nhập thông tin cá nhân của bạn và bắt đầu hành trình cùng chúng tôi.
          </p>
          <button 
            onClick={toggleAuthMode}
            className="neu-convex bg-transparent border-none text-[#4a5568] font-bold text-[14px] uppercase tracking-wider px-12 py-3.5 rounded-[20px] cursor-pointer hover:text-primary transition-colors z-10"
          >
            Sign Up
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthOverlay;
