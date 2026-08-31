import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    const data = params.get('data');

    if (error) {
      window.dispatchEvent(new CustomEvent('show_global_toast', {
        detail: {
          title: 'Đăng nhập thất bại',
          message: '❌ Đã xảy ra lỗi khi đăng nhập bằng Mạng xã hội.',
          type: 'error'
        }
      }));
      navigate('/auth');
      return;
    }

    if (data) {
      try {
        const decoded = JSON.parse(atob(data));
        if (decoded.status) {
          localStorage.setItem('auth_token', decoded.access_token);
          localStorage.setItem('current_user', JSON.stringify(decoded.user));
          
          sessionStorage.removeItem('notif_prompt_shown_session');
          sessionStorage.removeItem('skip_notif_prompt_session');

          window.dispatchEvent(new Event('user_auth_change'));

          if (decoded.isNew) {
            window.dispatchEvent(new CustomEvent('show_global_toast', {
              detail: {
                title: 'Đăng ký thành công!',
                message: `🎉 Chúc mừng ${decoded.user.ho_ten} đã gia nhập Club!`,
                type: 'success'
              }
            }));
            navigate('/onboarding');
          } else {
            if (!decoded.user.is_onboarded) {
              navigate('/onboarding');
            } else {
              navigate('/');
            }
          }
        }
      } catch (err) {
        console.error("Failed to parse social auth data", err);
        navigate('/auth');
      }
    } else {
      navigate('/auth');
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen neu-bg">
      <Loader className="animate-spin text-primary w-12 h-12 mb-4" />
      <h2 className="text-[#4a5568] font-bold text-xl">Đang xử lý đăng nhập...</h2>
      <p className="text-[#718096] text-sm mt-2">Vui lòng chờ trong giây lát.</p>
    </div>
  );
};

export default AuthCallback;
