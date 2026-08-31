import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      if (res.data && res.data.events) {
        setEvents(res.data.events.slice(0, 3));
      }
    } catch (error) {
      console.error('Lỗi khi tải sự kiện sắp tới:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-5 py-[60px]">
      <div className="max-w-[1320px] mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl md:text-[2rem] font-extrabold text-text-dark mb-2">Sự kiện Nổi bật</h2>
          <p className="text-text-light text-[1.05rem]">Nhấn vào từng banner để xem chi tiết buổi trải nghiệm tương ứng.</p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500 font-bold">Đang tải sự kiện...</div>
        ) : events.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-md relative z-10 border border-border-color rounded-[24px] py-12 px-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] max-w-[600px] mx-auto">
            <span className="text-slate-500 font-bold text-[1.05rem]">Hiện chưa có sự kiện nào sắp tới.</span>
          </div>
        ) : (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[30px] overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
            {events.map(event => {
              const eventDate = new Date(event.thoi_gian_bat_dau);
              const dateStr = eventDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
              const timeStr = eventDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
              
              let availableText = 'Không giới hạn';
              if (event.so_luong_toi_da) {
                const left = event.so_luong_toi_da - (event.attendees || 0);
                availableText = left > 0 ? `Còn ${left} slot tham dự` : 'Đã đầy (Có thể đăng ký chờ)';
              }

              return (
                <div key={event.id} className="w-[280px] sm:w-auto snap-center shrink-0 border border-border-color rounded-[24px] overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] group">
                  <Link to={`/events/${event.slug}`} className="block relative h-[160px] sm:h-[240px] overflow-hidden">
                    <img 
                      src={event.anh_bia || 'http://localhost:8000/avt/skien_mac_dinh.png'} 
                      alt={event.tieu_de} 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:8000/avt/skien_mac_dinh.png'; }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80 z-10" />
                    
                    <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
                      <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl text-[0.75rem] sm:text-[0.85rem] font-bold bg-white text-text-dark">
                        {dateStr}
                      </span>
                      <div className="flex gap-2">
                        {event.status === 'Đang diễn ra' && (
                          <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl text-[0.75rem] sm:text-[0.85rem] font-bold bg-emerald-500 text-white animate-pulse">
                            Đang diễn ra
                          </span>
                        )}
                        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl text-[0.75rem] sm:text-[0.85rem] font-bold bg-primary text-white">
                          {event.hinh_thuc === 1 ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 text-white">
                      <h3 className="text-[1.1rem] sm:text-[1.25rem] font-extrabold mb-1 sm:mb-2 leading-tight line-clamp-2">
                        {event.tieu_de}
                      </h3>
                      <p className="text-[0.85rem] sm:text-[0.95rem] opacity-90">{timeStr}</p>
                    </div>
                  </Link>
                  
                  <div className="p-4 sm:p-6 flex justify-between items-center">
                    <span className="text-[0.85rem] sm:text-[0.95rem] text-text-light">
                      {availableText}
                    </span>
                    <Link to={`/events/${event.slug}`} className="flex items-center gap-1 sm:gap-1.5 text-primary font-bold text-[0.85rem] sm:text-[0.95rem] no-underline hover:underline">
                      Đăng ký <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;
