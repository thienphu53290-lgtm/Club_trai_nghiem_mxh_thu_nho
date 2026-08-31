import React from 'react';
import { Package, Star, MessageSquare, Calendar } from 'lucide-react';

const features = [
  {
    icon: <Package size={24} />,
    title: 'Nhận sản phẩm trải nghiệm',
    desc: 'Đăng ký nhận sản phẩm từ nhãn hàng, dùng thử thật rồi viết đánh giá — không quảng cáo trá hình.'
  },
  {
    icon: <Star size={24} />,
    title: 'Đánh giá có kiểm chứng',
    desc: 'Mỗi review đều gắn hoá đơn hoặc ảnh mở hộp, gắn nhãn đã xác minh để bạn tin được.'
  },
  {
    icon: <MessageSquare size={24} />,
    title: 'Bảng tin cộng đồng',
    desc: 'Chia sẻ khoảnh khắc, hỏi đáp trước khi mua và nhận lời nhắn từ những người đã dùng.'
  },
  {
    icon: <Calendar size={24} />,
    title: 'Sự kiện & thử nghiệm nhóm',
    desc: 'Livestream mở hộp, buổi so sánh sản phẩm và các đợt test nhóm hàng tháng.'
  }
];

const Features = () => {
  return (
    <section className="px-5 py-10 md:py-[60px] relative z-10">
      <div className="max-w-[1320px] mx-auto">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-[2rem] font-extrabold text-text-dark mb-2">Club có gì?</h2>
          <p className="text-text-light text-sm md:text-[1.05rem]">Bốn hoạt động chính giúp bạn quyết định mua sắm tự tin hơn.</p>
        </div>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:mx-0 sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {features.map((feature, index) => (
            <div key={index} className="w-[280px] sm:w-auto shrink-0 snap-center border border-border-color rounded-[20px] md:rounded-[24px] p-6 md:p-8 bg-white transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.03)] flex flex-col">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#fcebeb] rounded-xl flex items-center justify-center mb-4 md:mb-6 text-primary shrink-0">
                {feature.icon}
              </div>
              <h3 className="text-base md:text-[1.15rem] font-bold mb-2 md:mb-3 text-text-dark">{feature.title}</h3>
              <p className="text-sm md:text-[0.95rem] text-text-light leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
