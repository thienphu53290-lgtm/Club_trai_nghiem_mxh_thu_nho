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
    <section className="px-5 py-[60px]">
      <div className="max-w-[1320px] mx-auto">
        <div className="mb-8">
          <h2 className="text-[2rem] font-extrabold text-text-dark mb-2">Club có gì?</h2>
          <p className="text-text-light text-[1.05rem]">Bốn hoạt động chính giúp bạn quyết định mua sắm tự tin hơn.</p>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="border border-border-color rounded-[24px] p-8 bg-white transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.03)]">
              <div className="w-14 h-14 bg-[#fcebeb] rounded-xl flex items-center justify-center mb-6 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-[1.15rem] font-bold mb-3 text-text-dark">{feature.title}</h3>
              <p className="text-text-light text-[0.95rem] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
