import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, ChevronRight, Globe, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomeAdPopup = ({ isOpen, onClose, events = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (events.length <= 1 || !isOpen) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000); // Tự động chuyển sau 5 giây
    
    return () => clearInterval(interval);
  }, [events.length, isOpen]);

  if (!isOpen || events.length === 0) return null;

  const handleNext = () => {
    if (events.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }
  };

  const handlePrev = () => {
    if (events.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 flex flex-col md:flex-row group/modal">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-all z-20 shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Cột trái: Hình ảnh */}
        <div className="w-full md:w-1/2 relative h-[300px] sm:h-[400px] md:h-auto md:min-h-[500px] bg-slate-100 group/image overflow-hidden">
          
          <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {events.map((ev, idx) => (
              <div key={idx} className="w-full h-full shrink-0 relative">
                <img 
                  src={ev.anh_bia || 'http://localhost:8000/avt/skien_mac_dinh.png'} 
                  alt={ev.tieu_de} 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:8000/avt/skien_mac_dinh.png'; }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-slate-950/20 md:to-slate-950/80 pointer-events-none"></div>
                
                {ev.ve_mien_phi_con_lai > 0 && (
                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md text-emerald-600 font-black px-4 py-2 rounded-2xl shadow-xl z-10">
                    Tặng {ev.ve_mien_phi_con_lai} vé vào cửa!
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="absolute top-6 left-6 bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5 z-20 border border-white/20 animate-pulse">
            🔥 SỰ KIỆN NỔI BẬT
          </div>

          {/* Mũi tên điều hướng trên ảnh */}
          <>
            <button 
              onClick={handlePrev}
              disabled={events.length <= 1}
              className={`absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 shadow-lg ${events.length <= 1 ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-white/50 hover:bg-white/80 backdrop-blur-md text-slate-800'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              disabled={events.length <= 1}
              className={`absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 shadow-lg ${events.length <= 1 ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-white/50 hover:bg-white/80 backdrop-blur-md text-slate-800'}`}
            >
              <ChevronRight size={20} />
            </button>
          </>

          {/* Chấm tròn điều hướng */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {events.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                disabled={events.length <= 1}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentIndex === idx ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </div>

        {/* Cột phải: Nội dung */}
        <div className="w-full md:w-1/2 bg-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none z-0"></div>
          
          <div className="flex transition-transform duration-700 ease-in-out h-full relative z-10" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {events.map((ev, idx) => (
              <div key={idx} className="w-full h-full shrink-0 p-8 sm:p-12 flex flex-col justify-center">
                <span className="text-indigo-600 font-bold uppercase tracking-wider text-sm sm:text-base mb-3 block">Đừng bỏ lỡ sự kiện siêu HOT</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 leading-tight mb-4 line-clamp-3">
                  {ev.tieu_de}
                </h2>
                
                <p className="text-slate-500 text-sm sm:text-base mb-8 line-clamp-3 leading-relaxed">
                  {ev.mo_ta || "Tham gia ngay để trải nghiệm những hoạt động tuyệt vời nhất cùng cộng đồng!"}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Thời gian</p>
                      <p>{new Date(ev.thoi_gian_bat_dau).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {new Date(ev.thoi_gian_bat_dau).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      {ev.hinh_thuc === 1 ? <Globe size={18} /> : <MapPin size={18} />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-slate-400 font-bold uppercase">Địa điểm</p>
                      <p className="truncate w-full">{ev.hinh_thuc === 1 ? "Sự kiện trực tuyến" : ev.dia_diem}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-auto">
                  <Link 
                    to={`/events/${ev.slug}`} 
                    onClick={onClose}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-200 hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Xem Chi Tiết <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomeAdPopup;
