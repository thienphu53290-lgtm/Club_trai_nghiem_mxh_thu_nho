import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Home, MessageCircle, Bell, Star, Sparkles, X, Info } from 'lucide-react';
import echo from '../../api/echo';
import api from '../../api/axios';
import OneSignal from 'react-onesignal';
import NotificationPromptModal from './NotificationPromptModal';
import NotificationCard from '../NotificationCard/NotificationCard';

const Header = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('club_notifications');
      if (!saved) return [];
      const list = JSON.parse(saved);
      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      return list.filter(n => {
        if (n.type === 'new_chat_message') return true;
        return (now - (n.createdAt || now)) <= thirtyDays;
      });
    } catch (e) {
      return [];
    }
  });
  const [showToast, setShowToast] = useState(false);
  const [latestNotif, setLatestNotif] = useState(null);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('current_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed?.user?.id ? parsed.user : parsed;
    } catch (e) { return null; }
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const lastEventTimeRef = useRef(0);
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('club_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  const handleNotificationClick = (n) => {
    setNotifications(prev => prev.filter(item => item.id !== n.id));
    setShowNotifDropdown(false);
    if (n.type === 'new_chat_message' && n.chatData) {
      navigate('/messages', {
        state: {
          chatTarget: {
            id: n.chatData.senderId,
            name: n.chatData.senderName || 'Thành viên Club',
            avatar: n.chatData.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
            online: true,
            isVerified: true,
            roleTitle: '👑 Thành Viên Club'
          }
        }
      });
      return;
    }
    let postId = n.chatData?.post_id || n.chatData?.id || n.data?.post_id || n.data?.id;
    if (!postId && n.type !== 'new_chat_message') {
      postId = 'latest';
    }
    if (postId) {
      navigate('/feed', { state: { scrollToPostId: postId } });
      window.dispatchEvent(new CustomEvent('scroll_to_post', { detail: { postId } }));
      return;
    }
    navigate('/feed');
  };

  const triggerNotificationUI = (title, message, source, extraData = null, type = 'general') => {
    const now = Date.now();
    if (now - lastEventTimeRef.current < 600 && !extraData) return;
    lastEventTimeRef.current = now;

    const newNotif = {
      id: now + Math.random(),
      title: title || 'Thông báo mới',
      message: message || 'Có cập nhật mới từ Club Trải Nghiệm',
      time: 'Vừa xong',
      badge: source || 'THÔNG BÁO CLUB',
      type: type,
      chatData: extraData,
      createdAt: now
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setLatestNotif(newNotif);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 6000);

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, { body: newNotif.message, icon: '/favicon.svg' });
      } catch (e) {}
    }
  };

  useEffect(() => {
    const channel = echo.channel('club-live');

    const handleEvent = (data) => {
      let currentLoggedUser = null;
      try {
        const saved = localStorage.getItem('current_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          currentLoggedUser = parsed?.user?.id ? parsed.user : parsed;
        }
      } catch (e) {}

      if (data.type === 'new_chat_message' && data.data) {
        const myId = currentLoggedUser ? parseInt(currentLoggedUser.id, 10) : null;
        const receiverId = parseInt(data.data.receiverId, 10);
        const senderId = parseInt(data.data.senderId, 10);

        if (!myId || receiverId !== myId || senderId === myId) {
          return;
        }
        triggerNotificationUI(data.title, data.message, "💬 TIN NHẮN MỚI", data.data, 'new_chat_message');
        return;
      }

      if (data.type === 'user_status_change') {
        return;
      }

      triggerNotificationUI(data.title, data.message, "🔔 THÔNG BÁO CLUB", data.data || data, data.type || 'general');
    };

    channel.listen('.live-event', handleEvent);

    return () => {
      channel.stopListening('.live-event', handleEvent);
    };
  }, []);

  useEffect(() => {
    const updateAuth = () => {
      try {
        const saved = localStorage.getItem('current_user');
        if (!saved) {
          setCurrentUser(null);
          return;
        }
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed?.user?.id ? parsed.user : parsed);
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
          <NavLink 
            to="/about" 
            className={({ isActive }) => `flex items-center gap-2 text-[0.95rem] font-semibold transition-all px-4 py-2 rounded-full no-underline ${isActive ? 'text-primary bg-white shadow-sm' : 'text-slate-500 hover:text-text-dark'}`}
          >
            <Info size={18} />
            Giới thiệu
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Realtime Notification Bell */}
          <div className="relative" ref={notifMenuRef}>
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
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {notifications.map((n) => (
                      <NotificationCard 
                        key={n.id} 
                        notification={n} 
                        onClick={() => handleNotificationClick(n)} 
                        isToast={false} 
                      />
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
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
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-all border-none cursor-pointer"
              >
                <img 
                  src={currentUser.anh_dai_dien || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
                  alt="Avatar" 
                  className="w-7 h-7 rounded-full object-cover shadow-sm border border-white" 
                />
                <span className="font-extrabold text-slate-800 text-sm max-w-[140px] truncate">
                  {currentUser.ten_hien_thi || currentUser.ho_ten || 'Thành viên'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white border border-slate-200/80 rounded-3xl p-3 shadow-2xl z-[200] flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 mb-1">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={currentUser.anh_dai_dien || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
                        alt="Avatar" 
                        className="w-11 h-11 rounded-2xl object-cover shadow-xs border border-white shrink-0" 
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="font-black text-slate-900 text-sm sm:text-base m-0 truncate">
                          {currentUser.ten_hien_thi || currentUser.ho_ten || 'Thành viên Club'}
                        </h5>
                        <p className="text-xs font-semibold text-slate-400 m-0 truncate mt-0.5">
                          {currentUser.email || 'Tài khoản Club Trải Nghiệm'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-2.5 border-t border-slate-200/60">
                      <span className="flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-xl bg-rose-50 text-[#c93638] border border-rose-200/80 shadow-2xs">
                        {currentUser.anh_cap_bac && <img src={currentUser.anh_cap_bac} alt="" className="w-3.5 h-3.5 rounded object-cover" />}
                        <span>{currentUser.ten_cap_bac || currentUser.cap_bac || (currentUser.vai_tro_id === 3 ? '👑 Siêu Quản Trị' : currentUser.vai_tro_id === 2 ? '🛡️ Quản Trị Viên' : '✨ Thành viên Club')}</span>
                      </span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 ml-auto shadow-2xs">
                        ⭐ {currentUser.diem_trai_nghiem || 0} XP
                      </span>
                    </div>
                  </div>

                  <NavLink 
                    to="/profile" 
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-black text-xs sm:text-sm no-underline transition-colors"
                  >
                    <span className="text-base">👤</span>
                    <span>Hồ sơ & Trang cá nhân</span>
                  </NavLink>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-2xl hover:bg-rose-50 text-[#c93638] font-black text-xs sm:text-sm bg-transparent border-none cursor-pointer w-full text-left transition-colors border-t border-slate-100/80 mt-0.5"
                  >
                    <span className="text-base">🚪</span>
                    <span>Đăng xuất tài khoản</span>
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
        <NotificationCard
          notification={latestNotif}
          onClick={() => { setShowToast(false); handleNotificationClick(latestNotif); }}
          onClose={() => setShowToast(false)}
          isToast={true}
        />
      )}

      {/* Bộ Bảng Hỏi Xin Quyền Tự Động (Soft Prompt Modal) chuẩn Mạng xã hội cao cấp */}
      <NotificationPromptModal />
    </header>
  );
};

export default Header;
