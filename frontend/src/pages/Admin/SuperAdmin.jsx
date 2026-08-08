import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { logAdminAction } from '../../api/logtail';
import api from '../../api/axios';
import { 
  ShieldCheck, LayoutDashboard, Users, UserCheck, Settings, 
  Activity, DollarSign, ArrowUpRight, CheckCircle2, AlertCircle, 
  Server, Database, LogOut, Home, ChevronRight, Search, Filter, 
  MoreVertical, MoreHorizontal, Plus, FileText, Layers, RefreshCw, 
  Sparkles, Trash2, Edit, Eye, ShieldAlert, Menu, Sliders, Calendar, BarChart3, TrendingUp, X, ChevronsLeft, Lock, Unlock
} from 'lucide-react';

const SuperAdmin = () => {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, showNotification } = useOutletContext();
  const [revenuePeriod, setRevenuePeriod] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [stats, setStats] = useState({
    total_affiliate_revenue: 0,
    total_members: 0,
    new_members_this_week: 0,
    crud_operations_24h: 0,
    chart_data: [],
    recent_logs: []
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const [sysLogs, setSysLogs] = useState([]);
  const [logCounts, setLogCounts] = useState({ total: 0, crud: 0, auth: 0, system: 0 });
  const [logFilter, setLogFilter] = useState('ALL');
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Admin Management States
  const [adminList, setAdminList] = useState([]);
  const [adminRoles, setAdminRoles] = useState([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [adminFormData, setAdminFormData] = useState({ id: null, email: '', vai_tro_id: 2 });
  
  // Role Management States
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isEditRoleMode, setIsEditRoleMode] = useState(false);
  const [roleFormData, setRoleFormData] = useState({ id: null, ten: '', mo_ta: '' });
  const [isSavingRole, setIsSavingRole] = useState(false);

  // User Management States
  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userFormData, setUserFormData] = useState({ email: '', ho_ten: '', mat_khau: '' });
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteUserEmail, setPromoteUserEmail] = useState('');
  const [promoteRoleId, setPromoteRoleId] = useState(2);

  const fetchUsers = async (search = '') => {
    setIsLoadingUsers(true);
    try {
      const res = await api.get(`/admin/users?search=${search}`);
      if (res.data.status === 'success') {
        setUsersList(res.data.data.data); // data.data because of pagination
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      const fetchStats = async () => {
        setIsLoadingStats(true);
        try {
          const res = await api.get(`/admin/dashboard-stats?period=${revenuePeriod}`);
          if (res.data.status === 'success') {
            setStats(res.data.data);
          }
        } catch (error) {
          console.error("Error fetching admin stats:", error);
        } finally {
          setIsLoadingStats(false);
        }
      };
      fetchStats();
    } else if (activeTab === 'logs') {
      const fetchLogs = async () => {
        setIsLoadingLogs(true);
        try {
          const res = await api.get('/admin/logs');
          if (res.data.status === 'success') {
            setSysLogs(res.data.data.logs);
            setLogCounts(res.data.data.counts);
          }
        } catch (error) {
          console.error("Error fetching logs:", error);
        } finally {
          setIsLoadingLogs(false);
        }
      };
      fetchLogs();
    } else if (activeTab === 'admins') {
      const fetchAdmins = async () => {
        setIsLoadingAdmins(true);
        try {
          const [resAdmins, resRoles] = await Promise.all([
            api.get('/admin/admins'),
            api.get('/admin/roles')
          ]);
          if (resAdmins.data.status === 'success') setAdminList(resAdmins.data.data);
          if (resRoles.data.status === 'success') setAdminRoles(resRoles.data.data);
        } catch (error) {
          console.error("Error fetching admins:", error);
        } finally {
          setIsLoadingAdmins(false);
        }
      };
      fetchAdmins();
    } else if (activeTab === 'users') {
      fetchUsers(searchQuery);
      // Also fetch roles for the promote modal if not already fetched
      if (adminRoles.length === 0) {
        api.get('/admin/roles').then(res => {
          if (res.data.status === 'success') setAdminRoles(res.data.data);
        }).catch(err => console.error(err));
      }
    }
  }, [activeTab, revenuePeriod]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
  };

  const getChartData = () => {
    if (stats.chart_data && stats.chart_data.length > 0) {
      return stats.chart_data;
    }
    return [];
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

      <div className={`h-64 sm:h-72 flex items-end justify-between gap-2 sm:gap-4 pt-8 px-2 pb-2 border-b border-slate-200 overflow-x-auto ${isLoadingStats ? 'opacity-50 blur-[2px] animate-pulse' : ''}`}>
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
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              {isLoadingStats ? '...' : `${Number(stats.total_affiliate_revenue).toLocaleString('vi-VN')}đ`}
            </span>
          </div>
          <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
            <span>↑ +18.2%</span> <span className="text-slate-500 font-semibold">so với tuần trước</span>
          </p>
        </div>

        <div className="bg-white border-2 border-[#0f172a] rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] transition-all">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">THÀNH VIÊN CLUB</p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoadingStats ? '...' : Number(stats.total_members).toLocaleString('vi-VN')}
            </span>
          </div>
          <p className="text-xs font-bold text-indigo-600 mt-2">
            +{isLoadingStats ? '...' : stats.new_members_this_week} thành viên tuần này
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
            {isLoadingStats ? (
              <span className="text-3xl font-black text-slate-400 tracking-tight">...</span>
            ) : stats?.reverb_status === 'online' ? (
              <span className="text-3xl font-black text-amber-500 tracking-tight">Ổn định ⚡</span>
            ) : (
              <span className="text-3xl font-black text-rose-500 tracking-tight">Mất kết nối ❌</span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-600 mt-2">
            {isLoadingStats ? 'Đang kiểm tra...' : `Cổng ${stats?.reverb_port || 8080} kết nối ${stats?.reverb_status === 'online' ? 'mượt' : 'thất bại'}`}
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
          <div className={`space-y-4 ${isLoadingStats ? 'opacity-50 blur-[2px] animate-pulse' : ''}`}>
            {(stats.recent_logs && stats.recent_logs.length > 0 ? stats.recent_logs : []).map((item, idx) => (
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
            {(!stats.recent_logs || stats.recent_logs.length === 0) && (
              <p className="text-sm text-slate-500 font-bold text-center py-4">Chưa có nhật ký nào.</p>
            )}
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
                  {isLoadingStats ? '...' : stats.crud_operations_24h}
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

  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const res = await api.put(`/admin/admins/${adminFormData.id}`, { vai_tro_id: adminFormData.vai_tro_id });
        if (res.data.status === 'success') {
          showNotification('✅ ' + res.data.message);
          setAdminList(adminList.map(a => a.id === adminFormData.id ? { ...a, vai_tro_id: adminFormData.vai_tro_id, role: adminRoles.find(r => r.id == adminFormData.vai_tro_id)?.ten, scope: adminRoles.find(r => r.id == adminFormData.vai_tro_id)?.mo_ta } : a));
          setShowAdminModal(false);
        }
      } else {
        const res = await api.post('/admin/admins', { email: adminFormData.email, vai_tro_id: adminFormData.vai_tro_id });
        if (res.data.status === 'success') {
          showNotification('✅ ' + res.data.message);
          const refetch = await api.get('/admin/admins');
          setAdminList(refetch.data.data);
          setShowAdminModal(false);
        }
      }
    } catch (err) {
      showNotification('❌ Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRevokeAdmin = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn thu hồi quyền Admin của ${name}?`)) return;
    try {
      const res = await api.delete(`/admin/admins/${id}/revoke`);
      if (res.data.status === 'success') {
        showNotification('✅ ' + res.data.message);
        setAdminList(adminList.filter(a => a.id !== id));
      }
    } catch (err) {
      showNotification('❌ Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsSavingUser(true);
    try {
      const res = await api.post('/admin/users', userFormData);
      if (res.data.status === 'success') {
        showNotification('✅ ' + res.data.message);
        setShowUserModal(false);
        setUserFormData({ email: '', ho_ten: '', mat_khau: '' });
        fetchUsers(searchQuery);
      }
    } catch (err) {
      showNotification('❌ Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleToggleUserStatus = async (id, currentStatus) => {
    try {
      const res = await api.put(`/admin/users/${id}/status`);
      if (res.data.status === 'success') {
        showNotification('✅ ' + res.data.message);
        fetchUsers(searchQuery);
      }
    } catch (err) {
      showNotification('❌ Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN người dùng ${name}? Hành động này không thể hoàn tác.`)) return;
    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.data.status === 'success') {
        showNotification('✅ ' + res.data.message);
        fetchUsers(searchQuery);
      }
    } catch (err) {
      showNotification('❌ Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePromoteUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/admins', {
        email: promoteUserEmail,
        vai_tro_id: promoteRoleId
      });
      if (res.data.status === 'success') {
        showNotification('✅ ' + res.data.message);
        setShowPromoteModal(false);
        fetchUsers(searchQuery);
        // also fetch admins so the admins tab is updated
        api.get('/admin/admins').then(r => setAdminList(r.data.data));
      }
    } catch (err) {
      showNotification('❌ Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    setIsSavingRole(true);
    try {
      if (isEditRoleMode) {
        const res = await api.put(`/admin/roles/${roleFormData.id}`, { ten: roleFormData.ten, mo_ta: roleFormData.mo_ta });
        if (res.data.status === 'success') {
          showNotification('✅ ' + res.data.message);
          const refetchRoles = await api.get('/admin/roles');
          setAdminRoles(refetchRoles.data.data);
          setIsEditRoleMode(false);
          setRoleFormData({ id: null, ten: '', mo_ta: '' });
        }
      } else {
        const res = await api.post('/admin/roles', { ten: roleFormData.ten, mo_ta: roleFormData.mo_ta });
        if (res.data.status === 'success') {
          showNotification('✅ ' + res.data.message);
          const refetchRoles = await api.get('/admin/roles');
          setAdminRoles(refetchRoles.data.data);
          setRoleFormData({ id: null, ten: '', mo_ta: '' });
        }
      }
    } catch (err) {
      showNotification('❌ Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleDeleteRole = async (id, ten) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa quyền "${ten}"? Các admin đang mang quyền này sẽ bị giáng cấp về Người dùng bình thường.`)) return;
    try {
      const res = await api.delete(`/admin/roles/${id}`);
      if (res.data.status === 'success') {
        showNotification('✅ ' + res.data.message);
        const refetchRoles = await api.get('/admin/roles');
        setAdminRoles(refetchRoles.data.data);
        const refetchAdmins = await api.get('/admin/admins');
        setAdminList(refetchAdmins.data.data);
      }
    } catch (err) {
      showNotification('❌ Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const renderAdminsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 m-0">Quản lý đội ngũ Admin</h2>
          <p className="text-sm text-slate-600 font-semibold m-0 mt-1">Phân quyền Super Admin, cấp hoặc thu hồi quyền truy cập quản trị viên.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIsEditRoleMode(false);
              setRoleFormData({ id: null, ten: '', mo_ta: '' });
              setShowRoleModal(true);
            }}
            className="bg-slate-900 text-white hover:bg-slate-800 border-2 border-[#0f172a] px-5 py-2.5 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(201,54,56,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer w-fit"
          >
            <Settings size={18} className="text-rose-500" /> Quản lý Quyền
          </button>
          <button 
            onClick={() => {
              setIsEditMode(false);
              setAdminFormData({ id: null, email: '', vai_tro_id: 2 });
              setShowAdminModal(true);
            }}
            className="bg-[#c93638] text-white hover:bg-[#b02e30] border-2 border-slate-900 px-5 py-2.5 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer w-fit"
          >
            <Plus size={18} /> Thêm Admin mới
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-[#0f172a] rounded-3xl shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar overflow-x-auto p-6 pt-0">
          <table className="w-full text-left border-collapse mt-6">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 sticky top-0 bg-white z-10 shadow-[0_2px_0_#0f172a]">Thành viên</th>
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 sticky top-0 bg-white z-10 shadow-[0_2px_0_#0f172a]">Vai trò</th>
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 sticky top-0 bg-white z-10 shadow-[0_2px_0_#0f172a]">Phạm vi quyền</th>
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 sticky top-0 bg-white z-10 shadow-[0_2px_0_#0f172a]">Trạng thái</th>
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 text-right sticky top-0 bg-white z-10 shadow-[0_2px_0_#0f172a]">Thao tác</th>
              </tr>
            </thead>
          <tbody className={`divide-y divide-slate-100 ${isLoadingAdmins ? 'opacity-50 blur-[2px] animate-pulse' : ''}`}>
            {adminList.length > 0 ? (
              adminList.map((admin, index) => (
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
                      {admin.status_text}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setIsEditMode(true);
                          setAdminFormData({ id: admin.id, email: admin.email, vai_tro_id: admin.vai_tro_id });
                          setShowAdminModal(true);
                        }}
                        className="px-3 py-1 bg-white hover:bg-slate-900 hover:text-white text-slate-900 border border-slate-900 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                      >
                        Sửa
                      </button>
                      {admin.vai_tro_id !== 3 && (
                        <button 
                          onClick={() => handleRevokeAdmin(admin.id, admin.name)}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-300 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                        >
                          Thu hồi
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500 font-bold">Chưa có quản trị viên nào.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal Add Role */}
      {showRoleModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div onClick={() => setShowRoleModal(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fadeIn" />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl border-4 border-[#0f172a] shadow-[12px_12px_0px_0px_rgba(201,54,56,1)] overflow-hidden animate-slideUp flex flex-col max-h-[90vh]">
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(201,54,56,1)]">
                  <Settings size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 m-0 tracking-tight">Quản lý Vai trò (Roles)</h3>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-xl hover:bg-slate-200">
                <X size={20} className="stroke-[3]" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Form Add/Edit */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                  <Plus size={16} className="text-rose-500" /> {isEditRoleMode ? 'Chỉnh sửa Quyền' : 'Thêm Quyền Mới'}
                </h4>
                <form onSubmit={handleSaveRole} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">Tên Quyền / Vai trò</label>
                    <input 
                      type="text" 
                      value={roleFormData.ten}
                      onChange={(e) => setRoleFormData({...roleFormData, ten: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 focus:border-[#c93638] focus:bg-white outline-none font-bold text-sm transition-all"
                      placeholder="VD: Admin Hỗ Trợ, Mod..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">Phạm vi quyền hạn (Mô tả)</label>
                    <textarea 
                      value={roleFormData.mo_ta}
                      onChange={(e) => setRoleFormData({...roleFormData, mo_ta: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 focus:border-[#c93638] focus:bg-white outline-none font-semibold text-sm transition-all min-h-[60px] resize-none"
                      placeholder="VD: Chăm sóc khách hàng..."
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    {isEditRoleMode && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsEditRoleMode(false);
                          setRoleFormData({ id: null, ten: '', mo_ta: '' });
                        }} 
                        className="px-4 py-2.5 rounded-xl font-bold text-xs border-2 border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Hủy
                      </button>
                    )}
                    <button type="submit" disabled={isSavingRole} className={`flex-1 py-2.5 rounded-xl font-black text-xs border-2 border-[#0f172a] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all ${isSavingRole ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#c93638] text-white hover:bg-[#a82527] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer'}`}>
                      {isSavingRole ? 'Đang lưu...' : (isEditRoleMode ? 'Lưu Thay Đổi' : 'Thêm Quyền')}
                    </button>
                  </div>
                </form>
              </div>

              {/* Role List */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-3">Danh sách Quyền đang có:</h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {adminRoles.map((role) => (
                    <div key={role.id} className="p-4 rounded-xl border-2 border-slate-100 hover:border-slate-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-sm text-slate-900">{role.ten}</span>
                          {(role.id === 2 || role.id === 3) && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">Hệ thống</span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-500 m-0">{role.mo_ta}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {role.id !== 1 && role.id !== 3 && (
                          <>
                            <button 
                              onClick={() => {
                                setIsEditRoleMode(true);
                                setRoleFormData({ id: role.id, ten: role.ten, mo_ta: role.mo_ta });
                              }}
                              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 border border-slate-200 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                            >
                              Sửa
                            </button>
                            <button 
                              onClick={() => handleDeleteRole(role.id, role.ten)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                            >
                              Xóa
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Admin */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div onClick={() => setShowAdminModal(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fadeIn" />
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 m-0">
                {isEditMode ? 'Chỉnh sửa Quyền Admin' : 'Thêm Admin Mới'}
              </h3>
              <button onClick={() => setShowAdminModal(false)} className="text-slate-400 hover:text-slate-900">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveAdmin} className="space-y-4">
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email người dùng</label>
                  <input
                    type="email"
                    required
                    value={adminFormData.email}
                    onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                    placeholder="Nhập email tài khoản cần cấp quyền..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-none font-semibold text-slate-900"
                  />
                  <p className="text-xs text-slate-500 mt-1 font-medium">Người dùng phải có tài khoản trước khi được cấp quyền.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Chức danh / Phạm vi quyền</label>
                <select
                  value={adminFormData.vai_tro_id}
                  onChange={(e) => setAdminFormData({...adminFormData, vai_tro_id: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-none font-bold text-slate-900 appearance-none bg-slate-50"
                >
                  {adminRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.ten}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-black text-white bg-[#c93638] hover:bg-[#b02e30] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900 active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                >
                  {isEditMode ? 'Lưu thay đổi' : 'Cấp quyền Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
            placeholder="Tìm kiếm thành viên theo tên, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers(searchQuery)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#0f172a] rounded-2xl font-bold text-sm text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:border-[#c93638]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-500 bg-white px-3.5 py-2 rounded-xl border-2 border-[#0f172a]">Hiển thị: {usersList.length} TV</span>
          <span className="text-xs font-black text-[#c93638] bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-300">Quyền hạn: CRUD Tối đa</span>
        </div>
      </div>

      <div className="bg-white border-2 border-[#0f172a] rounded-3xl shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto custom-scrollbar overflow-x-auto p-6 pt-0">
          <table className="w-full text-left border-collapse mt-6">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 sticky top-0 bg-white z-10 shadow-[0_2px_0_#0f172a]">Thành viên Club</th>
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 sticky top-0 bg-white z-10 shadow-[0_2px_0_#0f172a]">Cấp bậc Gamification</th>
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 sticky top-0 bg-white z-10 shadow-[0_2px_0_#0f172a]">Ngày tham gia</th>
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 sticky top-0 bg-white z-10 shadow-[0_2px_0_#0f172a]">Trạng thái</th>
                <th className="py-3 px-4 text-xs font-black uppercase tracking-wider text-slate-900 text-right sticky top-0 bg-white z-10 shadow-[0_2px_0_#0f172a]">Thao tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-slate-100 ${isLoadingUsers ? 'opacity-50 blur-[2px] animate-pulse' : ''}`}>
              {usersList.length > 0 ? (
                usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-slate-900 flex items-center justify-center font-black text-indigo-900 text-sm">
                          {u.ho_ten ? u.ho_ten[0] : 'U'}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm m-0 flex items-center gap-2">
                            {u.ho_ten}
                            {u.vai_tro_id > 1 && (
                              <ShieldCheck size={14} className="text-rose-500" title="Đã là Admin" />
                            )}
                          </p>
                          <p className="font-semibold text-slate-500 text-xs m-0">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full border font-extrabold text-xs text-amber-700 bg-amber-50 border-amber-200`}>
                        {u.cap_bac_hien_thi || 'Thành Viên Mới'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-sm text-slate-600">
                      {new Date(u.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-extrabold text-xs px-2.5 py-1 rounded-lg ${u.trang_thai === 1 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
                        {u.trang_thai === 1 ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.vai_tro_id === 1 && (
                          <button 
                            onClick={() => {
                              setPromoteUserEmail(u.email);
                              setShowPromoteModal(true);
                            }}
                            title="Nâng lên Admin" 
                            className="p-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 border border-indigo-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
                          >
                            <ShieldCheck size={15} /> <span>Nâng Admin</span>
                          </button>
                        )}
                        <button 
                          onClick={() => handleToggleUserStatus(u.id, u.trang_thai)}
                          title={u.trang_thai === 1 ? "Khóa tài khoản" : "Mở khóa"} 
                          className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-xl transition-colors cursor-pointer"
                        >
                          {u.trang_thai === 1 ? <Lock size={15} /> : <Unlock size={15} />}
                        </button>
                        {u.vai_tro_id !== 3 && (
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.ho_ten)}
                            title="Xóa vĩnh viễn" 
                            className="p-2 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-300 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 font-bold">Không tìm thấy người dùng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add User */}
      {showUserModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div onClick={() => setShowUserModal(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fadeIn" />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border-4 border-[#0f172a] shadow-[12px_12px_0px_0px_rgba(201,54,56,1)] overflow-hidden animate-slideUp">
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(201,54,56,1)]">
                  <Plus size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 m-0 tracking-tight">Thêm Người Dùng</h3>
              </div>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-xl hover:bg-slate-200">
                <X size={20} className="stroke-[3]" />
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="space-y-4 p-6">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Họ Tên</label>
                <input 
                  type="text" 
                  value={userFormData.ho_ten}
                  onChange={(e) => setUserFormData({...userFormData, ho_ten: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-[#c93638] focus:bg-white outline-none font-bold text-sm transition-all"
                  placeholder="Nhập họ tên"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" 
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-[#c93638] focus:bg-white outline-none font-bold text-sm transition-all"
                  placeholder="Nhập email"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Mật khẩu ban đầu</label>
                <input 
                  type="password" 
                  value={userFormData.mat_khau}
                  onChange={(e) => setUserFormData({...userFormData, mat_khau: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-[#c93638] focus:bg-white outline-none font-bold text-sm transition-all"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSavingUser} className={`w-full py-3.5 rounded-2xl font-black text-sm border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(23,23,42,1)] transition-all ${isSavingUser ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer'}`}>
                  {isSavingUser ? 'Đang lưu...' : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Promote User */}
      {showPromoteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div onClick={() => setShowPromoteModal(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fadeIn" />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border-4 border-[#0f172a] shadow-[12px_12px_0px_0px_rgba(201,54,56,1)] overflow-hidden animate-slideUp">
            <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white font-black flex items-center justify-center text-lg border-2 border-indigo-900 shadow-[2px_2px_0px_0px_rgba(79,70,229,1)]">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 m-0 tracking-tight">Nâng Quyền Admin</h3>
              </div>
              <button onClick={() => setShowPromoteModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-xl hover:bg-slate-200">
                <X size={20} className="stroke-[3]" />
              </button>
            </div>
            
            <form onSubmit={handlePromoteUser} className="space-y-4 p-6">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Thành viên</label>
                <input 
                  type="email" 
                  value={promoteUserEmail}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 border-2 border-slate-200 outline-none font-bold text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Chọn Vai Trò Admin</label>
                <select 
                  value={promoteRoleId}
                  onChange={(e) => setPromoteRoleId(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-[#4f46e5] focus:bg-white outline-none font-bold text-sm transition-all appearance-none cursor-pointer"
                  required
                >
                  {adminRoles.filter(r => r.id !== 1 && r.id !== 3).map(role => (
                    <option key={role.id} value={role.id}>{role.ten} ({role.mo_ta})</option>
                  ))}
                </select>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-3.5 rounded-2xl font-black text-sm border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(23,23,42,1)] transition-all bg-indigo-600 text-white hover:bg-indigo-700 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer flex justify-center items-center gap-2">
                  <ShieldCheck size={18} /> Xác Nhận Nâng Quyền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
        <button onClick={() => setLogFilter('ALL')} className={`px-4 py-2 font-bold text-xs rounded-2xl border-2 border-slate-900 cursor-pointer ${logFilter === 'ALL' ? 'bg-slate-900 text-white font-extrabold shadow-[2px_2px_0px_0px_rgba(201,54,56,1)]' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>Tất cả ({logCounts.total})</button>
        <button onClick={() => setLogFilter('CRUD')} className={`px-4 py-2 font-bold text-xs rounded-2xl border-2 border-slate-900 cursor-pointer ${logFilter === 'CRUD' ? 'bg-slate-900 text-white font-extrabold shadow-[2px_2px_0px_0px_rgba(201,54,56,1)]' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>Lệnh CRUD ({logCounts.crud})</button>
        <button onClick={() => setLogFilter('AUTH')} className={`px-4 py-2 font-bold text-xs rounded-2xl border-2 border-slate-900 cursor-pointer ${logFilter === 'AUTH' ? 'bg-slate-900 text-white font-extrabold shadow-[2px_2px_0px_0px_rgba(201,54,56,1)]' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>Admin Phân Quyền ({logCounts.auth})</button>
        <button onClick={() => setLogFilter('SYSTEM')} className={`px-4 py-2 font-bold text-xs rounded-2xl border-2 border-slate-900 cursor-pointer ${logFilter === 'SYSTEM' ? 'bg-slate-900 text-white font-extrabold shadow-[2px_2px_0px_0px_rgba(201,54,56,1)]' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>Hệ thống ({logCounts.system})</button>
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
          <tbody className={`divide-y divide-slate-100 font-medium text-sm ${isLoadingLogs ? 'opacity-50 blur-[2px] animate-pulse' : ''}`}>
            {sysLogs.length > 0 ? (
              sysLogs.filter(log => {
                if (logFilter === 'ALL') return true;
                if (logFilter === 'CRUD') return ['CREATE_ITEM', 'UPDATE_USER', 'MESSAGE'].includes(log.type);
                if (logFilter === 'AUTH') return log.type === 'AUTH' || log.type === 'AUTH_ADMIN';
                if (logFilter === 'SYSTEM') return log.type === 'SYSTEM';
                return true;
              }).map((log, idx) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500 font-bold">
                  {isLoadingLogs ? 'Đang tải dữ liệu nhật ký...' : 'Chưa có nhật ký hệ thống nào.'}
                </td>
              </tr>
            )}
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
