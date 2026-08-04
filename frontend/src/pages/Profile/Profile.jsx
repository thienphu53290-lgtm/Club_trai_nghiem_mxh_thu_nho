import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import api from '../../api/axios';
import echo from '../../api/echo';
import { 
  BadgeCheck, Settings, UserPlus, Calendar, MapPin, Sparkles, Shield, 
  BookOpen, Users, Heart, Package, Link as LinkIcon, MoreHorizontal, 
  Maximize, Type, Link2, MessageSquare, ThumbsUp, MessageCircle, Share2,
  Check, Star, Award, Camera, Image, X, Upload, Globe, Phone, Mail, Edit3, Pin, Send, FolderHeart, CalendarCheck, Trash2, ShoppingBag
} from 'lucide-react';
import { FormModal, ImageModal, ConfirmModal, CommentModal } from '../../components/Modal';

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
  const [openMenuPostId, setOpenMenuPostId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.post-menu-container')) {
        setOpenMenuPostId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [privacy, setPrivacy] = useState(() => {
    try {
      const saved = localStorage.getItem('profile_privacy_settings');
      return saved ? JSON.parse(saved) : { email: 'public', so_dien_thoai: 'private', dia_chi: 'public', mang_xa_hoi: 'public' };
    } catch (e) {
      return { email: 'public', so_dien_thoai: 'private', dia_chi: 'public', mang_xa_hoi: 'public' };
    }
  });

  const togglePrivacy = (field, fieldName) => {
    setPrivacy(prev => {
      const nextVal = prev[field] === 'private' ? 'public' : 'private';
      const newSettings = { ...prev, [field]: nextVal };
      localStorage.setItem('profile_privacy_settings', JSON.stringify(newSettings));
      setInteractionMessage(`🛡️ Quyền riêng tư ${fieldName}: ${nextVal === 'private' ? '🔒 Đã ẩn (Chỉ mình tôi)' : '🌐 Công khai'}`);
      setTimeout(() => setInteractionMessage(''), 3500);
      return newSettings;
    });
  };

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null, isLoading: false });
  const [unfollowModal, setUnfollowModal] = useState(false);
  const [editPostModal, setEditPostModal] = useState({ isOpen: false, id: null, tieu_de: '', noi_dung: '', hashtags: '', showProduct: false, san_pham_ten: '', san_pham_gia: '', san_pham_san: 'Link mua sắm', san_pham_url: '', isLoading: false });

  const confirmDeletePost = async () => {
    if (!deleteModal.postId) return;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      await api.delete(`/feed/posts/${deleteModal.postId}`);
      setPosts(prev => prev.filter(p => p.id !== deleteModal.postId));
      setInteractionMessage('🗑️ Đã xóa bài viết và dính trả dung lượng cloud thành công!');
      setTimeout(() => setInteractionMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa bài viết vào lúc này.');
    } finally {
      setDeleteModal({ isOpen: false, postId: null, isLoading: false });
    }
  };
  const handleSaveEditPost = async () => {
    if (!editPostModal.id || !editPostModal.tieu_de.trim() || !editPostModal.noi_dung.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết.');
      return;
    }
    if (editPostModal.showProduct && (!editPostModal.san_pham_ten.trim() || !editPostModal.san_pham_url.trim())) {
      alert('Vui lòng nhập đầy đủ tên sản phẩm và đường dẫn URL hoặc ẩn form sản phẩm.');
      return;
    }
    setEditPostModal(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await api.put(`/feed/posts/${editPostModal.id}`, {
        tieu_de: editPostModal.tieu_de,
        noi_dung: editPostModal.noi_dung,
        hashtags: editPostModal.hashtags,
        san_pham_ten: editPostModal.showProduct ? editPostModal.san_pham_ten : '',
        san_pham_gia: editPostModal.showProduct ? editPostModal.san_pham_gia : 0,
        san_pham_san: 'Link mua sắm',
        san_pham_url: editPostModal.showProduct ? editPostModal.san_pham_url : ''
      });
      const updatedData = res.data.post;
      setPosts(prev => prev.map(p => p.id === editPostModal.id ? { 
        ...p, 
        tieu_de: updatedData.tieu_de, 
        noi_dung: updatedData.noi_dung, 
        hashtags: updatedData.hashtags,
        san_pham_list: updatedData.san_pham_list
      } : p));
      setInteractionMessage('✨ Đã cập nhật nội dung bài viết và link sản phẩm thành công!');
      setTimeout(() => setInteractionMessage(''), 3000);
      setEditPostModal({ isOpen: false, id: null, tieu_de: '', noi_dung: '', hashtags: '', showProduct: false, san_pham_ten: '', san_pham_gia: '', san_pham_san: 'Link mua sắm', san_pham_url: '', isLoading: false });
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể chỉnh sửa bài viết lúc này.');
      setEditPostModal(prev => ({ ...prev, isLoading: false }));
    }
  };
  const [previewImage, setPreviewImage] = useState({ isOpen: false, url: '', title: '', caption: '' });

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

  const fetchProfileData = async (silent = false) => {
    if (!silent) setLoading(true);
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
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    window.scrollTo(0, 0);

    const channel = echo.channel('club-live');
    const handleLiveEvent = (event) => {
      if (['new_post', 'update_post', 'delete_post', 'like_post', 'comment_post', 'like_comment'].includes(event.type)) {
        fetchProfileData(true);
      }
    };
    channel.listen('.live-event', handleLiveEvent);

    const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('club_live_sync') : null;
    if (bc) {
      bc.onmessage = (event) => {
        if (event.data?.type === 'sync_feed') {
          fetchProfileData(true);
        }
      };
    }

    return () => {
      channel.stopListening('.live-event', handleLiveEvent);
      if (bc) bc.close();
    };
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

  const handleSendComment = async (postId, content, parentId = null) => {
    if (!content || !content.trim()) return;
    try {
      const res = await api.post(`/posts/${postId}/comment`, { noi_dung: content.trim(), parent_id: parentId });
      const { comments_count, comment, message } = res.data;

      const newComment = comment || {
        id: Date.now(),
        bai_viet_id: postId,
        parent_id: parentId,
        noi_dung: content.trim(),
        created_at: new Date().toISOString(),
        ho_ten: profile?.ho_ten || 'Thành viên',
        ten_hien_thi: profile?.ten_hien_thi || profile?.ho_ten || 'Thành viên',
        anh_dai_dien: profile?.anh_dai_dien || null,
        ten_cap_bac: profile?.ten_cap_bac || '⭐ Thành viên',
        anh_cap_bac: profile?.anh_cap_bac || null
      };

      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments_count: comments_count ?? (p.comments_count + 1),
            recent_comments: [newComment, ...(p.recent_comments || [])]
          };
        }
        return p;
      }));

      if (isOwner) {
        setProfile(prev => ({ ...prev, diem_trai_nghiem: (prev?.diem_trai_nghiem || 0) + 10 }));
      }

      setInteractionMessage(message);
      setTimeout(() => setInteractionMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi thảo luận.');
    }
  };

  const handleLikeComment = async (postId, commentId) => {
    try {
      const res = await api.post(`/comments/${commentId}/like`);
      if (res.status === 200) {
        const { is_liked, likes_count } = res.data;
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              recent_comments: (p.recent_comments || []).map(c => 
                c.id === commentId ? { ...c, is_liked, likes_count } : c
              )
            };
          }
          return p;
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Vui lòng đăng nhập để thích bình luận.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleFollow = async (force = false) => {
    if (!profile) return;
    if (isFollowing && force !== true) {
      setUnfollowModal(true);
      return;
    }
    try {
      const response = await api.post(`/users/${profile.id}/follow`);
      const newFollowStatus = response.data.is_following;
      setIsFollowing(newFollowStatus);
      setStats(prev => ({
        ...prev,
        followers_count: newFollowStatus ? prev.followers_count + 1 : Math.max(0, prev.followers_count - 1)
      }));
      setUnfollowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Vui lòng đăng nhập để theo dõi thành viên.');
      setUnfollowModal(false);
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

  const renderProductLinks = (post) => {
    if (!post.san_pham_list || post.san_pham_list.length === 0) return null;
    return (
      <div className="my-3 flex flex-col gap-3">
        {post.san_pham_list.map((sp, idx) => (
          <div key={sp.id || idx} className="p-4 rounded-[24px] bg-gradient-to-r from-amber-50/70 via-rose-50/40 to-slate-50 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 shadow-xs flex items-center justify-center shrink-0 text-[#c93638] font-black text-lg">
                🛍️
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm sm:text-base line-clamp-1 m-0">
                  {sp.ten}
                </h4>
                <p className="text-xs font-black text-[#c93638] mt-0.5 m-0">
                  Giá tham khảo: {sp.gia_tham_khao ? Number(sp.gia_tham_khao).toLocaleString('vi-VN') + ' VNĐ' : 'Liên hệ'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {sp.lien_ket_mua && sp.lien_ket_mua.map((lk, i) => (
                <a
                  key={lk.id || i}
                  href={lk.url || lk.url_affiliate}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => api.post('/affiliate-click', { lien_ket_id: lk.id, bai_viet_id: post.id }).catch(() => {})}
                  className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-[#c93638] hover:bg-[#a82527] shadow-sm transition-all flex items-center gap-1.5 active:scale-95 no-underline"
                >
                  <span>Mở Liên Kết Mua Sắm</span>
                  <span>↗</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPostImages = (post) => {
    const images = post.danh_sach_anh && post.danh_sach_anh.length > 0 
      ? post.danh_sach_anh 
      : (post.anh_bia ? [post.anh_bia] : []);

    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <div 
          onClick={() => setPreviewImage({ isOpen: true, url: images[0], title: post.tieu_de || 'Khoảnh khắc trải nghiệm', caption: 'Bảo trợ hình ảnh bởi Club Trải Nghiệm' })}
          className="relative rounded-[24px] overflow-hidden border border-slate-200 cursor-pointer group shadow-xs max-h-[420px] bg-slate-950 my-3.5"
        >
          <img src={images[0]} alt={post.tieu_de} className="w-full max-h-[420px] object-cover mx-auto group-hover:scale-[1.02] transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
            <span className="bg-white/95 backdrop-blur-md text-slate-900 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg">
              <Maximize size={15} className="text-[#c93638]" /> Phóng to
            </span>
          </div>
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-[24px] overflow-hidden border border-slate-200 h-[220px] sm:h-[260px] bg-slate-900 my-3.5 shadow-xs">
          {images.map((url, idx) => (
            <div 
              key={idx} 
              onClick={() => setPreviewImage({ isOpen: true, url, title: post.tieu_de || `Ảnh ${idx + 1}`, caption: `Ảnh ${idx + 1} / ${images.length} - Club Trải Nghiệm` })}
              className="relative overflow-hidden cursor-pointer group h-full bg-slate-800"
            >
              <img src={url} alt={`Photo ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="flex flex-col gap-1 rounded-[24px] overflow-hidden border border-slate-200 my-3.5 bg-slate-900 shadow-xs">
          <div 
            onClick={() => setPreviewImage({ isOpen: true, url: images[0], title: post.tieu_de || 'Ảnh 1', caption: `Ảnh 1 / ${images.length} - Club Trải Nghiệm` })}
            className="relative overflow-hidden cursor-pointer group h-[200px] sm:h-[240px] bg-slate-800"
          >
            <img src={images[0]} alt="Photo 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="grid grid-cols-2 gap-1 h-[140px] sm:h-[170px]">
            {images.slice(1, 3).map((url, idx) => (
              <div 
                key={idx + 1} 
                onClick={() => setPreviewImage({ isOpen: true, url, title: post.tieu_de || `Ảnh ${idx + 2}`, caption: `Ảnh ${idx + 2} / ${images.length} - Club Trải Nghiệm` })}
                className="relative overflow-hidden cursor-pointer group h-full bg-slate-800"
              >
                <img src={url} alt={`Photo ${idx + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (images.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-[24px] overflow-hidden border border-slate-200 h-[280px] sm:h-[340px] bg-slate-900 my-3.5 shadow-xs">
          {images.map((url, idx) => (
            <div 
              key={idx} 
              onClick={() => setPreviewImage({ isOpen: true, url, title: post.tieu_de || `Ảnh ${idx + 1}`, caption: `Ảnh ${idx + 1} / ${images.length} - Club Trải Nghiệm` })}
              className="relative overflow-hidden cursor-pointer group h-full bg-slate-800"
            >
              <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      );
    }

    const topImages = images.slice(0, 2);
    const bottomImages = images.slice(2, 5);
    const extraCount = images.length - 5;

    return (
      <div className="flex flex-col gap-1 rounded-[24px] overflow-hidden border border-slate-200 my-3.5 bg-slate-900 shadow-xs">
        <div className="grid grid-cols-2 gap-1 h-[180px] sm:h-[220px]">
          {topImages.map((url, idx) => (
            <div 
              key={idx} 
              onClick={() => setPreviewImage({ isOpen: true, url, title: post.tieu_de || `Ảnh ${idx + 1}`, caption: `Ảnh ${idx + 1} / ${images.length} - Club Trải Nghiệm` })}
              className="relative overflow-hidden cursor-pointer group h-full bg-slate-800"
            >
              <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 h-[125px] sm:h-[155px]">
          {bottomImages.map((url, idx) => {
            const actualIdx = idx + 2;
            const isLastVisible = idx === 2 && extraCount > 0;
            return (
              <div 
                key={actualIdx} 
                onClick={() => setPreviewImage({ isOpen: true, url, title: post.tieu_de || `Ảnh ${actualIdx + 1}`, caption: `Ảnh ${actualIdx + 1} / ${images.length} - Club Trải Nghiệm` })}
                className="relative overflow-hidden cursor-pointer group h-full bg-slate-800"
              >
                <img src={url} alt={`Photo ${actualIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {isLastVisible && (
                  <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex items-center justify-center text-white font-black text-2xl sm:text-3xl hover:bg-slate-950/75 transition-colors">
                    +{extraCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
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
  const rankInfo = profile.cap_bac_info || {
    ten_cap_bac: profile.cap_bac || '🥉 Đồng Tiên Phong',
    diem_toi_thieu: 0,
    diem_toi_da: 999,
    anh_cap_bac: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    mau_sac: 'text-amber-800 bg-amber-50 border-amber-300',
    mo_ta: 'Thành viên mới bắt đầu khám phá và chia sẻ trải nghiệm'
  };
  const minXP = rankInfo.diem_toi_thieu || 0;
  const maxXP = rankInfo.diem_toi_da;
  const progressPercent = maxXP 
    ? Math.min(100, Math.max(5, Math.round((currentXP / (maxXP + 1)) * 100)))
    : 100;

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
                <div className="flex flex-wrap items-center gap-2.5">
                  <button 
                    onClick={() => handleToggleFollow(false)}
                    className={`px-5 py-2.5 rounded-full font-black text-sm sm:text-[0.95rem] border-2 border-[#0f172a] flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                      isFollowing 
                        ? 'bg-white text-slate-800 hover:bg-slate-100' 
                        : 'bg-[#c93638] text-white hover:bg-[#a82b2d]'
                    }`}
                  >
                    <UserPlus size={18} />
                    <span>{isFollowing ? 'Đang theo dõi' : 'Theo dõi'}</span>
                  </button>

                  <button 
                    onClick={() => {
                      const chatTarget = {
                        id: profile?.id || 999,
                        name: profile?.ten_hien_thi || profile?.ho_ten || 'Thành viên Club',
                        avatar: profile?.anh_dai_dien || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                        roleTitle: profile?.cap_bac || '👑 Kim Cương VIP',
                        isVerified: true,
                        isFollowing: isFollowing,
                        product: 'Trao đổi từ Trang cá nhân',
                        productPrice: 'Thảo luận trực tiếp'
                      };
                      navigate('/messages', { state: { chatTarget } });
                    }}
                    className="px-5 py-2.5 rounded-full font-black text-sm sm:text-[0.95rem] border-2 border-[#0f172a] bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <MessageSquare size={17} />
                    <span>Nhắn tin</span>
                  </button>
                </div>
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
                            <div className="relative post-menu-container">
                              <button 
                                onClick={() => setOpenMenuPostId(openMenuPostId === p.id ? null : p.id)}
                                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center border border-slate-200/60 cursor-pointer shadow-2xs"
                                title="Tùy chọn"
                              >
                                <MoreHorizontal size={20} />
                              </button>

                              {openMenuPostId === p.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                                  {isOwner ? (
                                    <>
                                      <button
                                        onClick={() => {
                                          setOpenMenuPostId(null);
                                          const sp = p.san_pham_list && p.san_pham_list.length > 0 ? p.san_pham_list[0] : null;
                                          const lk = sp && sp.lien_ket_mua && sp.lien_ket_mua.length > 0 ? sp.lien_ket_mua[0] : null;
                                          setEditPostModal({
                                            isOpen: true,
                                            id: p.id,
                                            tieu_de: p.tieu_de || '',
                                            noi_dung: p.noi_dung || '',
                                            hashtags: Array.isArray(p.hashtags) ? p.hashtags.join(', ') : '',
                                            showProduct: !!sp,
                                            san_pham_ten: sp ? (sp.ten || '') : '',
                                            san_pham_gia: sp ? (sp.gia_tham_khao || '') : '',
                                            san_pham_san: lk ? (lk.ten_san || 'Link mua sắm') : 'Link mua sắm',
                                            san_pham_url: lk ? (lk.url || lk.url_affiliate || '') : '',
                                            isLoading: false
                                          });
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer border-none bg-transparent"
                                      >
                                        <Edit3 size={16} className="text-indigo-600" />
                                        <span>Chỉnh sửa bài viết</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setOpenMenuPostId(null);
                                          setDeleteModal({ isOpen: true, postId: p.id, isLoading: false });
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm font-extrabold text-[#c93638] hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer border-none bg-transparent border-t border-slate-100"
                                      >
                                        <Trash2 size={16} />
                                        <span>Xóa bài viết</span>
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setOpenMenuPostId(null);
                                        setInteractionMessage('🚩 Đã gửi báo cáo bài viết tới Quản trị viên!');
                                        setTimeout(() => setInteractionMessage(''), 3000);
                                      }}
                                      className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer border-none bg-transparent"
                                    >
                                      <span>🚩 Báo cáo bài viết</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {p.tieu_de && (
                            <div className="pb-3 mb-3 border-b border-dashed border-slate-200">
                              <h3 className="font-black text-lg sm:text-xl text-slate-900 leading-snug flex items-center gap-2 m-0">
                                <span className="w-1.5 h-5 bg-gradient-to-b from-[#c93638] to-rose-500 rounded-full inline-block shrink-0"></span>
                                <span>{p.tieu_de}</span>
                              </h3>
                            </div>
                          )}

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

                          {renderPostImages(p)}

                          {renderProductLinks(p)}

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

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Hồ sơ chi tiết' && (
                <div className="border border-slate-200 rounded-[32px] p-6 sm:p-8 bg-white shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="font-black text-xl text-slate-900 m-0 flex items-center gap-2.5">
                      <Shield className="text-[#c93638]" size={24} /> 
                      <span>Thông Tin Định Danh & Mạng Xã Hội</span>
                    </h2>
                    {isOwner && (
                      <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 shrink-0 flex items-center gap-1.5 w-fit">
                        <span>💡 Bấm nút quyền riêng tư để ẩn/hiện với công chúng</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-slate-300/80 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">HỌ VÀ TÊN THỰC</span>
                          <span className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-slate-200/70 text-slate-600">🌐 Mặc định công khai</span>
                        </div>
                        <p className="font-black text-slate-900 text-base m-0 pt-0.5">{profile.ho_ten || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-slate-300/80 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">EMAIL LIÊN KẾT</span>
                          {isOwner && (
                            <button 
                              type="button" 
                              onClick={() => togglePrivacy('email', 'Email liên kết')}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-black border cursor-pointer transition-all flex items-center gap-1 shadow-2xs ${privacy.email === 'private' ? 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100'}`}
                            >
                              {privacy.email === 'private' ? '🔒 Đang ẩn (Chỉ mình tôi)' : '🌐 Công khai'}
                            </button>
                          )}
                        </div>
                        <p className="font-black text-slate-900 text-base m-0 pt-0.5">
                          {(!isOwner && privacy.email === 'private') ? <span className="text-slate-400 italic font-bold">••••••••@••••.com (Đã ẩn theo quyền riêng tư 🔒)</span> : profile.email}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-slate-300/80 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">SỐ ĐIỆN THOẠI</span>
                          {isOwner && (
                            <button 
                              type="button" 
                              onClick={() => togglePrivacy('so_dien_thoai', 'Số điện thoại')}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-black border cursor-pointer transition-all flex items-center gap-1 shadow-2xs ${privacy.so_dien_thoai === 'private' ? 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100'}`}
                            >
                              {privacy.so_dien_thoai === 'private' ? '🔒 Đang ẩn (Chỉ mình tôi)' : '🌐 Công khai'}
                            </button>
                          )}
                        </div>
                        <p className="font-black text-slate-900 text-base m-0 pt-0.5">
                          {(!isOwner && privacy.so_dien_thoai === 'private') ? <span className="text-slate-400 italic font-bold">•••• ••• ••• (Đã ẩn theo quyền riêng tư 🔒)</span> : (profile.so_dien_thoai || '•••••••••• (Chưa cập nhật)')}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-slate-300/80 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">ĐỊA ĐIỂM CƯ TRÚ</span>
                          {isOwner && (
                            <button 
                              type="button" 
                              onClick={() => togglePrivacy('dia_chi', 'Địa điểm cư trú')}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-black border cursor-pointer transition-all flex items-center gap-1 shadow-2xs ${privacy.dia_chi === 'private' ? 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100'}`}
                            >
                              {privacy.dia_chi === 'private' ? '🔒 Đang ẩn (Chỉ mình tôi)' : '🌐 Công khai'}
                            </button>
                          )}
                        </div>
                        <p className="font-black text-slate-900 text-base m-0 pt-0.5">
                          {(!isOwner && privacy.dia_chi === 'private') ? <span className="text-slate-400 italic font-bold">Đã ẩn theo cài đặt riêng tư 🔒</span> : (profile.dia_chi || 'Việt Nam')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <h3 className="font-black text-base text-slate-900 m-0">Kết nối mạng xã hội</h3>
                      {isOwner && (
                        <button 
                          type="button" 
                          onClick={() => togglePrivacy('mang_xa_hoi', 'Mạng xã hội')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer transition-all flex items-center gap-1.5 w-fit shadow-2xs ${privacy.mang_xa_hoi === 'private' ? 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100'}`}
                        >
                          {privacy.mang_xa_hoi === 'private' ? '🔒 Đang ẩn (Chỉ mình tôi)' : '🌐 Công khai'}
                        </button>
                      )}
                    </div>
                    {(!isOwner && privacy.mang_xa_hoi === 'private') ? (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-500 font-extrabold text-xs flex items-center gap-2">
                        <span>🔒 Người dùng này đã ẩn danh sách các liên kết mạng xã hội của họ.</span>
                      </div>
                    ) : (
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
                    )}
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
                              <div className="bg-emerald-50 border border-emerald-400 text-emerald-800 px-5 py-2.5 rounded-2xl font-black text-xs shadow-2xs text-center">
                                ✅ Đã Đăng Ký / Chủ Trì
                              </div>
                            ) : (
                              <button className="w-full md:w-auto bg-[#0f172a] hover:bg-[#c93638] text-white px-6 py-3 rounded-2xl font-black text-xs border-none cursor-pointer transition-colors shadow-sm">
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
          
          <div className="border border-slate-200/80 rounded-[28px] p-6 bg-white shadow-sm transition-all hover:shadow-md hover:border-rose-200/60">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2.5 font-black text-base text-slate-800">
                <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c93638]">
                  <Sparkles size={18} />
                </div>
                <span>Điểm trải nghiệm (XP)</span>
              </div>
              <span className="font-black text-2xl text-[#c93638] bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-1.5 rounded-2xl border border-rose-200 shadow-2xs">
                {currentXP.toLocaleString('vi-VN')}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/40 border border-slate-100 mb-5 flex items-center gap-4 transition-all hover:border-rose-200/60">
              <div 
                onClick={() => rankInfo.anh_cap_bac && setPreviewImage({ isOpen: true, url: rankInfo.anh_cap_bac, title: rankInfo.ten_cap_bac, caption: rankInfo.mo_ta })}
                className="w-16 h-16 rounded-2xl border-2 border-white shadow-md overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-transform bg-slate-100 relative group"
                title="Bấm để xem huy hiệu cấp bậc"
              >
                {rankInfo.anh_cap_bac ? (
                  <img src={rankInfo.anh_cap_bac} alt={rankInfo.ten_cap_bac} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-xl text-amber-500">🏆</div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  🔍
                </div>
              </div>
              <div className="overflow-hidden flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={16} className="text-[#c93638] shrink-0" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cấp Bậc CLUB</span>
                </div>
                <h4 className="font-black text-base text-slate-900 truncate m-0">
                  {rankInfo.ten_cap_bac}
                </h4>
                <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {rankInfo.mo_ta || 'Danh hiệu chính thức từ Club Trải Nghiệm'}
                </p>
              </div>
            </div>

            <div className="mb-2 flex justify-between text-xs font-extrabold text-slate-500">
              <span>Tiến trình cấp bậc</span>
              <span>{maxXP ? `${currentXP.toLocaleString('vi-VN')} / ${(maxXP + 1).toLocaleString('vi-VN')} XP` : 'Đã đạt đỉnh cao tối thượng! 🏆'}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 border border-slate-200/80 overflow-hidden p-0.5 mb-4 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-red-500 via-[#c93638] to-amber-500 rounded-full transition-all duration-700 shadow-2xs"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <p className="text-xs font-bold text-slate-500 mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
              <span className="text-amber-500 font-extrabold text-base">💡</span>
              <span>Thích hoặc thảo luận bài viết sẽ lập tức tích lũy <strong>+5 và +10 điểm XP</strong> trong thời gian thực!</span>
            </p>
          </div>

          <button 
            onClick={handleCopyLink}
            className="w-full py-3.5 px-6 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            {copied ? (
              <>
                <Check size={19} className="text-emerald-500" />
                <span className="text-emerald-600 font-extrabold">Đã sao chép liên kết hồ sơ!</span>
              </>
            ) : (
              <>
                <LinkIcon size={19} className="rotate-45 text-[#c93638]" />
                <span>Sao chép liên kết chia sẻ</span>
              </>
            )}
          </button>

          <div className="border border-slate-200/80 rounded-[28px] p-6 bg-white shadow-sm transition-all hover:shadow-md">
            <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Award className="text-[#c93638]" /> Huy hiệu & Danh hiệu ({badges.length})
            </h3>
            <div className="flex flex-col gap-2.5">
              {badges.map((b, idx) => (
                <div 
                  key={idx} 
                  className="border border-slate-100 rounded-2xl p-3.5 bg-slate-50 hover:bg-rose-50/50 hover:border-rose-200 transition-all cursor-pointer group flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-800 group-hover:text-[#c93638] transition-colors">
                      {b.ten}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full shadow-2xs" style={{ backgroundColor: b.mau_sc || '#eab308' }}></span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium m-0">{b.mo_ta}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-200/80 rounded-[28px] p-6 bg-white shadow-sm transition-all hover:shadow-md">
            <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center justify-between">
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
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group border border-transparent hover:border-slate-200/70"
                  >
                    <div className="w-11 h-11 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center font-black text-slate-600 shadow-2xs">
                      {f.anh_dai_dien ? (
                        <img src={f.anh_dai_dien} alt={f.ten_hien_thi} className="w-full h-full object-cover" />
                      ) : (
                        <span>{(f.ten_hien_thi || f.ho_ten || 'F').charAt(0)}</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-black text-sm text-slate-800 group-hover:text-[#c93638] transition-colors truncate">
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

      <FormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSaveProfile}
        title="Chỉnh Sửa Trang Cá Nhân Của Bạn"
        icon={Edit3}
        iconColor="text-[#c93638]"
        iconBg="bg-rose-50 border-rose-200"
        size="lg"
        tabs={[
          { id: 'info', label: 'Thông Tin & Tiểu Sử', icon: '📝' },
          { id: 'media', label: 'Ảnh Bìa & Avatar', icon: '🖼️' }
        ]}
        activeTab={editTab}
        onTabChange={setEditTab}
        submitText="Lưu Thay Đổi Trang Cá Nhân"
        cancelText="Hủy bỏ"
        isSaving={isSaving}
        successMessage={saveSuccessMessage}
      >
        {editTab === 'info' && (
          <div className="space-y-4 text-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Tên hiển thị (Nickname)</label>
                <input 
                  type="text" 
                  value={editForm.ten_hien_thi} 
                  onChange={(e) => setEditForm({...editForm, ten_hien_thi: e.target.value})}
                  placeholder="VD: Long Founder 👑"
                  className="w-full p-3.5 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Họ tên thực</label>
                <input 
                  type="text" 
                  value={editForm.ho_ten} 
                  onChange={(e) => setEditForm({...editForm, ho_ten: e.target.value})}
                  placeholder="VD: Thành Long"
                  className="w-full p-3.5 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Tiểu sử trải nghiệm (Bio)</label>
              <textarea 
                rows={4}
                value={editForm.tieu_su} 
                onChange={(e) => setEditForm({...editForm, tieu_su: e.target.value})}
                placeholder="Hãy viết vài câu truyền cảm hứng về bạn, sở thích review cà phê hay công nghệ..."
                className="w-full p-3.5 border border-slate-200 rounded-2xl font-normal text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none leading-relaxed resize-y transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Số điện thoại</label>
                <input 
                  type="text" 
                  value={editForm.so_dien_thoai} 
                  onChange={(e) => setEditForm({...editForm, so_dien_thoai: e.target.value})}
                  placeholder="VD: 0988.888.888"
                  className="w-full p-3.5 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Địa điểm cư trú</label>
                <input 
                  type="text" 
                  value={editForm.dia_chi} 
                  onChange={(e) => setEditForm({...editForm, dia_chi: e.target.value})}
                  placeholder="VD: TP. Hồ Chí Minh"
                  className="w-full p-3.5 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1.5">Website hoặc liên kết cá nhân</label>
              <input 
                type="text" 
                value={editForm.website} 
                onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                placeholder="VD: https://clubtrainghiem.com"
                className="w-full p-3.5 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {editTab === 'media' && (
          <div className="space-y-6">
            
            <div className="p-5 border border-slate-200/80 rounded-3xl bg-gradient-to-br from-slate-50/80 via-white to-slate-50/40 shadow-xs">
              <h4 className="font-extrabold text-sm text-slate-900 mb-3.5 flex items-center gap-2 m-0">
                <Camera className="text-[#c93638]" size={18} /> 1. Cập Nhật Ảnh Đại Diện (Avatar)
              </h4>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-20 h-20 rounded-full border border-slate-200 shadow-sm overflow-hidden bg-white shrink-0 flex items-center justify-center text-xl font-black text-slate-600">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span>U</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="inline-block px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-extrabold text-xs cursor-pointer shadow-sm transition-all mb-2">
                    📁 Chọn File Ảnh Từ Máy Tính...
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" />
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium m-0">Hoặc bạn có thể dán trực tiếp đường link ảnh (URL) bên dưới:</p>
                </div>
              </div>
              <input 
                type="text" 
                value={editForm.anh_dai_dien} 
                onChange={(e) => { setEditForm({...editForm, anh_dai_dien: e.target.value}); setAvatarPreview(e.target.value); setAvatarFile(null); }}
                placeholder="Dán link ảnh URL (VD: https://images.unsplash.com/...)"
                className="w-full p-3.5 border border-slate-200 rounded-xl font-medium text-xs bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-800"
              />
            </div>

            <div className="p-5 border border-slate-200/80 rounded-3xl bg-gradient-to-br from-slate-50/80 via-white to-slate-50/40 shadow-xs">
              <h4 className="font-extrabold text-sm text-slate-900 mb-3.5 flex items-center gap-2 m-0">
                <Image className="text-indigo-600" size={18} /> 2. Cập Nhật Ảnh Bìa (Cover Banner)
              </h4>
              
              {coverPreview && (
                <div className="h-36 rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-3 bg-slate-950">
                  <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <label className="inline-block px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs cursor-pointer shadow-sm transition-all mb-2">
                📁 Chọn File Ảnh Bìa Từ Máy Tính...
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="hidden" />
              </label>
              <p className="text-[11px] text-slate-500 font-medium mb-2.5 m-0">Hoặc dán link ảnh URL cho ảnh bìa:</p>
              <input 
                type="text" 
                value={editForm.anh_bia} 
                onChange={(e) => { setEditForm({...editForm, anh_bia: e.target.value}); setCoverPreview(e.target.value); setCoverFile(null); }}
                placeholder="Dán link ảnh bìa URL (VD: https://images.unsplash.com/...)"
                className="w-full p-3.5 border border-slate-200 rounded-xl font-medium text-xs bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-800"
              />
            </div>

          </div>
        )}
      </FormModal>

      <ImageModal
        isOpen={previewImage.isOpen}
        onClose={() => setPreviewImage({ ...previewImage, isOpen: false })}
        imageUrl={previewImage.url}
        title={previewImage.title}
        caption={previewImage.caption}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null, isLoading: false })}
        onConfirm={confirmDeletePost}
        title="Xác nhận xóa khoảnh khắc"
        message="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này sẽ đồng thời thu hồi và xóa sạch trọn bộ ảnh trên Cloudinary."
        confirmText="Xóa vĩnh viễn"
        confirmColor="danger"
        isLoading={deleteModal.isLoading}
      />

      <ConfirmModal
        isOpen={unfollowModal}
        onClose={() => setUnfollowModal(false)}
        onConfirm={() => handleToggleFollow(true)}
        title="Xác Nhận Hủy Theo Dõi"
        message={`Bạn có chắc chắn muốn hủy theo dõi ${profile?.ho_ten || 'thành viên này'}? Bạn sẽ không còn nhận được thông báo về cập nhật mới nhất của họ.`}
        confirmText="Hủy theo dõi"
        variant="warning"
      />

      <FormModal
        isOpen={editPostModal.isOpen}
        onClose={() => setEditPostModal({ isOpen: false, id: null, tieu_de: '', noi_dung: '', hashtags: '', showProduct: false, san_pham_ten: '', san_pham_gia: '', san_pham_san: 'Link mua sắm', san_pham_url: '', isLoading: false })}
        onConfirm={handleSaveEditPost}
        title="✏️ Chỉnh sửa khoảnh khắc & sản phẩm"
        confirmText="Lưu thay đổi"
        isLoading={editPostModal.isLoading}
      >
        <div className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Tiêu đề khoảnh khắc (*)</label>
            <input 
              type="text" 
              value={editPostModal.tieu_de} 
              onChange={(e) => setEditPostModal({ ...editPostModal, tieu_de: e.target.value })}
              placeholder="Nhập tiêu đề bài review..." 
              className="w-full p-3 border border-slate-200 rounded-xl font-black text-sm bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Nội dung trải nghiệm (*)</label>
            <textarea 
              rows={5}
              value={editPostModal.noi_dung} 
              onChange={(e) => setEditPostModal({ ...editPostModal, noi_dung: e.target.value })}
              placeholder="Chia sẻ trọn vẹn trải nghiệm của bạn..." 
              className="w-full p-3 border border-slate-200 rounded-xl font-medium text-sm bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800 transition-all leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Hashtags (cách nhau bởi dấu phẩy)</label>
            <input 
              type="text" 
              value={editPostModal.hashtags} 
              onChange={(e) => setEditPostModal({ ...editPostModal, hashtags: e.target.value })}
              placeholder="VD: #clubtrainghiem, #khoanhkhac, #review" 
              className="w-full p-3 border border-slate-200 rounded-xl font-semibold text-xs bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-indigo-600 transition-all"
            />
          </div>

          <div className="pt-2 border-t border-slate-200/60">
            <button
              type="button"
              onClick={() => setEditPostModal(prev => ({ ...prev, showProduct: !prev.showProduct }))}
              className="flex items-center gap-2 text-xs font-black text-slate-700 hover:text-[#c93638] bg-amber-50 hover:bg-amber-100/70 px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-amber-200"
            >
              <ShoppingBag size={16} className="text-orange-500" />
              <span>{editPostModal.showProduct ? '❌ Ẩn / Xóa link mua sắm khỏi bài' : '+ Gắn / Chỉnh Sửa Link Mua Sắm (Affiliate)'}</span>
            </button>

            {editPostModal.showProduct && (
              <div className="mt-3 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
                <div className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <span>🛍️ Chi tiết sản phẩm & link affiliate đính kèm</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1">Tên linh kiện / Sản phẩm *</label>
                    <input
                      type="text"
                      placeholder="VD: Cối xay Comandante C40 / Bàn phím Rainy75"
                      value={editPostModal.san_pham_ten || ''}
                      onChange={(e) => setEditPostModal(prev => ({ ...prev, san_pham_ten: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 outline-none focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1">Giá tham khảo (VNĐ)</label>
                    <input
                      type="number"
                      placeholder="VD: 5500000"
                      value={editPostModal.san_pham_gia || ''}
                      onChange={(e) => setEditPostModal(prev => ({ ...prev, san_pham_gia: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">Đường dẫn Mua sắm / Affiliate URL *</label>
                  <input
                    type="text"
                    placeholder="https://... dán link sản phẩm hoặc affiliate tại đây"
                    value={editPostModal.san_pham_url || ''}
                    onChange={(e) => setEditPostModal(prev => ({ ...prev, san_pham_url: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 outline-none focus:border-orange-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </FormModal>

      <CommentModal
        isOpen={Boolean(activeCommentPostId)}
        onClose={() => setActiveCommentPostId(null)}
        post={posts.find(p => p.id === activeCommentPostId)}
        currentUser={isOwner ? profile : { ten_hien_thi: 'Bạn', anh_dai_dien: profile?.anh_dai_dien }}
        onSendComment={handleSendComment}
        onLikeComment={handleLikeComment}
      />

    </div>
  );
};

export default Profile;
