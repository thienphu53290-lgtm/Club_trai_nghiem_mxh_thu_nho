import React, { useState } from 'react';
import { BadgeCheck, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [activeThumb, setActiveThumb] = useState(0);
  const images = [
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop'
  ];

  return (
    <section className="px-5 py-[30px]">
      <div className="max-w-[1320px] mx-auto flex items-center gap-[60px] border border-border-color rounded-[32px] p-[60px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        {/* Content */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-[#fcebeb] text-primary px-4 py-1.5 rounded-full text-[0.85rem] font-semibold mb-5">
            <BadgeCheck size={16} className="text-primary" />
            Cộng đồng đánh giá có kiểm chứng
          </div>
          
          <h1 className="text-[3.2rem] font-extrabold leading-[1.15] tracking-tight mb-5 text-text-dark">
            Mua online không còn hên xui
          </h1>
          
          <p className="text-[1.05rem] text-text-light leading-relaxed mb-8 w-full">
            Thành viên dùng thử sản phẩm thật, viết đánh giá trung thực kèm ảnh và hoá đơn. Đọc trước khi mua, chia sẻ sau khi dùng.
          </p>
          
          <div className="flex gap-4">
            <button className="bg-primary text-white border-none px-7 py-3.5 rounded-full font-semibold text-[1rem] flex items-center gap-2 cursor-pointer transition-colors hover:bg-primary-hover">
              Xem bảng tin cộng đồng <ArrowRight size={18} />
            </button>
            <button className="bg-white text-text-dark border border-border-color px-7 py-3.5 rounded-full font-semibold text-[1rem] cursor-pointer transition-all hover:border-text-dark">
              Tham gia club
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex-1 flex flex-col gap-4 max-w-[580px]">
          <div className="relative rounded-[24px] overflow-hidden aspect-[4/3]">
            <img src={images[activeThumb]} alt="Hero main" className="w-full h-full object-cover" />
            <button className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 rounded-full bg-white/90 border-none flex items-center justify-center cursor-pointer text-text-dark shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-colors hover:bg-white">
              <ChevronLeft size={24} />
            </button>
            <button className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 rounded-full bg-white/90 border-none flex items-center justify-center cursor-pointer text-text-dark shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-colors hover:bg-white">
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div 
                key={index}
                className={`aspect-[16/9] rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${activeThumb === index ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setActiveThumb(index)}
              >
                <img src={img} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
