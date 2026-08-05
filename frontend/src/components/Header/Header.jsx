import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Home, MessageCircle, Bell, Star, Sparkles, X, Info, User, ShieldCheck, LogOut, ChevronRight, ShoppingBag, Calendar } from 'lucide-react';
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

      if (data.type === 'user_status_change' || data.type === 'message_recalled') {
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
      <div className="max-w-[1320px] mx-auto px-5 py-3 flex flex-col gap-3">
        {/* Top Row: Logo, Navigation, Actions */}
        <div className="flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer min-w-max">
          <div className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[1.2rem]">k</div>
          <span className="font-extrabold text-[1.2rem] tracking-tight text-text-dark">club trải nghiệm</span>
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
            to="/products" 
            className={({ isActive }) => `flex items-center gap-2 text-[0.95rem] font-semibold transition-all px-4 py-2 rounded-full no-underline ${isActive ? 'text-primary bg-white shadow-sm' : 'text-slate-500 hover:text-text-dark'}`}
          >
            <ShoppingBag size={18} />
            Sản phẩm
          </NavLink>
          <NavLink 
            to="/events" 
            className={({ isActive }) => `flex items-center gap-2 text-[0.95rem] font-semibold transition-all px-4 py-2 rounded-full no-underline ${isActive ? 'text-primary bg-white shadow-sm' : 'text-slate-500 hover:text-text-dark'}`}
          >
            <Calendar size={18} />
            Sự kiện
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
                className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-2xl border-2 border-[#0f172a] font-black text-xs sm:text-sm cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                  showUserMenu 
                    ? 'bg-slate-900 text-amber-300 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] translate-x-0.5' 
                    : 'bg-white hover:bg-slate-100 text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                }`}
              >
                <img 
                  src={currentUser.anh_dai_dien || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
                  alt="Avatar" 
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl object-cover border border-[#0f172a] shrink-0" 
                />
                <span className="font-extrabold text-xs sm:text-sm max-w-[130px] truncate">
                  {currentUser.ten_hien_thi || currentUser.ho_ten || 'Thành viên'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-13 w-80 sm:w-[370px] bg-white border-3 border-[#0f172a] rounded-3xl p-4 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] z-[200] flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 pt-1 pb-2.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400 border-b-2 border-slate-900/10">
                    <span>Menu Quản Trị</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-extrabold border border-emerald-200">Online 🟢</span>
                  </div>

                  <NavLink 
                    to="/profile" 
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-sm border-2 border-[#0f172a] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all no-underline group hover:translate-x-1.5 hover:shadow-[4px_4px_0px_0px_rgba(201,54,56,1)] hover:border-[#c93638]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-rose-50 text-[#c93638] group-hover:bg-[#c93638] group-hover:text-white border border-[#0f172a] transition-transform group-hover:scale-110 flex items-center justify-center shrink-0">
                        <User size={18} />
                      </div>
                      <span className="font-black whitespace-nowrap">Hồ sơ & Trang cá nhân</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-[#c93638] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </NavLink>

                  <NavLink 
                    to="/admin" 
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-white hover:bg-slate-900 text-slate-900 hover:text-white font-extrabold text-sm border-2 border-[#0f172a] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all no-underline group hover:translate-x-1.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-300 text-slate-950 group-hover:bg-amber-400 border border-[#0f172a] transition-transform group-hover:scale-110 group-hover:-rotate-12 flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} />
                      </div>
                      <span className="font-black whitespace-nowrap">Bảng Quản Trị Tối Cao</span>
                    </div>
                    <span className="text-[11px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full border border-slate-900 group-hover:scale-105 transition-transform shrink-0">VIP</span>
                  </NavLink>

                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-white hover:bg-rose-50 text-[#c93638] font-extrabold text-sm border-2 border-[#0f172a] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer w-full text-left group hover:translate-x-1.5 hover:shadow-[4px_4px_0px_0px_rgba(201,54,56,1)] hover:border-[#c93638]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-[#c93638] text-slate-700 group-hover:text-white border border-[#0f172a] transition-transform group-hover:scale-110 flex items-center justify-center shrink-0">
                        <LogOut size={18} />
                      </div>
                      <span className="font-black whitespace-nowrap">Đăng xuất tài khoản</span>
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 group-hover:bg-[#c93638] group-hover:text-white transition-colors shrink-0">Thoát</span>
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

        {/* Bottom Row: Search */}
        <div className="w-full flex items-center bg-slate-100/80 rounded-full px-4 py-2.5 gap-2.5 border border-slate-200">
          <Search className="text-slate-500" size={18} />
          <input type="text" placeholder="Tìm kiếm sản phẩm, bài đánh giá, thành viên..." className="border-none bg-transparent w-full outline-none text-[0.95rem] text-text-dark placeholder-slate-400" />
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
