import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, ChevronRight, Download as DownloadIcon, Star, ShieldCheck, Zap, Terminal } from 'lucide-react';

const AppleIcon = () => (
  <svg viewBox="0 0 384 512" fill="currentColor" width="100%" height="100%"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
);

const PlayStoreIcon = () => (
  <svg viewBox="0 0 512 512" fill="currentColor" width="100%" height="100%"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
);

const WindowsIcon = () => (
  <svg viewBox="0 0 448 512" fill="currentColor" width="100%" height="100%"><path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z"/></svg>
);



const AndroidIcon = () => (
  <svg viewBox="0 0 576 512" fill="currentColor" width="100%" height="100%"><path d="M420.22 166.52c-4-4.88-11.23-5.59-16.14-1.62l-40.45 32.7a188.75 188.75 0 0 0 -75.64-15.82c-27.16 0-52.92 5.61-75.64 15.82l-40.45-32.7c-4.88-3.95-12.11-3.24-16.14 1.62-3.95 4.88-3.24 12.11 1.62 16.14l39.05 31.57C133.19 253.94 92 314 92 384h392c0-70-41.19-130.06-104.38-169.75l39.05-31.57c4.86-4.04 5.57-11.27 1.55-16.16zM196 320c-13.25 0-24-10.75-24-24s10.75-24 24-24 24 10.75 24 24-10.75 24-24 24zm184 0c-13.25 0-24-10.75-24-24s10.75-24 24-24 24 10.75 24 24-10.75 24-24 24zM32 384h32v80H32c-17.67 0-32-14.33-32-32v-16c0-17.67 14.33-32 32-32zm480 0h32c17.67 0 32 14.33 32 32v16c0 17.67-14.33 32-32 32h-32v-80zM124 416h328v64H124v-64z"/></svg>
);

const PremiumCard = ({ icon: Icon, title, subtitle, color, glowColor, onClick, bgIcon }) => (
  <div 
    onClick={onClick}
    className="group relative cursor-pointer rounded-3xl bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col justify-between overflow-hidden"
    style={{ minHeight: '260px' }}
  >
    {/* Animated Background Gradient on Hover */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br ${glowColor}`} />
    
    {/* Large Background Icon (Watermark style) */}
    {bgIcon && (
      <div className="absolute -bottom-6 -right-6 w-48 h-48 text-slate-50 opacity-[0.4] group-hover:opacity-100 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">
        <Icon />
      </div>
    )}

    {/* Content */}
    <div className="relative z-10">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg bg-gradient-to-br ${glowColor}`}>
        <div className="w-8 h-8">
          <Icon />
        </div>
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium text-base leading-relaxed max-w-[85%]">{subtitle}</p>
    </div>

    {/* Action Button Area */}
    <div className="relative z-10 mt-8 flex items-center gap-3 font-bold text-sm" style={{ color }}>
      <span className="group-hover:mr-2 transition-all duration-300">Tải xuống ngay</span>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-[${color}] group-hover:text-white transition-colors duration-300`}>
        <ChevronRight size={18} />
      </div>
    </div>
  </div>
);

const Download = () => {
  const [selectedTab, setSelectedTab] = useState('mobile');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden font-sans">
      {/* Decorative Ambient Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-[120px] mix-blend-multiply pointer-events-none animate-pulse duration-10000" />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-rose-300/30 rounded-full blur-[100px] mix-blend-multiply pointer-events-none animate-pulse duration-7000 delay-1000" />
      <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-[150px] mix-blend-multiply pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-20 pb-32">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 text-sm font-bold text-slate-700">
            <Zap size={16} className="text-amber-500" />
            Trải nghiệm siêu mượt mà
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
            Mang <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">PIVO</span><br />vào thiết bị của bạn
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Sử dụng ứng dụng gốc để nhận thông báo tức thì, hiệu năng tối đa và trải nghiệm người dùng tuyệt vời nhất trên mọi nền tảng.
          </p>

          {/* Premium Toggle Switch */}
          <div className="flex bg-slate-200/50 backdrop-blur-md p-1.5 rounded-2xl mx-auto w-fit mt-12 shadow-inner">
            <button
              onClick={() => setSelectedTab('mobile')}
              className={`flex items-center gap-3 px-10 py-4 rounded-xl font-extrabold text-base transition-all duration-300 border-none cursor-pointer ${
                selectedTab === 'mobile' 
                  ? 'bg-white text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.08)] scale-100' 
                  : 'bg-transparent text-slate-500 hover:text-slate-800 scale-95 hover:scale-100'
              }`}
            >
              <Smartphone size={22} /> Di động & Máy tính bảng
            </button>
            <button
              onClick={() => setSelectedTab('pc')}
              className={`flex items-center gap-3 px-10 py-4 rounded-xl font-extrabold text-base transition-all duration-300 border-none cursor-pointer ${
                selectedTab === 'pc' 
                  ? 'bg-white text-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.08)] scale-100' 
                  : 'bg-transparent text-slate-500 hover:text-slate-800 scale-95 hover:scale-100'
              }`}
            >
              <Monitor size={22} /> Máy tính cá nhân
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto relative">
          {selectedTab === 'mobile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-12 fade-in duration-700">
              <PremiumCard
                icon={AppleIcon}
                title="App Store"
                subtitle="Được tối ưu hóa hoàn hảo cho hệ sinh thái của Apple. Yêu cầu iOS 13.0 trở lên."
                color="#000000"
                glowColor="from-slate-700 to-black"
                onClick={() => window.open('#', '_blank')}
                bgIcon={true}
              />
              <PremiumCard
                icon={PlayStoreIcon}
                title="Google Play"
                subtitle="Trải nghiệm mượt mà trên hàng triệu thiết bị Android. Yêu cầu Android 8.0 trở lên."
                color="#059669"
                glowColor="from-emerald-400 to-emerald-700"
                onClick={() => window.open('#', '_blank')}
                bgIcon={true}
              />
              <div className="md:col-span-2 mt-4">
                <div 
                  onClick={() => window.open('#', '_blank')}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-[2px] transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.4)] hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white rounded-[22px] px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                        <div className="w-8 h-8"><AndroidIcon /></div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 mb-1">Tải File APK Trực Tiếp</h4>
                        <p className="text-slate-500 font-medium">Dành cho các thiết bị Android không có sẵn Google Play Store (Huawei, Amazon Fire...)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-orange-500 bg-orange-50 px-5 py-3 rounded-full shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <DownloadIcon size={20} />
                      Tải ngay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'pc' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-12 fade-in duration-700">
              <PremiumCard
                icon={AppleIcon}
                title="macOS"
                subtitle="Tương thích hoàn toàn với chip Apple Silicon (M1/M2/M3) và Intel."
                color="#000000"
                glowColor="from-slate-700 to-black"
                onClick={() => window.open('#', '_blank')}
                bgIcon={true}
              />
              <PremiumCard
                icon={WindowsIcon}
                title="Windows"
                subtitle="Trải nghiệm mượt mà trên hệ điều hành phổ biến nhất thế giới."
                color="#2563eb"
                glowColor="from-blue-500 to-blue-700"
                onClick={() => window.open('#', '_blank')}
                bgIcon={true}
              />
              <div className="md:col-span-2">
                <div 
                  onClick={() => window.open('#', '_blank')}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-900 p-8 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                >
                  {/* Decorative mesh */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 shadow-2xl">
                        <Terminal size={40} strokeWidth={1.5} className="text-amber-400" />
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-white mb-2">Linux Distribution</h4>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">
                          Cung cấp đa dạng định dạng <span className="text-slate-200 font-bold">AppImage, .deb, .rpm</span> hỗ trợ hầu hết mọi bản phân phối Linux phổ biến như Ubuntu, Fedora, Arch.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-4 rounded-xl shrink-0 transition-colors whitespace-nowrap">
                      Khám phá các bản dựng
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Trust/Footer section */}
        <div className="mt-24 pt-12 border-t border-slate-200/50">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400 font-semibold text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" />
              100% An toàn & Bảo mật
            </div>
            <div className="flex items-center gap-2">
              <Star size={20} className="text-amber-500" />
              4.9/5 Đánh giá tích cực
            </div>
            <div className="flex items-center gap-2">
              <DownloadIcon size={20} className="text-blue-500" />
              100K+ Lượt tải xuống
            </div>
          </div>
          <p className="text-center mt-8 text-slate-400 font-medium text-sm">
            Bằng cách tải xuống, bạn đồng ý với <a href="#" className="text-slate-600 font-bold no-underline hover:underline hover:text-indigo-600 transition-colors">Điều khoản dịch vụ</a> và <a href="#" className="text-slate-600 font-bold no-underline hover:underline hover:text-indigo-600 transition-colors">Chính sách bảo mật</a> của chúng tôi.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Download;
