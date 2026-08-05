import React from 'react';
import Modal from './Modal';
import { BookOpen, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const DisclaimerModal = ({ isOpen, onClose }) => {
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
        <div className="w-full flex items-center justify-between gap-4 py-1">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <span>Cam kết an toàn dữ liệu & trải nghiệm học tập thuần túy</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="px-8 py-3.5 bg-gradient-to-r from-[#0b57d0] to-indigo-600 hover:from-indigo-600 hover:to-[#0b57d0] text-white font-extrabold text-sm sm:text-base rounded-2xl transition-all shadow-[0_6px_20px_rgba(11,87,208,0.35)] hover:shadow-[0_8px_25px_rgba(11,87,208,0.5)] transform hover:-translate-y-0.5 border-none cursor-pointer flex items-center gap-2.5 shrink-0"
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
            Chào mừng bạn đến với không gian trải nghiệm <span className="text-[#0b57d0]">Club Trải Nghiệm MXH Thu Nhỏ!</span>
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
        </div>
      </div>
    </Modal>
  );
};

export default DisclaimerModal;
