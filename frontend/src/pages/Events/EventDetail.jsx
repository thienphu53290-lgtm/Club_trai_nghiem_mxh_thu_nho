import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Gift, Globe, CheckCircle2, QrCode, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';

const EventDetail = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gallery, setGallery] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [registerResult, setRegisterResult] = useState(null);
  const [emailNhanVe, setEmailNhanVe] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${slug}`);
      const evt = res.data.event;
      setEvent(evt);
      
      // Parse gallery
      let images = [];
      if (evt.anh_bia) images.push(evt.anh_bia);
      if (evt.thu_vien_anh) {
        let extraImages = [];
        try {
          extraImages = typeof evt.thu_vien_anh === 'string' ? JSON.parse(evt.thu_vien_anh) : evt.thu_vien_anh;
        } catch (e) {}
        images = [...images, ...extraImages];
      }
      if (images.length === 0) images.push('http://localhost:8000/avt/skien_mac_dinh.png');
      setGallery(images);
      
    } catch (error) {
      console.error('Lỗi khi tải sự kiện:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    setRegisterResult(null);
    setShowModal(true);
    // Get user email from local storage or context if possible, 
    // Here we can try to fetch from user info if available globally.
    // For now, let user input it or it defaults to backend auth user email if empty.
  };

  const confirmRegister = async () => {
    setIsRegistering(true);
    try {
      const res = await api.post(`/events/${event.id}/register`, {
        email_nhan_ve: emailNhanVe
      });
      setRegisterResult(res.data);
      fetchEvent(); // Refresh to update tickets
    } catch (error) {
      console.error('Error registering:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsConfirmingPayment(true);
    try {
      const res = await api.post(`/events/payment/${registerResult.ma_giao_dich}/confirm`);
      // Sau khi thành công, biến registerResult thành màn hình success
      setRegisterResult({
        ...registerResult,
        is_free: true,
        message: res.data.message
      });
      fetchEvent();
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận thanh toán');
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Đang tải thông tin...</div>;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-slate-800 mb-4">Sự kiện không tồn tại</h2>
        <Link to="/events" className="text-indigo-600 font-bold hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-[100px]">
      <div className="max-w-[1200px] mx-auto px-5">
        
        <Link to="/events" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 transition-colors">
          <ArrowLeft size={20} /> Quay lại Sự Kiện
        </Link>

        {/* Header Title */}
        <div className="mb-8">
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
              {event.status}
            </span>
            {event.ve_mien_phi_con_lai > 0 && (
              <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide animate-pulse">
                🔥 Còn {event.ve_mien_phi_con_lai} vé FREE
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-4">{event.tieu_de}</h1>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column - Details */}
          <div className="flex-1">
            {/* Gallery Carousel */}
            <div className="bg-slate-900 rounded-[32px] overflow-hidden relative aspect-[16/10] mb-10 shadow-xl group">
              <img 
                src={gallery[currentImageIndex]} 
                alt="Gallery" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:8000/avt/skien_mac_dinh.png'; }}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
              />
              
              {gallery.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-2">
                    {gallery.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm mb-10">
              <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                  <Calendar size={20} />
                </span>
                Thông Tin Chi Tiết
              </h3>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium text-lg">
                {event.mo_ta && event.mo_ta.split('\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {event.giai_thuong && (
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-[32px] p-8 border border-amber-200 shadow-sm mb-10">
                <h3 className="text-2xl font-black text-amber-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <Gift size={20} />
                  </span>
                  Giveaway Đặc Biệt
                </h3>
                <p className="text-amber-800 font-bold text-lg">{event.giai_thuong}</p>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-28 bg-white rounded-[32px] p-8 border border-slate-200 shadow-xl">
              
              <div className="pb-6 border-b border-slate-100 mb-6 text-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Giá vé</span>
                <div className="text-4xl font-black">
                  {event.gia_ve > 0 ? (
                    event.ve_mien_phi_con_lai > 0 ? (
                      <div className="flex flex-col items-center">
                        <span className="text-pink-500 line-through text-2xl mb-1">{parseInt(event.gia_ve).toLocaleString()}đ</span>
                        <span className="text-emerald-600">MIỄN PHÍ</span>
                      </div>
                    ) : (
                      <span className="text-indigo-600">{parseInt(event.gia_ve).toLocaleString()}đ</span>
                    )
                  ) : (
                    <span className="text-emerald-600">MIỄN PHÍ</span>
                  )}
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Thời gian</h4>
                    <p className="text-slate-500 text-sm font-medium">{new Date(event.thoi_gian_bat_dau).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {new Date(event.thoi_gian_bat_dau).toLocaleDateString('vi-VN')}</p>
                    <p className="text-slate-500 text-sm font-medium">Đến {new Date(event.thoi_gian_ket_thuc).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {new Date(event.thoi_gian_ket_thuc).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                    {event.hinh_thuc === 1 ? <Globe size={24} /> : <MapPin size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Địa điểm</h4>
                    <p className="text-slate-500 text-sm font-medium">{event.hinh_thuc === 1 ? 'Sự kiện trực tuyến' : event.dia_diem}</p>
                    {event.hinh_thuc === 1 && (
                      <a href={event.dia_diem} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm font-bold hover:underline mt-1 block">Tham gia ngay</a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Số lượng tham gia</h4>
                    <p className="text-slate-500 text-sm font-medium">{event.attendees} / {event.so_luong_toi_da || 'Không giới hạn'}</p>
                  </div>
                </div>
              </div>

              {event.is_registered ? (
                <button disabled className="w-full bg-emerald-100 text-emerald-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed border border-emerald-200">
                  <CheckCircle2 size={20} /> Đã Đăng Ký
                </button>
              ) : (
                <button 
                  onClick={handleRegisterClick}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
                >
                  Đăng Ký Tham Gia
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-10"
            >
              <X size={18} />
            </button>
            
            <div className="h-32 bg-indigo-600 relative overflow-hidden">
              <img 
                src={event.anh_bia || 'http://localhost:8000/avt/skien_mac_dinh.png'} 
                alt="cover" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:8000/avt/skien_mac_dinh.png'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" 
              />
            </div>
            
            <div className="p-6 relative -mt-10">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white mx-auto mb-4">
                <Calendar size={32} className="text-indigo-600" />
              </div>

              {!registerResult ? (
                <>
                  <h3 className="text-xl font-black text-slate-800 text-center mb-2">{event.tieu_de}</h3>
                  <p className="text-slate-500 text-sm text-center mb-6">Bạn xác nhận muốn đăng ký tham gia sự kiện này?</p>
                  
                  <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Thời gian:</span>
                      <span className="font-bold text-slate-800">{new Date(event.thoi_gian_bat_dau).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Chi phí:</span>
                      <span className="font-bold text-indigo-600">
                        {event.gia_ve == 0 || event.ve_mien_phi_con_lai > 0 
                          ? 'Miễn phí' 
                          : `${parseInt(event.gia_ve).toLocaleString()} VNĐ`
                        }
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email nhận vé điện tử (e-Ticket)</label>
                    <input 
                      type="email" 
                      value={emailNhanVe}
                      onChange={(e) => setEmailNhanVe(e.target.value)}
                      placeholder="Để trống để dùng email tài khoản" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-slate-400 mt-2">Hệ thống sẽ gửi một bản sao của vé chứa mã QR check-in qua email này.</p>
                  </div>

                  <button 
                    onClick={confirmRegister}
                    disabled={isRegistering}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isRegistering ? 'Đang xử lý...' : 'Xác nhận Đăng ký'}
                  </button>
                </>
              ) : (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {registerResult.is_free ? (
                    <>
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-2">Đăng ký thành công!</h3>
                      <p className="text-slate-500 text-sm mb-6">{registerResult.message}</p>
                      
                      <button 
                        onClick={() => setShowModal(false)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all"
                      >
                        Đóng
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-black text-slate-800 mb-2">Thanh Toán Trực Tuyến</h3>
                      <p className="text-slate-500 text-sm mb-4">Vui lòng quét mã QR dưới đây bằng ứng dụng ngân hàng hoặc Momo để hoàn tất đăng ký.</p>
                      
                      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6">
                        <div className="bg-white p-2 rounded-xl border border-slate-200 inline-block mb-3 shadow-sm">
                          <img 
                            src={`https://img.vietqr.io/image/mbbank-000000000-compact2.png?amount=${registerResult.gia_ve}&addInfo=${registerResult.ma_giao_dich}&accountName=HE%20THONG%20SU%20KIEN`} 
                            alt="VietQR" 
                            className="w-48 h-48 mx-auto object-cover"
                          />
                        </div>
                        <p className="text-xs text-indigo-600 font-bold mb-1 uppercase">Mã giao dịch (Nội dung CK)</p>
                        <p className="text-lg font-black text-indigo-900 tracking-wider mb-2">{registerResult.ma_giao_dich}</p>
                        
                        <p className="text-xs text-indigo-600 font-bold mb-1 uppercase">Số tiền</p>
                        <p className="text-xl font-black text-pink-600">{parseInt(registerResult.gia_ve).toLocaleString()} VNĐ</p>
                      </div>
                      
                      <button 
                        onClick={handleConfirmPayment}
                        disabled={isConfirmingPayment}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isConfirmingPayment ? 'Đang xác nhận...' : 'Giả lập: Tôi đã thanh toán xong'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventDetail;
