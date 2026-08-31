import React, { useState } from 'react';
import Modal from './Modal';
import { BookOpen, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const DisclaimerModal = ({ isOpen, onClose }) => {
  const [isRead, setIsRead] = useState(false);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="THÔNG BÁO TÍNH CHẤT DỰ ÁN"
      icon={BookOpen}
      iconColor="text-[#0b57d0]"
      iconBg="bg-blue-50 border-blue-200"
      size="lg"
      showCloseButton={true}
      closeOnBackdropClick={false}
      footer={
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 text-xs font-semibold w-full sm:w-auto">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <span>Cam kết an toàn dữ liệu & trải nghiệm học tập thuần túy</span>
          </div>
          <button
            onClick={onClose}
            disabled={!isRead}
            type="button"
            className={`w-full sm:w-auto justify-center px-8 py-3.5 font-extrabold text-sm sm:text-base rounded-2xl transition-all flex items-center gap-2.5 shrink-0 border-none
              ${isRead 
                ? 'bg-gradient-to-r from-[#0b57d0] to-indigo-600 hover:from-indigo-600 hover:to-[#0b57d0] text-white shadow-[0_6px_20px_rgba(11,87,208,0.35)] hover:shadow-[0_8px_25px_rgba(11,87,208,0.5)] transform hover:-translate-y-0.5 cursor-pointer' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <span>Tôi đã hiểu, vào Trang chủ</span>
            <ArrowRight size={18} />
          </button>
        </div>
      }
    >
      <div className="space-y-6 text-slate-800 py-2">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold px-4 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 shadow-xs">
          <Sparkles size={15} className="text-amber-600 animate-pulse" />
          <span>DỰ ÁN NGHIÊN CỨU & THỰC HÀNH LẬP TRÌNH PHI THƯƠNG MẠI</span>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-700 font-normal leading-relaxed">
          <p className="m-0 text-slate-900 font-extrabold text-base sm:text-lg">
            Chào mừng bạn đến với không gian trải nghiệm <span className="text-[#0b57d0]">PIVO MXH Thu Nhỏ!</span>
          </p>
          <p className="m-0">
            Chúng tôi xin trân trọng gửi lời chào và xin lưu ý đến toàn thể quý người dùng, khách truy cập: <strong>Đây là một hệ thống trang web và mạng xã hội được thiết kế, nghiên cứu và xây dựng HOÀN TOÀN VÌ MỤC ĐÍCH HỌC TẬP & PHÁT TRIỂN KỸ NĂNG CÔNG NGHỆ.</strong>
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
              <p className="m-0 text-slate-700 text-sm sm:text-base">
                <strong>Phi thương mại hóa:</strong> Dự án không thuộc bất kỳ tổ chức kinh doanh thực tế nào và không có mục đích thương mại, không kinh doanh hay buôn bán dịch vụ thực tế dưới bất kỳ hình thức nào.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0"></div>
              <p className="m-0 text-slate-700 text-sm sm:text-base">
                <strong>Dữ liệu mô phỏng:</strong> Toàn bộ các thông tin sản phẩm, bài đánh giá, gian hàng affiliate hay các bài đăng trong hệ thống đều là dữ liệu thực hành để kiểm nghiệm khả năng vận hành của kiến trúc hệ thống giao tiếp Frontend - Backend.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0"></div>
              <p className="m-0 text-slate-700 text-sm sm:text-base">
                <strong>Trải nghiệm thoải mái:</strong> Bạn có thể tự do đăng ký tài khoản, trải nghiệm trò chuyện trực tuyến, đăng bài và khám phá toàn bộ tính năng với tâm thế trải nghiệm một không gian đồ án công nghệ thuần túy.
              </p>
            </div>
          </div>
          
          {/* Checkbox xác nhận */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-[#0b57d0] checked:border-[#0b57d0] transition-colors cursor-pointer"
                  checked={isRead}
                  onChange={(e) => setIsRead(e.target.checked)}
                />
                <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-slate-700 font-bold group-hover:text-slate-900 transition-colors select-none">
                Tôi đã đọc và hiểu rõ tính chất của dự án này.
              </span>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DisclaimerModal;
