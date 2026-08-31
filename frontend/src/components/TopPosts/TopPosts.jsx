import React, { useState, useEffect } from 'react';
import { Flame, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const TopPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const res = await api.get('/feed/posts');
        if (res.data && res.data.posts) {
          // Sort by total interactions (likes + comments)
          const sorted = [...res.data.posts].sort((a, b) => {
            const aInteractions = (a.likes_count || 0) + (a.comments_count || 0);
            const bInteractions = (b.likes_count || 0) + (b.comments_count || 0);
            return bInteractions - aInteractions;
          });
          setPosts(sorted.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch top posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="px-5 py-[60px] border-y border-border-color">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 sm:gap-0">
          <div>
            <h2 className="flex items-center gap-3 text-2xl md:text-[2rem] font-extrabold text-text-dark mb-2">
              <Flame className="text-primary" size={28} />
              Bảng tin nổi bật
            </h2>
            <p className="text-text-light text-[1.05rem]">Những bài viết có lượt tương tác cao nhất từ cộng đồng PIVO.</p>
          </div>
          <Link to="/feed" className="flex items-center gap-1.5 text-primary font-semibold text-[1rem] transition-opacity hover:opacity-80 no-underline shrink-0">
            Khám phá bảng tin <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-[20px] sm:gap-[30px] overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
          {posts.map(post => (
            <div 
              key={post.id} 
              onClick={() => navigate('/feed')}
              className="w-[280px] sm:w-auto snap-center shrink-0 border border-border-color rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 bg-white cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] transition-all duration-300 group flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={post.anh_dai_dien || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"} 
                  alt={post.ten_hien_thi} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-[0.95rem] text-slate-900 leading-tight">
                    {post.ten_hien_thi || post.ho_ten}
                  </div>
                  <div className="text-[0.75rem] text-slate-500 font-medium">
                    {post.ten_cap_bac || 'Thành viên'}
                  </div>
                </div>
              </div>
              
              {post.danh_sach_anh && post.danh_sach_anh.length > 0 && (
                <div className="relative rounded-[20px] overflow-hidden mb-4 h-[180px] sm:h-[220px] bg-slate-100 shrink-0">
                  <img 
                    src={post.danh_sach_anh[0]} 
                    alt="Post" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  {post.danh_sach_anh.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-slate-900/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold">
                      +{post.danh_sach_anh.length - 1} ảnh
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex-1">
                <p className="text-slate-700 text-[0.95rem] mb-4 line-clamp-3 leading-relaxed">
                  {post.noi_dung || 'Bài viết chứa hình ảnh/video chia sẻ trải nghiệm.'}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[0.9rem] group-hover:text-rose-500 transition-colors">
                    <Heart size={18} className={post.is_liked ? 'fill-rose-500 text-rose-500' : ''} />
                    <span>{post.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[0.9rem] group-hover:text-blue-500 transition-colors">
                    <MessageCircle size={18} />
                    <span>{post.comments_count || 0}</span>
                  </div>
                </div>
                {post.ten_danh_muc && (
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full truncate max-w-[120px]">
                    {post.ten_danh_muc}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopPosts;
