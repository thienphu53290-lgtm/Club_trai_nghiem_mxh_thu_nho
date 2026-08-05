import React, { useState, useEffect } from 'react';
import { BadgeCheck, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../../api/axios';

const Hero = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      tieu_de: 'Mua online không còn hên xui',
      mo_ta: 'Thành viên dùng thử sản phẩm thật, viết đánh giá trung thực kèm ảnh và hoá đơn. Đọc trước khi mua, chia sẻ sau khi dùng.',
      hinh_anh: '/img/banner1.jpeg',
      duong_dan: '/feed'
    },
    {
      id: 2,
      tieu_de: 'Khám Phá Không Gian Cà Phê & Nghệ Thuật Sống Đích Thực ☕✨',
      mo_ta: 'Những góc làm việc yên tĩnh, thiết kế ấn tượng và các trải nghiệm thưởng ngoạn specialty coffee được tuyển chọn khắt khe từ cộng đồng.',
      hinh_anh: '/img/banner2.jpg',
      duong_dan: '/feed'
    },
    {
      id: 3,
      tieu_de: 'Góc Setup & Đánh Giá Đồ Cực Chất Từ Các Chuyên Gia 💻🚀',
      mo_ta: 'Chia sẻ hình ảnh góc bàn làm việc tối giản, đánh giá sâu chi tiết bàn phím cơ, màn hình 4K và phụ kiện công nghệ sáng tạo.',
      hinh_anh: '/img/banner3.jpg',
      duong_dan: '/feed'
    },
    {
      id: 4,
      tieu_de: 'Kết Nối Thảo Luận Realtime & Chinh Phục Huy Chương Độc Quyền 🔥👑',
      mo_ta: 'Trò chuyện trực tuyến tức thời cùng các nhà sáng tạo nội dung, tích lũy điểm trải nghiệm để vươn tới đẳng cấp Huyền Thoại Club.',
      hinh_anh: '/img/banner4.jpg',
      duong_dan: '/about'
    }
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/banners/hero')
      .then(res => {
        if (res.data?.status === 'success' && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setBanners(res.data.data);
          setActiveIndex(0);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isHovered || banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, banners.length]);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/img/') || path.startsWith('/bannersp/')) return path;
    
    const backendHost = API_BASE_URL.replace('/api', '');
    return `${backendHost}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const currentBanner = banners[activeIndex] || banners[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIndex(prev => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex(prev => (prev + 1) % banners.length);
  };

  return (
    <section className="px-5 py-[30px]" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="max-w-[1320px] mx-auto flex items-center gap-[60px] border border-border-color rounded-[32px] p-[60px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-[#fcebeb] text-primary px-4 py-1.5 rounded-full text-[0.85rem] font-semibold mb-5">
            <BadgeCheck size={16} className="text-primary" />
            Cộng đồng đánh giá có kiểm chứng
          </div>
          
          <div key={activeIndex} className="animate-fadeSlideIn min-h-[190px] flex flex-col justify-center">
            <h1 className="text-[3.2rem] font-extrabold leading-[1.15] tracking-tight mb-5 text-text-dark">
              {currentBanner.tieu_de || 'Mua online không còn hên xui'}
            </h1>
            
            <p className="text-[1.05rem] text-text-light leading-relaxed mb-8 w-full">
              {currentBanner.mo_ta || 'Thành viên dùng thử sản phẩm thật, viết đánh giá trung thực kèm ảnh và hoá đơn. Đọc trước khi mua, chia sẻ sau khi dùng.'}
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate(currentBanner.duong_dan || '/feed')}
              className="bg-primary text-white border-none px-7 py-3.5 rounded-full font-semibold text-[1rem] flex items-center gap-2 cursor-pointer transition-colors hover:bg-primary-hover"
            >
              Xem bảng tin cộng đồng <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="bg-white text-text-dark border border-border-color px-7 py-3.5 rounded-full font-semibold text-[1rem] cursor-pointer transition-all hover:border-text-dark"
            >
              Tham gia club
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 max-w-[580px]">
          <div className="relative rounded-[24px] overflow-hidden aspect-[4/3] bg-slate-100 shadow-xs">
            {banners.map((img, index) => (
              <img 
                key={img.id || index}
                src={getImageUrl(img.hinh_anh)} 
                alt={img.tieu_de || `Hero slide ${index + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out transform ${
                  activeIndex === index 
                    ? 'opacity-100 scale-100 z-10' 
                    : 'opacity-0 scale-105 z-0 pointer-events-none'
                }`} 
              />
            ))}
            
            <button 
              onClick={handlePrev}
              type="button"
              className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white border-none flex items-center justify-center cursor-pointer text-text-dark shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all z-20 hover:scale-105"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white border-none flex items-center justify-center cursor-pointer text-text-dark shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all z-20 hover:scale-105"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {banners.map((img, index) => (
              <div 
                key={img.id || index}
                className={`aspect-[16/9] rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 transform ${
                  activeIndex === index 
                    ? 'border-primary shadow-xs scale-[1.02]' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <img src={getImageUrl(img.hinh_anh)} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
