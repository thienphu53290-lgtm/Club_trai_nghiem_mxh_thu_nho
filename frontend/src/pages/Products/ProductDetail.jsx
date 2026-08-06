import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ExternalLink, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { mockProducts } from './Products';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Find product from mock
  const product = mockProducts.find(p => p.slug === slug) || mockProducts[0];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-[100px]">
      <div className="max-w-[1000px] mx-auto px-5">
        
        {/* Back button */}
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-text-light hover:text-primary transition-colors font-medium mb-8"
        >
          <ArrowLeft size={20} />
          Quay lại Khám phá
        </button>

        {/* Product Hero Section */}
        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 border border-border-color shadow-sm mb-8 flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Image */}
          <div 
            className="w-full md:w-[400px] h-[300px] md:h-[400px] shrink-0 rounded-[24px] overflow-hidden flex items-center justify-center relative"
            style={{ backgroundColor: product.imageBg }}
          >
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover mix-blend-multiply" 
            />
            {product.badgeText && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary px-4 py-1.5 rounded-full font-bold text-[0.9rem]">
                🔥 {product.badgeText}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1 py-4">
            <span className="text-primary font-bold text-[1rem] tracking-wider uppercase mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-[2.5rem] font-extrabold text-text-dark mb-4 leading-tight">
              {product.title}
            </h1>
            <p className="text-text-light text-[1.1rem] leading-relaxed mb-6">
              {product.desc} Trải nghiệm thực tế cho thấy sản phẩm đáp ứng xuất sắc các nhu cầu cơ bản với mức độ hoàn thiện cao. Phù hợp cho những ai đang tìm kiếm sự bền bỉ.
            </p>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border-color">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <div className="text-[1.1rem]">
                <span className="font-bold text-text-dark">{product.rating}</span>
                <span className="text-text-light ml-1">({product.reviews} đánh giá)</span>
              </div>
            </div>

            <div className="mt-auto pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div>
                <div className="text-text-light text-[0.95rem] mb-1">Giá tham khảo</div>
                <div className="text-[2rem] font-black text-primary">{product.price}</div>
              </div>
              <button className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-[1.1rem] hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
                Tới nơi bán <ExternalLink size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 border border-border-color shadow-sm">
          <h2 className="text-[1.8rem] font-bold text-text-dark mb-6">Cộng đồng đánh giá</h2>
          
          {/* Write Review Box */}
          <div className="bg-[#f8f9fa] rounded-[24px] p-6 mb-10 border border-border-color">
            <h3 className="font-bold text-[1.1rem] mb-4">Bạn chấm món này mấy điểm?</h3>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    size={32} 
                    className={(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} 
                  />
                </button>
              ))}
              <span className="ml-3 text-text-light font-medium">
                {rating === 0 ? 'Chọn sao để đánh giá' : `Bạn đã chọn ${rating} sao`}
              </span>
            </div>
            <div className="relative">
              <textarea 
                rows="3"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Chia sẻ trải nghiệm thực tế của bạn về sản phẩm này..."
                className="w-full rounded-[16px] border border-border-color p-4 pr-16 resize-none focus:outline-none focus:border-primary bg-white text-[1rem]"
              ></textarea>
              <button className="absolute right-3 bottom-4 p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* List of Reviews (Mock) */}
          <div className="space-y-6">
            {[
              { name: 'Minh Tuấn', rating: 5, date: '2 ngày trước', content: 'Sản phẩm quá ngon trong tầm giá. Đã mua dùng được 1 tháng và không có gì để chê. Khuyên anh em nên mua nhé!', likes: 24 },
              { name: 'Ngọc Lan', rating: 4, date: '1 tuần trước', content: 'Thiết kế đẹp, dùng ổn định. Tuy nhiên giao hàng hơi chậm một chút. Nhìn chung vẫn cho 4 sao vì chất lượng.', likes: 8 },
              { name: 'Hoàng Long', rating: 5, date: '2 tuần trước', content: 'Đúng như review của anh em trên feed. Cầm cực kỳ đầm tay, build xịn sò. Link mua anh em chia sẻ uy tín phết.', likes: 56 },
            ].map((rev, idx) => (
              <div key={idx} className="pb-6 border-b border-border-color last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-text-dark">{rev.name}</div>
                      <div className="text-[0.85rem] text-text-light">{rev.date}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-text-dark leading-relaxed mb-3 mt-3">{rev.content}</p>
                <div className="flex items-center gap-4 text-text-light text-[0.9rem] font-medium">
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <ThumbsUp size={16} /> Hữu ích ({rev.likes})
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <MessageSquare size={16} /> Phản hồi
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
