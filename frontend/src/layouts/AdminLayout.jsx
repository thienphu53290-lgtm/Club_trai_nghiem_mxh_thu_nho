import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminFooter from '../components/Footer/AdminFooter';
import { 
  ShieldCheck, LayoutDashboard, Users, Sliders, FileText, 
  Menu, Settings, Home, ChevronRight, X, ChevronsLeft, Sparkles,
  Edit3, CalendarDays, DollarSign, LifeBuoy, ExternalLink
} from 'lucide-react';

const AdminLayout = () => {
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
      if (!user || (user.vai_tro_id !== 3 && user.email !== 'superadmin@clubtrainghiem.com')) {
        navigate('/');
      }
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('admin_active_tab') || 'overview';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const menuItems = [
    { id: 'overview', label: 'Tổng quan & Doanh thu', icon: LayoutDashboard, badge: 'Super Admin' },
    { id: 'admins', label: 'Quản lý Admin', icon: ShieldCheck, badge: '12 chờ/hoạt động' },
    { id: 'users', label: 'Quản lý Người dùng (CRUD)', icon: Users, badge: '1.243' },
    { id: 'config', label: 'Cấu hình hệ thống', icon: Sliders, badge: 'Reverb ⚡' },
    { id: 'logs', label: 'Nhật ký hệ thống', icon: FileText, badge: '3.842' },
  ];

  const subAdminModules = [
    { id: 'content', label: 'Content Admin (Nội dung)', icon: Edit3, hoverColor: 'hover:border-emerald-500 hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,1)]' },
    { id: 'event', label: 'Event Admin (Sự kiện)', icon: CalendarDays, hoverColor: 'hover:border-purple-500 hover:shadow-[6px_6px_0px_0px_rgba(168,85,247,1)]' },
    { id: 'finance', label: 'Finance Admin (Tài chính)', icon: DollarSign, hoverColor: 'hover:border-teal-500 hover:shadow-[6px_6px_0px_0px_rgba(20,184,166,1)]' },
    { id: 'support', label: 'Support Admin (CSKH)', icon: LifeBuoy, hoverColor: 'hover:border-pink-500 hover:shadow-[6px_6px_0px_0px_rgba(236,72,153,1)]' },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    sessionStorage.setItem('admin_active_tab', tabId);
    setIsSidebarOpen(false);
    if (window.location.pathname !== '/admin' && window.location.pathname !== '/super-admin') {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-rose-500 selection:text-white relative overflow-x-hidden">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[200] bg-slate-950 text-amber-300 px-5 py-3.5 rounded-2xl border-2 border-slate-800 font-extrabold text-sm shadow-[6px_6px_0px_0px_rgba(201,54,56,1)] animate-bounce flex items-center gap-2.5">
          <Sparkles size={18} className="text-[#c93638]" />
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
                    <span className="w-10 h-10 rounded-xl bg-[#c93638] text-white font-black flex items-center justify-center text-xl border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                      ⚡
                    </span>
                    <span className="font-black text-lg sm:text-xl text-slate-900 uppercase tracking-tight">
                      CÔNG CỤ & CHỨC NĂNG
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-[#c93638] text-slate-700 hover:text-white border-2 border-slate-900 font-extrabold flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between px-1 pt-1">
                  <span>Khối Điều Hành Tối Cao</span>
                  <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-xl border border-rose-300 font-black shadow-sm">Full CRUD</span>
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
                            ? 'bg-[#c93638] text-white translate-x-2 scale-[1.02] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]' 
                            : 'bg-white text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-gradient-to-r hover:from-white hover:to-rose-50/60 hover:border-[#c93638] hover:translate-x-3.5 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[8px_8px_0px_0px_rgba(201,54,56,1)]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-2.5 rounded-2xl border-2 border-[#0f172a] transition-transform group-hover:scale-110 group-hover:rotate-6 ${
                            isActive ? 'bg-slate-900 text-amber-300 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'bg-rose-50 text-[#c93638] group-hover:bg-[#c93638] group-hover:text-white'
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
                          <ChevronRight size={18} className={`transition-all group-hover:translate-x-1 ${isActive ? 'text-amber-300 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-[#c93638]'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-5 border-t-2 border-slate-200">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between px-1 mb-4">
                    <span>Phân Hệ Cấp Dưới</span>
                    <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-300 font-black shadow-sm">Sub-Admins</span>
                  </div>
                  <div className="space-y-4">
                    {subAdminModules.map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsSidebarOpen(false);
                            handleSelectTab(item.id);
                          }}
                          className={`w-full p-4 rounded-2xl font-extrabold text-sm border-2 border-[#0f172a] bg-white text-slate-700 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 ${item.hoverColor} transition-all duration-200 flex items-center justify-between cursor-pointer group`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl border-2 border-[#0f172a] bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                              <IconComp size={18} strokeWidth={2.5} />
                            </div>
                            <span>{item.label}</span>
                          </div>
                          <ExternalLink size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>


            </div>
            <div 
              onClick={() => setIsSidebarOpen(false)}
              title="Thu gọn cửa sổ công cụ"
              className="w-8 sm:w-10 bg-[#c93638] hover:bg-slate-900 text-amber-300 border-y-4 border-r-4 border-[#0f172a] rounded-r-2xl py-8 shadow-[6px_4px_0px_0px_rgba(15,23,42,1)] cursor-pointer flex items-center justify-center transition-all hover:w-12 group active:translate-x-[-2px] -ml-1 z-[170]"
            >
              <ChevronsLeft size={26} strokeWidth={3.5} className="group-hover:scale-125 transition-transform drop-shadow" />
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b-2 border-[#0f172a] sticky top-0 z-50 shadow-sm px-4 sm:px-8 py-3.5">
        <div className="max-w-[1550px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
            <button
              onClick={() => setIsSidebarOpen(true)}
              title="Nhấn để mở cửa sổ danh sách công cụ chức năng (Nút 3 gạch)"
              className="px-3 py-2 sm:w-11 sm:h-11 rounded-2xl bg-white hover:bg-slate-900 text-slate-900 hover:text-white border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center cursor-pointer active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0"
            >
              <Menu size={24} />
            </button>

            <button
              onClick={() => showNotification('⚙️ Mục Cài đặt đang ở trạng thái Khung Giao Diện, chưa có logic bóc rãnh.')}
              title="Cài đặt hệ thống (Cùng cấp với nút 3 gạch)"
              className="px-3.5 py-2 sm:h-11 rounded-2xl bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-black text-xs sm:text-sm border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center gap-2 cursor-pointer active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0 group"
            >
              <Settings size={18} className="text-slate-700 group-hover:text-amber-300 transition-colors" />
              <span>Cài đặt</span>
            </button>

            <div 
              onClick={() => navigate('/')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#c93638] text-white flex items-center justify-center font-black text-xl border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer hover:rotate-6 transition-transform shrink-0 ml-1"
            >
              k
            </div>
            <span className="font-black text-lg sm:text-2xl text-slate-900 tracking-tight uppercase hidden md:inline-block">
              BẢNG QUẢN TRỊ
            </span>
            <span className="bg-amber-400 text-slate-950 px-3 sm:px-3.5 py-1.5 rounded-full font-black text-xs border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center gap-1.5 shrink-0">
              <ShieldCheck size={16} className="text-slate-950" /> Super Admin
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
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
                alt="Super Admin Avatar" 
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

export default AdminLayout;
