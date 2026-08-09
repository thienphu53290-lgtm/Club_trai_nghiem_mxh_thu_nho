import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminFooter from '../components/Footer/AdminFooter';
import { 
  ShieldCheck, Calendar, Users, Ticket,
  Menu, Settings, Home, ChevronRight, X, ChevronsLeft, Sparkles, MapPin
} from 'lucide-react';

const EventAdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('current_user');
      if (!saved) {
        navigate('/');
        return;
      }
      const parsed = JSON.parse(saved);
      const user = parsed?.user?.id ? parsed.user : parsed;
      // Cho phép Admin (role 2) và Super Admin (role 3)
      if (!user || (user.vai_tro_id !== 2 && user.vai_tro_id !== 3 && user.email !== 'superadmin@clubtrainghiem.com')) {
        navigate('/');
      }
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('event_admin_active_tab') || 'schedule';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const menuItems = [
    { id: 'schedule', label: 'Lịch trình Sự kiện', icon: Calendar, badge: 'Đang diễn ra: 2' },
    { id: 'checkin', label: 'Duyệt khách (Check-in)', icon: Users, badge: 'Live' },
    { id: 'tickets', label: 'Thống kê Vé', icon: Ticket, badge: 'Doanh thu' },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    sessionStorage.setItem('event_admin_active_tab', tabId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-purple-500 selection:text-white relative overflow-x-hidden">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[200] bg-slate-950 text-amber-300 px-5 py-3.5 rounded-2xl border-2 border-slate-800 font-extrabold text-sm shadow-[6px_6px_0px_0px_rgba(217,119,6,1)] flex items-center gap-2.5">
          <Sparkles size={18} className="text-amber-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[150] flex">
          <div 
            onClick={() => setIsSidebarOpen(false)} 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fadeIn"
          />
          <div className="relative z-[160] h-full flex items-center">
            <div className="w-[440px] sm:w-[520px] max-w-[92vw] bg-white h-full border-r-4 border-[#0f172a] shadow-[12px_0px_30px_0px_rgba(0,0,0,0.5)] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto transition-all">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                      <Calendar size={20} />
                    </span>
                    <span className="font-black text-lg sm:text-xl text-slate-900 uppercase tracking-tight">
                      QUẢN TRỊ SỰ KIỆN
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-purple-600 text-slate-700 hover:text-white border-2 border-slate-900 font-extrabold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between px-1 pt-1">
                  <span>Điều Phối Hoạt Động</span>
                  <span className="text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-300 font-black shadow-sm">Event Admin</span>
                </div>

                <div className="space-y-4 pt-1">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full p-4.5 sm:p-5 rounded-3xl font-extrabold text-sm sm:text-base border-2 border-[#0f172a] transition-all duration-200 flex items-center justify-between cursor-pointer text-left group ${
                          isActive 
                            ? 'bg-purple-500 text-white translate-x-2 scale-[1.02] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]' 
                            : 'bg-white text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-gradient-to-r hover:from-white hover:to-purple-50/60 hover:border-purple-500 hover:translate-x-3.5 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[8px_8px_0px_0px_rgba(168,85,247,1)]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2.5 rounded-2xl border-2 border-[#0f172a] transition-transform group-hover:scale-110 group-hover:-rotate-6 ${
                            isActive ? 'bg-slate-900 text-amber-300 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'bg-purple-50 text-purple-600 group-hover:bg-amber-400 group-hover:text-slate-900'
                          }`}>
                            <IconComponent size={24} />
                          </div>
                          <span className="tracking-tight font-black">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-black border transition-transform group-hover:scale-105 ${
                            isActive 
                              ? 'bg-amber-400 text-slate-950 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]' 
                              : 'bg-slate-100 text-slate-700 border-slate-300 group-hover:border-slate-900 group-hover:bg-amber-100'
                          }`}>
                            {item.badge}
                          </span>
                          <ChevronRight size={18} className={`transition-all group-hover:translate-x-1 ${isActive ? 'text-amber-300 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-purple-700'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t-2 border-slate-200">
                <div className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-[#0f172a] shadow-[5px_5px_0px_0px_rgba(168,85,247,1)]">
                  <h4 className="font-black text-base text-purple-400 m-0 mb-2 flex items-center gap-2">
                    <MapPin size={20} /> Ban Tổ Chức Sự Kiện
                  </h4>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed m-0 mb-4">
                    Khu vực dành riêng cho BTC điều phối lịch trình, theo dõi doanh thu bán vé và quét mã QR kiểm soát ra vào thời gian thực.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-ping"></span>
                    Hệ thống Check-in: ONLINE
                  </div>
                </div>
              </div>
            </div>
            <div 
              onClick={() => setIsSidebarOpen(false)}
              title="Thu gọn cửa sổ công cụ"
              className="w-8 sm:w-10 bg-purple-500 hover:bg-slate-900 text-amber-300 border-y-4 border-r-4 border-[#0f172a] rounded-r-2xl py-8 shadow-[6px_4px_0px_0px_rgba(15,23,42,1)] cursor-pointer flex items-center justify-center transition-all hover:w-12 group active:translate-x-[-2px] -ml-1 z-[170]"
            >
              <ChevronsLeft size={26} strokeWidth={3.5} className="group-hover:scale-125 transition-transform drop-shadow" />
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b-2 border-[#0f172a] sticky top-0 z-50 shadow-sm px-4 sm:px-8 py-3.5">
        <div className="max-w-[1550px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
            {/* NÚT HAMBURGER MỚI (MẪU HÌNH TRÒN VÀNG) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              title="Mở menu (Mẫu Tròn Màu Vàng)"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 border-[3px] border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group shrink-0"
            >
              <Menu size={24} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>

            <div 
              onClick={() => navigate('/')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-xl border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer hover:rotate-12 transition-transform shrink-0 ml-1"
            >
              e
            </div>
            <span className="font-black text-lg sm:text-2xl text-slate-900 tracking-tight uppercase hidden md:inline-block">
              SỰ KIỆN
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 sm:px-3.5 py-1.5 rounded-full font-black text-xs border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center gap-1.5 shrink-0">
              <ShieldCheck size={16} /> Event Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="bg-white hover:bg-slate-900 text-slate-900 hover:text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-full border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer flex items-center gap-1.5 active:translate-x-[2px] active:translate-y-[2px]"
            >
              <Home size={16} /> Về trang chủ
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-[#0f172a] overflow-hidden bg-slate-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80" 
                alt="Event Admin Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1550px] w-full mx-auto px-4 sm:px-8 pt-8 pb-16">
        <Outlet context={{ activeTab, setActiveTab, showNotification }} />
      </main>

      <AdminFooter />
    </div>
  );
};

export default EventAdminLayout;
