import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import api, { API_BASE_URL } from '../../api/axios';

const SignUpForm = ({ toggleAuthMode }) => {
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}/redirect`;
  };

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

        window.dispatchEvent(new CustomEvent('show_global_toast', {
          detail: {
            title: 'Đăng ký thành công!',
            message: `🎉 Chúc mừng ${res.data.user.ho_ten} đã gia nhập PIVO!`,
            source: 'HỆ THỐNG',
            type: 'success'
          }
        }));

        setTimeout(() => {
          navigate('/onboarding');
        }, 1500);
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
          <button type="button" onClick={() => handleSocialLogin('facebook')} className="neu-convex w-10 h-10 rounded-full flex items-center justify-center text-[#1877F2] hover:scale-110 transition-transform border-none bg-transparent cursor-pointer">
            <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" fill="currentColor"/>
            </svg>
          </button>
          <button type="button" onClick={() => handleSocialLogin('google')} className="neu-convex w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform border-none bg-transparent cursor-pointer">
            <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
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

        {/* Mobile View Toggle */}
        <div className="mt-8 md:hidden">
          <span className="text-[13px] text-[#718096] font-medium">
            Đã có tài khoản?{' '}
            <button 
              type="button" 
              onClick={toggleAuthMode}
              className="text-primary font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              Đăng nhập ngay
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
