import React from 'react';
import { X, Calendar, MapPin, ChevronRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomeAdPopup = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 flex flex-col md:flex-row">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all z-20 shadow-lg"
        >
          <X size={20} />
        </button>

        {/* Cột trái: Hình ảnh */}
        <div className="w-full md:w-1/2 relative h-[300px] sm:h-[400px] md:h-auto md:min-h-[500px] bg-slate-100">
          <img 
            src={event.anh_bia || 'http://localhost:8000/avt/skien_mac_dinh.png'} 
            alt={event.tieu_de} 
            onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:8000/avt/skien_mac_dinh.png'; }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-slate-950/20 md:to-slate-950/80 pointer-events-none"></div>
          
          <div className="absolute top-6 left-6 bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5 z-10 border border-white/20 animate-pulse">
            🔥 SỰ KIỆN NỔI BẬT
          </div>
          
          {event.ve_mien_phi_con_lai > 0 && (
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md text-emerald-600 font-black px-4 py-2 rounded-2xl shadow-xl z-10">
              Tặng {event.ve_mien_phi_con_lai} vé vào cửa!
            </div>
          )}
        </div>

        {/* Cột phải: Nội dung */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          
          <span className="text-indigo-600 font-bold uppercase tracking-wider text-sm sm:text-base mb-3 block">Đừng bỏ lỡ sự kiện siêu HOT</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 leading-tight mb-4 line-clamp-3">
            {event.tieu_de}
          </h2>
          
          <p className="text-slate-500 text-sm sm:text-base mb-8 line-clamp-3 leading-relaxed">
            {event.mo_ta || "Tham gia ngay để trải nghiệm những hoạt động tuyệt vời nhất cùng cộng đồng!"}
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Thời gian</p>
                <p>{new Date(event.thoi_gian_bat_dau).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {new Date(event.thoi_gian_bat_dau).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                {event.hinh_thuc === 1 ? <Globe size={18} /> : <MapPin size={18} />}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-slate-400 font-bold uppercase">Địa điểm</p>
                <p className="truncate w-full">{event.hinh_thuc === 1 ? "Sự kiện trực tuyến" : event.dia_diem}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-auto">
            <Link 
              to={`/events/${event.slug}`} 
              onClick={onClose}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-200 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Xem Chi Tiết <ChevronRight size={20} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomeAdPopup;
