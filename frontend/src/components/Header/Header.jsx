import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Home, MessageCircle, Bell, Star, Sparkles, X } from 'lucide-react';
import echo from '../../api/echo';
import api from '../../api/axios';
import OneSignal from 'react-onesignal';
import NotificationPromptModal from './NotificationPromptModal';

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [latestNotif, setLatestNotif] = useState(null);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const lastEventTimeRef = useRef(0);

  const triggerNotificationUI = (title, message, source) => {
    const now = Date.now();
    if (now - lastEventTimeRef.current < 600) return; // Chống lặp tín hiệu trong vòng 600ms
    lastEventTimeRef.current = now;

    console.log(`🔥 [Realtime ${source}] Tín hiệu phát nổ:`, { title, message });
    const newNotif = {
      id: now,
      title: title || '✨ Minh Anh (Realtime)',
      message: message || 'Vừa thả tim cho bức ảnh Cà phê sáng ở Đà Lạt của bạn qua WebSocket Reverb!',
      time: 'Vừa xong',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setLatestNotif(newNotif);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 6000);

    // Kích hoạt đồng thời thông báo trực tiếp ra hệ điều hành macOS/Windows (Web Push) nếu đã được phân quyền
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, { body: newNotif.message, icon: '/favicon.svg' });
      } catch (e) {
        console.warn("Không thể hiển thị OS Notification:", e);
      }
    }
  };

  useEffect(() => {
    console.log("🌟 Đang kết nối vào trạm sóng Laravel Reverb (Channel: club-live)...");
    
    const channel = echo.channel('club-live');

    const handleEvent = (data) => {
      triggerNotificationUI(data.title, data.message, "WebSocket Reverb");
    };

    // Chỉ lắng nghe đúng 1 định danh chuẩn của Laravel Reverb để tránh bị trùng đúm sự kiện
    channel.listen('.live-event', handleEvent);

    return () => {
      echo.leave('club-live');
    };
  }, []);

  useEffect(() => {
    const updateAuth = () => {
      try {
        const saved = localStorage.getItem('current_user');
        setCurrentUser(saved ? JSON.parse(saved) : null);
      } catch (e) {
        setCurrentUser(null);
      }
    };
    window.addEventListener('user_auth_change', updateAuth);
    return () => window.removeEventListener('user_auth_change', updateAuth);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.log('Lỗi khi gọi API logout:', e);
    } finally {
      // 1. Hủy Token Sanctum và dữ liệu người dùng
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');

      // 2. XOÁ TRẠNG THÁI NHẮC BẬT THÔNG BÁO THEO ĐÚNG YÊU CẦU CỦA USER:
      // Để khi khách đăng ký hay đăng nhập lại, lần bấm chuông tiếp theo sẽ mở Bảng chào mời!
      sessionStorage.removeItem('notif_prompt_shown_session');
      sessionStorage.removeItem('skip_notif_prompt_session');
      localStorage.removeItem('os_push_verified');

      setCurrentUser(null);
      setShowUserMenu(false);
      window.dispatchEvent(new Event('user_auth_change'));
      alert("👋 Bạn đã đăng xuất thành công khỏi Club Trải Nghiệm!");
    }
  };

  const handleBellClick = () => {
    const nextState = !showNotifDropdown;
    setShowNotifDropdown(nextState);

    // KIỂM TRA PHIÊN LÀM VIỆC (Token/Session): Lần đầu tiên người dùng mở hộp chuông thông báo trong phiên
    if (nextState) {
      const promptShown = sessionStorage.getItem('notif_prompt_shown_session');
      if (!promptShown) {
        sessionStorage.setItem('notif_prompt_shown_session', 'true');
        // Nhẹ nhàng hiển thị Bảng hỏi sau 300ms khi vừa mở menu
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open_notif_prompt_modal', { detail: { fromBellClick: true } }));
        }, 300);
      }
    }
  };

  const sendDemoRealtime = () => {
    if (isSending) return;
    setIsSending(true);

    api.post('/send-live-notification', {
      type: 'interaction',
      title: '✨ Minh Anh (Realtime)',
      message: 'Vừa thả tim cho bức ảnh Cà phê sáng ở Đà Lạt của bạn qua WebSocket Reverb!'
    }).then(res => {
      console.log("⚡ Đã gửi lệnh broadcast về Server:", res.data);
    }).catch(err => {
      console.error("❌ Lỗi gửi realtime:", err);
      triggerNotificationUI('✨ Minh Anh (Demo Local)', 'Đã kích hoạt chế độ mô phỏng phản hồi lập tức!', 'Fallback');
    }).finally(() => {
      setTimeout(() => setIsSending(false), 600);
    });
  };

  const promptOneSignalPush = async () => {
    // Thử trigger OneSignal ngầm
    if (typeof window !== 'undefined' && window.OneSignal && typeof window.OneSignal.Slidedown?.promptPush === 'function') {
      try { window.OneSignal.Slidedown.promptPush(); } catch (e) { /* ignore */ }
    }

    if (typeof Notification === 'undefined') {
      alert("❌ Trình duyệt của bạn không hỗ trợ tính năng thông báo hệ điều hành!");
      return;
    }

    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification("🔥 Club Trải Nghiệm (Desktop Push)", { 
          body: "Đặc quyền OS Push đang hoạt động! (Nếu không thấy pop-up, hãy nhấp vào Ngày/Giờ góc phải màn hình Mac để mở kho thông báo nhé!)", 
          icon: "/favicon.svg",
          silent: false
        });
        notif.onclick = () => window.focus();
      } catch (e) { console.warn(e); }

      triggerNotificationUI("🔥 OS Desktop Push", "Đã gửi thông báo ra hệ điều hành macOS/Windows! (Nếu không thấy ngoài màn hình, hãy nhấp vào Đồng hồ góc phải trên cùng màn hình Mac nhé!)", "OS Trigger");
    } else if (Notification.permission === 'denied') {
      alert("❌ Bạn (hoặc chế độ Không Làm Phiền của macOS/Chrome) đang CHẶN THÔNG BÁO!\n\n👉 Cách mở lại: Nhấp vào biểu tượng Ổ KHÓA ngay góc trái thanh địa chỉ trình duyệt (cạnh localhost:5173) -> Ở mục Thông báo (Notifications), chuyển từ 'Chặn' (Block) sang 'Cho phép' (Allow) nhé!");
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        try {
          new Notification("🌟 Club Trải Nghiệm", { body: "Chúc mừng! Từ giờ bạn sẽ nhận được tin nóng ra màn hình desktop tức thì!" });
        } catch (e) { console.warn(e); }
        triggerNotificationUI("🌟 Đã cấp quyền OS Push", "Bạn đã cho phép hiển thị thông báo bên ngoài màn hình hệ điều hành!", "OS Permission");
      } else {
        alert("⚠️ Bạn vừa bấm Không Cho Phép (Cancel/Block). Nếu muốn bật lại sau, hãy ấn vào ổ khóa trên thanh địa chỉ nhé!");
      }
    }
  };

  return (
    <header className="border-b border-border-color bg-bg-color sticky top-0 z-50">
      <div className="max-w-[1320px] mx-auto px-5 h-[72px] flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer min-w-max">
          <div className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[1.2rem]">k</div>
          <span className="font-extrabold text-[1.2rem] tracking-tight text-text-dark">club trải nghiệm</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-[400px] flex items-center bg-slate-100 rounded-full px-4 py-2.5 gap-2.5">
          <Search className="text-slate-500" size={18} />
          <input type="text" placeholder="Tìm sản phẩm, bài đánh giá..." className="border-none bg-transparent w-full outline-none text-[0.95rem] text-text-dark placeholder-slate-400" />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
          <NavLink 
            to="/" 
            className={({ isActive }) => `flex items-center gap-2 text-[0.95rem] font-semibold transition-all px-4 py-2 rounded-full no-underline ${isActive ? 'text-primary bg-white shadow-sm' : 'text-slate-500 hover:text-text-dark'}`}
            end
          >
            <Home size={18} />
            Trang chủ
          </NavLink>
          <NavLink 
            to="/feed" 
            className={({ isActive }) => `flex items-center gap-2 text-[0.95rem] font-semibold transition-all px-4 py-2 rounded-full no-underline ${isActive ? 'text-primary bg-white shadow-sm' : 'text-slate-500 hover:text-text-dark'}`}
          >
            <Star size={18} />
            Bảng tin
          </NavLink>
          <NavLink 
            to="/messages" 
            className={({ isActive }) => `flex items-center gap-2 text-[0.95rem] font-semibold transition-all px-4 py-2 rounded-full no-underline ${isActive ? 'text-primary bg-white shadow-sm' : 'text-slate-500 hover:text-text-dark'}`}
          >
            <MessageCircle size={18} />
            Tin nhắn
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={sendDemoRealtime} 
            disabled={isSending}
            title="Bấm để phát tín hiệu WebSocket qua Laravel Reverb" 
            className={`hidden lg:flex items-center gap-1 bg-[#fcebeb] text-[#c93638] hover:bg-[#c93638] hover:text-white transition-all border border-[#c93638]/30 px-3.5 py-1.5 rounded-full font-extrabold text-[0.82rem] cursor-pointer shadow-sm ${isSending ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isSending ? '⏳ Đang phát sóng...' : '⚡ Test Realtime'}
          </button>

          {/* Realtime Notification Bell */}
          <div className="relative">
            <button 
              onClick={handleBellClick}
              className="bg-transparent border-none cursor-pointer flex items-center justify-center relative p-2"
            >
              <Bell className="text-slate-600 transition-colors hover:text-slate-900" size={22} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c93638] text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md border-2 border-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Dropdown thông báo */}
            {showNotifDropdown && (
              <div className="absolute right-0 top-12 w-[340px] sm:w-[380px] bg-white border-2 border-[#0f172a] rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] z-[100] max-h-[420px] overflow-y-auto">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-[1.05rem] flex items-center gap-1.5 m-0">
                    <Sparkles size={18} className="text-[#c93638]" /> Thông báo Realtime
                  </h4>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button onClick={() => setNotifications([])} className="text-xs text-slate-400 font-bold bg-transparent border-none cursor-pointer hover:text-slate-700">Xóa hết</button>
                    )}
                    <button onClick={() => setShowNotifDropdown(false)} className="text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer p-0 font-bold">✕</button>
                  </div>
                </div>
                {notifications.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-slate-400 font-semibold text-sm m-0">Chưa có thông báo mới.</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Bấm thử nút <strong className="text-[#c93638]">⚡ Test Realtime</strong> để thấy phép thuật WebSocket!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3.5 bg-[#fff5f5] border border-[#fcebeb] rounded-2xl hover:bg-[#fbdada] transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-slate-900 font-extrabold text-sm">{n.title}</strong>
                          <span className="text-[11px] font-extrabold text-[#c93638] bg-white px-2 py-0.5 rounded-full border border-[#f3a4a4]">{n.time}</span>
                        </div>
                        <p className="text-slate-700 font-medium text-xs leading-relaxed m-0">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <button onClick={sendDemoRealtime} disabled={isSending} className="w-full py-2.5 bg-[#f2a9a9] hover:bg-[#c93638] text-white rounded-xl font-extrabold text-xs transition-colors border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50">
                    ⚡ {isSending ? 'Đang phát sóng...' : 'Bắn thử thông báo Realtime'}
                  </button>
                  <button onClick={promptOneSignalPush} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl font-extrabold text-xs transition-colors border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm">
                    🔔 Xin quyền Desktop Push (OneSignal / OS)
                  </button>
                  <button onClick={() => { setShowNotifDropdown(false); window.dispatchEvent(new Event('open_notif_prompt_modal')); }} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] transition-colors border-none cursor-pointer flex items-center justify-center gap-1.5">
                    👀 Xem thử Bảng Mời Bật Thông Báo (Soft Prompt)
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-all border-none cursor-pointer"
              >
                <img 
                  src={currentUser.anh_dai_dien || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
                  alt="Avatar" 
                  className="w-7 h-7 rounded-full object-cover shadow-sm border border-white" 
                />
                <span className="font-extrabold text-slate-800 text-sm max-w-[120px] truncate">
                  {currentUser.ten_hien_thi || currentUser.ho_ten || 'VIP Member'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-[230px] bg-white border-2 border-[#0f172a] rounded-2xl p-2.5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] z-[200] flex flex-col gap-1 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] text-slate-400 font-medium mb-0.5">Vai trò thành viên:</p>
                    <span className="text-xs font-bold text-primary bg-red-50 px-2.5 py-0.5 rounded-md inline-block">
                      {currentUser.vai_tro?.ten || (currentUser.vai_tro_id === 3 ? '👑 Siêu Quản Trị' : currentUser.vai_tro_id === 2 ? '🛡️ Quản Trị Viên' : '📖 Người Đọc')}
                    </span>
                  </div>
                  <NavLink 
                    to="/profile" 
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-xs no-underline transition-colors"
                  >
                    👤 Hồ sơ của tôi
                  </NavLink>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-extrabold text-xs bg-transparent border-none cursor-pointer w-full text-left transition-colors"
                  >
                    🚪 Đăng xuất (Thu hồi Token)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink 
              to="/auth"
              className="bg-[#f2a9a9] text-white border-none px-6 py-2.5 rounded-full font-bold text-[0.95rem] cursor-pointer transition-all hover:bg-primary no-underline flex items-center justify-center shadow-sm hover:shadow"
            >
              Đăng nhập
            </NavLink>
          )}
        </div>
      </div>

      {/* Floating Realtime Toast Popup (Góc dưới bên phải) */}
      {showToast && latestNotif && (
        <div className="fixed bottom-6 right-6 bg-white border-2 border-[#0f172a] p-4 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] z-[9999] max-w-[360px] flex items-start gap-3.5 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-[#fcebeb] border border-[#c93638]/40 flex items-center justify-center text-[#c93638] font-extrabold text-lg shrink-0 shadow-sm">
            ⚡
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-extrabold text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">Laravel Reverb</span>
              <span className="text-[10px] text-slate-400 font-bold">Vừa xong</span>
            </div>
            <strong className="text-slate-900 font-extrabold text-[0.98rem] block mb-1">{latestNotif.title}</strong>
            <p className="text-slate-600 font-medium text-xs leading-relaxed m-0">{latestNotif.message}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-slate-800 bg-transparent border-none cursor-pointer text-base font-extrabold p-0">✕</button>
        </div>
      )}

      {/* Bộ Bảng Hỏi Xin Quyền Tự Động (Soft Prompt Modal) chuẩn Mạng xã hội cao cấp */}
      <NotificationPromptModal />
    </header>
  );
};

export default Header;
