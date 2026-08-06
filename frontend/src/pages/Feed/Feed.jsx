import React from 'react';
import { Sparkles, Users, Bookmark, Calendar, Image as ImageIcon, Smile, MapPin, MoreHorizontal, MessageSquare, Heart, Maximize, Type, Link2, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

const myCircle = [
  { id: 1, name: 'Minh Anh', status: 'Đang hoạt động', online: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop' },
  { id: 2, name: 'Hải Đăng', status: 'Đang hoạt động', online: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop' },
  { id: 3, name: 'Thu Hà', status: 'Ngoại tuyến', online: false, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop' },
  { id: 4, name: 'Quang Huy', status: 'Đang hoạt động', online: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop' }
];

const suggestions = [
  { id: 1, name: 'Bảo Ngọc', mutual: '5 bạn chung', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop' },
  { id: 2, name: 'Trung Kiên', mutual: '3 bạn chung', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop' }
];

const Feed = () => {
  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="max-w-[1320px] mx-auto px-5 py-8 grid grid-cols-[280px_1fr_300px] gap-8">
        
        {/* Left Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="bg-white border border-border-color rounded-[32px] p-6 shadow-sm">
            <h3 className="font-extrabold text-[1.1rem] mb-5 text-text-dark">Vòng tròn của bạn</h3>
            <div className="flex flex-col gap-5">
              {myCircle.map(user => (
                <div key={user.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    {user.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[0.95rem] text-text-dark group-hover:text-primary transition-colors">{user.name}</h4>
                    <p className="text-[0.8rem] text-[#64748b] font-medium">{user.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <a href="#" className="flex items-center gap-4 px-4 py-3.5 rounded-[24px] hover:bg-slate-100 text-text-dark font-bold text-[1rem] transition-colors no-underline">
              <div className="w-10 h-10 rounded-full bg-[#fcebeb] flex items-center justify-center text-primary"><Users size={20} /></div>
              Bạn bè
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3.5 rounded-[24px] hover:bg-slate-100 text-text-dark font-bold text-[1rem] transition-colors no-underline">
              <div className="w-10 h-10 rounded-full bg-[#fcebeb] flex items-center justify-center text-primary"><Bookmark size={20} /></div>
              Đã lưu
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3.5 rounded-[24px] border-2 border-[#3b82f6] bg-white text-text-dark font-bold text-[1rem] transition-colors no-underline shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#fcebeb] flex items-center justify-center text-primary"><Calendar size={20} /></div>
              Sự kiện
            </a>
            <a href="#" className="flex items-center gap-4 px-4 py-3.5 rounded-[24px] hover:bg-slate-100 text-text-dark font-bold text-[1rem] transition-colors no-underline">
              <div className="w-10 h-10 rounded-full bg-[#fcebeb] flex items-center justify-center text-primary"><Sparkles size={20} /></div>
              Khám phá
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-col gap-6">
          <div className="bg-[#fff5f5] border border-[#fcebeb] rounded-[24px] p-6 flex gap-4 shadow-sm">
            <Sparkles className="text-[#fbbf24] shrink-0" size={26} fill="#fbbf24" />
            <div>
              <h2 className="font-extrabold text-primary text-[1.1rem] mb-1.5">Bảng tin của club</h2>
              <p className="text-[0.95rem] text-slate-600 font-medium leading-relaxed">
                Nơi thành viên chia sẻ khoảnh khắc mở hộp, cảm nhận nhanh và hỏi đáp trước khi mua — không thuật toán, không cuộc đua tương tác. <a href="#" className="text-primary font-bold hover:underline">Về trang giới thiệu</a>
              </p>
            </div>
          </div>

          {/* Create Post */}
          <div className="border border-border-color rounded-[32px] p-6 bg-white shadow-sm">
            <div className="flex gap-4 mb-5">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" alt="My avatar" className="w-11 h-11 rounded-full object-cover shrink-0" />
              <div className="bg-[#f1f5f9] rounded-[24px] flex-1 px-5 py-4 text-slate-400 font-medium cursor-text hover:bg-slate-200 transition-colors h-[100px]">
                Hôm nay bạn cảm thấy thế nào?
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 pl-[60px]">
                <button className="flex items-center gap-2 text-[0.95rem] text-slate-500 hover:text-text-dark bg-transparent border-none cursor-pointer font-semibold">
                  <ImageIcon size={20} /> Ảnh
                </button>
                <button className="flex items-center gap-2 text-[0.95rem] text-slate-500 hover:text-text-dark bg-transparent border-none cursor-pointer font-semibold">
                  <Smile size={20} /> Cảm xúc
                </button>
                <button className="flex items-center gap-2 text-[0.95rem] text-slate-700 bg-slate-100 px-4 py-2 rounded-full border-none cursor-pointer font-semibold">
                  <MapPin size={18} /> Vị trí
                </button>
              </div>
              <button className="bg-[#f3a4a4] text-white px-6 py-2.5 rounded-full font-bold text-[0.95rem] border-none cursor-pointer hover:bg-primary transition-colors">
                Đăng khoảnh khắc
              </button>
            </div>
          </div>

          {/* Post Item */}
          <div className="border border-border-color rounded-[32px] p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" alt="Minh Anh" className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <h4 className="font-extrabold text-[1rem] text-text-dark">Minh Anh</h4>
                  <div className="text-[0.85rem] text-slate-500 font-medium flex items-center gap-1.5">
                    @minhanh · 20 phút trước 
                    <span className="text-primary flex items-center gap-1 ml-1 bg-[#fcebeb] px-2.5 py-0.5 rounded-full text-[0.75rem] font-bold">
                       — 🌿 Bình yên
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-text-dark bg-transparent border-none cursor-pointer p-1">
                <MoreHorizontal size={24} />
              </button>
            </div>
            
            <p className="text-[1.05rem] font-medium leading-relaxed text-text-dark mb-4">
              Cà phê sáng ở Đà Lạt, sương mù dày đặc mà nắng vẫn xuyên qua được ☕️⛅️
            </p>
            
            <div className="relative rounded-[24px] overflow-hidden border border-border-color">
              <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop" alt="Coffee" className="w-full h-auto max-h-[500px] object-cover" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-md rounded-full px-5 py-2.5">
                <button className="text-white bg-transparent border-none cursor-pointer p-0.5 hover:text-primary transition-colors"><Maximize size={18} /></button>
                <button className="text-white bg-transparent border-none cursor-pointer p-0.5 hover:text-primary transition-colors"><Type size={18} /></button>
                <button className="text-white bg-transparent border-none cursor-pointer p-0.5 hover:text-primary transition-colors"><Link2 size={18} /></button>
                <button className="text-white bg-transparent border-none cursor-pointer p-0.5 hover:text-primary transition-colors"><MessageSquare size={18} /></button>
              </div>
            </div>

            {/* Post Reactions & Actions */}
            <div className="mt-5">
              <div className="flex justify-between items-center pb-4 border-b border-border-color">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1.5">
                    <span className="w-6 h-6 rounded-full bg-[#f8fafc] flex items-center justify-center text-[12px] border-2 border-white z-20 shadow-sm">👍</span>
                    <span className="w-6 h-6 rounded-full bg-[#f8fafc] flex items-center justify-center text-[12px] border-2 border-white z-10 shadow-sm">❤️</span>
                    <span className="w-6 h-6 rounded-full bg-[#f8fafc] flex items-center justify-center text-[12px] border-2 border-white z-0 shadow-sm">😮</span>
                  </div>
                  <span className="text-[0.95rem] text-slate-500 font-semibold">39 người bạn quan tâm</span>
                </div>
                <div className="flex items-center gap-4 text-[0.95rem] text-slate-500 font-semibold">
                  <span>1 lời nhắn</span>
                  <span>4 chia sẻ</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-text-dark rounded-xl font-bold text-[0.95rem] transition-colors border-none bg-transparent cursor-pointer">
                  <ThumbsUp size={20} /> Quan tâm
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-text-dark rounded-xl font-bold text-[0.95rem] transition-colors border-none bg-transparent cursor-pointer">
                  <MessageCircle size={20} /> Lời nhắn
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-text-dark rounded-xl font-bold text-[0.95rem] transition-colors border-none bg-transparent cursor-pointer">
                  <Share2 size={20} /> Chia sẻ
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="bg-white border border-border-color rounded-[32px] p-6 shadow-sm">
            <h3 className="font-extrabold text-[1.1rem] mb-5 text-text-dark">Gợi ý kết nối</h3>
            <div className="flex flex-col gap-5">
              {suggestions.map(user => (
                <div key={user.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3 cursor-pointer group">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-[0.95rem] text-text-dark group-hover:text-primary transition-colors">{user.name}</h4>
                      <p className="text-[0.8rem] text-slate-500 font-medium">{user.mutual}</p>
                    </div>
                  </div>
                  <button className="bg-[#fcebeb] text-primary px-4 py-1.5 rounded-full font-bold text-[0.85rem] border-none cursor-pointer hover:bg-[#fbdada] transition-colors">
                    Thêm
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border-color rounded-[32px] p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-extrabold text-[1.1rem] mb-5 text-text-dark">
              <Heart className="text-primary" size={20} />
              Chủ đề nhỏ
            </h3>
            <div className="flex flex-col gap-4">
              <a href="#" className="no-underline group">
                <h4 className="font-extrabold text-[1rem] text-primary group-hover:underline mb-0.5">#coffeemorning</h4>
                <p className="text-[0.85rem] text-slate-500 font-medium">24 khoảnh khắc</p>
              </a>
              <a href="#" className="no-underline group">
                <h4 className="font-extrabold text-[1rem] text-primary group-hover:underline mb-0.5">#dalatslowlife</h4>
                <p className="text-[0.85rem] text-slate-500 font-medium">18 khoảnh khắc</p>
              </a>
              <a href="#" className="no-underline group">
                <h4 className="font-extrabold text-[1rem] text-primary group-hover:underline mb-0.5">#runnershanoi</h4>
                <p className="text-[0.85rem] text-slate-500 font-medium">12 khoảnh khắc</p>
              </a>
            </div>
          </div>

          <div className="bg-white border border-border-color rounded-[32px] p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-extrabold text-[1.1rem] mb-3 text-text-dark">
              <MessageSquare className="text-primary" size={20} fill="currentColor" fillOpacity={0.2} />
              Lời nhắn trong ngày
            </h3>
            <p className="text-[0.95rem] text-slate-500 font-medium leading-relaxed">
              Mỗi ngày chỉ hiển thị những khoảnh khắc từ vòng tròn của bạn. Hãy dành thời gian trả lời những lời nhắn chân thành.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Feed;
