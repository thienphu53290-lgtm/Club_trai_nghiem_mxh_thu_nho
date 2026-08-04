import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { logAdminAction } from '../../api/logtail';
import api from '../../api/axios';
import { 
  ShieldCheck, LayoutDashboard, Users, UserCheck, Settings, 
  Activity, DollarSign, ArrowUpRight, CheckCircle2, AlertCircle, 
  Server, Database, LogOut, Home, ChevronRight, Search, Filter, 
  MoreVertical, MoreHorizontal, Plus, FileText, Layers, RefreshCw, 
  Sparkles, Trash2, Edit, Eye, ShieldAlert, Menu, Sliders, Calendar, BarChart3, TrendingUp, X, ChevronsLeft
} from 'lucide-react';

const SuperAdmin = () => {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, showNotification } = useOutletContext();
  const [revenuePeriod, setRevenuePeriod] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
  };

  const getChartData = () => {
    if (revenuePeriod === 'day') {
      return [
        { label: 'Thứ 2', val: '14.2M', pct: 45, isPeak: false },
        { label: 'Thứ 3', val: '18.5M', pct: 60, isPeak: false },
        { label: 'Thứ 4', val: '12.0M', pct: 40, isPeak: false },
        { label: 'Thứ 5', val: '22.4M', pct: 72, isPeak: false },
        { label: 'Thứ 6', val: '19.8M', pct: 65, isPeak: false },
        { label: 'Thứ 7', val: '28.5M', pct: 90, isPeak: false },
        { label: 'Chủ Nhật', val: '31.2M', pct: 100, isPeak: true, text: 'Hôm nay' },
      ];
    } else if (revenuePeriod === 'month') {
      return [
        { label: 'T1', val: '82M', pct: 55, isPeak: false },
        { label: 'T2', val: '90M', pct: 62, isPeak: false },
        { label: 'T3', val: '88M', pct: 60, isPeak: false },
        { label: 'T4', val: '105M', pct: 74, isPeak: false },
        { label: 'T5', val: '112M', pct: 80, isPeak: false },
        { label: 'T6', val: '98M', pct: 70, isPeak: false },
        { label: 'T7', val: '120M', pct: 88, isPeak: false },
        { label: 'T8', val: '128.5M', pct: 100, isPeak: true, text: 'Hiện tại' },
        { label: 'T9', val: '135M*', pct: 45, isPeak: false, isProjected: true },
        { label: 'T10', val: '140M*', pct: 48, isPeak: false, isProjected: true },
        { label: 'T11', val: '155M*', pct: 55, isPeak: false, isProjected: true },
        { label: 'T12', val: '180M*', pct: 65, isPeak: false, isProjected: true },
      ];
    } else {
      return [
        { label: 'Năm 2023', val: '420M', pct: 35, isPeak: false },
        { label: 'Năm 2024', val: '680M', pct: 55, isPeak: false },
        { label: 'Năm 2025', val: '950M', pct: 78, isPeak: false },
        { label: 'Năm 2026', val: '1.450M', pct: 100, isPeak: true, text: 'Năm nay' },
      ];
    }
  };

  const renderRevenueChart = () => (
    <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] my-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-900 mb-6">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 m-0 flex items-center gap-2 uppercase tracking-tight">
            <TrendingUp className="text-[#c93638]" size={26} />
            <span>Sơ đồ doanh thu thực tế</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold m-0 mt-1">
            Theo dõi sự tăng trưởng dòng tiền Affiliate và dịch vụ Club trải nghiệm theo mốc thời gian chi tiết.
          </p>
        </div>
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] w-fit">
          {[
            { id: 'day', label: 'Theo Ngày', icon: Calendar },
            { id: 'month', label: 'Theo Tháng', icon: BarChart3 },
            { id: 'year', label: 'Theo Năm', icon: TrendingUp },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setRevenuePeriod(btn.id)}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer border-none ${
                revenuePeriod === btn.id
                  ? 'bg-[#c93638] text-white shadow-md scale-[1.02]'
                  : 'bg-transparent text-slate-700 hover:text-slate-950'
              }`}
            >
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 flex items-end justify-between gap-2 sm:gap-4 pt-8 px-2 pb-2 border-b border-slate-200 overflow-x-auto">
        {getChartData().map((col, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 min-w-[45px] h-full justify-end group">
            <div className="text-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200">
              <span className={`text-[11px] sm:text-xs font-black block ${col.isPeak ? 'text-[#c93638]' : col.isProjected ? 'text-slate-400 font-semibold' : 'text-slate-800'}`}>
                {col.val}
              </span>
              {col.text && (
                <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-[#fcebeb] text-[#c93638] border border-[#c93638]/40 rounded-full inline-block mb-1">
                  {col.text}
                </span>
              )}
            </div>
            <div 
              style={{ height: `${col.pct}%` }} 
              className={`w-full max-w-[54px] rounded-t-2xl border-2 transition-all duration-300 relative group-hover:brightness-110 ${
                col.isPeak
                  ? 'bg-gradient-to-t from-[#c93638] to-rose-500 border-[#0f172a] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                  : col.isProjected
                  ? 'bg-slate-100 border-dashed border-slate-400 opacity-60'
                  : 'bg-emerald-500 hover:bg-emerald-400 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
              }`}
            >
              <div className="absolute inset-0 bg-white/10 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xs font-black text-slate-700 mt-2 block shrink-0">{col.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-5 text-xs font-bold text-slate-600 px-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-lg bg-[#c93638] border border-slate-900 inline-block"></span>
            <span>Đỉnh doanh thu / Hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-lg bg-emerald-500 border border-slate-900 inline-block"></span>
            <span>Doanh thu đạt chuẩn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-lg bg-slate-200 border border-dashed border-slate-500 inline-block"></span>
            <span>Dự kiến chặng tới</span>
          </div>
        </div>
        <div className="text-slate-900 font-extrabold bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
          🔥 Trị giá tăng trưởng toàn diện: +24.8%
        </div>
      </div>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight m-0 mb-1">
          Tổng quan hệ thống
        </h1>
        <p className="text-sm text-slate-600 font-semibold m-0">
          Chỉ Super Admin thấy trang này. Từ đây bạn đi vào các khu quản trị và theo dõi sơ đồ tổng doanh thu theo thời gian thực.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] transition-all">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">TỔNG DOANH THU AFFILIATE</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">128.500.000đ</span>
          </div>
          <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
            <span>↑ +18.2%</span> <span className="text-slate-500 font-semibold">so với tuần trước</span>
          </p>
        </div>

        <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] transition-all">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">THÀNH VIÊN CLUB</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight">1.243</span>
          </div>
          <p className="text-xs font-bold text-indigo-600 mt-2">
            +38 thành viên tuần này
          </p>
        </div>

        <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] transition-all">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">QUYỀN HẠN DỮ LIỆU</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#c93638] tracking-tight">Toàn quyền</span>
          </div>
          <p className="text-xs font-bold text-slate-600 mt-2">
            CRUD 100% mọi thực thể & bài viết
          </p>
        </div>

        <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] transition-all">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">REALTIME REVERB & WS</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-500 tracking-tight">Ổn định ⚡</span>
          </div>
          <p className="text-xs font-bold text-slate-600 mt-2">
            Cổng 8080 & 8000 kết nối mượt
          </p>
        </div>
      </div>

      {renderRevenueChart()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
        <div 
          onClick={() => handleSelectTab('admins')}
          className="bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[7px_7px_0px_0px_rgba(201,54,56,1)] hover:border-[#c93638] cursor-pointer transition-all flex flex-col justify-between h-full group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fcebeb] border-2 border-[#0f172a] flex items-center justify-center text-[#c93638] font-bold group-hover:scale-110 transition-transform">
                <ShieldCheck size={26} />
              </div>
              <ArrowUpRight size={22} className="text-slate-700 group-hover:text-[#c93638] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Quản lý Admin</h3>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed mb-6">
              Phân quyền Super Admin, cấp và thu hồi quyền hạn của Admin nội dung, Admin sự kiện, giám sát chi tiết thao tác điều hành.
            </p>
          </div>
          <div className="mt-auto">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-300">
              12 ADMIN HOẠT ĐỘNG
            </span>
          </div>
        </div>

        <div 
          onClick={() => handleSelectTab('users')}
          className="bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[7px_7px_0px_0px_rgba(201,54,56,1)] hover:border-[#c93638] cursor-pointer transition-all flex flex-col justify-between h-full group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fcebeb] border-2 border-[#0f172a] flex items-center justify-center text-[#c93638] font-bold group-hover:scale-110 transition-transform">
                <Users size={26} />
              </div>
              <ArrowUpRight size={22} className="text-slate-700 group-hover:text-[#c93638] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Quản lý Người dùng & CRUD</h3>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed mb-6">
              Toàn quyền tạo mới, chỉnh sửa thông tin, xóa dữ liệu (CRUD) thành viên, quản lý bài đánh giá, bình luận và khóa tài khoản vi phạm.
            </p>
          </div>
          <div className="mt-auto">
            <span className="text-xs font-black uppercase tracking-wider text-[#c93638] bg-rose-50 px-3.5 py-1.5 rounded-xl border border-rose-200">
              TOÀN QUYỀN CRUD DỮ LIỆU
            </span>
          </div>
        </div>

        <div 
          onClick={() => handleSelectTab('config')}
          className="bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[7px_7px_0px_0px_rgba(201,54,56,1)] hover:border-[#c93638] cursor-pointer transition-all flex flex-col justify-between h-full group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fcebeb] border-2 border-[#0f172a] flex items-center justify-center text-[#c93638] font-bold group-hover:scale-110 transition-transform">
                <Sliders size={26} />
              </div>
              <ArrowUpRight size={22} className="text-slate-700 group-hover:text-[#c93638] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Cấu hình hệ thống</h3>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed mb-6">
              Thiết lập cổng WebSocket Laravel Reverb, cấu hình lưu trữ Cloudinary, tỉ lệ hoa hồng Affiliate và cài đặt thông báo OS Push.
            </p>
          </div>
          <div className="mt-auto">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-300">
              HỆ THỐNG MƯỢT 100%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
        <div className="lg:col-span-2 bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-slate-900">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider m-0">NHẬT KÝ HOẠT ĐỘNG & CRUD</h3>
            <button 
              onClick={() => handleSelectTab('logs')}
              className="px-4 py-1 rounded-full bg-white text-slate-900 hover:bg-slate-900 hover:text-white border-2 border-slate-900 font-extrabold text-xs transition-colors cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>
          <div className="space-y-4">
            {[
              { time: '09:12', user: 'Thu Hà', action: 'duyệt 4 bài đánh giá kem chống nắng và gắn nhãn xác minh', tag: 'Nội dung', color: 'bg-slate-100 text-slate-800' },
              { time: '08:40', user: 'Hải Đăng', action: 'thực hiện lệnh CRUD thêm mới 15 sản phẩm Affiliate vào kho', tag: 'CRUD Dữ liệu', color: 'bg-rose-100 text-[#c93638]' },
              { time: 'Hôm qua', user: 'Quang Huy', action: 'khóa 2 tài khoản spam link quảng cáo trái phép', tag: 'Người dùng', color: 'bg-amber-100 text-amber-900' },
              { time: 'Hôm qua', user: 'Minh Anh', action: 'cập nhật cấu hình máy chủ Realtime Reverb lên cổng 8080', tag: 'Cấu hình', color: 'bg-indigo-100 text-indigo-900' },
              { time: 'Hôm qua', user: 'Long Founder', action: 'cấp quyền Super Admin toàn quyền cho tài khoản Trưởng nhóm', tag: 'Super Admin', color: 'bg-emerald-100 text-emerald-900' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 last:border-0 gap-2 hover:bg-slate-50 rounded-xl px-2 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-400 w-16 shrink-0">{item.time}</span>
                  <p className="text-sm font-semibold text-slate-700 m-0">
                    <strong className="text-slate-900 font-black">{item.user}</strong> {item.action}
                  </p>
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full border border-slate-300 w-fit shrink-0 ${item.color}`}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
          <div>
            <div className="mb-5 pb-3 border-b-2 border-slate-900">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider m-0">SỨC KHỔE & TRẠNG THÁI</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm font-bold text-slate-700">Tỉ lệ review có ảnh/video</span>
                <span className="px-3 py-1 rounded-full bg-emerald-400 border-2 border-slate-900 font-black text-xs text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  96%
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm font-bold text-slate-700">WebSocket Reverb (Cổng 8080)</span>
                <span className="px-3 py-1 rounded-full bg-amber-300 border-2 border-slate-900 font-black text-xs text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  Ổn định ⚡
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm font-bold text-slate-700">Báo cáo vi phạm đang chờ</span>
                <span className="px-3 py-1 rounded-full bg-rose-500 text-white border-2 border-slate-900 font-black text-xs shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  3
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm font-bold text-slate-700">Nhân hàng đang hợp tác</span>
                <span className="px-3 py-1 rounded-full bg-white border-2 border-slate-900 font-black text-xs text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  24
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm font-bold text-slate-700">Lệnh CRUD 24h qua</span>
                <span className="px-3 py-1 rounded-full bg-indigo-300 border-2 border-slate-900 font-black text-xs text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  342
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button 
              onClick={() => showNotification('⚡ Đã chạy quy trình kiểm tra sức khỏe máy chủ thành công!')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-extrabold text-xs transition-colors border-2 border-slate-900 flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(201,54,56,1)] cursor-pointer"
            >
              <RefreshCw size={16} /> Kiểm tra hệ thống ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 m-0">Quản lý đội ngũ Admin</h2>
          <p className="text-sm text-slate-600 font-semibold m-0 mt-1">Phân quyền Super Admin, cấp hoặc thu hồi quyền truy cập quản trị viên.</p>
        </div>
        <button 
          onClick={() => showNotification('🛡️ Đã bật giao diện cấp quyền Admin cho tài khoản mới!')}
          className="bg-[#c93638] text-white hover:bg-[#b02e30] border-2 border-slate-900 px-5 py-2.5 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer w-fit"
        >
          <Plus size={18} /> Thêm Admin mới
        </button>
      </div>

      <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Thành viên</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Vai trò</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Phạm vi quyền</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Trạng thái</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Long Founder', email: 'long@clubtrainghiem.vn', role: 'Super Admin Toàn Quyền', scope: 'Toàn quyền CRUD & Hệ thống', status: 'Active', color: 'bg-amber-300' },
              { name: 'Thu Hà (Lead)', email: 'thuha@clubtrainghiem.vn', role: 'Admin Nội Dung', scope: 'Duyệt bài, xóa comment vi phạm', status: 'Active', color: 'bg-rose-200' },
              { name: 'Hải Đăng', email: 'haidang@clubtrainghiem.vn', role: 'Admin Sự Kiện & Affiliate', scope: 'Quản lý sự kiện, cập nhật sản phẩm', status: 'Active', color: 'bg-emerald-200' },
              { name: 'Quang Huy', email: 'huy@clubtrainghiem.vn', role: 'Admin Người Dùng', scope: 'Khóa tài khoản spam, xác minh TV', status: 'Review', color: 'bg-indigo-200' },
            ].map((admin, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-900 flex items-center justify-center font-black text-slate-800">
                      {admin.name[0]}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm m-0">{admin.name}</p>
                      <p className="font-semibold text-slate-500 text-xs m-0">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full border border-slate-900 font-extrabold text-xs ${admin.color} text-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]`}>
                    {admin.role}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-sm text-slate-700">{admin.scope}</td>
                <td className="py-4 px-4">
                  <span className="flex items-center gap-1.5 font-bold text-xs text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Hoạt động
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => showNotification(`✏️ Đang chỉnh sửa quyền cho ${admin.name}`)}
                      className="px-3 py-1 bg-white hover:bg-slate-900 hover:text-white text-slate-900 border border-slate-900 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      Sửa
                    </button>
                    {admin.role !== 'Super Admin Toàn Quyền' && (
                      <button 
                        onClick={() => showNotification(`⚠️ Đã thu hồi quyền Admin của ${admin.name}`)}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-300 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                      >
                        Thu hồi
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 m-0">Toàn quyền CRUD Người Dùng & Dữ Liệu</h2>
          <p className="text-sm text-slate-600 font-semibold m-0 mt-1">Thực hiện các lệnh Tạo mới (Create), Đọc (Read), Cập nhật (Update) và Xóa (Delete) mọi tài khoản và dữ liệu.</p>
        </div>
        <button 
          onClick={() => showNotification('➕ Đã mở biểu mẫu thêm mới Người dùng vào hệ thống!')}
          className="bg-emerald-600 text-white hover:bg-emerald-700 border-2 border-slate-900 px-5 py-2.5 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer w-fit"
        >
          <Plus size={18} /> Tạo người dùng (Create)
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm thành viên theo tên, email hoặc cấp bậc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#0f172a] rounded-2xl font-bold text-sm text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:border-[#c93638]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-500 bg-white px-3.5 py-2 rounded-xl border-2 border-[#0f172a]">Tổng: 1.243 TV</span>
          <span className="text-xs font-black text-[#c93638] bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-300">Quyền hạn: CRUD Tối đa</span>
        </div>
      </div>

      <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Thành viên Club</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Cấp bậc Gamification</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Ngày gia nhập</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Trạng thái</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 text-right">Toàn quyền CRUD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { id: 1, name: 'Minh Anh', email: 'minhanh@gmail.com', rank: '👑 Kim Cương VIP', date: '01/08/2026', status: 'Hoạt động', color: 'text-rose-600 bg-rose-50 border-rose-200' },
              { id: 2, name: 'Hải Đăng', email: 'dang@gmail.com', rank: '🥇 Vàng', date: '28/07/2026', status: 'Hoạt động', color: 'text-amber-700 bg-amber-50 border-amber-200' },
              { id: 3, name: 'Thanh Hà', email: 'thanhha@gmail.com', rank: '🥈 Bạc', date: '02/08/2026', status: 'Hoạt động', color: 'text-slate-700 bg-slate-100 border-slate-300' },
              { id: 4, name: 'Tài Khoản Spam', email: 'quangcao123@yahoo.com', rank: '🥉 Đồng', date: 'Hôm nay', status: 'Đã khóa răn đe', color: 'text-slate-500 bg-rose-100 border-rose-400 font-line-through' },
            ].map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-slate-900 flex items-center justify-center font-black text-indigo-900 text-sm">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm m-0">{u.name}</p>
                      <p className="font-semibold text-slate-500 text-xs m-0">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full border font-extrabold text-xs ${u.color}`}>
                    {u.rank}
                  </span>
                </td>
                <td className="py-4 px-4 font-bold text-sm text-slate-600">{u.date}</td>
                <td className="py-4 px-4">
                  <span className={`font-extrabold text-xs px-2.5 py-1 rounded-lg ${u.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button 
                      onClick={() => showNotification(`👁️ Đang đọc dữ liệu chi tiết (Read) của ${u.name}`)}
                      title="Xem (Read)" 
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                    >
                      <Eye size={15} />
                    </button>
                    <button 
                      onClick={() => showNotification(`✏️ Đang cập nhật thông tin (Update) cho ${u.name}`)}
                      title="Sửa (Update)" 
                      className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit size={15} />
                    </button>
                    <button 
                      onClick={() => showNotification(`🗑️ Đã thực thi lệnh xóa dữ liệu (Delete) với ${u.name}`)}
                      title="Xóa (Delete)" 
                      className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-300 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderConfigTab = () => (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-slate-200">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 m-0">Cấu hình hệ thống Club</h2>
        <p className="text-sm text-slate-600 font-semibold m-0 mt-1">Điều chỉnh thông số máy chủ Realtime, cổng lưu trữ Cloudinary, Affiliate và cấu hình bảo mật.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <Server className="text-amber-500" size={24} />
            <h3 className="text-lg font-black text-slate-900 m-0">Máy chủ WebSocket (Laravel Reverb)</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-black uppercase text-slate-700 block mb-1">Cổng kết nối WebSocket (Port)</label>
              <input type="text" defaultValue="8080" className="w-full px-3.5 py-2 border-2 border-[#0f172a] rounded-xl font-extrabold text-sm text-slate-900 bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-700 block mb-1">Tên Kênh Broadcast Chính (Channel)</label>
              <input type="text" defaultValue="club-live" className="w-full px-3.5 py-2 border-2 border-[#0f172a] rounded-xl font-extrabold text-sm text-slate-900 bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-700 block mb-1">Tần số duy trì kết nối (Heartbeat Interval)</label>
              <select className="w-full px-3.5 py-2 border-2 border-[#0f172a] rounded-xl font-extrabold text-sm text-slate-900 bg-white">
                <option>30 giây (Chuẩn mượt mà)</option>
                <option>15 giây (Tốc độ cao)</option>
                <option>60 giây (Tiết kiệm tài nguyên)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
            <Database className="text-indigo-600" size={24} />
            <h3 className="text-lg font-black text-slate-900 m-0">Lưu trữ Cloudinary & Media</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-black uppercase text-slate-700 block mb-1">Cloudinary Cloud Name</label>
              <input type="text" defaultValue="club-trai-nghiem-mxh" className="w-full px-3.5 py-2 border-2 border-[#0f172a] rounded-xl font-extrabold text-sm text-slate-900 bg-slate-50" />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-700 block mb-1">Chế độ tối ưu ảnh tự động</label>
              <input type="text" defaultValue="Format WebP + Auto Quality (80%)" className="w-full px-3.5 py-2 border-2 border-[#0f172a] rounded-xl font-extrabold text-sm text-slate-900 bg-slate-50" disabled />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-700 block mb-1">Giới hạn dung lượng tải lên mỗi tệp</label>
              <select className="w-full px-3.5 py-2 border-2 border-[#0f172a] rounded-xl font-extrabold text-sm text-slate-900 bg-white">
                <option>10 MB (Khuyên dùng)</option>
                <option>25 MB (Dành cho video ngắn)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-black text-slate-900 m-0 flex items-center gap-2">
              <ShieldAlert className="text-[#c93638]" size={22} /> Cấu hình quyền truy cập Super Admin
            </h4>
            <p className="text-sm font-semibold text-slate-600 m-0 mt-1">Bảo vệ bảng điều khiển tối cao bằng xác minh kép và nhật ký thời gian thực.</p>
          </div>
          <button 
            onClick={() => showNotification('💾 Đã lưu và áp dụng toàn bộ thiết lập mới cho máy chủ!')}
            className="px-6 py-3 bg-[#c93638] hover:bg-[#a82a2b] text-white rounded-2xl font-black text-sm border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
          >
            💾 Lưu cấu hình hệ thống
          </button>
        </div>
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-slate-200">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 m-0">Nhật ký hệ thống & CRUD Thời Gian Thực</h2>
        <p className="text-sm text-slate-600 font-semibold m-0 mt-1">Ghi lại toàn bộ lịch sử thao tác dữ liệu, đăng nhập, bảo mật và tương tác của Admin & Người dùng.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-slate-900 text-white font-extrabold text-xs rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(201,54,56,1)] cursor-pointer">Tất cả (3.842)</button>
        <button className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-2xl border-2 border-slate-900 cursor-pointer">Lệnh CRUD (1.420)</button>
        <button className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-2xl border-2 border-slate-900 cursor-pointer">Admin Phân Quyền (142)</button>
        <button className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-2xl border-2 border-slate-900 cursor-pointer">WebSocket Reverb (532)</button>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-6 border-3 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(201,54,56,1)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#c93638] to-amber-400 text-slate-950 font-black flex items-center justify-center text-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] shrink-0">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-black text-base text-white m-0">Better Stack (Logtail) Audit Engine</h4>
              <span className="bg-emerald-400 text-slate-950 text-[11px] px-2.5 py-0.5 rounded-md font-black border border-slate-950 shadow-xs">Active (1GB Free Tier)</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold m-0 mt-1">
              Hệ thống giám sát log quốc tế chuẩn WORM chống xóa dấu vết & tự động đồng bộ mọi thao tác CRUD.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            logAdminAction('TEST_LOGTAIL_SIGNAL', { user: 'Super Admin', ip: '127.0.0.1', target: 'Live Audit Desk' });
            api.post('/test-logtail', { user: 'Super Admin', source: 'Laravel Backend Test' }).catch(() => {});
            showNotification('⚡ Đã bắn log thực thi sang Better Stack (Logtail)! Kiểm tra Console hoặc Dashboard Better Stack.');
          }}
          className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-white text-slate-950 font-black text-xs border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-[4px_4px_0px_0px_rgba(201,54,56,1)] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] shrink-0"
        >
          🧪 Bắn Log Mẫu Sang Better Stack
        </button>
      </div>

      <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Thời gian</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Người thực hiện</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Hành động CRUD / Hệ thống</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900">Loại lệnh</th>
              <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-sm">
            {[
              { time: '16:15:02', user: 'Super Admin (Bạn)', action: 'Truy cập Bảng Quản Trị Tối Cao (Super Admin Dashboard)', type: 'AUTH_ADMIN', badge: 'bg-amber-100 text-amber-950 border-amber-400' },
              { time: '16:12:45', user: 'Thu Hà', action: 'Duyệt bài đăng #4502 trên Bảng tin cộng đồng [UPDATE]', type: 'UPDATE_POST', badge: 'bg-emerald-100 text-emerald-950 border-emerald-400' },
              { time: '15:58:11', user: 'Hải Đăng', action: 'Thêm sản phẩm Kem Chống Nắng mới vào Affiliate [CREATE]', type: 'CREATE_ITEM', badge: 'bg-indigo-100 text-indigo-950 border-indigo-400' },
              { time: '15:40:22', user: 'Quang Huy', action: 'Khóa tài khoản vi phạm spam comment #214 [DELETE/LOCK]', type: 'DELETE_USER', badge: 'bg-rose-100 text-[#c93638] border-rose-400' },
              { time: '15:30:00', user: 'System Reverb', action: 'Phát tín hiệu Realtime Notification tới 1.240 thành viên', type: 'WEBSOCKET_BROADCAST', badge: 'bg-slate-100 text-slate-900 border-slate-300' },
            ].map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-black text-slate-500 text-xs">{log.time}</td>
                <td className="py-3.5 px-4 font-extrabold text-slate-900">{log.user}</td>
                <td className="py-3.5 px-4 font-bold text-slate-700">{log.action}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-lg border font-black text-[11px] ${log.badge}`}>
                    {log.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-black text-xs text-emerald-600">
                  ✔ Thành công
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full animate-fadeIn">
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'admins' && renderAdminsTab()}
      {activeTab === 'users' && renderUsersTab()}
      {activeTab === 'config' && renderConfigTab()}
      {activeTab === 'logs' && renderLogsTab()}
    </div>
  );
};

export default SuperAdmin;
