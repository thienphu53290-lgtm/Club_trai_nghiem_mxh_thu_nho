import React, { useRef, useState } from 'react';
import { Flame, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease',
    transformStyle: 'preserve-3d'
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`,
      transition: 'none',
      transformStyle: 'preserve-3d'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease',
      transformStyle: 'preserve-3d'
    });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className="border border-border-color rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 bg-white cursor-pointer hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] group will-change-transform relative"
    >
      <div 
        className="pointer-events-none absolute inset-0 rounded-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(201, 54, 56, 0.15), transparent 40%)`,
          transform: 'translateZ(10px)'
        }}
      />

      <div className="flex justify-between items-center mb-5 px-1 relative z-10">
        <span className="bg-[#fcebeb] text-primary px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[0.8rem] sm:text-[0.9rem] font-semibold flex items-center gap-1.5">
          <Flame size={14} />
          {product.badgeText}
        </span>
        <span className="text-black/60 text-[0.85rem] font-medium">{product.category}</span>
      </div>
      
      <div className="relative rounded-[20px] sm:rounded-[24px] flex items-center justify-center mb-4 sm:mb-6 overflow-hidden z-10 h-[220px] sm:h-[320px]" style={{ backgroundColor: product.imageBg }}>
        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      
      <div className="px-2 relative z-10">
        <h3 className="text-[1.1rem] sm:text-[1.2rem] font-bold mb-1 sm:mb-2 text-text-dark">{product.title}</h3>
        <p className="text-text-light text-[0.85rem] sm:text-[0.95rem] mb-3 sm:mb-4 leading-relaxed">{product.desc}</p>
        
        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-[0.9rem] text-text-light">{product.rating}</span>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-border-color">
          <div className="font-extrabold text-primary text-[1rem] sm:text-[1.15rem]">{product.price}</div>
          <button className="bg-white border border-border-color px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-[0.85rem] sm:text-[0.9rem] text-text-dark cursor-pointer transition-colors group-hover:bg-[#c93638] group-hover:text-white group-hover:border-[#c93638]">
            Xem đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

const HotProducts = () => {
  return (
    <section className="px-5 py-[60px]">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 sm:gap-0">
          <div>
            <h2 className="flex items-center gap-3 text-2xl md:text-[2rem] font-extrabold text-text-dark mb-2">
              <Flame className="text-primary" size={28} />
              Sản phẩm hot nhất
            </h2>
            <p className="text-text-light text-[1.05rem]">Được thành viên đánh giá và hỏi nhiều nhất tuần này. Di chuột lên thẻ để xem hiệu ứng 3D.</p>
          </div>
          <Link to="/products" className="flex items-center gap-1.5 text-primary font-semibold text-[1rem] transition-opacity hover:opacity-80 no-underline">
            Xem tất cả sản phẩm <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[30px] overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
          {products.map(product => (
            <div key={product.id} className="w-[280px] sm:w-auto snap-center shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotProducts;
