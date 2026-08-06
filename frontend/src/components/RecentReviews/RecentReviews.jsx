import React from 'react';
import { ArrowRight, Star, BadgeCheck } from 'lucide-react';

const reviews = [
  {
    id: 1,
    author: 'Minh Anh',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    verified: true,
    rating: 4.5,
    title: 'Tai nghe AirBuds Pro 3',
    category: 'Công nghệ',
    desc: 'Chống ồn tốt hơn đời trước rõ rệt, pin thực tế 6 tiếng. Trừ điểm vì hộp sạc dễ bám vân tay.'
  },
  {
    id: 2,
    author: 'Thu Hà',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
    verified: true,
    rating: 4.0,
    title: 'Serum Vitamin C 15%',
    category: 'Chăm sóc da',
    desc: 'Dùng 4 tuần, da sáng đều hơn nhưng hơi châm chích tuần đầu. Da nhạy cảm nên bắt đầu cách ngày.'
  },
  {
    id: 3,
    author: 'Quang Huy',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
    verified: false,
    rating: 5.0,
    title: 'Nồi chiên không dầu 5L',
    category: 'Nhà bếp',
    desc: 'Giá tầm trung mà làm được gần hết món cơ bản. Lòng nồi chống dính bền sau 2 tháng dùng hằng ngày.'
  }
];

const RecentReviews = () => {
  return (
    <section className="px-5 py-[60px] border-y border-border-color">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-[2rem] font-extrabold text-text-dark mb-2">Đánh giá mới nhất</h2>
            <p className="text-text-light text-[1.05rem]">Viết bởi thành viên đã dùng thật.</p>
          </div>
          <a href="#" className="flex items-center gap-1.5 text-primary font-semibold text-[1rem] transition-opacity hover:opacity-80 no-underline">
            Xem tất cả bài viết <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-[30px]">
          {reviews.map(review => (
            <div key={review.id} className="bg-white border border-border-color rounded-[24px] p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
              <span className="inline-block border border-border-color px-3.5 py-1.5 rounded-xl text-[0.85rem] text-text-light mb-4 self-start">
                {review.category}
              </span>
              
              <h3 className="text-[1.15rem] font-bold mb-2">{review.title}</h3>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(review.rating) ? 'text-primary fill-primary' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-[0.9rem] text-text-light">{review.rating}</span>
              </div>
              
              <p className="text-text-light text-[1rem] leading-relaxed mb-6 flex-1">
                {review.desc}
              </p>
              
              <div className="flex justify-between items-center pt-4 border-t border-border-color">
                <div className="flex items-center gap-3">
                  <img src={review.authorAvatar} alt={review.author} className="w-9 h-9 rounded-full object-cover" />
                  <span className="font-bold text-[0.95rem]">{review.author}</span>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1.5 text-primary text-[0.85rem] font-medium">
                    <BadgeCheck size={16} />
                    Đã xác minh
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentReviews;
