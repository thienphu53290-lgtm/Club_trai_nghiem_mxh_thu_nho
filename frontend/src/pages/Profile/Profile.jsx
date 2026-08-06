import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import api from '../../api/axios';
import { 
  BadgeCheck, Settings, UserPlus, Calendar, MapPin, Sparkles, Shield, 
  BookOpen, Users, Heart, Package, Link as LinkIcon, MoreHorizontal, 
  Maximize, Type, Link2, MessageSquare, ThumbsUp, MessageCircle, Share2,
  Check, Star, Award, Camera, Image, X, Upload, Globe, Phone, Mail, Edit3, Pin, Send, FolderHeart, CalendarCheck
} from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ followers_count: 0, following_count: 0, posts_count: 0 });
  const [posts, setPosts] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [collections, setCollections] = useState([]);
  const [events, setEvents] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('Bài viết');
  const [copied, setCopied] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTab, setEditTab] = useState('info');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [interactionMessage, setInteractionMessage] = useState('');

  const [editForm, setEditForm] = useState({
    ho_ten: '',
    ten_hien_thi: '',
    tieu_su: '',
    so_dien_thoai: '',
    dia_chi: '',
    website: '',
    anh_dai_dien: '',
    anh_bia: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  const fetchProfileData = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = id ? `/profile/${id}` : '/profile/me';
      const response = await api.get(endpoint);
      const resData = response.data.data;

      setProfile(resData.profile);
      setStats(resData.stats);
      setPosts(resData.posts || []);
      setFollowersList(resData.followers_list || []);
      setCollections(resData.collections || []);
      setEvents(resData.events || []);
      setIsOwner(resData.is_owner);
      setIsFollowing(resData.is_following);

      if (resData.profile) {
        setEditForm({
          ho_ten: resData.profile.ho_ten || '',
          ten_hien_thi: resData.profile.ten_hien_thi || '',
          tieu_su: resData.profile.tieu_su || '',
          so_dien_thoai: resData.profile.so_dien_thoai || '',
          dia_chi: resData.profile.dia_chi || '',
          website: resData.profile.website || '',
          anh_dai_dien: resData.profile.anh_dai_dien || '',
          anh_bia: resData.profile.anh_bia || '',
        });
        setAvatarPreview(resData.profile.anh_dai_dien || '');
        setCoverPreview(resData.profile.anh_bia || '');
      }
    } catch (err) {
      console.error('Lỗi tải profile:', err);
      if (err.response && err.response.status === 401) {
        setError('Bạn cần đăng nhập để xem trang cá nhân của mình.');
      } else {
        setError(err.response?.data?.message || 'Không thể tải thông tin Trang Cá Nhân lúc này.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleLikePost = async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      const { is_liked, likes_count, message } = res.data;

      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, is_liked: is_liked, likes_count: likes_count };
        }
        return p;
      }));

      if (is_liked && isOwner) {
        setProfile(prev => ({ ...prev, diem_trai_nghiem: (prev?.diem_trai_nghiem || 0) + 5 }));
      }

      setInteractionMessage(message);
      setTimeout(() => setInteractionMessage(''), 2500);

    } catch (err) {
      alert(err.response?.data?.message || 'Vui lòng đăng nhập để thích bài viết.');
    }
  };

  const handleSendComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/posts/${postId}/comment`, { noi_dung: commentText });
      const { comments_count, message } = res.data;

      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, comments_count: comments_count };
        }
        return p;
      }));

      if (isOwner) {
        setProfile(prev => ({ ...prev, diem_trai_nghiem: (prev?.diem_trai_nghiem || 0) + 10 }));
      }

      setCommentText('');
      setActiveCommentPostId(null);
      setInteractionMessage(message);
      setTimeout(() => setInteractionMessage(''), 3000);

    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi thảo luận.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleFollow = async () => {
    if (!profile) return;
    try {
      const response = await api.post(`/users/${profile.id}/follow`);
      const newFollowStatus = response.data.is_following;
      setIsFollowing(newFollowStatus);
      setStats(prev => ({
        ...prev,
        followers_count: newFollowStatus ? prev.followers_count + 1 : Math.max(0, prev.followers_count - 1)
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Vui lòng đăng nhập để theo dõi thành viên.');
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const previewUrl = URL.createObjectURL(file);
    if (type === 'avatar') {
      setAvatarFile(file);
      setAvatarPreview(previewUrl);
    } else if (type === 'cover') {
      setCoverFile(file);
      setCoverPreview(previewUrl);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('ho_ten', editForm.ho_ten);
      formData.append('ten_hien_thi', editForm.ten_hien_thi);
      formData.append('tieu_su', editForm.tieu_su);
      formData.append('so_dien_thoai', editForm.so_dien_thoai);
      formData.append('dia_chi', editForm.dia_chi);
      formData.append('website', editForm.website);
      
      if (!avatarFile && editForm.anh_dai_dien) {
        formData.append('anh_dai_dien', editForm.anh_dai_dien);
      }
      if (!coverFile && editForm.anh_bia) {
        formData.append('anh_bia', editForm.anh_bia);
      }
      if (avatarFile) {
        formData.append('anh_dai_dien_file', avatarFile);
      }
      if (coverFile) {
        formData.append('anh_bia_file', coverFile);
      }

      const response = await api.post('/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedUser = response.data.user;
      setProfile(updatedUser);
      setAvatarFile(null);
      setCoverFile(null);
      setSaveSuccessMessage('🎉 Đã lưu Trang Cá Nhân thành công rực rỡ!');
      
      setTimeout(() => {
        setSaveSuccessMessage('');
        setShowEditModal(false);
      }, 1800);

    } catch (err) {
      console.error('Lỗi lưu profile:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#c93638] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-slate-700 text-sm animate-pulse">Đang nạp dữ liệu Realtime từ MySQL...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center py-20 px-5">
        <div className="max-w-md w-full border-2 border-[#0f172a] rounded-[32px] p-8 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] text-center">
          <Shield size={48} className="text-[#c93638] mx-auto mb-4 animate-bounce" />
          <h2 className="font-black text-xl text-slate-900 mb-2">Truy Cập Bị Từ Chối</h2>
          <p className="text-slate-600 font-bold text-sm mb-6">{error}</p>
          <NavLink 
            to="/auth" 
            className="inline-block px-6 py-3 bg-[#c93638] hover:bg-[#a82b2d] text-white font-black text-sm rounded-full no-underline shadow-sm transition-all"
          >
            🔑 Đăng nhập ngay
          </NavLink>
        </div>
      </div>
    );
  }

  const badges = profile.huy_chuong_danh_hieu && Array.isArray(profile.huy_chuong_danh_hieu)
    ? profile.huy_chuong_danh_hieu
    : [{ ten: '⭐ Thành viên Club', mo_ta: 'Thành viên mới', mau_sc: '#3b82f6' }];

  const currentXP = profile.diem_trai_nghiem || 100;
  const rankTitle = profile.cap_bac || 'Đồng Tiên Phong';
  const progressPercent = Math.min(100, Math.max(15, (currentXP % 1000) / 10));

  return (
    <div className="bg-[#fafafa] min-h-screen py-8 relative">
      
      {interactionMessage && (
        <div className="fixed top-24 right-6 z-[9999] bg-slate-900 text-amber-300 px-6 py-3.5 rounded-2xl border-2 border-amber-400 font-black text-sm shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-2.5 animate-bounce">
          <Sparkles size={18} className="text-amber-400 animate-spin" />
          <span>{interactionMessage}</span>
        </div>
      )}

      <div className="max-w-[1320px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        
        <div className="flex flex-col">
          
          <div className="relative border-2 border-[#0f172a] rounded-[32px] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-red-900 h-[260px] md:h-[320px] shadow-sm group">
            {profile.anh_bia ? (
              <img 
                src={profile.anh_bia} 
                alt="Cover Banner" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-950 via-slate-900 to-black text-white">
                <Image size={44} className="text-rose-400 mb-2 opacity-80 animate-pulse" />
                <p className="font-black text-base md:text-lg mb-1">Trang Trí Không Gian Cảm Xúc Của Bạn</p>
                <p className="text-xs text-slate-300 max-w-sm">Hãy thêm một bức ảnh bìa lung linh để thể hiện phong cách trải nghiệm độc quyền của {profile.ten_hien_thi || profile.ho_ten}!</p>
                {isOwner && (
                  <button 
                    onClick={() => { setEditTab('media'); setShowEditModal(true); }} 
                    className="mt-4 px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  >
                    <Upload size={14} /> 🖼️ Thêm Ảnh Bìa Ngay
                  </button>
                )}
              </div>
            )}

            {isOwner && profile.anh_bia && (
              <button 
                onClick={() => { setEditTab('media'); setShowEditModal(true); }}
                className="absolute top-4 right-4 px-4 py-2 bg-black/60 hover:bg-black/80 text-white font-bold text-xs rounded-full border border-white/30 flex items-center gap-1.5 transition-colors cursor-pointer opacity-90 hover:opacity-100 backdrop-blur-md z-10"
              >
                <Camera size={15} /> Đổi ảnh bìa
              </button>
            )}
          </div>

          <div className="flex justify-between items-end px-6 -mt-16 sm:-mt-20 mb-4 z-10 relative">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-[#0f172a] overflow-hidden bg-white shadow-lg flex items-center justify-center relative">
                {profile.anh_dai_dien ? (
                  <img 
                    src={profile.anh_dai_dien} 
                    alt={profile.ten_hien_thi} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex flex-col items-center justify-center text-white font-black text-4xl sm:text-5xl select-none">
                    {(profile.ten_hien_thi || profile.ho_ten || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {isOwner && (
                <button 
                  onClick={() => { setEditTab('media'); setShowEditModal(true); }}
                  className="absolute bottom-1 right-1 w-9 h-9 bg-[#c93638] hover:bg-[#a82b2d] text-white rounded-full border-2 border-white flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110"
                  title="Thêm / đổi ảnh đại diện"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 mb-2">
              {!isOwner ? (
                <button 
                  onClick={handleToggleFollow}
                  className={`px-6 py-2.5 rounded-full font-black text-[0.95rem] border-2 border-[#0f172a] flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                    isFollowing 
                      ? 'bg-white text-slate-800 hover:bg-slate-100' 
                      : 'bg-[#c93638] text-white hover:bg-[#a82b2d]'
                  }`}
                >
                  <UserPlus size={18} />
                  {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
              ) : (
                <button 
                  onClick={() => { setEditTab('info'); setShowEditModal(true); }}
                  className="px-6 py-2.5 rounded-full font-black text-[0.95rem] border-2 border-[#0f172a] bg-white hover:bg-slate-900 hover:text-white text-slate-900 flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <Edit3 size={17} /> Chỉnh Sửa Hồ Sơ
                </button>
              )}

              {isOwner && (
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="w-11 h-11 rounded-full border-2 border-[#0f172a] bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-all cursor-pointer shadow-sm"
                >
                  <Settings size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="px-4 mt-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
                {profile.ten_hien_thi || profile.ho_ten || 'Thành Viên VIP'}
              </h1>
              <BadgeCheck size={28} className="text-[#c93638] shrink-0 stroke-[2.5]" />
              
              <span className="ml-1 text-xs font-extrabold px-3 py-1 rounded-full border border-slate-300 bg-slate-900 text-amber-300 shadow-xs">
                {profile.vai_tro?.ten || (profile.vai_tro_id === 3 ? '👑 Siêu Quản Trị' : '⭐ Thành viên')}
              </span>
            </div>
            
            <p className="text-slate-500 font-bold text-sm mt-1">
              @{profile.email.split('@')[0]} {profile.ho_ten ? `• (${profile.ho_ten})` : ''}
            </p>

            <p className="text-slate-800 font-medium text-[1.05rem] leading-relaxed my-4 max-w-[720px] whitespace-pre-line">
              {profile.tieu_su || 'Người đam mê theo đuổi những trải nghiệm cà phê và phong cách sống hiện đại.'}
            </p>

            <div className="flex flex-wrap items-center gap-5 text-slate-600 font-bold text-sm mb-4">
              {profile.dia_chi && (
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin size={17} className="text-[#c93638]" />
                  <span>{profile.dia_chi}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-1.5 text-blue-600 hover:underline">
                  <Globe size={17} />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold no-underline hover:underline">
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar size={17} className="text-slate-400" />
                <span>Tham gia {new Date(profile.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-8 mt-2 mb-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl w-fit">
              <div className="cursor-pointer">
                <span className="font-black text-slate-900 text-xl mr-1.5">{stats.followers_count}</span>
                <span className="text-slate-600 font-bold text-sm">Người theo dõi</span>
              </div>
              <div className="cursor-pointer">
                <span className="font-black text-slate-900 text-xl mr-1.5">{stats.following_count}</span>
                <span className="text-slate-600 font-bold text-sm">Đang theo dõi</span>
              </div>
              <div>
                <span className="font-black text-[#c93638] text-xl mr-1.5">{stats.posts_count}</span>
                <span className="text-slate-600 font-bold text-sm">Bài review</span>
              </div>
            </div>

            <div className="flex border-b border-slate-200 gap-8 mt-4 overflow-x-auto no-scrollbar">
              {['Bài viết', 'Hồ sơ chi tiết', 'Bộ Sưu Tập', 'Sự kiện'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`bg-transparent border-none pb-3.5 text-[1.05rem] cursor-pointer transition-all relative shrink-0 ${
                    activeTab === tab 
                      ? 'font-black text-slate-900' 
                      : 'font-bold text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab}
                  {tab === 'Bộ Sưu Tập' && collections.length > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-black rounded-full">{collections.length}</span>
                  )}
                  {tab === 'Sự kiện' && events.length > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-full">{events.length}</span>
                  )}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[3.5px] bg-[#c93638] rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8">
              
              {activeTab === 'Bài viết' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black text-xl text-slate-900">Bài viết trải nghiệm ({posts.length})</h2>
                  </div>

                  {posts.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-[32px] p-12 text-center bg-slate-50/50 my-6">
                      <BookOpen size={40} className="text-slate-400 mx-auto mb-3" />
                      <h3 className="font-black text-lg text-slate-800 mb-1">Chưa có bài chia sẻ nào</h3>
                      <p className="text-slate-500 text-sm max-w-md mx-auto">Khi {profile.ten_hien_thi || 'bạn'} đăng bài review quán cà phê hoặc công nghệ, chúng sẽ xuất hiện sống động tại đây.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {posts.map((p) => (
                        <div key={p.id} className={`border-2 ${p.ghim ? 'border-amber-400 bg-amber-50/20 shadow-[0_4px_20px_rgba(251,191,36,0.15)]' : 'border-[#0f172a] bg-white shadow-sm'} rounded-[32px] p-6 transition-all hover:shadow-md relative overflow-hidden`}>
                          
                          {p.ghim == 1 && (
                            <div className="flex items-center gap-1.5 text-amber-800 bg-gradient-to-r from-amber-200 to-yellow-100 px-4 py-1.5 rounded-xl font-black text-xs w-fit mb-4 border border-amber-300">
                              <Pin size={14} className="fill-current text-amber-600 rotate-45" /> 
                              <span>BÀI VIẾT ĐƯỢC GHIM TRUYỀN CẢM HỨNG 📍</span>
                            </div>
                          )}

                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full border border-[#0f172a] overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                                {profile.anh_dai_dien ? (
                                  <img src={profile.anh_dai_dien} alt={profile.ten_hien_thi} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-black text-sm text-slate-700">{(profile.ten_hien_thi || 'U').charAt(0)}</span>
                                )}
                              </div>
                              <div>
                                <h4 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                                  {profile.ten_hien_thi || profile.ho_ten}
                                  <BadgeCheck size={16} className="text-[#c93638] stroke-[2.5]" />
                                </h4>
                                <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                                  <span>{new Date(p.created_at).toLocaleDateString('vi-VN')}</span>
                                  {p.ten_danh_muc && (
                                    <span className="text-[#c93638] bg-[#fcebeb] px-2.5 py-0.5 rounded-full text-[11px] font-black">
                                      {p.ten_danh_muc}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-800 bg-transparent border-none cursor-pointer p-1">
                              <MoreHorizontal size={22} />
                            </button>
                          </div>

                          <h3 className="font-black text-lg sm:text-xl text-slate-900 mb-2.5 leading-snug">
                            {p.tieu_de}
                          </h3>

                          <p className="text-[1.02rem] font-medium leading-relaxed text-slate-800 mb-4 whitespace-pre-line">
                            {p.noi_dung}
                          </p>

                          {p.hashtags && p.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {p.hashtags.map((tag, i) => (
                                <span key={i} className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200/60 cursor-pointer hover:bg-indigo-100 transition-colors">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {p.anh_bia && (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 my-4 max-h-[460px]">
                              <img src={p.anh_bia} alt={p.tieu_de} className="w-full h-auto object-cover max-h-[460px] hover:scale-[1.02] transition-transform duration-500" />
                            </div>
                          )}

                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                                👁️ <strong className="text-slate-900 font-black">{p.luot_xem || 45}</strong> xem
                              </span>
                              <span className="text-xs font-bold text-rose-600 flex items-center gap-1 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                                👍 <strong className="font-black">{p.likes_count || 0}</strong> lượt thích
                              </span>
                              <span className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                                💬 <strong className="font-black">{p.comments_count || 0}</strong> thảo luận
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleLikePost(p.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs transition-all border-none cursor-pointer ${
                                  p.is_liked 
                                    ? 'bg-rose-500 text-white shadow-md scale-105' 
                                    : 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700'
                                }`}
                              >
                                <ThumbsUp size={15} /> {p.is_liked ? 'Đã thích ❤️' : 'Thích'}
                              </button>
                              <button 
                                onClick={() => setActiveCommentPostId(activeCommentPostId === p.id ? null : p.id)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-all border-none cursor-pointer"
                              >
                                <MessageCircle size={15} /> Thảo luận
                              </button>
                            </div>
                          </div>

                          {activeCommentPostId === p.id && (
                            <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50/80 p-4 rounded-2xl animate-fadeIn">
                              <label className="block text-xs font-black text-slate-700 uppercase mb-2">Gửi thảo luận của bạn vào bài review này (+10 Điểm XP ✨):</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Nhập lời bình luận sắc sảo của bạn..."
                                  className="flex-1 p-3 rounded-xl border-2 border-slate-300 font-semibold text-xs outline-none focus:border-[#0f172a] bg-white"
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment(p.id); }}
                                />
                                <button 
                                  onClick={() => handleSendComment(p.id)}
                                  className="px-5 py-3 bg-[#0f172a] hover:bg-[#c93638] text-white rounded-xl font-black text-xs cursor-pointer border-none transition-colors flex items-center gap-1"
                                >
                                  <Send size={14} /> Gửi
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Hồ sơ chi tiết' && (
                <div className="border-2 border-[#0f172a] rounded-[32px] p-8 bg-white shadow-sm">
                  <h2 className="font-black text-xl text-slate-900 mb-6 flex items-center gap-2">
                    <Shield className="text-[#c93638]" /> Thông Tin Định Danh & Mạng Xã Hội
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Họ và tên thực</p>
                      <p className="font-black text-slate-900 text-base">{profile.ho_ten || 'Chưa cập nhật'}</p>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email liên kết</p>
                      <p className="font-black text-slate-900 text-base">{profile.email}</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Số điện thoại</p>
                      <p className="font-black text-slate-900 text-base">{profile.so_dien_thoai || '•••••••••• (Bảo mật)'}</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Địa điểm cư trú</p>
                      <p className="font-black text-slate-900 text-base">{profile.dia_chi || 'Việt Nam'}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="font-black text-base text-slate-900 mb-4">Kết nối mạng xã hội</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.facebook ? (
                        <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-blue-600 text-white font-black text-xs rounded-xl no-underline hover:bg-blue-700 transition-colors shadow-sm">
                          📘 Facebook Profile
                        </a>
                      ) : (
                        <span className="px-4 py-2 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl">📘 Facebook (Chưa gắn link)</span>
                      )}

                      {profile.instagram ? (
                        <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-black text-xs rounded-xl no-underline hover:opacity-90 transition-opacity shadow-sm">
                          📸 Instagram VIP
                        </a>
                      ) : (
                        <span className="px-4 py-2 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl">📸 Instagram (Chưa gắn link)</span>
                      )}

                      {profile.tiktok ? (
                        <a href={profile.tiktok} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-slate-950 text-white font-black text-xs rounded-xl no-underline hover:bg-slate-800 transition-colors shadow-sm">
                          🎵 TikTok Creator
                        </a>
                      ) : (
                        <span className="px-4 py-2 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl">🎵 TikTok (Chưa gắn link)</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Bộ Sưu Tập' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black text-xl text-slate-900 flex items-center gap-2">
                      <FolderHeart className="text-[#c93638]" /> Bộ Sưu Tập Trải Nghiệm Độc Quyền
                    </h2>
                  </div>

                  {collections.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-[32px] p-12 text-center bg-slate-50/50 my-6">
                      <FolderHeart size={40} className="text-slate-400 mx-auto mb-3" />
                      <h3 className="font-black text-lg text-slate-800 mb-1">Chưa có bộ sưu tập nào</h3>
                      <p className="text-slate-500 text-sm max-w-md mx-auto">Các món đồ công nghệ hoặc quán cà phê được lưu tại trang trải nghiệm sẽ hiển thị thành bộ sưu tập sống động tại đây.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {collections.map((col, idx) => (
                        <div key={idx} className="border-2 border-[#0f172a] rounded-[28px] p-5 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group cursor-pointer hover:-translate-y-1 transition-all flex flex-col justify-between">
                          <div>
                            <div className="h-44 rounded-2xl overflow-hidden bg-slate-900 mb-4 relative">
                              <img src={col.anh_bia} alt={col.ten_bo_suu_tap} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute top-3 left-3 bg-black/70 text-amber-300 font-black text-xs px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                                🌟 {col.so_luong} món đồ & review
                              </div>
                            </div>
                            <h3 className="font-black text-lg text-slate-900 group-hover:text-[#c93638] transition-colors leading-tight mb-2">
                              {col.ten_bo_suu_tap}
                            </h3>
                            <div className="space-y-1.5 mt-2">
                              {col.items.slice(0, 2).map((item, i) => (
                                <p key={i} className="text-xs font-extrabold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/80 truncate m-0 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-[#c93638] shrink-0"></span>
                                  <span className="truncate">{item.tieu_de}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-black text-indigo-600">
                            <span>Khám phá trọn bộ ➔</span>
                            <span className="text-slate-400 font-semibold">Được thẩm định bởi Club</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Sự kiện' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black text-xl text-slate-900 flex items-center gap-2">
                      <CalendarCheck className="text-emerald-600" /> Sự Kiện Đã & Đang Tham Gia
                    </h2>
                  </div>

                  {events.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-[32px] p-12 text-center bg-slate-50/50 my-6">
                      <CalendarCheck size={40} className="text-slate-400 mx-auto mb-3" />
                      <h3 className="font-black text-lg text-slate-800 mb-1">Chưa đăng ký sự kiện nào</h3>
                      <p className="text-slate-500 text-sm max-w-md mx-auto">Hãy tìm kiếm các sự kiện offline hay workshop trải nghiệm để góp mặt cùng cộng đồng nhé.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {events.map((ev) => (
                        <div key={ev.id} className="border-2 border-[#0f172a] rounded-[32px] p-6 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
                            {ev.anh_bia && (
                              <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                                <img src={ev.anh_bia} alt={ev.tieu_de} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[11px] font-black uppercase bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full border border-emerald-300">
                                  {ev.trang_thai == 1 ? '🔥 Sắp diễn ra' : 'Đã diễn ra'}
                                </span>
                                <span className="text-xs font-bold text-slate-500">
                                  Giới hạn {ev.so_luong_toi_da || 50} thành viên
                                </span>
                              </div>
                              <h3 className="font-black text-lg text-slate-900 leading-snug mb-1 hover:text-[#c93638] transition-colors cursor-pointer">
                                {ev.tieu_de}
                              </h3>
                              <p className="text-slate-600 font-bold text-xs m-0 flex items-center gap-2 flex-wrap">
                                <span>📍 {ev.dia_diem}</span>
                                <span>⏰ {new Date(ev.thoi_gian_bat_dau).toLocaleString('vi-VN')}</span>
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 w-full md:w-auto text-right">
                            {ev.trang_thai_dang_ky == 1 ? (
                              <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-800 px-5 py-2.5 rounded-2xl font-black text-xs shadow-xs text-center">
                                ✅ Đã Đăng Ký / Chủ Trì
                              </div>
                            ) : (
                              <button className="w-full md:w-auto bg-[#0f172a] hover:bg-[#c93638] text-white px-6 py-3 rounded-2xl font-black text-xs border-none cursor-pointer transition-colors shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                                🎟️ Nhận Vé Tham Dự Ngay
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          
          <div className="border-2 border-[#0f172a] rounded-[28px] p-6 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-0.5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 font-black text-[1.05rem] text-slate-800">
                <Sparkles size={22} className="text-[#c93638] shrink-0" />
                <span>Điểm trải nghiệm (XP)</span>
              </div>
              <span className="font-black text-2xl text-[#c93638] bg-rose-50 px-3.5 py-1 rounded-2xl border border-rose-200 shadow-xs">
                {currentXP.toLocaleString('vi-VN')}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 font-black text-[1.05rem] text-slate-800">
                <Shield size={20} className="text-amber-500 shrink-0" />
                <span>Cấp bậc club</span>
              </div>
              <span className="font-black text-sm text-amber-700 bg-gradient-to-r from-amber-100 to-yellow-50 px-3.5 py-1 rounded-full border border-amber-300">
                {rankTitle}
              </span>
            </div>

            <div className="w-full h-[16px] rounded-full border-2 border-[#0f172a] overflow-hidden bg-white p-[2px] my-3">
              <div 
                className="h-full bg-gradient-to-r from-red-600 via-[#c93638] to-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <p className="text-xs font-bold text-slate-500 mt-2">
              💡 Thích hoặc thảo luận bài viết sẽ lập tức tích lũy <strong>+5 và +10 điểm XP</strong> trong thời gian thực!
            </p>
          </div>

          <button 
            onClick={handleCopyLink}
            className="w-full py-3.5 px-6 rounded-2xl border-2 border-[#0f172a] bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {copied ? (
              <>
                <Check size={19} className="text-emerald-500" />
                <span className="text-emerald-600 font-extrabold">Đã sao chép liên kết hồ sơ!</span>
              </>
            ) : (
              <>
                <LinkIcon size={19} className="rotate-45" />
                <span>Sao chép liên kết chia sẻ</span>
              </>
            )}
          </button>

          <div className="border-2 border-[#0f172a] rounded-[28px] p-6 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="font-black text-lg text-slate-900 mb-4 flex items-center gap-2">
              <Award className="text-amber-500" /> Huy hiệu & Danh hiệu ({badges.length})
            </h3>
            <div className="flex flex-col gap-2.5">
              {badges.map((b, idx) => (
                <div 
                  key={idx} 
                  className="border-2 border-[#0f172a] rounded-2xl p-3 bg-slate-50 hover:bg-[#fff5f5] hover:border-[#c93638] transition-all cursor-pointer group flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900 group-hover:text-[#c93638] transition-colors">
                      {b.ten}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: b.mau_sc || '#eab308' }}></span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold m-0">{b.mo_ta}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-[#0f172a] rounded-[28px] p-6 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="font-black text-lg text-slate-900 mb-4 flex items-center justify-between">
              <span>Bạn bè Theo dõi ({followersList.length})</span>
              <Users size={20} className="text-slate-400" />
            </h3>
            
            {followersList.length === 0 ? (
              <p className="text-xs font-semibold text-slate-400 py-2">Chưa có ai theo dõi tài khoản này.</p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {followersList.map((f) => (
                  <div 
                    key={f.id} 
                    onClick={() => navigate(`/profile/${f.id}`)}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group border border-transparent hover:border-slate-200"
                  >
                    <div className="w-11 h-11 rounded-full border border-[#0f172a] overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center font-black text-slate-600">
                      {f.anh_dai_dien ? (
                        <img src={f.anh_dai_dien} alt={f.ten_hien_thi} className="w-full h-full object-cover" />
                      ) : (
                        <span>{(f.ten_hien_thi || f.ho_ten || 'F').charAt(0)}</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-black text-sm text-slate-900 group-hover:text-[#c93638] transition-colors truncate">
                        {f.ten_hien_thi || f.ho_ten || 'Thành viên'}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-bold m-0 truncate">
                        {f.ten_vai_tro || '⭐ Thành viên Club'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </aside>

      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white border-4 border-[#0f172a] rounded-[36px] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-[#0f172a]">
              <div className="flex items-center gap-2">
                <Edit3 className="text-amber-400" />
                <h3 className="font-black text-lg m-0">Chỉnh Sửa Trang Cá Nhân Của Bạn</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white bg-transparent border-none cursor-pointer p-1">
                <X size={24} />
              </button>
            </div>

            <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-4">
              <button 
                onClick={() => setEditTab('info')} 
                className={`py-3 px-4 font-black text-xs border-none bg-transparent cursor-pointer transition-colors border-b-4 ${editTab === 'info' ? 'text-[#c93638] border-[#c93638]' : 'text-slate-500 border-transparent'}`}
              >
                📝 Thông Tin & Tiểu Sử
              </button>
              <button 
                onClick={() => setEditTab('media')} 
                className={`py-3 px-4 font-black text-xs border-none bg-transparent cursor-pointer transition-colors border-b-4 ${editTab === 'media' ? 'text-[#c93638] border-[#c93638]' : 'text-slate-500 border-transparent'}`}
              >
                🖼️ Ảnh Bìa & Avatar
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {saveSuccessMessage && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-800 rounded-2xl font-black text-sm text-center animate-bounce">
                  {saveSuccessMessage}
                </div>
              )}

              {editTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Tên hiển thị (Nickname)</label>
                      <input 
                        type="text" 
                        value={editForm.ten_hien_thi} 
                        onChange={(e) => setEditForm({...editForm, ten_hien_thi: e.target.value})}
                        placeholder="VD: Long Founder 👑"
                        className="w-full p-3.5 border-2 border-[#0f172a] rounded-2xl font-bold text-sm bg-slate-50 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Họ tên thực</label>
                      <input 
                        type="text" 
                        value={editForm.ho_ten} 
                        onChange={(e) => setEditForm({...editForm, ho_ten: e.target.value})}
                        placeholder="VD: Thành Long"
                        className="w-full p-3.5 border-2 border-[#0f172a] rounded-2xl font-bold text-sm bg-slate-50 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-1">Tiểu sử trải nghiệm (Bio)</label>
                    <textarea 
                      rows={4}
                      value={editForm.tieu_su} 
                      onChange={(e) => setEditForm({...editForm, tieu_su: e.target.value})}
                      placeholder="Hãy viết vài câu truyền cảm hứng về bạn, sở thích review cà phê hay công nghệ..."
                      className="w-full p-3.5 border-2 border-[#0f172a] rounded-2xl font-semibold text-sm bg-slate-50 focus:bg-white outline-none leading-relaxed resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Số điện thoại</label>
                      <input 
                        type="text" 
                        value={editForm.so_dien_thoai} 
                        onChange={(e) => setEditForm({...editForm, so_dien_thoai: e.target.value})}
                        placeholder="VD: 0988.888.888"
                        className="w-full p-3.5 border-2 border-[#0f172a] rounded-2xl font-bold text-sm bg-slate-50 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 uppercase mb-1">Địa điểm cư trú</label>
                      <input 
                        type="text" 
                        value={editForm.dia_chi} 
                        onChange={(e) => setEditForm({...editForm, dia_chi: e.target.value})}
                        placeholder="VD: TP. Hồ Chí Minh"
                        className="w-full p-3.5 border-2 border-[#0f172a] rounded-2xl font-bold text-sm bg-slate-50 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-1">Website hoặc liên kết cá nhân</label>
                    <input 
                      type="text" 
                      value={editForm.website} 
                      onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                      placeholder="VD: https://clubtrainghiem.com"
                      className="w-full p-3.5 border-2 border-[#0f172a] rounded-2xl font-bold text-sm bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>
                </div>
              )}

              {editTab === 'media' && (
                <div className="space-y-6">
                  
                  <div className="p-4 border-2 border-[#0f172a] rounded-3xl bg-slate-50">
                    <h4 className="font-black text-sm text-slate-900 mb-3 flex items-center gap-2">
                      <Camera className="text-[#c93638]" /> 1. Cập Nhật Ảnh Đại Diện (Avatar)
                    </h4>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-20 h-20 rounded-full border-2 border-[#0f172a] overflow-hidden bg-white shrink-0 flex items-center justify-center text-xl font-black">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span>U</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="inline-block px-4 py-2 bg-slate-900 text-amber-300 hover:bg-slate-800 rounded-xl font-black text-xs cursor-pointer border border-slate-700 shadow-sm transition-all mb-2">
                          📁 Chọn File Ảnh Từ Máy Tính...
                          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" />
                        </label>
                        <p className="text-[11px] text-slate-500 font-semibold m-0">Hoặc bạn có thể dán trực tiếp đường link ảnh (URL) bên dưới:</p>
                      </div>
                    </div>
                    <input 
                      type="text" 
                      value={editForm.anh_dai_dien} 
                      onChange={(e) => { setEditForm({...editForm, anh_dai_dien: e.target.value}); setAvatarPreview(e.target.value); setAvatarFile(null); }}
                      placeholder="Dán link ảnh URL (VD: https://images.unsplash.com/...)"
                      className="w-full p-3 border-2 border-slate-300 rounded-xl font-medium text-xs bg-white focus:border-[#0f172a] outline-none"
                    />
                  </div>

                  <div className="p-4 border-2 border-[#0f172a] rounded-3xl bg-slate-50">
                    <h4 className="font-black text-sm text-slate-900 mb-3 flex items-center gap-2">
                      <Image className="text-indigo-600" /> 2. Cập Nhật Ảnh Bìa (Cover Banner)
                    </h4>
                    
                    {coverPreview && (
                      <div className="h-36 rounded-2xl border-2 border-[#0f172a] overflow-hidden mb-3 bg-slate-900">
                        <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <label className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs cursor-pointer shadow-sm transition-all mb-2">
                      📁 Chọn File Ảnh Bìa Từ Máy Tính...
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="hidden" />
                    </label>
                    <p className="text-[11px] text-slate-500 font-semibold mb-2">Hoặc dán link ảnh URL cho ảnh bìa:</p>
                    <input 
                      type="text" 
                      value={editForm.anh_bia} 
                      onChange={(e) => { setEditForm({...editForm, anh_bia: e.target.value}); setCoverPreview(e.target.value); setCoverFile(null); }}
                      placeholder="Dán link ảnh bìa URL (VD: https://images.unsplash.com/...)"
                      className="w-full p-3 border-2 border-slate-300 rounded-xl font-medium text-xs bg-white focus:border-[#0f172a] outline-none"
                    />
                  </div>

                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-end items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 rounded-2xl font-extrabold text-sm text-slate-600 hover:bg-slate-100 bg-transparent border-none cursor-pointer transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-8 py-3 rounded-2xl font-black text-sm bg-[#c93638] hover:bg-[#a82b2d] text-white border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>Lưu Thay Đổi Trang Cá Nhân</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
