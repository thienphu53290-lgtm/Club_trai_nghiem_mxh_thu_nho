import React, { useState, useEffect } from 'react';
import { Upload, Info, Rocket } from 'lucide-react';
import api from '../../api/axios';

const CreateEventTab = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    tieu_de: '',
    dia_diem: '',
    thoi_gian_bat_dau: '',
    thoi_gian_ket_thuc: '',
    hinh_thuc: 1, // 1: Offline, 2: Online
    gia_ve: 0,
    so_ve_mien_phi: 0,
    goi_dich_vu_id: '',
    mo_ta: '',
    goi_quang_cao: 0
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/event-packages');
      if (res.data) {
        setPackages(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, goi_dich_vu_id: res.data[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      // Default cover image if not provided
      data.append('anh_bia', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80');

      const res = await api.post('/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data) {
        if (res.data.status === 'enterprise_pending') {
          alert(res.data.message);
        } else if (res.data.ma_giao_dich) {
          alert('Tạo sự kiện thành công! Mã giao dịch thanh toán phí tạo sự kiện: ' + res.data.ma_giao_dich);
        } else {
          alert('Sự kiện đã được tạo thành công!');
        }
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo sự kiện.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-6 animate-slideUp bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 md:p-8 border-b-4 border-slate-100 bg-slate-50">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">✨ Khởi tạo Sự Kiện Mới</h2>
          <p className="text-slate-500 font-bold">Điền thông tin chi tiết để bắt đầu chiến dịch sự kiện của bạn.</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
          <form id="createEventForm" onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tên sự kiện *</label>
              <input 
                type="text" 
                name="tieu_de"
                required
                value={formData.tieu_de}
                onChange={handleChange}
                placeholder="VD: Hội thảo Công nghệ 2026..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian bắt đầu *</label>
                <input 
                  type="datetime-local" 
                  name="thoi_gian_bat_dau"
                  required
                  value={formData.thoi_gian_bat_dau}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian kết thúc *</label>
                <input 
                  type="datetime-local" 
                  name="thoi_gian_ket_thuc"
                  required
                  value={formData.thoi_gian_ket_thuc}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Hình thức tổ chức</label>
                <select 
                  name="hinh_thuc"
                  value={formData.hinh_thuc}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold transition-colors appearance-none bg-white"
                >
                  <option value={1}>Offline (Trực tiếp)</option>
                  <option value={2}>Online (Trực tuyến)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Địa điểm *</label>
                <input 
                  type="text" 
                  name="dia_diem"
                  required
                  value={formData.dia_diem}
                  onChange={handleChange}
                  placeholder="VD: 68 Nguyễn Huệ, Quận 1..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold transition-colors"
                />
              </div>
            </div>

            {/* Ticket & Packages */}
            <div className="bg-blue-50 rounded-2xl border-2 border-blue-100 p-5 space-y-5">
              <h3 className="font-black text-blue-900 flex items-center gap-2">
                <Info size={18} /> Gói Dịch Vụ & Vé
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Chọn gói dịch vụ nền tảng *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packages.map(pkg => (
                    <div 
                      key={pkg.id}
                      onClick={() => setFormData(prev => ({...prev, goi_dich_vu_id: pkg.id}))}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.goi_dich_vu_id == pkg.id 
                          ? 'border-blue-600 bg-white shadow-sm' 
                          : 'border-blue-200/50 bg-white/50 hover:bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-900">{pkg.ten_goi}</div>
                      <div className="text-xs font-semibold text-slate-500 mt-1 line-clamp-2">{pkg.mo_ta}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Giá vé (VNĐ) *</label>
                  <input 
                    type="number" 
                    name="gia_ve"
                    min="0"
                    required
                    value={formData.gia_ve}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-blue-500 focus:outline-none font-semibold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Số lượng vé mời (Miễn phí)</label>
                  <input 
                    type="number" 
                    name="so_ve_mien_phi"
                    min="0"
                    value={formData.so_ve_mien_phi}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-blue-500 focus:outline-none font-semibold transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả chi tiết</label>
              <textarea 
                name="mo_ta"
                rows={4}
                value={formData.mo_ta}
                onChange={handleChange}
                placeholder="Chia sẻ về sự kiện của bạn..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-semibold transition-colors resize-none"
              ></textarea>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t-4 border-slate-100 bg-white flex justify-end">
          <button 
            type="submit"
            form="createEventForm"
            disabled={loading}
            className={`px-8 py-4 rounded-2xl font-black text-white border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center gap-3 text-lg ${
              loading 
                ? 'bg-slate-400 cursor-not-allowed shadow-none translate-y-[6px] translate-x-[6px]' 
                : 'bg-blue-600 hover:bg-blue-700 active:translate-y-[6px] active:translate-x-[6px] active:shadow-none'
            }`}
          >
            {loading ? (
              <><div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div> Đang xử lý...</>
            ) : (
              <><Rocket size={24} /> Tạo Sự Kiện Mới</>
            )}
          </button>
        </div>

    </div>
  );
};

export default CreateEventTab;
