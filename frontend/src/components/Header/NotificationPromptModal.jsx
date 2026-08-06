import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Settings, RefreshCw } from 'lucide-react';

const NotificationPromptModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState('welcome'); // 'welcome' | 'verification' | 'guide'
  const [permissionState, setPermissionState] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');

  useEffect(() => {
    if (typeof Notification === 'undefined') return;
    setPermissionState(Notification.permission);
  }, []);

  const triggerDemoOSPush = () => {
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        const n = new Notification("🌟 Club Trải Nghiệm & Realtime", {
          body: "Chúc mừng! Hệ thống đã phát sóng thành công ra màn hình hệ điều hành của bạn!",
          icon: "/favicon.svg",
          silent: false
        });
        n.onclick = () => window.focus();
      }
    } catch (e) {
      console.warn("Không thể hiển thị OS Notification:", e);
    }
  };

  const handleAllowClick = async () => {
    try {
      if (typeof Notification !== 'undefined') {
        const result = await Notification.requestPermission();
        setPermissionState(result);

        if (result === 'granted') {
          triggerDemoOSPush();
          if (typeof window !== 'undefined' && window.OneSignal && typeof window.OneSignal.Slidedown?.promptPush === 'function') {
            try { window.OneSignal.Slidedown.promptPush(); } catch (e) {}
          }
          // Chuyển sang bước xác minh xem hệ điều hành máy tính có bị tắt không
          setStep('verification');
        } else {
          // Nếu bị từ chối hoặc máy đang chặn, chuyển thẳng tới trang Hướng Dẫn Mở Khóa
          setStep('guide');
        }
      }
    } catch (error) {
      console.error("Lỗi khi yêu cầu quyền thông báo:", error);
      setStep('guide');
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem('skip_notif_prompt_session', 'true');
    setShowModal(false);
    setStep('welcome');
  };

  // Lắng nghe sự kiện từ nút chuông hoặc nút test để hiển thị Bảng hỏi
  useEffect(() => {
    const handleForceShow = (e) => {
      if (typeof Notification !== 'undefined') {
        if (e.detail?.fromBellClick) {
          // Lần đầu bấm chuông trong phiên đăng nhập: Ưu tiên mở bảng chào mời mượt mà hoặc hướng dẫn nếu đang bị block
          setStep(Notification.permission === 'denied' ? 'guide' : 'welcome');
        } else if (Notification.permission === 'granted' && e.detail?.fromTest) {
          triggerDemoOSPush();
          setStep('verification');
        } else if (Notification.permission === 'denied') {
          setStep('guide');
        } else {
          setStep('welcome');
        }
      } else {
        setStep('welcome');
      }
      setShowModal(true);
    };
    window.addEventListener('open_notif_prompt_modal', handleForceShow);
    return () => window.removeEventListener('open_notif_prompt_modal', handleForceShow);
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all animate-fadeIn">
      <div className="bg-gradient-to-br from-white via-white to-[#fff5f5] border-2 border-[#0f172a] rounded-[32px] p-6 sm:p-8 max-w-[500px] w-full shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative max-h-[90vh] overflow-y-auto">
        {/* Nút đóng */}
        <button 
          onClick={handleSkip} 
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all border-none cursor-pointer"
          title="Đóng lại"
        >
          <X size={18} />
        </button>

        {step === 'welcome' && (
          <div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fcebeb] border-2 border-[#c93638]/30 flex items-center justify-center text-[#c93638] mb-5 shadow-inner">
              <Bell size={32} className="animate-bounce" />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-extrabold tracking-wider text-[#c93638] uppercase bg-[#fff1f1] px-3 py-1 rounded-full w-max mb-3 border border-[#fbdada]">
              <Sparkles size={14} /> Đặc quyền thành viên Club
            </div>

            <h3 className="text-xl sm:text-[1.35rem] font-black text-slate-900 leading-tight mb-2.5">
              Bật thông báo để không bỏ lỡ tin hay!
            </h3>

            <p className="text-slate-600 font-medium text-sm leading-relaxed mb-5">
              Hệ thống phát hiện bạn chưa mở chuông báo. Hãy kích hoạt ngay để nhận tức thì các đánh giá sản phẩm hot và tin tức độc quyền thẳng ra màn hình máy tính ngay cả khi đã đóng trang web!
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100/80 p-3 rounded-2xl mb-6 border border-slate-200/60">
              <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
              <span>An toàn tuyệt đối, chỉ gửi thông báo quan trọng. Bạn có thể tắt bất cứ lúc nào!</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleAllowClick} 
                className="flex-1 py-3.5 px-6 bg-[#c93638] hover:bg-[#a82527] text-white rounded-2xl font-extrabold text-[0.95rem] transition-all transform active:translate-y-0.5 border-none cursor-pointer flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              >
                👉 Bật Thông Báo Ngay <ArrowRight size={18} />
              </button>
              <button 
                onClick={handleSkip} 
                className="py-3.5 px-5 bg-transparent hover:bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm transition-colors border-none cursor-pointer"
              >
                Để sau
              </button>
            </div>
          </div>
        )}

        {step === 'verification' && (
          <div className="text-center py-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-300 shadow-inner">
              <CheckCircle2 size={38} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Đã gửi tín hiệu bật thông báo!</h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed mb-6">
              Hệ thống vừa gửi 1 thông báo thử nghiệm ra màn hình máy tính của bạn. <br/>
              <strong>Bạn có thấy tin nhắn nảy ra ở sát cạnh viền màn hình không?</strong>
            </p>
            
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => { localStorage.setItem('os_push_verified', 'true'); alert("🎉 Tuyệt vời! Bạn đã xác nhận nhận thông báo thành công ra viền màn hình OS!"); setShowModal(false); setStep('welcome'); }}
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm transition-all border-none cursor-pointer flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
              >
                ✅ Có, tôi thấy thông báo nổ ra rồi!
              </button>
              <button 
                onClick={() => setStep('guide')}
                className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-extrabold text-sm transition-all border-none cursor-pointer flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
              >
                ❌ Không thấy gì (Máy Mac của tôi đang chặn)
              </button>
            </div>
          </div>
        )}

        {step === 'guide' && (
          <div className="text-left">
            <div className="flex items-center gap-2 text-[#c93638] font-black text-base mb-3">
              <AlertTriangle size={24} className="shrink-0" />
              <span>Hướng Dẫn Mở Khóa Cài Đặt (Hệ Điều Hành)</span>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4 bg-slate-100 p-3 rounded-xl border border-slate-200">
              💡 <strong className="text-slate-700">Tại sao web không tự dẫn bạn sang cài đặt máy?</strong> Do luật bảo mật hệ điều hành, trình duyệt Web (Chrome) bị cấm tự động mở hoặc chuyển hướng vào ứng dụng Cài đặt (System Settings) của Mac/Windows. Bạn vui lòng mở bằng 2 bước tay siêu nhẹ nhàng dưới đây:
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl">
                <h4 className="font-extrabold text-xs text-rose-950 flex items-center gap-1.5 m-0 mb-1.5">
                  <Settings size={16} /> 1. Nếu bị tắt ở máy Mac (như ảnh bạn chụp):
                </h4>
                <ul className="text-[13px] text-slate-700 font-medium leading-relaxed pl-5 m-0 space-y-1">
                  <li>Mở <strong>System Settings (Cài đặt hệ thống Mac)</strong> ➡️ Chọn <strong>Notifications</strong>.</li>
                  <li>Tìm <strong>Google Chrome</strong> ➡️ Gạt công tắc <strong>Allow notifications</strong> sang <strong>MÀU XANH</strong>!</li>
                  <li>Đảm bảo chọn kiểu hiển thị là <strong>Banners</strong> hoặc <strong>Alerts</strong>.</li>
                </ul>
              </div>

              <div className="p-3.5 bg-amber-50 border-2 border-amber-200 rounded-2xl">
                <h4 className="font-extrabold text-xs text-amber-900 flex items-center gap-1.5 m-0 mb-1.5">
                  🔒 2. Nếu lỡ chọn "Chặn/Block" trên trình duyệt:
                </h4>
                <p className="text-[13px] text-slate-700 font-medium leading-relaxed m-0">
                  Click vào biểu tượng <strong>Ổ Khóa 🔒</strong> bên trái chữ <code>localhost:5173</code> ➡️ Ở dòng <strong>Thông báo (Notifications)</strong>, chuyển sang <strong>Cho phép (Allow)</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => { triggerDemoOSPush(); alert("🚀 Đã phát tín hiệu! Nếu bạn vừa gạt mở công tắc sang màu xanh ở Cài Đặt Mac, tin nhắn sẽ nổ ra viền màn hình ngay!"); }}
                className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-2xl font-extrabold text-xs transition-all border-none cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw size={16} /> Đã bật XONG! Bắn thử lại!
              </button>
              <button 
                onClick={() => { setShowModal(false); setStep('welcome'); }}
                className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl font-bold text-xs border-none cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPromptModal; // Đảm bảo giao diện Soft Prompt chuẩn UX của mạng xã hội cao cấp
