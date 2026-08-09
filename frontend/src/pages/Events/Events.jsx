import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Globe } from 'lucide-react';
import api from '../../api/axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, 0 (offline), 1 (online)
  
  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let url = '/events';
      if (filter !== 'all') {
        url += `?hinh_thuc=${filter}`;
      }
      const res = await api.get(url);
      setEvents(res.data.events);
    } catch (error) {
      console.error('Lỗi khi tải sự kiện:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-[100px]">
      <div className="max-w-[1320px] mx-auto px-5">
        
        {/* Hero Banner */}
        <div className="w-full bg-indigo-900 rounded-[20px] sm:rounded-[32px] overflow-hidden mb-8 sm:mb-12 relative aspect-[4/3] sm:aspect-auto sm:h-[450px] flex items-center shadow-xl group">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop" 
            alt="Events Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-[10000ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-900/80 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 pl-6 sm:pl-12 max-w-[85%] sm:max-w-2xl">
            <span className="text-pink-400 font-bold tracking-widest uppercase text-[0.65rem] sm:text-sm mb-1.5 sm:mb-3 block animate-pulse">Sự Kiện Đặc Biệt</span>
            <h1 className="text-[1.8rem] sm:text-[3.5rem] font-black text-white mb-2 sm:mb-4 leading-tight drop-shadow-lg">Kết Nối Đam Mê</h1>
            <p className="text-indigo-100 text-[0.85rem] sm:text-[1.1rem] leading-relaxed mb-4 sm:mb-8 line-clamp-2 sm:line-clamp-none">
              Tham gia các sự kiện offline và workshop độc quyền để gặp gỡ, giao lưu cùng những người có chung đam mê trải nghiệm và công nghệ.
            </p>
            <div className="flex gap-4">
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 sm:py-3.5 px-5 sm:px-8 text-[0.85rem] sm:text-base rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center gap-1.5 sm:gap-2">
                <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" /> Khám phá ngay
              </button>
              <Link to="/events/create" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-2 sm:py-3.5 px-5 sm:px-8 text-[0.85rem] sm:text-base rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl leading-none">+</span> Tổ Chức Sự Kiện
              </Link>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Calendar size={16} />
              </span>
              Sự Kiện Sắp Tới
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 font-bold rounded-lg text-sm shadow transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                Tất cả
              </button>
              <button 
                onClick={() => setFilter(0)}
                className={`px-4 py-2 font-bold rounded-lg text-sm shadow transition-colors ${filter === 0 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                Offline 📍
              </button>
              <button 
                onClick={() => setFilter(1)}
                className={`px-4 py-2 font-bold rounded-lg text-sm shadow transition-colors ${filter === 1 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                Online 🌐
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-500 font-bold">Đang tải sự kiện...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-bold">Không có sự kiện nào phù hợp.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-[24px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="relative h-56 bg-slate-200">
                    <div className="absolute inset-0 overflow-hidden">
                      <img 
                        src={event.anh_bia || 'http://localhost:8000/avt/skien_mac_dinh.png'} 
                        alt={event.tieu_de} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:8000/avt/skien_mac_dinh.png'; }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-black text-indigo-700 shadow-sm z-10">
                      {event.status}
                    </div>
                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {event.ve_mien_phi_con_lai > 0 && (
                        <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg animate-pulse flex items-center gap-1">
                          🔥 Còn {event.ve_mien_phi_con_lai} vé FREE
                        </div>
                      )}
                      {event.giai_thuong && (
                        <div className="bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1">
                          🎁 Có Giveaway
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-2xl shadow flex flex-col items-center justify-center z-10 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase leading-none mt-1">Tháng {new Date(event.thoi_gian_bat_dau).getMonth() + 1}</span>
                      <span className="text-2xl font-black text-indigo-600 leading-none mt-1">{new Date(event.thoi_gian_bat_dau).getDate()}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 pt-10 flex-1 flex flex-col">
                    <h3 className="font-black text-[1.15rem] text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">{event.tieu_de}</h3>
                    <div className="flex flex-col gap-3 mb-6 flex-1">
                      <div className="flex items-center gap-2.5 text-[0.9rem] text-slate-600 font-medium">
                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100"><Calendar size={12} className="text-slate-500" /></div>
                        <span>{new Date(event.thoi_gian_bat_dau).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {new Date(event.thoi_gian_bat_dau).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[0.9rem] text-slate-600 font-medium">
                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                          {event.hinh_thuc === 1 ? <Globe size={12} className="text-slate-500" /> : <MapPin size={12} className="text-slate-500" />}
                        </div>
                        <span>{event.hinh_thuc === 1 ? "🌐 Sự kiện Trực tuyến" : `📍 ${event.dia_diem}`}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[0.9rem] text-slate-600 font-medium">
                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100"><Users size={12} className="text-slate-500" /></div>
                        <span>{event.attendees} / {event.so_luong_toi_da || 'Không giới hạn'} người tham gia</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div className="font-black text-[0.95rem]">
                        {event.gia_ve > 0 ? (
                          event.ve_mien_phi_con_lai > 0 ? (
                            <span className="text-pink-500 line-through mr-2">{parseInt(event.gia_ve).toLocaleString()}đ</span>
                          ) : (
                            <span className="text-indigo-600">{parseInt(event.gia_ve).toLocaleString()}đ</span>
                          )
                        ) : null}
                        {(event.gia_ve == 0 || event.ve_mien_phi_con_lai > 0) && (
                          <span className="text-emerald-600">MIỄN PHÍ</span>
                        )}
                      </div>
                      <Link to={`/events/${event.slug}`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center gap-2">
                        Xem chi tiết <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Events;
