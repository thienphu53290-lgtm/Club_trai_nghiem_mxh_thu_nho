import React from 'react';
import { ShieldCheck, Server, Lock, Mail, Phone, MapPin, Award, Terminal, Activity } from 'lucide-react';

const AdminFooter = () => {
  return (
    <footer className="bg-white border-t-4 border-[#0f172a] text-slate-800 font-sans mt-auto py-12 px-4 sm:px-8">
      <div className="max-w-[1550px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b-2 border-slate-900/10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#c93638] text-white font-black text-xl flex items-center justify-center border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] shrink-0">
                k
              </div>
              <span className="font-black text-lg text-slate-900 uppercase tracking-tight">
                PIVO CORP
              </span>
            </div>
            <h5 className="font-black text-sm text-slate-900 m-0">
              Công Ty TNHH Công Nghệ & Trải Nghiệm Mạng Xã Hội CTN
            </h5>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed m-0">
              Giấy chứng nhận ĐKKD số: 0317829819 do Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh cấp ngày 15/05/2023.
            </p>
            <div className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
              <MapPin size={16} className="text-[#c93638] shrink-0 mt-0.5" />
              <span>Trụ sở chính: Tòa nhà CTN Tech Hub, 68 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 m-0 border-b-2 border-slate-900 pb-2">
              <Phone size={16} className="text-[#c93638]" /> Trung Tâm Điều Hành
            </h4>
            <div className="flex flex-col gap-2 text-xs font-extrabold text-slate-700">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span>Hotline Quản Trị:</span>
                <span className="text-[#c93638] font-black">1800 6868 / 0988 888 888</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span>Email Hỗ Trợ:</span>
                <span className="text-slate-900 font-black">support@pivo.vn</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span>Báo cáo Vi phạm:</span>
                <span className="text-slate-900 font-black">admin@pivo.vn</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 m-0 border-b-2 border-slate-900 pb-2">
              <Server size={16} className="text-indigo-600" /> Hạ Tầng Mạng Xã Hội
            </h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-2 text-xs font-extrabold text-slate-700">
              <li className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>WebSocket Reverb Engine</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-black border border-emerald-200">Online ⚡</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Cloudinary Media Storage</span>
                <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-black border border-indigo-200">CDN Pro</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>OneSignal Desktop Push</span>
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-black border border-amber-200">Active 🔔</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3.5">
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 m-0 border-b-2 border-slate-900 pb-2">
              <Lock size={16} className="text-emerald-600" /> Bảo Mặt & Chứng Nhận
            </h4>
            <div className="p-4 bg-slate-900 text-white rounded-2xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(201,54,56,1)] flex flex-col gap-2.5">
              <div className="flex items-center gap-2 font-black text-amber-300 text-xs">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                <span>ISO/IEC 27001:2022 Certified</span>
              </div>
              <p className="text-[11px] text-slate-300 m-0 font-semibold leading-normal">
                Hệ thống lưu trữ độc lập, mã hóa đầu cuối 256-bit AES & tự động sao lưu dữ liệu CRUD mỗi giờ.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-bold">Phiên bản lõi:</span>
                <span className="text-white font-black bg-[#c93638] px-2 py-0.5 rounded border border-slate-900">v4.2.0-PRO</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs font-extrabold text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} PIVO & Cá Nhân Hóa (CTN Corp). Bảo lưu mọi quyền quản trị tối cao.
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-300">
              <Activity size={14} className="text-emerald-600 animate-pulse" />
              <span>System Status: Healthy (99.99% Uptime)</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 border border-slate-900 font-black">
              Neo-Brutalian Design System
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
