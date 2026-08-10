import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, ChevronRight, Globe } from 'lucide-react';

const AdBanner = ({ event, isSuper = false }) => {
  if (!event) return null;

  return (
    <div className={`relative overflow-hidden rounded-[24px] shadow-lg group ${isSuper ? 'w-full aspect-[4/3] sm:aspect-auto sm:h-[450px] mb-12' : 'w-full h-[250px] sm:h-[300px] my-6'}`}>
      <img 
        src={event.anh_bia || 'http://localhost:8000/avt/skien_mac_dinh.png'} 
        alt={event.tieu_de} 
        onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:8000/avt/skien_mac_dinh.png'; }}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none"></div>
      
      <div className="absolute top-4 left-4 bg-rose-500 text-white text-[0.65rem] sm:text-xs font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5 z-10 border border-white/20">
        🔥 ĐƯỢC TÀI TRỢ
      </div>

      <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-end">
        <div className="relative z-10 w-full md:w-3/4 lg:w-2/3">
          <h3 className={`${isSuper ? 'text-3xl md:text-5xl mb-4' : 'text-xl md:text-2xl mb-2'} font-black text-white leading-tight drop-shadow-lg group-hover:text-rose-200 transition-colors line-clamp-2`}>
            {event.tieu_de}
          </h3>
          
          <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-4 sm:mb-6">
            <div className="flex items-center gap-1.5 text-slate-200 text-xs sm:text-sm font-medium">
              <Calendar size={14} className="text-rose-400" />
              <span>{new Date(event.thoi_gian_bat_dau).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {new Date(event.thoi_gian_bat_dau).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200 text-xs sm:text-sm font-medium">
              {event.hinh_thuc === 1 ? <Globe size={14} className="text-rose-400" /> : <MapPin size={14} className="text-rose-400" />}
              <span className="truncate max-w-[120px] sm:max-w-[200px]">{event.hinh_thuc === 1 ? "Trực tuyến" : event.dia_diem}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link to={`/events/${event.slug}`} className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 sm:py-2.5 px-5 sm:px-6 rounded-full transition-all shadow-lg hover:shadow-rose-500/50 flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto hover:-translate-y-0.5">
              Khám phá sự kiện <ChevronRight size={18} />
            </Link>
            
            {event.ve_mien_phi_con_lai > 0 && (
              <span className="text-emerald-400 font-bold text-xs sm:text-sm text-center sm:text-left drop-shadow-md">
                Tặng {event.ve_mien_phi_con_lai} vé vào cửa!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
