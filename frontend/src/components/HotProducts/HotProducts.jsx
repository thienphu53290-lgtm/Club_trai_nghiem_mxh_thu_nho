import React from 'react';
import { Flame, ArrowRight, Star } from 'lucide-react';

const products = [
  {
    id: 1,
    badgeText: 'Nóng nhất tuần',
    category: 'Công nghệ',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop',
    imageBg: '#d91d36',
    title: 'Tai nghe AirBuds Pro 3',
    desc: 'Chống ồn vượt tầm giá, pin thực đo 6 tiếng.',
    rating: 4.5,
    reviews: 214,
    price: '1.890.000đ'
  },
  {
    id: 2,
    badgeText: 'Được hỏi nhiều',
    category: 'Chăm sóc da',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop',
    imageBg: '#ffcfb3',
    title: 'Serum Vitamin C 15%',
    desc: 'Sáng da sau 4 tuần, cần bắt đầu cách ngày.',
    rating: 4.2,
    reviews: 168,
    price: '459.000đ'
  },
  {
    id: 3,
    badgeText: 'Điểm cao nhất',
    category: 'Nhà bếp',
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=400&auto=format&fit=crop',
    imageBg: '#ffd580',
    title: 'Nồi chiên không dầu 5L',
    desc: 'Lòng nồi vẫn chống dính tốt sau 2 tháng.',
    rating: 4.8,
    reviews: 302,
    price: '1.290.000đ'
  }
];

const HotProducts = () => {
  return (
    <section className="px-5 py-[60px]">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="flex items-center gap-3 text-[2rem] font-extrabold text-text-dark mb-2">
              <Flame className="text-primary" size={28} />
              Sản phẩm hot nhất
            </h2>
            <p className="text-text-light text-[1.05rem]">Được thành viên đánh giá và hỏi nhiều nhất tuần này. Di chuột lên thẻ để xem hiệu ứng 3D.</p>
          </div>
          <a href="#" className="flex items-center gap-1.5 text-primary font-semibold text-[1rem] transition-opacity hover:opacity-80 no-underline">
            Xem tất cả sản phẩm <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-[30px]">
          {products.map(product => (
            <div key={product.id} className="border border-border-color rounded-[24px] p-4 bg-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] group">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="bg-[#fcebeb] text-primary px-3 py-1.5 rounded-full text-[0.9rem] font-semibold flex items-center gap-1.5">
                  <Flame size={14} />
                  {product.badgeText}
                </span>
                <span className="text-black/60 text-[0.85rem] font-medium">{product.category}</span>
              </div>
              
              <div className="relative rounded-2xl h-[280px] flex items-center justify-center mb-5 overflow-hidden" style={{ backgroundColor: product.imageBg }}>
                <img src={product.image} alt={product.title} className="w-[70%] h-[70%] object-cover rounded-lg transition-transform duration-500 group-hover:scale-105" />
              </div>
              
              <div className="px-2">
                <h3 className="text-[1.2rem] font-bold mb-2 text-text-dark">{product.title}</h3>
                <p className="text-text-light text-[0.95rem] mb-4 leading-relaxed">{product.desc}</p>
                
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-[0.9rem] text-text-light">{product.rating}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-border-color">
                  <div className="font-extrabold text-primary text-[1.15rem]">{product.price}</div>
                  <button className="bg-white border border-border-color px-4 py-2 rounded-full font-semibold text-[0.9rem] text-text-dark cursor-pointer transition-colors hover:border-text-dark">
                    Xem đánh giá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotProducts;
