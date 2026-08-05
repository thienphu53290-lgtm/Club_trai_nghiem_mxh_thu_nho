import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const mockEvents = [
  {
    id: 1,
    title: 'Offline Trải Nghiệm Công Nghệ 2026',
    date: '15/09/2026',
    time: '08:00 - 12:00',
    location: 'TP. Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    attendees: 120,
    status: 'Sắp diễn ra',
  },
  {
    id: 2,
    title: 'Workshop: Tối ưu Setup Bàn Làm Việc',
    date: '20/09/2026',
    time: '14:00 - 17:00',
    location: 'Hà Nội',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    attendees: 50,
    status: 'Sắp diễn ra',
  },
  {
    id: 3,
    title: 'Giao Lưu Cộng Đồng - Coffee Talk',
    date: '25/09/2026',
    time: '09:00 - 11:30',
    location: 'Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
    attendees: 80,
    status: 'Sắp diễn ra',
  },
  {
    id: 4,
    title: 'Triển lãm Công nghệ Audio Hi-End',
    date: '10/10/2026',
    time: '09:00 - 18:00',
    location: 'TP. Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1516280440502-8611598437a4?q=80&w=800&auto=format&fit=crop',
    attendees: 300,
    status: 'Đang mở đăng ký',
  },
  {
    id: 5,
    title: 'Hội thảo Đánh giá Máy Ảnh Mirroless',
    date: '25/10/2026',
    time: '13:00 - 17:00',
    location: 'Hà Nội',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    attendees: 60,
    status: 'Sắp diễn ra',
  },
  {
    id: 6,
    title: 'Camping & Trải nghiệm Đồ Dã Ngoại',
    date: '05/11/2026',
    time: '15:00 - 22:00',
    location: 'Đà Lạt',
    image: 'https://images.unsplash.com/photo-1504280390227-3615f8e6ce94?q=80&w=800&auto=format&fit=crop',
    attendees: 40,
    status: 'Đang mở đăng ký',
  }
];

const Events = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-[100px]">
      <div className="max-w-[1320px] mx-auto px-5">
        
        {/* Hero Banner */}
        <div className="w-full bg-indigo-900 rounded-[32px] overflow-hidden mb-12 relative h-[450px] flex items-center shadow-xl group">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop" 
            alt="Events Banner" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-[10000ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-900/80 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 pl-12 max-w-2xl">
            <span className="text-pink-400 font-bold tracking-widest uppercase text-sm mb-3 block animate-pulse">Sự Kiện Đặc Biệt</span>
            <h1 className="text-[3.5rem] font-black text-white mb-4 leading-tight drop-shadow-lg">Kết Nối Đam Mê</h1>
            <p className="text-indigo-100 text-[1.1rem] leading-relaxed mb-8">
              Tham gia các sự kiện offline và workshop độc quyền để gặp gỡ, giao lưu cùng những người có chung đam mê trải nghiệm và công nghệ.
            </p>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center gap-2">
              <Calendar size={18} /> Đăng ký tham gia ngay
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Calendar size={16} />
              </span>
              Sự Kiện Sắp Tới
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm shadow hover:bg-indigo-700 transition-colors">Tất cả</button>
              <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors">Đang mở đăng ký</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-[24px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer hover:-translate-y-2 flex flex-col">
                <div className="relative h-56 overflow-hidden bg-slate-200">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-black text-indigo-700 shadow-sm">
                    {event.status}
                  </div>
                  <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-2xl shadow flex flex-col items-center justify-center z-10 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase leading-none mt-1">Tháng {event.date.split('/')[1]}</span>
                    <span className="text-2xl font-black text-indigo-600 leading-none mt-1">{event.date.split('/')[0]}</span>
                  </div>
                </div>
                
                <div className="p-6 pt-10 flex-1 flex flex-col">
                  <h3 className="font-black text-[1.15rem] text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">{event.title}</h3>
                  <div className="flex flex-col gap-3 mb-6 flex-1">
                    <div className="flex items-center gap-2.5 text-[0.9rem] text-slate-600 font-medium">
                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100"><Calendar size={12} className="text-slate-500" /></div>
                      <span>{event.time} - {event.date}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[0.9rem] text-slate-600 font-medium">
                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100"><MapPin size={12} className="text-slate-500" /></div>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[0.9rem] text-slate-600 font-medium">
                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100"><Users size={12} className="text-slate-500" /></div>
                      <span>{event.attendees} người tham gia</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="font-bold text-indigo-600 text-[0.95rem]">Xem chi tiết</span>
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <ArrowRight size={16} className="text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Events;
