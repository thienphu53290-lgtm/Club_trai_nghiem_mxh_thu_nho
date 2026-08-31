import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../../api/axios';

const SignInForm = ({ toggleAuthMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}/redirect`;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('⚠️ Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      if (res.data.status) {
        // 1. Lưu thông tin Token Sanctum và dữ liệu user theo chuẩn MVC
        localStorage.setItem('auth_token', res.data.access_token);
        localStorage.setItem('current_user', JSON.stringify(res.data.user));

        // 2. LÀM MỚI TRẠNG THÁI NHẮC THÔNG BÁO THEO PHIÊN (Session Token reset)
        // Khi người dùng mới đăng nhập vào, chắc chắn khi bấm vào icon Chuông lần đầu sẽ được nhắc thông báo!
        sessionStorage.removeItem('notif_prompt_shown_session');
        sessionStorage.removeItem('skip_notif_prompt_session');

        // 3. Thông báo cho Header cập nhật trạng thái
        window.dispatchEvent(new Event('user_auth_change'));

        // 4. Di chuyển về trang chủ hoặc profile (Kiểm tra Onboarding)
        if (!res.data.user.is_onboarded) {
          navigate('/onboarding');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || '❌ Đăng nhập thất bại! Vui lòng kiểm tra lại email hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container sign-in-container neu-bg flex items-center justify-center">
      <form className="flex flex-col items-center justify-center px-12 text-center w-full h-full" onSubmit={handleSignIn}>
        <h1 className="font-extrabold text-3xl mb-4 text-[#4a5568]">Sign In</h1>
        
        <div className="flex gap-4 mb-6">
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
        
        <span className="text-[13px] text-[#718096] font-medium mb-3">hoặc sử dụng tài khoản thành viên của bạn</span>
        
        {error && (
          <div className="bg-red-50 text-red-600 text-[13px] p-2.5 rounded-xl font-bold border border-red-200 mb-3 w-full animate-fadeIn">
            {error}
          </div>
        )}

        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (vd: test@gmail.com)" 
          className="neu-concave border-none px-5 py-3.5 mb-3.5 rounded-[15px] w-full text-[15px] font-medium text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password (vd: password123)" 
          className="neu-concave border-none px-5 py-3.5 mb-4 rounded-[15px] w-full text-[15px] font-medium text-[#4a5568] placeholder:text-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        
        <a href="#" onClick={(e) => { e.preventDefault(); alert("Vui lòng liên hệ Admin để khôi phục mật khẩu test nhé!"); }} className="text-[13px] text-[#718096] font-semibold hover:text-[#4a5568] no-underline mb-6 transition-colors">
          Quên mật khẩu? (Tài khoản mẫu: test@gmail.com / pass: password123)
        </a>
        
        <button 
          type="submit" 
          disabled={loading}
          className="neu-convex mt-8 w-40 h-12 rounded-full bg-[#f2a9a9] text-white font-extrabold text-[0.85rem] tracking-wider uppercase border-none cursor-pointer hover:bg-primary transition-colors flex items-center justify-center disabled:opacity-70"
        >
          {loading ? 'Đang tải...' : 'SIGN IN'}
        </button>

        {/* Mobile only switch button */}
        <button 
          type="button" 
          onClick={toggleAuthMode}
          className="md:hidden mt-6 text-[#4a5568] text-sm font-bold bg-transparent border-none underline"
        >
          Chưa có tài khoản? Đăng ký ngay
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
