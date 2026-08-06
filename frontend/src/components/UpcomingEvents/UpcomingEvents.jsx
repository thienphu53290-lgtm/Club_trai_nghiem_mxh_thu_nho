import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Đêm mở hộp: 5 tai nghe dưới 2 triệu',
    type: 'Livestream',
    date: '12/08',
    time: '20:00 - 21:30',
    available: 'Còn 120 slot tham dự',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Offine trải nghiệm máy ảnh Fujifilm',
    type: 'Offline',
    date: '24/08',
    time: '09:00 - 11:30',
    available: 'Đã đầy (Có thể đăng ký chờ)',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Skincare routine mùa đông',
    type: 'Workshop',
    date: '05/09',
    time: '19:00 - 20:30',
    available: 'Còn 45 slot tham dự',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop'
  }
];

const UpcomingEvents = () => {
  return (
    <section className="px-5 py-[60px]">
      <div className="max-w-[1320px] mx-auto">
        <div className="mb-8">
          <h2 className="text-[2rem] font-extrabold text-text-dark mb-2">Sự kiện sắp tới</h2>
          <p className="text-text-light text-[1.05rem]">Nhấn vào từng banner để xem chi tiết buổi trải nghiệm tương ứng.</p>
        </div>

        <div className="grid grid-cols-3 gap-[30px]">
          {events.map(event => (
            <div key={event.id} className="border border-border-color rounded-[24px] overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] group">
              <div className="relative h-[240px] overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80 z-10" />
                
                <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
                  <span className="px-3.5 py-1.5 rounded-2xl text-[0.85rem] font-bold bg-white text-text-dark">
                    {event.date}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-2xl text-[0.85rem] font-bold bg-primary text-white">
                    {event.type}
                  </span>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                  <h3 className="text-[1.25rem] font-extrabold mb-2 leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-[0.95rem] opacity-90">{event.time}</p>
                </div>
              </div>
              
              <div className="p-6 flex justify-between items-center">
                <span className="text-[0.95rem] text-text-light">
                  {event.available}
                </span>
                <a href="#" className="flex items-center gap-1.5 text-primary font-bold text-[0.95rem] no-underline hover:underline">
                  Đăng ký ngay <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
