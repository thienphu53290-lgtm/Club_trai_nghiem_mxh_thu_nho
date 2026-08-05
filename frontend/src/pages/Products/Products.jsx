import React, { useRef, useState, useEffect } from 'react';
import { Star, Search, Filter, ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../api/axios';

const ASSET_URL = API_BASE_URL.replace('/api', '');

const bannerImages = [
  `${ASSET_URL}/bannersp/bannersp1.png`,
  `${ASSET_URL}/bannersp/bannersp2.png`,
  `${ASSET_URL}/bannersp/bannersp3.png`
];

const ProductBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-slate-900 rounded-[32px] overflow-hidden mb-12 relative h-[500px] flex items-center shadow-lg group">
      {bannerImages.map((src, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={src} 
            alt={`Products Banner ${idx + 1}`} 
            className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out scale-100 group-hover:scale-105"
          />
        </div>
      ))}
      
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-lg"
      >
        <ChevronLeft size={28} />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-lg"
      >
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">
        {bannerImages.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/60 hover:bg-white'}`}
          />
        ))}
      </div>
    </div>
  );
};
export const mockProducts = [
  {
    id: 1,
    slug: 'tai-nghe-airbuds-pro-3',
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
    slug: 'serum-vitamin-c-15',
    category: 'Làm đẹp',
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
    slug: 'noi-chien-khong-dau-5l',
    category: 'Khác',
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=400&auto=format&fit=crop',
    imageBg: '#ffd580',
    title: 'Nồi chiên không dầu 5L',
    desc: 'Lòng nồi vẫn chống dính tốt sau 2 tháng.',
    rating: 4.8,
    reviews: 302,
    price: '1.290.000đ'
  },
  {
    id: 4,
    slug: 'ban-phim-co-khong-day',
    category: 'Công nghệ',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    imageBg: '#e2e8f0',
    title: 'Bàn phím cơ không dây 75%',
    desc: 'Switch silent red, gõ êm ái không ồn ào.',
    rating: 4.9,
    reviews: 56,
    price: '2.850.000đ'
  },
  {
    id: 5,
    slug: 'may-pha-ca-phe-cam-tay',
    category: 'Khác',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    imageBg: '#d1d5db',
    title: 'Máy pha cafe Espresso Flair',
    desc: 'Pha cafe chuẩn vị mọi lúc mọi nơi.',
    rating: 4.7,
    reviews: 120,
    price: '6.900.000đ'
  },
  {
    id: 6,
    slug: 'ghe-cong-thai-hoc',
    category: 'Khác',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&auto=format&fit=crop&q=80',
    imageBg: '#fcd34d',
    title: 'Ghế Công Thái Học Ergonomic',
    desc: 'Chống đau lưng cực tốt cho dân IT.',
    rating: 4.6,
    reviews: 432,
    price: '4.500.000đ'
  }
];

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
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
      onClick={() => navigate(`/products/${product.slug}`)}
      style={style}
      className="border border-border-color rounded-[32px] p-5 bg-white cursor-pointer hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] group will-change-transform relative flex flex-col"
    >
      <div 
        className="pointer-events-none absolute inset-0 rounded-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(201, 54, 56, 0.15), transparent 40%)`,
          transform: 'translateZ(10px)'
        }}
      />

      <div className="relative rounded-[24px] flex items-center justify-center mb-5 overflow-hidden z-10" style={{ height: '260px', backgroundColor: product.imageBg }}>
        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>

      <div className="px-1 relative z-10 flex-1 flex flex-col">
        <span className="text-black/50 text-[0.8rem] font-medium uppercase tracking-wider mb-1">{product.category}</span>
        <h3 className="text-[1.1rem] font-bold mb-2 text-text-dark line-clamp-2 leading-snug">{product.title}</h3>
        
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="font-extrabold text-primary text-[1.1rem]">{product.price}</div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-[0.85rem] text-amber-700 font-bold">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-8 pb-[100px]">
      <div className="max-w-[1320px] mx-auto px-5">
        
        {/* Banner Riêng Cho Trang Sản Phẩm */}
        <ProductBanner />

        <div className="flex gap-8 items-start">
          
          {/* Sidebar Filter (Left Column) */}
          <div className="w-[280px] shrink-0 bg-white border border-border-color rounded-[24px] p-6 sticky top-[90px]">
            <div className="flex items-center gap-2 font-black text-text-dark text-[1.2rem] mb-6 pb-4 border-b border-slate-100">
              <Filter size={20} className="text-primary" />
              Bộ Lọc Tìm Kiếm
            </div>

            {/* Filter Group: Category */}
            <div className="mb-8">
              <h4 className="font-bold text-text-dark mb-4">Danh mục</h4>
              <div className="flex flex-col gap-3 text-[0.95rem] text-text-light font-medium">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-primary bg-primary flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-[0.95rem] text-text-dark font-bold">Tất cả sản phẩm (98)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center group-hover:border-primary transition-colors"></div>
                  <span className="text-[0.95rem] text-text-light group-hover:text-text-dark transition-colors">Công nghệ (24)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center group-hover:border-primary transition-colors"></div>
                  <span className="text-[0.95rem] text-text-light group-hover:text-text-dark transition-colors">Làm đẹp (18)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center group-hover:border-primary transition-colors"></div>
                  <span className="text-[0.95rem] text-text-light group-hover:text-text-dark transition-colors">Sản phẩm Khác (56)</span>
                </label>
              </div>
            </div>

            {/* Filter Group: Price */}
            <div className="mb-8">
              <h4 className="font-bold text-text-dark mb-4">Khoảng giá</h4>
              <div className="flex flex-col gap-3">
                {['Dưới 1 triệu', '1 triệu - 3 triệu', 'Trên 3 triệu'].map((price, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center group-hover:border-primary transition-colors"></div>
                    <span className="text-[0.95rem] text-text-light font-medium group-hover:text-text-dark transition-colors">{price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Rating */}
            <div>
              <h4 className="font-bold text-text-dark mb-4">Đánh giá</h4>
              <div className="flex flex-col gap-3">
                {[5, 4, 3].map((star) => (
                  <label key={star} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center group-hover:border-primary transition-colors"></div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < star ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                      ))}
                      {star < 5 && <span className="text-[0.85rem] text-text-light ml-1 font-medium">trở lên</span>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
          </div>

          {/* Main Content (Right Column) */}
          <div className="flex-1">
            
            {/* Header of Grid */}
            <div className="bg-white border border-border-color rounded-[20px] p-4 flex items-center justify-between mb-6">
              <div className="relative w-[350px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm..." 
                  className="pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 w-full focus:outline-none focus:border-primary focus:bg-white transition-colors text-[0.95rem]"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[0.95rem] text-text-light font-medium">Sắp xếp theo:</span>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[0.95rem] font-bold text-text-dark hover:bg-slate-50 transition-colors">
                  Phổ biến nhất <ChevronDown size={16} className="text-slate-400" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...mockProducts, ...mockProducts].map((product, idx) => (
                <ProductCard key={`${product.id}-${idx}`} product={product} />
              ))}
            </div>

            {/* Pagination Mock */}
            <div className="mt-12 flex justify-center items-center gap-2">
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors cursor-not-allowed">
                &lt;
              </button>
              <button className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center shadow-md">
                1
              </button>
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-text-dark font-medium hover:text-primary hover:border-primary transition-colors">
                2
              </button>
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-text-dark font-medium hover:text-primary hover:border-primary transition-colors">
                3
              </button>
              <span className="text-slate-400 px-2">...</span>
              <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-text-dark hover:text-primary hover:border-primary transition-colors">
                &gt;
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Products;
