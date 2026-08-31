import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  Sparkles, 
  Users, 
  Award, 
  Navigation, 
  Target, 
  Heart, 
  Globe, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpeningHours = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentMinute = hour * 60 + minute;

      if (day === 0) {
        setIsOpen(false);
      } else if (day >= 1 && day <= 5) {
        const start = 8 * 60 + 30;
        const end = 18 * 60;
        setIsOpen(currentMinute >= start && currentMinute <= end);
      } else if (day === 6) {
        const start = 8 * 60 + 30;
        const end = 12 * 60;
        setIsOpen(currentMinute >= start && currentMinute <= end);
      }
    };

    checkOpeningHours();
    const interval = setInterval(checkOpeningHours, 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: <Users size={28} className="text-[#c93638]" />, value: "50,000+", label: "Thành viên Club tích cực", desc: "Cộng đồng năng động khắp cả nước" },
    { icon: <Sparkles size={28} className="text-amber-500" />, value: "250,000+", label: "Lượt tương tác / tháng", desc: "Bài đánh giá, bình luận chân thực" },
    { icon: <Globe size={28} className="text-blue-600" />, value: "0.05s", label: "Tốc độ Realtime", desc: "Pushtech qua WebSocket Reverb" },
    { icon: <Award size={28} className="text-emerald-600" />, value: "99.8%", label: "Độ hài lòng & Tin cậy", desc: "Môi trường giao tiếp an toàn 100%" }
  ];

  const coreValues = [
    {
      title: "Chân Thực & Minh Bạch",
      desc: "Mọi trải nghiệm, lời khen hay góp ý tại Club đều xuất phát từ trải nghiệm thực tế. Nói không với review ảo và tin giả.",
      color: "bg-[#fff5f5] border-[#fcebeb] text-[#c93638]",
      icon: <CheckCircle2 size={24} className="text-[#c93638]" />
    },
    {
      title: "Kết Nối Đa Chiều",
      desc: "Không gian mở giúp người dùng từ khắp mọi miền dễ dàng nhắn tin trò chuyện, theo dõi và lan tỏa lối sống tích cực.",
      color: "bg-[#eff6ff] border-[#dbeafe] text-blue-700",
      icon: <Heart size={24} className="text-blue-600" />
    },
    {
      title: "Đổi Mới Tức Thời (Realtime)",
      desc: "Ứng dụng công nghệ hiện đại bậc nhất như Laravel Reverb WebSocket và OneSignal Push để kết nối nhịp nhàng lập tức.",
      color: "bg-[#fef3c7] border-[#fde68a] text-amber-800",
      icon: <Sparkles size={24} className="text-amber-600" />
    },
    {
      title: "Bảo Đảm & Uy Tín",
      desc: "Hệ thống bảo mật tối đa với mã hóa Sanctum an toàn, danh tính minh bạch cùng cơ chế phân loại Cấp Bậc rõ ràng.",
      color: "bg-[#ecfdf5] border-[#d1fae5] text-emerald-800",
      icon: <Shield size={24} className="text-emerald-600" />
    }
  ];

  return (
    <div className="max-w-[1280px] mx-auto py-8 px-4 sm:px-6 flex flex-col gap-12 text-slate-800 animate-in fade-in duration-300">
      <div className="bg-gradient-to-r from-[#fff5f5] via-white to-[#fff0f0] text-slate-900 p-8 sm:p-14 rounded-[36px] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(201,54,56,1)] relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#c93638]/5 blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#fff5f5] text-[#c93638] font-black text-xs uppercase px-3.5 py-1.5 rounded-full border-2 border-[#0f172a] mb-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <Sparkles size={14} className="animate-spin text-[#c93638]" />
            <span>Về chúng tôi & Trụ sở công ty</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 mb-6 leading-tight">
            CÔNG TY CỔ PHẦN TRẢI NGHIỆM <br className="hidden sm:inline" />
            <span className="text-[#c93638]">MẠNG XÃ HỘI THU NHỎ</span>
          </h1>
          <p className="text-slate-600 font-semibold text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
            Chào mừng bạn đến với <strong className="text-slate-950 font-black">PIVO</strong> — nền tảng mạng xã hội thu nhỏ tiên phong tại Việt Nam, kết hợp mượt mà giữa tương tác theo thời gian thực và không gian giao tiếp chất lượng cao cho cộng đồng hiện đại.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => navigate('/feed')}
              className="bg-[#c93638] hover:bg-[#a7282a] text-white font-black px-7 py-4 rounded-2xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base hover:translate-x-0.5 hover:-translate-y-0.5"
            >
              <span>Khám Phá Bảng Tin Ngay</span>
              <ArrowRight size={18} />
            </button>
            <a 
              href="#ban-do-cty" 
              className="bg-white hover:bg-slate-50 text-slate-900 font-black px-6 py-4 rounded-2xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center gap-2 no-underline text-sm sm:text-base hover:translate-x-0.5 hover:-translate-y-0.5"
            >
              <Navigation size={18} className="text-[#c93638]" />
              <span>Xem Bản Đồ Trụ Sở</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((st, i) => (
          <div 
            key={i} 
            className="p-6 rounded-[28px] bg-white border-2 border-[#0f172a] shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-[#0f172a] flex items-center justify-center shadow-xs">
                {st.icon}
              </span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white animate-pulse"></span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-950 m-0 tracking-tight">{st.value}</h3>
              <p className="font-extrabold text-sm text-[#c93638] mt-1 mb-2">{st.label}</p>
              <p className="text-xs font-semibold text-slate-500 m-0">{st.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex lg:grid lg:grid-cols-2 gap-5 sm:gap-8 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory lg:snap-none [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
        <div className="w-[300px] sm:w-[400px] lg:w-auto shrink-0 snap-center p-6 sm:p-8 rounded-[32px] bg-[#eff6ff] text-slate-900 border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black mb-6 border-2 border-[#0f172a] shadow-xs">
              <Target size={28} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-4">Sứ Mệnh Của PIVO</h2>
            <p className="text-slate-700 font-medium leading-relaxed text-base">
              Sứ mệnh cao nhất của chúng tôi là xóa bỏ sự vô danh và rời rạc của các mạng xã hội truyền thống, trao quyền cho mỗi cá nhân tự do chia sẻ đánh giá thực tế. Chúng tôi muốn biến mỗi bài viết, mỗi tấm ảnh hay dòng tin nhắn trở thành một cầu nối bền chặt giữa những con người chung niềm đam mê trải nghiệm cuộc sống.
            </p>
          </div>
          <div className="mt-8 pt-6 border-t-2 border-blue-200 flex items-center gap-3 text-[0.65rem] sm:text-xs font-black text-blue-800">
            <Shield className="text-blue-600 shrink-0" size={18} />
            <span>Cam kết minh bạch thông tin &amp; bảo mật tuyệt đối 100% cho cộng đồng.</span>
          </div>
        </div>

        <div className="w-[300px] sm:w-[400px] lg:w-auto shrink-0 snap-center p-6 sm:p-8 rounded-[32px] bg-[#fff5f5] text-slate-900 border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(201,54,56,1)] relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#c93638] text-white flex items-center justify-center font-black mb-6 border-2 border-[#0f172a] shadow-xs">
              <Globe size={28} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-4">Tầm Nhìn 2030</h2>
            <p className="text-slate-700 font-medium leading-relaxed text-base">
              Hướng tới năm 2030, <strong className="text-[#c93638] font-black">PIVO</strong> đặt mục tiêu trở thành mạng xã hội chia sẻ trải nghiệm cá nhân hóa vững mạnh nhất Đông Nam Á. Chúng tôi liên tục mở rộng hệ thống Cấp Bậc (Gamification), tích hợp các giải pháp truyền tải dữ liệu siêu nhanh và kiến tạo một Không Gian Số Độc Quyền cho mọi thành viên uy tín.
            </p>
          </div>
          <div className="mt-8 pt-6 border-t-2 border-[#fcebeb] flex items-center gap-3 text-[0.65rem] sm:text-xs font-black text-[#c93638]">
            <Sparkles size={18} className="shrink-0" />
            <span>Nơi mỗi thành viên là một "Đại sứ trải nghiệm" thực thụ.</span>
          </div>
        </div>
      </div>

      <div>
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-3 uppercase tracking-tight">
            Giá Trị <span className="text-[#c93638]">Cốt Lõi</span>
          </h2>
          <p className="text-slate-500 font-semibold text-sm sm:text-base">
            Bốn nền tảng kiên cố giúp PIVO không ngừng lớn mạnh và nhận được niềm tin tuyệt đối từ cộng đồng.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coreValues.map((val, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-[28px] border-2 border-[#0f172a] shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-1 ${val.color}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#0f172a] flex items-center justify-center mb-5 shadow-xs">
                {val.icon}
              </div>
              <h4 className="font-black text-lg text-slate-950 mb-2">{val.title}</h4>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed m-0">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="ban-do-cty" className="pt-4">
        <div className="bg-[#fff5f5] text-[#c93638] rounded-3xl px-6 py-3.5 border-2 border-[#0f172a] inline-flex items-center gap-2.5 mb-6 shadow-[4px_4px_0px_0px_rgba(201,54,56,1)]">
          <MapPin className="text-[#c93638] animate-bounce" size={20} />
          <span className="font-black text-sm sm:text-base uppercase tracking-wider">Thông tin Doanh Nghiệp &amp; Bản Đồ Ghim Trụ Sở</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 bg-white border-4 border-[#0f172a] rounded-[32px] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 pb-5 border-b-2 border-slate-100 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#c93638] text-white font-extrabold text-xl flex items-center justify-center border-2 border-[#0f172a] shadow-xs shrink-0">
                  C
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-950 m-0">PIVO</h3>
                  <span className="text-xs font-extrabold text-slate-400">Mạng Xã Hội Thu Nhỏ</span>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#fcebeb] border-2 border-[#0f172a] text-[#c93638] flex items-center justify-center shrink-0 font-bold mt-0.5 shadow-2xs">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wide">Đơn vị chủ quản</span>
                    <p className="font-black text-sm text-slate-900 m-0 mt-0.5">CÔNG TY CỔ PHẦN TRẢI NGHIỆM MXH THU NHỎ</p>
                    <span className="text-xs font-semibold text-[#c93638] mt-1 inline-block">Mã số thuế: 0317654321</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#fcebeb] border-2 border-[#0f172a] text-[#c93638] flex items-center justify-center shrink-0 font-bold mt-0.5 shadow-2xs">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wide">Trụ sở chính</span>
                    <p className="font-bold text-sm text-slate-800 m-0 mt-0.5 leading-snug">
                      65 Huỳnh Thúc Khang, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh (Trường Cao đẳng Kỹ thuật Cao Thắng)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border-2 border-[#0f172a] text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5 shadow-2xs">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wide">Hotline Hỗ Trợ 24/7</span>
                    <p className="font-black text-base text-slate-900 m-0 mt-0.5">1900 6868 <span className="text-xs text-slate-400 font-semibold">(Miễn phí cước)</span></p>
                    <p className="text-xs font-bold text-slate-600 m-0 mt-0.5">(028) 3868 6868</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-[#0f172a] text-blue-700 flex items-center justify-center shrink-0 font-bold mt-0.5 shadow-2xs">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wide">Email Liên Hệ</span>
                    <p className="font-extrabold text-sm text-blue-700 m-0 mt-0.5">partner@pivo.vn</p>
                    <p className="text-xs font-semibold text-slate-500 m-0 mt-0.5">support@pivo.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-[#0f172a] text-amber-700 flex items-center justify-center shrink-0 font-bold mt-0.5 shadow-2xs">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wide">Giờ Làm Việc</span>
                    <p className="font-bold text-sm text-slate-800 m-0 mt-0.5">Thứ Hai - Thứ Sáu: <strong className="text-slate-950">08:30 - 18:00</strong></p>
                    <p className="text-xs font-bold text-slate-500 m-0">Thứ Bảy: <strong className="text-slate-950">08:30 - 12:00</strong> (Chủ Nhật nghỉ)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t-2 border-slate-100 flex flex-col gap-3">
              <button 
                onClick={() => navigate('/messages')}
                className="w-full py-3.5 bg-[#fff5f5] hover:bg-[#fbdada] text-[#c93638] rounded-2xl font-black text-sm transition-colors border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] cursor-pointer flex items-center justify-center gap-2 hover:translate-x-0.5 hover:-translate-y-0.5"
              >
                <span>💬 Nhắn Tin Trực Tiếp Với Ban Quản Trị</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border-4 border-[#0f172a] rounded-[32px] p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#c93638] border border-[#0f172a]"></span>
                <h4 className="font-black text-base sm:text-lg text-slate-950 m-0">Bản Đồ Ghim Vị Trí Trụ Sở (Google Maps)</h4>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full border hidden sm:inline-block ${
                isOpen 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-[#fcebeb] text-[#c93638] border-[#f3a4a4]'
              }`}>
                {isOpen ? '● Đang mở cửa' : '● Đã đóng cửa'}
              </span>
            </div>

            <div className="w-full h-[400px] sm:h-[480px] rounded-[24px] overflow-hidden border-2 border-[#0f172a] shadow-sm relative bg-slate-100">
              <iframe 
                title="Bản Đồ Trụ Sở PIVO - Trường Cao đẳng Kỹ thuật Cao Thắng"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.513933997974!2d106.69867477594718!3d10.771894089376621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEvhu7kgdGh14bqtdCBDYW8gVGjhuq9uZw!5e0!3m2!1svi!2s!4v1786255262555!5m2!1svi!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full object-cover"
              ></iframe>
            </div>

            <div className="flex items-center justify-between bg-slate-50 px-5 py-3 rounded-2xl border-2 border-[#0f172a] shadow-2xs">
              <span className="text-xs font-bold text-slate-700 truncate mr-2">
                📌 Chỉ dẫn: 65 Huỳnh Thúc Khang, P. Bến Nghé, Q. 1, TP. HCM (Trường CĐ Kỹ thuật Cao Thắng).
              </span>
              <a 
                href="https://www.google.com/maps/search/Trường+Cao+đẳng+Kỹ+thuật+Cao+Thắng+65+Huỳnh+Thúc+Khang+Quận+1+TP+HCM" 
                target="_blank" 
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-black text-[#c93638] hover:underline bg-white px-3 py-1.5 rounded-xl border-2 border-[#0f172a] shadow-2xs no-underline"
              >
                <span>Mở Map toàn màn hình</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
