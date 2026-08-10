import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Settings, Gift, Users, MessageSquare, Radio, Save, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';

const EventManagementHub = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states for general settings
  const [formData, setFormData] = useState({
    tieu_de: '',
    mo_ta: '',
    thoi_gian_bat_dau: '',
    thoi_gian_ket_thuc: '',
    dia_diem: '',
    hinh_thuc: 1
  });

  useEffect(() => {
    fetchEventData();
  }, [slug]);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${slug}`);
      if (res.data && res.data.event) {
        setEvent(res.data.event);
        setFormData({
          tieu_de: res.data.event.tieu_de || '',
          mo_ta: res.data.event.mo_ta || '',
          thoi_gian_bat_dau: res.data.event.thoi_gian_bat_dau ? res.data.event.thoi_gian_bat_dau.slice(0,16) : '',
          thoi_gian_ket_thuc: res.data.event.thoi_gian_ket_thuc ? res.data.event.thoi_gian_ket_thuc.slice(0,16) : '',
          dia_diem: res.data.event.dia_diem || '',
          hinh_thuc: res.data.event.hinh_thuc || 1
        });
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    alert('Tính năng lưu đang được xây dựng (Cần API Update ở Backend)');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center flex-col gap-4">
        <AlertTriangle size={48} className="text-amber-500" />
        <h2 className="text-xl font-bold">Không tìm thấy sự kiện</h2>
        <button onClick={() => navigate('/admin')} className="text-blue-500 underline font-bold">Quay lại Admin</button>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'general', label: 'Thông tin chung', icon: Settings },
    { id: 'gifts', label: 'Quà tặng & Minigame', icon: Gift },
    { id: 'attendees', label: 'Người tham gia', icon: Users },
    { id: 'chat', label: 'Chat & Kiểm duyệt', icon: MessageSquare },
    { id: 'live', label: 'Bảng điều khiển Live', icon: Radio },
  ];

  const getGalleryImages = () => {
    if (!event || !event.thu_vien_anh) return [];
    if (Array.isArray(event.thu_vien_anh)) return event.thu_vien_anh;
    try {
      const parsed = JSON.parse(event.thu_vien_anh);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const galleryImages = getGalleryImages();

  return (
    <div className="w-full mt-6 animate-slideUp space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-5 md:p-6">
        <button 
          onClick={() => navigate('/admin')} 
          className="w-12 h-12 bg-indigo-100 text-indigo-900 hover:bg-indigo-200 rounded-2xl border-4 border-[#0f172a] flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <ArrowLeft size={24} className="stroke-[3px]" />
        </button>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Trang Quản Lý Sự Kiện</p>
          <h1 className="font-black text-2xl md:text-3xl text-slate-900 truncate leading-tight">{event.tieu_de}</h1>
        </div>
      </div>

      {/* Horizontal Tabs Menu */}
      <div className="bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-3 md:p-4 flex gap-3 overflow-x-auto custom-scrollbar">
        {sidebarItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm md:text-base whitespace-nowrap transition-all border-4 border-[#0f172a] ${
              activeTab === item.id 
                ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px]' 
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-1px]'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-blue-500"} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="w-full">
          {activeTab === 'general' && (
            <div className="space-y-6 animate-slideUp">
              {/* Cover Image Block */}
              <div className="bg-white rounded-3xl border-4 border-[#0f172a] p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">🖼️ Ảnh Bìa Sự Kiện</h3>
                <div className="w-full bg-slate-50 rounded-2xl border-2 border-slate-200 mb-4 overflow-hidden flex items-center justify-center min-h-[200px]">
                  <img 
                    src={event.anh_bia || 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&auto=format&fit=crop&q=80'} 
                    alt="Cover" 
                    className="w-full max-h-[400px] object-contain" 
                  />
                </div>
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-6 rounded-xl border-2 border-slate-300 transition-all">
                  Đổi ảnh bìa
                </button>
              </div>

              {/* Gallery Images Block */}
              <div className="bg-white rounded-3xl border-4 border-[#0f172a] p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">📸 Thư Viện Ảnh (Ảnh Phụ)</h3>
                
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {galleryImages.map((imgUrl, index) => (
                      <div key={index} className="bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden flex items-center justify-center h-32 relative group">
                        <img 
                          src={imgUrl} 
                          alt={`Gallery ${index}`} 
                          className="w-full h-full object-contain" 
                        />
                        <button className="absolute top-2 right-2 w-8 h-8 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full bg-slate-50 rounded-2xl border-2 border-slate-200 border-dashed mb-4 py-8 flex flex-col items-center justify-center text-slate-500">
                    <p className="font-bold text-sm">Chưa có ảnh phụ nào</p>
                  </div>
                )}
                
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-6 rounded-xl border-2 border-slate-300 transition-all">
                  + Thêm ảnh phụ
                </button>
              </div>

              {/* General Info Form */}
              <form onSubmit={handleSaveGeneral} className="bg-white rounded-3xl border-4 border-[#0f172a] p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-5">
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">📝 Thông tin cơ bản</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tên sự kiện</label>
                  <input 
                    type="text" 
                    value={formData.tieu_de}
                    onChange={(e) => setFormData({...formData, tieu_de: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian bắt đầu</label>
                    <input 
                      type="datetime-local" 
                      value={formData.thoi_gian_bat_dau}
                      onChange={(e) => setFormData({...formData, thoi_gian_bat_dau: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian kết thúc</label>
                    <input 
                      type="datetime-local" 
                      value={formData.thoi_gian_ket_thuc}
                      onChange={(e) => setFormData({...formData, thoi_gian_ket_thuc: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Địa điểm tổ chức</label>
                  <input 
                    type="text" 
                    value={formData.dia_diem}
                    onChange={(e) => setFormData({...formData, dia_diem: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả chi tiết</label>
                  <textarea 
                    rows={4}
                    value={formData.mo_ta}
                    onChange={(e) => setFormData({...formData, mo_ta: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 px-8 rounded-xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2 transition-all"
                  >
                    <Save size={18} /> Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className="bg-white rounded-3xl border-4 border-slate-300 p-12 text-center border-dashed animate-slideUp">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="text-slate-400" size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Đang xây dựng</h3>
              <p className="text-slate-500 font-bold">Tính năng này đang được phát triển trong Phase tiếp theo.</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default EventManagementHub;
