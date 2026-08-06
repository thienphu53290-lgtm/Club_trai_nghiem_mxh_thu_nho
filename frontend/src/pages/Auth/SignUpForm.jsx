import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const SignUpForm = ({ toggleAuthMode }) => {
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!hoTen || !email || !password) {
      setError('⚠️ Vui lòng điền đầy đủ tên, email và mật khẩu!');
      return;
    }

    if (password.length < 6) {
      setError('⚠️ Mật khẩu cần có độ dài tối thiểu 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/register', { ho_ten: hoTen, email, password });
      if (res.data.status) {
        localStorage.setItem('auth_token', res.data.access_token);
        localStorage.setItem('current_user', JSON.stringify(res.data.user));

        // Khi tài khoản mới đăng ký và truy cập trang chủ, thiết lập lại trạng thái chuông
        sessionStorage.removeItem('notif_prompt_shown_session');
        sessionStorage.removeItem('skip_notif_prompt_session');

        window.dispatchEvent(new Event('user_auth_change'));

        alert(`🎉 Chúc mừng ${res.data.user.ho_ten} đã gia nhập Club Trải Nghiệm!`);
        // Luôn chuyển hướng người mới đến trang Onboarding
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || '❌ Đăng ký thất bại. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container sign-up-container neu-bg flex items-center justify-center">
      <form className="flex flex-col items-center justify-center px-12 text-center w-full h-full" onSubmit={handleSignUp}>
        <h1 className="font-extrabold text-3xl mb-3 text-[#4a5568]">Create Account</h1>
        
        <div className="flex gap-4 mb-4">
          <button type="button" className="neu-convex w-10 h-10 rounded-full flex items-center justify-center text-[#4a5568] hover:text-primary transition-colors border-none bg-transparent cursor-pointer font-bold text-lg">
            f
          </button>
          <button type="button" className="neu-convex w-10 h-10 rounded-full flex items-center justify-center text-[#4a5568] hover:text-primary transition-colors border-none bg-transparent cursor-pointer font-bold text-lg">
            X
          </button>
          <button type="button" className="neu-convex w-10 h-10 rounded-full flex items-center justify-center text-[#4a5568] hover:text-primary transition-colors border-none bg-transparent cursor-pointer font-bold text-lg">
            in
          </button>
        </div>
        
        <span className="text-[13px] text-[#718096] font-medium mb-3">hoặc đăng ký bằng email của bạn</span>
        
        {error && (
          <div className="bg-red-50 text-red-600 text-[13px] p-2 rounded-xl font-bold border border-red-200 mb-3 w-full animate-fadeIn">
            {error}
          </div>
        )}

        <input 
          type="text" 
          value={hoTen}
          onChange={(e) => setHoTen(e.target.value)}
          placeholder="Họ và tên hiển thị" 
          className="neu-concave border-none px-5 py-3 mb-3 rounded-[15px] w-full text-[15px] font-medium text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email của bạn" 
          className="neu-concave border-none px-5 py-3 mb-3 rounded-[15px] w-full text-[15px] font-medium text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu (tối thiểu 6 ký tự)" 
          className="neu-concave border-none px-5 py-3 mb-5 rounded-[15px] w-full text-[15px] font-medium text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        
        <button 
          type="submit" 
          disabled={loading}
          className="neu-convex mt-5 w-40 h-12 rounded-full bg-[#f2a9a9] text-white font-extrabold text-[0.85rem] tracking-wider uppercase border-none cursor-pointer hover:bg-primary transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {loading ? 'Đang tải...' : 'SIGN UP'}
        </button>

        {/* Mobile only switch button */}
        <button 
          type="button" 
          onClick={toggleAuthMode}
          className="md:hidden mt-5 text-[#4a5568] text-sm font-bold bg-transparent border-none underline"
        >
          Đã có tài khoản? Đăng nhập ngay
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
