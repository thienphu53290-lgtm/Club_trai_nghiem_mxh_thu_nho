import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Users, Ticket, ArrowRight, QrCode, PlayCircle, XCircle, ExternalLink } from 'lucide-react';
import api from '../../api/axios';
import Modal from '../../components/Modal/Modal';

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

  const [checkinCode, setCheckinCode] = useState('');
  const [checkinResult, setCheckinResult] = useState(null);
  
  const handleCheckin = async (e) => {
    e.preventDefault();
    if (!checkinCode.trim()) return;

    try {
      const res = await api.post('/admin/events/checkin', { code: checkinCode });
      if (res.data && res.data.status === 'success') {
        showNotification('✅ ' + res.data.message);
        setCheckinResult({ type: 'success', data: res.data.data });
      }
    } catch (err) {
      showNotification('❌ ' + (err.response?.data?.message || 'Lỗi Check-in!'));
      setCheckinResult({ type: 'error', message: err.response?.data?.message || 'Lỗi Check-in!' });
    }
    setCheckinCode('');
  };

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/admin/events');
      if (res.data && res.data.events) {
        const formattedEvents = res.data.events.map(ev => {
          let statusStr = 'upcoming';
          if (ev.trang_thai === 2) statusStr = 'ongoing';
          if (ev.trang_thai === 3) statusStr = 'completed';

          const startDate = new Date(ev.thoi_gian_bat_dau);
          const endDate = new Date(ev.thoi_gian_ket_thuc);
          
          return {
            id: ev.id,
            slug: ev.slug,
            title: ev.tieu_de,
            status: statusStr,
            time: `${startDate.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}, ${startDate.toLocaleDateString('vi-VN')}`,
            location: ev.dia_diem || (ev.hinh_thuc === 1 ? 'Online' : 'Chưa cập nhật'),
            attendees: ev.attendees || 0,
            cover: ev.anh_bia || 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400&auto=format&fit=crop&q=80'
          };
        });
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error fetching admin events:', error);
      showNotification('❌ Không thể tải danh sách sự kiện.');
    } finally {
      setLoading(false);
    }
  };

  const moveEvent = async (id, newStatus) => {
    try {
      let dbStatus = 1;
      if (newStatus === 'ongoing') dbStatus = 2;
      if (newStatus === 'completed') dbStatus = 3;

      await api.put(`/admin/events/${id}/status`, { status: dbStatus });

      setEvents(events.map(ev => 
        ev.id === id ? { ...ev, status: newStatus } : ev
      ));
      showNotification(`🔄 Đã chuyển trạng thái sự kiện sang: ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('❌ Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const renderEventListItem = (ev) => (
    <div 
      key={ev.id} 
      onClick={() => setSelectedEvent(ev)}
      className="flex items-center gap-4 bg-white p-3 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:shadow-[4px_4px_0px_0px_rgba(99,102,241,0.2)] cursor-pointer transition-all group"
    >
      <div className="w-24 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
        <img src={ev.cover} alt="Event cover" className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">{ev.title}</h4>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Clock size={12} className="text-purple-500" /> {ev.time}</p>
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1"><MapPin size={12} className="text-amber-500" /> {ev.location}</p>
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Users size={12} className="text-emerald-500" /> {ev.attendees} Người tham dự</p>
        </div>
      </div>
      <button className="hidden sm:flex bg-slate-50 group-hover:bg-indigo-50 text-slate-500 group-hover:text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold border-2 border-slate-200 group-hover:border-indigo-200 items-center gap-1 transition-all">
        Chi tiết <ArrowRight size={14} />
      </button>
    </div>
  );

  const renderScheduleTab = () => {
    const filteredEvents = events.filter(e => e.status === activeSubTab);

    return (
      <div className="w-full mt-6 animate-slideUp bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-6">
        
        {/* Sub-tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-6 border-b-2 border-slate-100 pb-4">
          <button 
            onClick={() => setActiveSubTab('upcoming')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeSubTab === 'upcoming' ? 'bg-indigo-100 text-indigo-900 border-2 border-indigo-900 shadow-[2px_2px_0px_0px_rgba(49,46,129,1)]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent'}`}
          >
            Sắp tới
            <span className="bg-white text-indigo-900 px-2 py-0.5 rounded-md text-xs border border-indigo-200">{events.filter(e => e.status === 'upcoming').length}</span>
          </button>
          <button 
            onClick={() => setActiveSubTab('ongoing')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeSubTab === 'ongoing' ? 'bg-amber-100 text-amber-900 border-2 border-amber-900 shadow-[2px_2px_0px_0px_rgba(120,53,15,1)]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent'}`}
          >
            Đang diễn ra
            <span className="bg-white text-amber-900 px-2 py-0.5 rounded-md text-xs border border-amber-200">{events.filter(e => e.status === 'ongoing').length}</span>
          </button>
          <button 
            onClick={() => setActiveSubTab('completed')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeSubTab === 'completed' ? 'bg-slate-800 text-white border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-2 border-transparent'}`}
          >
            Đã kết thúc
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-md text-xs">{events.filter(e => e.status === 'completed').length}</span>
          </button>
        </div>

        {/* List View with Scrollbar */}
        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(renderEventListItem)
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 font-semibold">Chưa có sự kiện nào trong mục này.</p>
            </div>
          )}
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <Modal 
            isOpen={!!selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
            title="Chi Tiết Sự Kiện"
            size="md"
          >
            <div className="space-y-6">
              <div className="w-full bg-slate-50 rounded-2xl border-2 border-slate-200 mb-6 flex items-center justify-center overflow-hidden h-48">
                <img src={selectedEvent.cover} alt="Cover" className="w-full h-full object-contain" />
              </div>
              
              <div>
                <h3 className="font-black text-xl text-slate-900 mb-4">{selectedEvent.title}</h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
                  <div className="flex items-center gap-3 text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <Clock size={16} className="text-purple-600" />
                    </div>
                    <span className="font-semibold">{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-amber-600" />
                    </div>
                    <span className="font-semibold">{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Users size={16} className="text-emerald-600" />
                    </div>
                    <span className="font-semibold">{selectedEvent.attendees} Người tham dự</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-bold text-slate-800 mb-3">Hành động điều phối</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedEvent.status === 'upcoming' && (
                    <button 
                      onClick={() => { moveEvent(selectedEvent.id, 'ongoing'); setSelectedEvent(null); }}
                      className="col-span-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black py-3 rounded-xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all"
                    >
                      <PlayCircle size={20} /> Bắt đầu sự kiện
                    </button>
                  )}
                  {selectedEvent.status === 'ongoing' && (
                    <>
                      <button 
                        className="bg-purple-500 hover:bg-purple-400 text-white font-black py-3 rounded-xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all"
                      >
                        <QrCode size={20} /> Quét Vé
                      </button>
                      <button 
                        onClick={() => { moveEvent(selectedEvent.id, 'completed'); setSelectedEvent(null); }}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all"
                      >
                        <XCircle size={20} /> Kết thúc sự kiện
                      </button>
                    </>
                  )}
                  {selectedEvent.status === 'completed' && (
                    <button 
                      className="col-span-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black py-3 rounded-xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all"
                    >
                      <Ticket size={20} /> Xem Báo Cáo Doanh Thu
                    </button>
                  )}
                  
                  <Link 
                    to={`/admin/events/${selectedEvent.slug || selectedEvent.id}/manage`}
                    className="col-span-2 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all no-underline"
                  >
                    VÀO TRANG QUẢN LÝ SỰ KIỆN
                  </Link>

                  <a 
                    href={`/events/${selectedEvent.slug || selectedEvent.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="col-span-2 mt-1 bg-white hover:bg-blue-50 text-blue-600 font-bold py-3 rounded-xl border-2 border-blue-200 shadow-sm flex items-center justify-center gap-2 transition-all no-underline"
                  >
                    <ExternalLink size={18} /> Xem trang chi tiết sự kiện
                  </a>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  };

  const renderCheckinTab = () => (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-slideUp">
      <div className="bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-8">
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <QrCode className="text-primary" /> Quét Mã Vé Check-in
        </h2>
        
        <form onSubmit={handleCheckin} className="flex gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Nhập mã vé (VD: TICKET-1-5 hoặc TICKET-00001)"
            value={checkinCode}
            onChange={(e) => setCheckinCode(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold text-lg"
            autoFocus
          />
          <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-black text-lg transition-all">
            Kiểm tra
          </button>
        </form>

        {checkinResult && checkinResult.type === 'success' && (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-6 text-center animate-slideUp">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
              <span className="text-white text-3xl">✓</span>
            </div>
            <h3 className="text-2xl font-black text-emerald-700 mb-2">Hợp Lệ!</h3>
            <p className="font-bold text-slate-700 text-lg mb-1">{checkinResult.data.ho_ten}</p>
            <p className="text-slate-500 mb-4">{checkinResult.data.email}</p>
            <div className="inline-block bg-white px-4 py-2 rounded-lg border border-emerald-200 font-bold text-emerald-600">
              Sự kiện: {checkinResult.data.su_kien}
            </div>
          </div>
        )}

        {checkinResult && checkinResult.type === 'error' && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 text-center animate-slideUp">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
              <span className="text-white text-3xl">✕</span>
            </div>
            <h3 className="text-2xl font-black text-red-700 mb-2">Không Hợp Lệ!</h3>
            <p className="font-bold text-slate-700 text-lg">{checkinResult.message}</p>
          </div>
        )}
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
      </div>

      {currentTab === 'schedule' && renderScheduleTab()}
      {currentTab === 'checkin' && renderCheckinTab()}
      {currentTab === 'tickets' && renderPlaceholder('Báo cáo Doanh thu')}
    </div>
  );
};

export default EventAdmin;
