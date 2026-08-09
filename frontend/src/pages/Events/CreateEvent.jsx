import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, X, Calendar, MapPin, Users, Ticket, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAdPackage, setSelectedAdPackage] = useState(0);
  
  // Form State
  const [formData, setFormData] = useState({
    tieu_de: '',
    dia_diem: '',
    thoi_gian_bat_dau: '',
    thoi_gian_ket_thuc: '',
    gia_ve: 0,
    mo_ta: ''
  });
  const [anhBiaFile, setAnhBiaFile] = useState(null);
  const [thuVienAnhFiles, setThuVienAnhFiles] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (selectedPackage?.loai_phi === 'percent') {
      setSelectedAdPackage(499000);
    }
  }, [selectedPackage]);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/event-packages');
      setPackages(res.data);
    } catch (error) {
      console.error('Error fetching packages', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    
    if (step === 1 && !selectedPackage) {
      window.dispatchEvent(new CustomEvent('show_global_toast', {
        detail: {
          title: 'Lỗi',
          message: 'Vui lòng chọn một gói dịch vụ để tiếp tục',
          type: 'error'
        }
      }));
      return;
    }
    
    if (step === 2) {
      setStep(3); // Go to Ad selection
      return;
    }
    
    setStep(2); // From step 1 to step 2
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });
      payload.append('goi_dich_vu_id', selectedPackage.id);
      payload.append('goi_quang_cao', selectedAdPackage);
      
      if (anhBiaFile) {
        payload.append('anh_bia_file', anhBiaFile);
      }
      
      thuVienAnhFiles.forEach((file) => {
        if (file) {
          payload.append('thu_vien_anh_files[]', file);
        }
      });
      
      const res = await api.post('/events', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.status === 'payment_required') {
        setPaymentResult(res.data);
        setStep(4);
      } else if (res.data.status === 'enterprise_pending') {
        setShowContactAdminModal(true);
      } else {
        window.dispatchEvent(new CustomEvent('show_global_toast', {
          detail: {
            title: 'Thành công',
            message: res.data.message,
            type: 'success'
          }
        }));
        navigate('/events');
      }
    } catch (error) {
      console.error('Error creating event', error);
      window.dispatchEvent(new CustomEvent('show_global_toast', {
        detail: {
          title: 'Lỗi',
          message: error.response?.data?.message || 'Có lỗi xảy ra',
          type: 'error'
        }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      await api.post(`/events/payment/${paymentResult.ma_giao_dich}/confirm`);
      window.dispatchEvent(new CustomEvent('show_global_toast', {
        detail: {
          title: 'Thành công',
          message: 'Thanh toán thành công! Sự kiện của bạn đã được đưa lên hệ thống.',
          type: 'success'
        }
      }));
      navigate('/events');
    } catch (error) {
      console.error('Error confirming payment', error);
      window.dispatchEvent(new CustomEvent('show_global_toast', {
        detail: {
          title: 'Lỗi',
          message: 'Lỗi xác nhận thanh toán',
          type: 'error'
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Tổ Chức Sự Kiện</h1>
          <p className="text-lg text-slate-500 font-medium">Đưa sự kiện của bạn tiếp cận hàng ngàn người tham gia tiềm năng</p>
          
          {/* Stepper */}
          <div className="flex items-center justify-center mt-8 space-x-2 sm:space-x-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>1</div>
              <span className="font-semibold hidden sm:inline">Chọn Gói</span>
            </div>
            <div className="w-8 sm:w-12 h-1 bg-slate-200 rounded">
              <div className={`h-full bg-indigo-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>2</div>
              <span className="font-semibold hidden sm:inline">Thông Tin</span>
            </div>
            <div className="w-8 sm:w-12 h-1 bg-slate-200 rounded">
              <div className={`h-full bg-indigo-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>3</div>
              <span className="font-semibold hidden sm:inline">Quảng Cáo</span>
            </div>
            <div className="w-8 sm:w-12 h-1 bg-slate-200 rounded">
              <div className={`h-full bg-indigo-600 transition-all ${step >= 4 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 4 ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 4 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>4</div>
              <span className="font-semibold hidden sm:inline">Hoàn Tất</span>
            </div>
          </div>
        </div>

        {/* Step 1: Pricing */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`bg-white rounded-[32px] p-6 sm:p-8 border-2 transition-all cursor-pointer relative flex flex-col ${selectedPackage?.id === pkg.id ? 'border-indigo-600 shadow-xl shadow-indigo-100 scale-105 z-10' : 'border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md'}`}
              >
                {selectedPackage?.id === pkg.id && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={20} />
                  </div>
                )}
                
                <h3 className="text-lg font-black text-slate-500 uppercase tracking-wider mb-2">{pkg.ten_goi}</h3>
                <div className="mb-4 min-h-[48px] flex items-end">
                  {pkg.loai_phi === 'percent' ? (
                    <span className="text-4xl font-black text-slate-800">{parseInt(pkg.gia_tri)}%<span className="text-lg text-slate-400 font-medium ml-1">/vé</span></span>
                  ) : pkg.gia_tri == 0 ? (
                    <span className="text-4xl font-black text-emerald-500">Miễn phí</span>
                  ) : (
                    <span className="text-4xl font-black text-slate-800">{parseInt(pkg.gia_tri).toLocaleString()}<span className="text-lg text-slate-400 font-medium ml-1">đ</span></span>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{pkg.mo_ta}</p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Users size={12} className="text-emerald-600" />
                      </div>
                      <span className="leading-tight">Tối đa {pkg.so_luong_toi_da ? pkg.so_luong_toi_da : 'Vô cực'} người</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      </div>
                      <span className="leading-tight">Hỗ trợ công cụ check-in</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      </div>
                      <span className="leading-tight">Báo cáo doanh thu realtime</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto">
                  <button 
                    className={`w-full py-3.5 rounded-2xl font-bold transition-all ${selectedPackage?.id === pkg.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {pkg.loai_phi === 'percent' ? 'Liên Hệ Quản Lý' : 'Chọn Gói Này'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 1 Footer */}
        {step === 1 && (
          <div className="mt-10 text-center">
              <button 
                onClick={handleNextStep}
                disabled={!selectedPackage}
                className={`font-black py-4 px-12 rounded-full transition-all flex items-center gap-2 mx-auto ${selectedPackage ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Tiếp tục điền thông tin <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Step 2: Form */}
        {step === 2 && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-200 shadow-xl max-w-3xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">Thông Tin Sự Kiện</h2>
              <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm">
                Đang dùng: {selectedPackage?.ten_goi}
              </div>
            </div>

            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tên sự kiện <span className="text-red-500">*</span></label>
                <input required type="text" name="tieu_de" onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Ví dụ: Workshop Lập trình Web..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian bắt đầu <span className="text-red-500">*</span></label>
                  <input required type="datetime-local" name="thoi_gian_bat_dau" onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Thời gian kết thúc <span className="text-red-500">*</span></label>
                  <input required type="datetime-local" name="thoi_gian_ket_thuc" onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Giá vé (VNĐ) <span className="text-red-500">*</span></label>
                  <input required type="number" min="0" step="1000" name="gia_ve" onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="0 nếu miễn phí" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Địa điểm tổ chức <span className="text-red-500">*</span></label>
                  <input required type="text" name="dia_diem" onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="Địa chỉ cụ thể hoặc Link Online" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ảnh Bìa (Bắt buộc) <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <input required type="file" accept="image/*" onChange={(e) => setAnhBiaFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-full px-5 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center gap-3 group-hover:bg-slate-100 transition-colors">
                    <ImageIcon className="text-slate-400" />
                    <span className="font-medium text-slate-500">{anhBiaFile ? anhBiaFile.name : 'Nhấn để chọn ảnh từ máy...'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Thư viện ảnh (Tối đa 3 ảnh phụ - Không bắt buộc)</label>
                <div className="relative group">
                  <input type="file" multiple accept="image/*" onChange={(e) => setThuVienAnhFiles(Array.from(e.target.files).slice(0, 3))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-full px-5 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center gap-3 group-hover:bg-slate-100 transition-colors">
                    <ImageIcon className="text-slate-400" />
                    <span className="font-medium text-slate-500">
                      {thuVienAnhFiles.length > 0 
                        ? `Đã chọn ${thuVienAnhFiles.length} ảnh` 
                        : 'Nhấn để chọn nhiều ảnh (Tối đa 3)...'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả sự kiện</label>
                <textarea rows="4" name="mo_ta" onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium resize-none" placeholder="Hãy viết gì đó hấp dẫn về sự kiện của bạn..."></textarea>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  Quay lại
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
                  Tiếp tục chọn Quảng cáo <ChevronRight size={20} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Ads Package */}
        {step === 3 && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-200 shadow-xl max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-800 mb-2">Tăng Tốc Tiếp Cận</h2>
              <p className="text-slate-500 font-medium">Bạn có muốn sự kiện hiển thị nổi bật trên Bảng tin để bán được nhiều vé hơn không?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* No Ads */}
              <div 
                onClick={() => selectedPackage?.loai_phi !== 'percent' && setSelectedAdPackage(0)}
                className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer relative flex flex-col ${selectedPackage?.loai_phi === 'percent' ? 'opacity-50 pointer-events-none' : selectedAdPackage === 0 ? 'border-slate-800 shadow-lg' : 'border-slate-100 hover:border-slate-300'}`}
              >
                {selectedAdPackage === 0 && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={20} />
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-700 mb-2">Không, Cảm ơn</h3>
                <div className="mb-4">
                  <span className="text-2xl font-black text-slate-400">0đ</span>
                </div>
                <p className="text-sm text-slate-500 mb-6 flex-grow">Sự kiện sẽ chỉ hiển thị trong danh sách sự kiện thông thường.</p>
              </div>

              {/* Standard Ads */}
              <div 
                onClick={() => selectedPackage?.loai_phi !== 'percent' && setSelectedAdPackage(299000)}
                className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer relative flex flex-col ${selectedPackage?.loai_phi === 'percent' ? 'opacity-50 pointer-events-none' : selectedAdPackage === 299000 ? 'border-indigo-600 shadow-xl shadow-indigo-100 scale-105 z-10' : 'border-indigo-50 hover:border-indigo-200'}`}
              >
                {selectedAdPackage === 299000 && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={20} />
                  </div>
                )}
                <h3 className="text-xl font-bold text-indigo-700 mb-2">Gói Phổ Thông</h3>
                <div className="mb-4">
                  {selectedPackage?.ten_goi?.toLowerCase().includes('pro') ? (
                    <>
                      <span className="text-sm text-slate-400 line-through mr-2">299,000đ</span>
                      <span className="text-2xl font-black text-indigo-600">179,400đ</span>
                      <div className="text-xs font-bold text-rose-500 mt-1">Giảm 40% (Đặc quyền Pro)</div>
                    </>
                  ) : (
                    <span className="text-2xl font-black text-indigo-600">299,000đ</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-6 flex-grow">Banner quảng cáo sẽ xuất hiện xen kẽ ngẫu nhiên trên Bảng tin của người dùng.</p>
              </div>

              {/* VIP Ads */}
              <div 
                onClick={() => setSelectedAdPackage(499000)}
                className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer relative flex flex-col ${selectedAdPackage === 499000 ? 'border-rose-500 shadow-xl shadow-rose-100 scale-105 z-10' : 'border-rose-50 hover:border-rose-200'}`}
              >
                {selectedAdPackage === 499000 && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={20} />
                  </div>
                )}
                <div className="absolute -top-4 left-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  🔥 Tốt Nhất
                </div>
                <h3 className="text-xl font-bold text-rose-600 mb-2 mt-2">Gói Độc Quyền</h3>
                <div className="mb-4">
                  {selectedPackage?.loai_phi === 'percent' ? (
                    <>
                      <span className="text-sm text-slate-400 line-through mr-2">499,000đ</span>
                      <span className="text-2xl font-black text-emerald-500">Miễn Phí</span>
                      <div className="text-xs font-bold text-emerald-600 mt-1">Đặc quyền Enterprise</div>
                    </>
                  ) : selectedPackage?.ten_goi?.toLowerCase().includes('pro') ? (
                    <>
                      <span className="text-sm text-slate-400 line-through mr-2">499,000đ</span>
                      <span className="text-2xl font-black text-rose-500">299,400đ</span>
                      <div className="text-xs font-bold text-rose-500 mt-1">Giảm 40% (Đặc quyền Pro)</div>
                    </>
                  ) : (
                    <span className="text-2xl font-black text-rose-500">499,000đ</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-6 flex-grow">
                  Tần suất xuất hiện cực cao trên Bảng tin. Được hiển thị Super Banner tại Trang chủ và Popup cho người dùng mới.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button onClick={() => setStep(2)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors">
                Quay lại
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-full transition-all disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-indigo-200">
                {isSubmitting ? 'Đang xử lý...' : 'Đăng Sự Kiện Ngay'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && paymentResult && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-200 shadow-xl max-w-md mx-auto text-center animate-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Thanh Toán Phí Khởi Tạo</h2>
            <p className="text-slate-500 text-sm mb-8">Vui lòng quét mã QR dưới đây để thanh toán tiền mua gói <strong>{selectedPackage?.ten_goi}</strong>. Sự kiện của bạn sẽ được hiển thị ngay lập tức.</p>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 mb-8 relative overflow-hidden">
              <div className="bg-white p-3 rounded-2xl inline-block shadow-sm mb-4">
                <img 
                  src={`https://img.vietqr.io/image/mbbank-00000000-compact2.png?amount=${paymentResult.so_tien}&addInfo=${paymentResult.ma_giao_dich}&accountName=HE THONG SU KIEN`} 
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Mã Giao Dịch</p>
              <p className="text-xl font-black text-indigo-900 mb-4">{paymentResult.ma_giao_dich}</p>
              
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Số Tiền</p>
              <p className="text-3xl font-black text-pink-600">{parseInt(paymentResult.so_tien).toLocaleString()} VNĐ</p>
            </div>

            <button 
              onClick={handleConfirmPayment}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all shadow-lg"
            >
              Giả lập: Đã Thanh Toán Thành Công
            </button>
          </div>
        )}

      </div>

      {/* Contact Admin Modal */}
      {showContactAdminModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowContactAdminModal(false)}></div>
          <div className="relative z-10 w-full max-w-[420px] bg-white rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(201,54,56,1)] overflow-hidden animate-in zoom-in-95 p-8 text-center">
            <button 
              onClick={() => setShowContactAdminModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">🤝</span>
            </div>

            <div className="inline-block bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-4 border border-rose-100">
              ✨ Dành Riêng Cho Đối Tác
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-3 leading-tight">Liên Hệ Hợp Tác<br/>Doanh Nghiệp</h2>
            
            <p className="text-sm font-medium text-slate-600 mb-6 px-2">
              Hệ thống phát hiện bạn muốn tạo sự kiện quy mô lớn (Gói % doanh thu). Hãy liên hệ trực tiếp với Ban Quản Trị trước ít nhất 1 tháng để được ký kết hợp đồng và cấp quyền ưu tiên.
            </p>
            
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-left flex items-start gap-3 mb-6">
              <div className="text-emerald-600 mt-0.5">
                <CheckCircle2 size={18} strokeWidth={3} />
              </div>
              <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                Đảm bảo an toàn thanh toán, hỗ trợ công cụ kiểm soát độc quyền. Rất mong được hợp tác cùng bạn!
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  window.location.href = 'tel:0123456789';
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 rounded-2xl transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2"
              >
                📞 Gọi Hotline Ngay
              </button>
              <button 
                onClick={() => setShowContactAdminModal(false)}
                className="w-full font-bold text-slate-500 hover:text-slate-800 py-2"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
