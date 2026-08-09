import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Users, Ticket, ArrowRight, QrCode } from 'lucide-react';

const EventAdmin = () => {
  const context = useOutletContext();
  const activeTabContext = context?.activeTab;
  const showNotification = context?.showNotification || (() => {});
  
  const isEmbedded = !['schedule', 'checkin', 'tickets'].includes(activeTabContext);
  const [localTab, setLocalTab] = useState('schedule');
  const currentTab = isEmbedded ? localTab : activeTabContext;

  const handleTabChange = (tab) => {
    if (isEmbedded) setLocalTab(tab);
    else if (context?.setActiveTab) context.setActiveTab(tab);
  };

  // MOCK DATA: Kanban Board Data cho Sự kiện
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Workshop Kỹ năng Thuyết trình',
      status: 'upcoming', // upcoming, ongoing, completed
      time: '14:00 - 16:30, 20/09/2026',
      location: 'Hội trường A, Tầng 3',
      attendees: 45,
      cover: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      title: 'Đêm Nhạc Giao Lưu Tân Sinh Viên',
      status: 'ongoing',
      time: '19:00 - 22:00, 08/08/2026',
      location: 'Sân Khấu Lớn',
      attendees: 320,
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      title: 'Seminar: Tương lai của Trí Tuệ Nhân Tạo',
      status: 'completed',
      time: '08:00 - 11:30, 01/08/2026',
      location: 'Phòng Hội Thảo 2',
      attendees: 120,
      cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&auto=format&fit=crop&q=80'
    }
  ]);

  const moveEvent = (id, newStatus) => {
    setEvents(events.map(ev => 
      ev.id === id ? { ...ev, status: newStatus } : ev
    ));
    showNotification(`🔄 Đã chuyển trạng thái sự kiện sang: ${newStatus.toUpperCase()}`);
  };

  const renderEventCard = (ev) => (
    <div key={ev.id} className="bg-white p-4 rounded-3xl border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] mb-4 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer group">
      <img src={ev.cover} alt="Event cover" className="w-full h-32 object-cover rounded-xl border-2 border-[#0f172a] mb-3 group-hover:scale-[1.02] transition-transform" />
      <h4 className="font-black text-lg text-slate-900 mb-2 leading-tight">{ev.title}</h4>
      <div className="space-y-1.5 mb-4">
        <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Clock size={14} className="text-purple-600" /> {ev.time}</p>
        <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><MapPin size={14} className="text-amber-500" /> {ev.location}</p>
        <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Users size={14} className="text-emerald-500" /> {ev.attendees} Người tham dự</p>
      </div>

      <div className="flex gap-2">
        {ev.status === 'upcoming' && (
          <button onClick={() => moveEvent(ev.id, 'ongoing')} className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 rounded-xl border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1">
            Bắt đầu <ArrowRight size={14} />
          </button>
        )}
        {ev.status === 'ongoing' && (
          <>
            <button className="flex-1 bg-purple-500 hover:bg-purple-400 text-white font-black text-xs py-2 rounded-xl border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1">
              <QrCode size={14} /> Quét Vé
            </button>
            <button onClick={() => moveEvent(ev.id, 'completed')} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2 rounded-xl border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1">
              Kết thúc <ArrowRight size={14} />
            </button>
          </>
        )}
        {ev.status === 'completed' && (
          <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-2 rounded-xl border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1">
            <Ticket size={14} /> Xem Báo Cáo
          </button>
        )}
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-start mt-6 animate-slideUp">
      {/* CỘT 1: SẮP TỚI */}
      <div className="flex-1 w-full bg-indigo-50 rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-5">
        <div className="flex items-center justify-between mb-5 border-b-4 border-[#0f172a] pb-3">
          <h3 className="font-black text-xl text-indigo-900 uppercase tracking-tight flex items-center gap-2">
            <CalendarDays size={24} /> Sắp tới
          </h3>
          <span className="bg-white border-2 border-[#0f172a] text-indigo-900 px-3 py-1 rounded-full font-black text-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            {events.filter(e => e.status === 'upcoming').length}
          </span>
        </div>
        <div className="space-y-4">
          {events.filter(e => e.status === 'upcoming').map(renderEventCard)}
        </div>
      </div>

      {/* CỘT 2: ĐANG DIỄN RA */}
      <div className="flex-1 w-full bg-amber-50 rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(217,119,6,1)] p-5">
        <div className="flex items-center justify-between mb-5 border-b-4 border-[#0f172a] pb-3">
          <h3 className="font-black text-xl text-amber-600 uppercase tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping absolute -ml-4"></span>
            Đang diễn ra
          </h3>
          <span className="bg-amber-400 border-2 border-[#0f172a] text-slate-900 px-3 py-1 rounded-full font-black text-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            {events.filter(e => e.status === 'ongoing').length}
          </span>
        </div>
        <div className="space-y-4">
          {events.filter(e => e.status === 'ongoing').map(renderEventCard)}
        </div>
      </div>

      {/* CỘT 3: ĐÃ KẾT THÚC */}
      <div className="flex-1 w-full bg-slate-100 rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-5 opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between mb-5 border-b-4 border-[#0f172a] pb-3">
          <h3 className="font-black text-xl text-slate-600 uppercase tracking-tight flex items-center gap-2">
            Đã kết thúc
          </h3>
          <span className="bg-slate-300 border-2 border-[#0f172a] text-slate-800 px-3 py-1 rounded-full font-black text-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            {events.filter(e => e.status === 'completed').length}
          </span>
        </div>
        <div className="space-y-4">
          {events.filter(e => e.status === 'completed').map(renderEventCard)}
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title) => (
    <div className="bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-12 text-center mt-10">
      <h2 className="text-3xl font-black text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-500 font-bold text-lg">Tính năng đang được phát triển...</p>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-4 border-b-4 border-slate-900">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">
            {currentTab === 'schedule' && 'Điều phối Sự Kiện (Kanban)'}
            {currentTab === 'checkin' && 'Kiểm soát Check-in'}
            {currentTab === 'tickets' && 'Thống kê Doanh thu Vé'}
          </h1>
          <p className="text-slate-500 font-bold text-sm sm:text-base m-0">
            Không gian làm việc chuyên biệt dành cho Ban Tổ Chức Club Trải Nghiệm.
          </p>
        </div>

        {isEmbedded && (
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'schedule', label: 'Điều phối Sự Kiện' },
              { id: 'checkin', label: 'Kiểm soát Check-in' },
              { id: 'tickets', label: 'Doanh thu Vé' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`px-5 py-2.5 rounded-xl font-black text-sm border-2 border-slate-900 transition-all cursor-pointer ${
                  currentTab === t.id 
                    ? 'bg-amber-400 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px]' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {currentTab === 'schedule' && renderScheduleTab()}
      {currentTab === 'checkin' && renderPlaceholder('Máy quét QR Check-in')}
      {currentTab === 'tickets' && renderPlaceholder('Báo cáo Doanh thu')}
    </div>
  );
};

export default EventAdmin;
