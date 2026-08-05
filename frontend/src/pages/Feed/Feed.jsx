import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import echo from '../../api/echo';
import { 
  Sparkles, Users, Bookmark, Calendar, Image as ImageIcon, Smile, ShoppingBag,
  MapPin, Heart, Maximize, MessageCircle, Share2, Trash2, Send, Shield, Flame, Plus, X, PlusCircle, MoreHorizontal, Edit3, RefreshCcw
} from 'lucide-react';
import { ImageModal, FormModal, ConfirmModal, CommentModal } from '../../components/Modal';

const Feed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [activeMembers, setActiveMembers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [toast, setToast] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [pendingScrollPostId, setPendingScrollPostId] = useState(location.state?.scrollToPostId || null);
  const [commentInput, setCommentInput] = useState('');
  
  const [previewImage, setPreviewImage] = useState({ isOpen: false, url: '', title: '', caption: '' });
  const [createPostModal, setCreatePostModal] = useState({ isOpen: false, title: '', content: '', inputUrl: '', images: [], showProduct: false, productName: '', productPrice: '', productPlatform: 'Link mua sắm', productUrl: '', isSaving: false });
  const [editPostModal, setEditPostModal] = useState({ isOpen: false, id: null, tieu_de: '', noi_dung: '', hashtags: '', showProduct: false, san_pham_ten: '', san_pham_gia: '', san_pham_san: 'Link mua sắm', san_pham_url: '', isLoading: false });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null, isLoading: false });
  const [openMenuPostId, setOpenMenuPostId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchFeedData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/feed/posts');
      if (res.data && res.data.status === 'success') {
        setPosts(res.data.posts || []);
        setActiveMembers(res.data.active_members || []);
        setSuggestions(res.data.suggestions || []);
        setTopics(res.data.topics || []);
      }
    } catch (error) {
      showToast('Khởi tạo bảng tin gặp vấn đề kết nối', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.post-menu-container')) {
        setOpenMenuPostId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem('current_user');
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          setCurrentUser(parsed?.user?.id ? parsed.user : parsed);
        } catch (e) {}
      }
    };
    loadUser();

    api.get('/user').then(res => {
      const userData = res.data?.user || res.data;
      if (userData && userData.id) {
        setCurrentUser(userData);
        localStorage.setItem('current_user', JSON.stringify(userData));
        window.dispatchEvent(new Event('user_auth_change'));
      }
    }).catch(() => {});

    window.addEventListener('user_auth_change', loadUser);
    fetchFeedData();

    const channel = echo.channel('club-live');
    const handleLiveEvent = (event) => {
      if (['new_post', 'update_post', 'delete_post', 'like_post', 'comment_post', 'like_comment'].includes(event.type)) {
        fetchFeedData(true);
      }
    };
    channel.listen('.live-event', handleLiveEvent);

    const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('club_live_sync') : null;
    if (bc) {
      bc.onmessage = (event) => {
        if (event.data?.type === 'sync_feed') {
          fetchFeedData(true);
        }
      };
    }

    return () => {
      window.removeEventListener('user_auth_change', loadUser);
      channel.stopListening('.live-event', handleLiveEvent);
      if (bc) bc.close();
    };
  }, []);

  useEffect(() => {
    const handleScrollEvent = (e) => {
      if (e.detail?.postId) {
        setPendingScrollPostId(e.detail.postId);
      }
    };
    window.addEventListener('scroll_to_post', handleScrollEvent);
    return () => window.removeEventListener('scroll_to_post', handleScrollEvent);
  }, []);

  useEffect(() => {
    if (location.state?.scrollToPostId) {
      setPendingScrollPostId(location.state.scrollToPostId);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.state]);

  useEffect(() => {
    if (!pendingScrollPostId || posts.length === 0) return;

    let targetId = pendingScrollPostId;
    if (pendingScrollPostId === 'latest') {
      targetId = posts[0]?.id;
    }

    const parsedId = parseInt(targetId, 10);
    if (isNaN(parsedId)) return;

    const targetPost = posts.find(p => parseInt(p.id, 10) === parsedId);
    if (!targetPost && pendingScrollPostId !== 'latest') {
      setPendingScrollPostId(null);
      return;
    }

    setPendingScrollPostId(null);

    setTimeout(() => {
      const el = document.getElementById(`post-${parsedId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
        el.style.boxShadow = '0 0 0 4px rgba(201, 54, 56, 0.4)';
        el.style.borderColor = '#c93638';
        setTimeout(() => {
          el.style.boxShadow = '';
          el.style.borderColor = '';
        }, 2500);
      }
    }, 200);
  }, [pendingScrollPostId, posts]);

  const refreshCurrentUser = async () => {
    try {
      const res = await api.get('/user');
      const userData = res.data?.user || res.data;
      if (userData && userData.id) {
        setCurrentUser(userData);
        localStorage.setItem('current_user', JSON.stringify(userData));
        window.dispatchEvent(new Event('user_auth_change'));
      }
    } catch (e) {}
  };

  const handleLikePost = (postId) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để bày tỏ cảm xúc!', 'error');
      navigate('/auth');
      return;
    }
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.is_liked;
        return {
          ...p,
          is_liked: !isLiked,
          likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1
        };
      }
      return p;
    }));
    api.post(`/posts/${postId}/like`).then(res => {
      if (currentUser && res.data && res.data.is_liked) {
        try {
          const updatedUser = { ...currentUser, diem_trai_nghiem: (currentUser.diem_trai_nghiem || 0) + 5 };
          localStorage.setItem('current_user', JSON.stringify(updatedUser));
        } catch (e) {}
      }
    }).catch(() => {
      showToast('Không thể cập nhật cảm xúc lúc này', 'error');
      fetchFeedData();
    });
  };

  const handleSendComment = async (postId, content, parentId = null) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để tham gia thảo luận!', 'error');
      navigate('/auth');
      return;
    }
    if (!content || !content.trim()) return;

    try {
      const res = await api.post(`/posts/${postId}/comment`, { noi_dung: content.trim(), parent_id: parentId });
      if (res.status === 200 || res.status === 201) {
        const newComment = res.data.comment || {
          id: Date.now(),
          bai_viet_id: postId,
          nguoi_dung_id: currentUser.id,
          parent_id: parentId,
          noi_dung: content.trim(),
          created_at: new Date().toISOString(),
          ho_ten: currentUser.ho_ten || 'Thành viên',
          ten_hien_thi: currentUser.ten_hien_thi || currentUser.ho_ten || 'Thành viên',
          anh_dai_dien: currentUser.anh_dai_dien || null,
          ten_cap_bac: currentUser.cap_bac_info?.ten_cap_bac || currentUser.cap_bac || '⭐ Thành viên',
          anh_cap_bac: currentUser.cap_bac_info?.anh_cap_bac || null
        };
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments_count: res.data.comments_count ?? (p.comments_count + 1),
              recent_comments: [newComment, ...(p.recent_comments || [])]
            };
          }
          return p;
        }));
        showToast('Gửi thảo luận thành công! (+10 XP ✨)', 'success');
        refreshCurrentUser();
      }
    } catch (error) {
      showToast('Lỗi gửi lời nhắn, vui lòng thử lại', 'error');
    }
  };

  const handleLikeComment = async (postId, commentId) => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để thao tác!', 'error');
      navigate('/auth');
      return;
    }
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
    } catch (error) {
      showToast('Lỗi thao tác, vui lòng thử lại', 'error');
    }
  };

  const handleAddImageUrl = () => {
    const url = createPostModal.inputUrl.trim();
    if (!url) return;
    setCreatePostModal(prev => ({
      ...prev,
      images: [...prev.images, { type: 'url', url }],
      inputUrl: ''
    }));
  };

  const handleFileChange = (e) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const newImgs = selectedFiles.map(file => ({
      type: 'file',
      file,
      url: URL.createObjectURL(file)
    }));
    setCreatePostModal(prev => ({
      ...prev,
      images: [...prev.images, ...newImgs]
    }));
  };

  const handleRemoveImage = (index) => {
    setCreatePostModal(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleOpenAlbumPicker = () => {
    if (!currentUser) {
      showToast('Vui lòng đăng nhập để chia sẻ album ảnh!', 'error');
      navigate('/auth');
      return;
    }
    setCreatePostModal(prev => ({ ...prev, isOpen: true, title: '', content: '', inputUrl: '', showProduct: false, isSaving: false }));
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleOpenProductPost = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    setCreatePostModal({ isOpen: true, title: '', content: '', inputUrl: '', images: [], showProduct: true, productName: '', productPrice: '', productPlatform: 'Link mua sắm', productUrl: '', isSaving: false });
  };

  const handleOpenCheckinPost = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    setCreatePostModal({ isOpen: true, title: '📍 Check-in tại Quán ', content: '✨ Hôm nay mình ghé thử một không gian vô cùng ấn tượng. Một vài chia sẻ trải nghiệm từ mình:\n\n1. Về không gian & góc chill:\n2. Về đồ uống & hương vị:\n3. Về thái độ phục vụ & giá cả:', inputUrl: '', images: [], isSaving: false });
  };

  const handleCreatePostSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!createPostModal.content.trim()) {
      showToast('Vui lòng nhập nội dung khoảnh khắc!', 'error');
      return;
    }
    setCreatePostModal(prev => ({ ...prev, isSaving: true }));
    try {
      const formData = new FormData();
      formData.append('noi_dung', createPostModal.content);
      if (createPostModal.title.trim()) {
        formData.append('tieu_de', createPostModal.title);
      }
      
      createPostModal.images.forEach(img => {
        if (img.type === 'file') {
          formData.append('danh_sach_file[]', img.file);
        } else if (img.type === 'url') {
          formData.append('danh_sach_url[]', img.url);
        }
      });

      if (createPostModal.productName && createPostModal.productUrl) {
        formData.append('san_pham_ten', createPostModal.productName);
        formData.append('san_pham_gia', createPostModal.productPrice || 0);
        formData.append('san_pham_san', 'Link mua sắm');
        formData.append('san_pham_url', createPostModal.productUrl);
      }

      const res = await api.post('/feed/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.status === 'success') {
        showToast('Đăng khoảnh khắc thành công! (+20 XP ✨)', 'success');
        setCreatePostModal({ isOpen: false, title: '', content: '', inputUrl: '', images: [], showProduct: false, productName: '', productPrice: '', productPlatform: 'Link mua sắm', productUrl: '', isSaving: false });
        fetchFeedData();
        refreshCurrentUser();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Không thể đăng bài lúc này', 'error');
    } finally {
      setCreatePostModal(prev => ({ ...prev, isSaving: false }));
    }
  };

  const confirmDeletePost = async () => {
    if (!deleteModal.postId) return;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      await api.delete(`/feed/posts/${deleteModal.postId}`);
      setPosts(prev => prev.filter(p => p.id !== deleteModal.postId));
      showToast('Đã xóa bài viết khỏi bảng tin thành công.', 'success');
    } catch (error) {
      showToast('Bạn không có quyền hoặc lỗi khi xóa', 'error');
    } finally {
      setDeleteModal({ isOpen: false, postId: null, isLoading: false });
    }
  };

  const handleSaveEditPost = async () => {
    if (!editPostModal.id || !editPostModal.tieu_de.trim() || !editPostModal.noi_dung.trim()) {
      showToast('Vui lòng nhập tiêu đề và nội dung bài viết.', 'error');
      return;
    }
    if (editPostModal.showProduct && (!editPostModal.san_pham_ten.trim() || !editPostModal.san_pham_url.trim())) {
      showToast('Vui lòng nhập tên sản phẩm và đường dẫn URL hoặc ẩn form sản phẩm.', 'error');
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
      showToast('✨ Đã cập nhật khoảnh khắc và link sản phẩm thành công!', 'success');
      setEditPostModal({ isOpen: false, id: null, tieu_de: '', noi_dung: '', hashtags: '', showProduct: false, san_pham_ten: '', san_pham_gia: '', san_pham_san: 'Link mua sắm', san_pham_url: '', isLoading: false });
    } catch (err) {
      showToast(err.response?.data?.message || 'Không thể chỉnh sửa bài viết lúc này.', 'error');
      setEditPostModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const renderProductLinks = (post) => {
    if (!post.san_pham_list || post.san_pham_list.length === 0) return null;
    return (
      <div className="mt-2 flex flex-col gap-3">
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

  return (
    <div className="bg-slate-50 min-h-screen relative font-sans text-slate-800 pb-16">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      {toast && (
        <div className="fixed top-6 right-6 z-[10000] animate-bounce">
          <div className="px-6 py-4 rounded-2xl bg-white border border-rose-200 text-slate-800 font-extrabold shadow-xl flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c93638]">
              {toast.type === 'error' ? '⚠️' : '✨'}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-8">
        
        <aside className="hidden lg:flex flex-col gap-6">
          
          {currentUser && (
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4 cursor-pointer" onClick={() => navigate('/profile/me')}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c93638] to-amber-500 p-0.5 shadow-md shrink-0">
                  <div className="w-full h-full bg-white rounded-[14px] overflow-hidden flex items-center justify-center font-black text-slate-800">
                    {currentUser.anh_dai_dien ? (
                      <img src={currentUser.anh_dai_dien} alt={currentUser.ten_hien_thi} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{(currentUser.ten_hien_thi || currentUser.ho_ten || 'U').charAt(0)}</span>
                    )}
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-extrabold text-slate-900 text-base truncate m-0 hover:text-[#c93638] transition-colors">
                    {currentUser.ten_hien_thi || currentUser.ho_ten}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    {currentUser.cap_bac_info?.anh_cap_bac && (
                      <img src={currentUser.cap_bac_info.anh_cap_bac} alt="Badge" className="w-5 h-5 rounded-md object-cover" />
                    )}
                    <span className="text-xs font-bold text-[#c93638]">
                      {currentUser.cap_bac_info?.ten_cap_bac || currentUser.cap_bac || 'Thành viên Club'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-extrabold text-slate-500">
                <span>Điểm tích lũy</span>
                <span className="px-3 py-1 bg-rose-50 text-[#c93638] rounded-xl border border-rose-100">
                  {currentUser.diem_trai_nghiem || 0} XP
                </span>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-extrabold text-base text-slate-900 mb-5 flex items-center gap-2">
              <Flame className="text-[#c93638] shrink-0" size={20} />
              <span>Thành viên năng nổ</span>
            </h3>
            <div className="flex flex-col gap-4">
              {activeMembers.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="relative shrink-0" onClick={() => navigate(`/profile/${user.id}`)}>
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-600 shadow-2xs">
                      {user.anh_dai_dien ? (
                        <img src={user.anh_dai_dien} alt={user.ten_hien_thi} className="w-full h-full object-cover" />
                      ) : (
                        <span>{(user.ten_hien_thi || user.ho_ten || 'U').charAt(0)}</span>
                      )}
                    </div>
                    {user.online && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden" onClick={() => navigate(`/profile/${user.id}`)}>
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#c93638] transition-colors truncate m-0">
                      {user.ten_hien_thi || user.ho_ten}
                    </h4>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-0.5 m-0 truncate">
                      {user.anh_cap_bac && (
                        <img 
                          src={user.anh_cap_bac} 
                          alt="rank" 
                          className="w-4 h-4 rounded object-cover cursor-pointer hover:scale-125 transition-transform" 
                          onClick={(e) => { e.stopPropagation(); setPreviewImage({ isOpen: true, url: user.anh_cap_bac, title: user.ten_cap_bac, caption: `Huy hiệu của ${user.ten_hien_thi || user.ho_ten}` }); }}
                        />
                      )}
                      <span>{user.ten_cap_bac || 'Thành viên'}</span>
                    </p>
                  </div>
                  <span className="text-[11px] font-black text-[#c93638] bg-rose-50/80 px-2 py-1 rounded-lg shrink-0">
                    {user.diem_trai_nghiem} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => navigate('/profile/me')} className="flex items-center gap-4 px-5 py-4 rounded-[24px] bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all shadow-xs cursor-pointer text-left">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c93638] shrink-0">
                <Bookmark size={18} />
              </div>
              <span>Khoảnh khắc đã lưu</span>
            </button>
            <button onClick={() => showToast('Đang mở trang danh sách sự kiện club...')} className="flex items-center gap-4 px-5 py-4 rounded-[24px] bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all shadow-xs cursor-pointer text-left">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#c93638] shrink-0">
                <Calendar size={18} />
              </div>
              <span>Sự kiện & Buổi Offline</span>
            </button>
          </div>

        </aside>

        <main className="flex flex-col gap-6">
          
          <div className="bg-gradient-to-r from-rose-50 via-amber-50/50 to-orange-50 border border-rose-200/80 rounded-[32px] p-6 sm:p-8 shadow-sm">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-[#c93638] shrink-0 shadow-xs">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-xl sm:text-2xl mb-2 tracking-tight">
                  Bảng Tin Club Trải Nghiệm 2026 ✨
                </h2>
                <p className="text-sm text-slate-600 font-medium leading-relaxed m-0">
                  Nơi cộng đồng tự do chia sẻ album ảnh mở hộp, trải nghiệm specialty coffee và bàn luận kiệt tác công nghệ — không thuật toán gò bó, tự do kết nối và tích lũy điểm XP thực tế!
                </p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200/80 rounded-[32px] p-6 bg-white shadow-sm hover:shadow-md transition-all">
            <div className="flex gap-4 mb-5 items-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-extrabold text-slate-600 shadow-2xs">
                {currentUser?.anh_dai_dien ? (
                  <img src={currentUser.anh_dai_dien} alt="Me" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg">{(currentUser?.ten_hien_thi || currentUser?.ho_ten || currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div 
                onClick={() => currentUser ? setCreatePostModal({ isOpen: true, title: '', content: '', inputUrl: '', images: [], isSaving: false }) : navigate('/auth')}
                className="bg-slate-50 border border-slate-200/70 hover:border-rose-200 rounded-[24px] flex-1 px-5 py-4 text-slate-400 font-bold text-sm cursor-pointer hover:bg-rose-50/30 transition-all select-none flex items-center justify-between"
              >
                <span>{currentUser ? `${currentUser.ten_hien_thi || currentUser.ho_ten || currentUser.name || currentUser.email || 'Thành viên Club'} ơi, bạn muốn chia sẻ bộ ảnh hay câu chuyện gì?` : 'Đăng nhập ngay để viết khoảnh khắc của bạn...'}</span>
                <Plus size={20} className="text-[#c93638] shrink-0 hidden sm:block" />
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="flex gap-2 sm:gap-4">
                <button 
                  onClick={handleOpenAlbumPicker}
                  className="flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-[#c93638] bg-slate-50 hover:bg-rose-50 px-3 sm:px-4 py-2 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                >
                  <ImageIcon size={18} className="text-[#c93638]" /> 
                  <span>Album ảnh review</span>
                </button>
                <button 
                  onClick={handleOpenProductPost}
                  className="flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-[#c93638] bg-slate-50 hover:bg-rose-50 px-3 sm:px-4 py-2 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                >
                  <ShoppingBag size={18} className="text-orange-500" /> 
                  <span>Gắn link sản phẩm</span>
                </button>
                <button 
                  onClick={handleOpenCheckinPost}
                  className="hidden sm:flex items-center gap-2 text-xs font-extrabold text-slate-600 hover:text-[#c93638] bg-slate-50 hover:bg-rose-50 px-4 py-2 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                >
                  <MapPin size={18} className="text-emerald-500" /> 
                  <span>Check-in quán</span>
                </button>
              </div>
              <button 
                onClick={() => currentUser ? setCreatePostModal({ isOpen: true, title: '', content: '', inputUrl: '', images: [], isSaving: false }) : navigate('/auth')}
                className="bg-[#c93638] hover:bg-[#a82527] text-white px-5 py-2.5 rounded-2xl font-black text-xs border-none cursor-pointer transition-all shadow-sm flex items-center gap-2 active:scale-95"
              >
                <Sparkles size={16} />
                <span>Đăng Bài</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-400 font-extrabold animate-pulse">
              Đang đồng bộ dòng thời gian và bộ sưu tập ảnh Realtime... ⏳
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 border border-slate-200/80 rounded-[32px] bg-white text-slate-500 font-bold p-8">
              Chưa có khoảnh khắc hay album ảnh nào được chia sẻ trên bảng tin. Hãy là người đầu tiên bứt phá! 🏆
            </div>
          ) : (
            posts.map(post => (
              <article key={post.id} id={`post-${post.id}`} className="border border-slate-200/80 rounded-[32px] p-6 sm:p-8 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-5">
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div 
                      onClick={() => navigate(`/profile/${post.nguoi_dung_id}`)}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 cursor-pointer hover:ring-2 ring-rose-300 transition-all flex items-center justify-center font-black text-slate-600 shadow-2xs"
                    >
                      {post.anh_dai_dien ? (
                        <img src={post.anh_dai_dien} alt={post.ten_hien_thi} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">{(post.ten_hien_thi || post.ho_ten || 'U').charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 
                          onClick={() => navigate(`/profile/${post.nguoi_dung_id}`)}
                          className="font-black text-base sm:text-lg text-slate-900 hover:text-[#c93638] transition-colors cursor-pointer m-0"
                        >
                          {post.ten_hien_thi || post.ho_ten}
                        </h4>
                        
                        {post.anh_cap_bac && (
                          <div 
                            onClick={() => setPreviewImage({ isOpen: true, url: post.anh_cap_bac, title: post.ten_cap_bac, caption: `Danh hiệu đẳng cấp của ${post.ten_hien_thi || post.ho_ten}` })}
                            className="w-6 h-6 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:scale-125 transition-transform bg-slate-50 shrink-0"
                            title="Bấm để phóng to huy hiệu"
                          >
                            <img src={post.anh_cap_bac} alt={post.ten_cap_bac} className="w-full h-full object-cover" />
                          </div>
                        )}

                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {post.ten_cap_bac || 'Thành viên'}
                        </span>

                        {post.ghim == 1 && (
                          <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-rose-50 text-[#c93638] border border-rose-200 flex items-center gap-1">
                            📌 Ghim Club
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-slate-400 font-bold mt-1 flex items-center gap-2">
                        <span>⏰ {new Date(post.created_at).toLocaleString('vi-VN')}</span>
                        {post.ten_danh_muc && (
                          <>
                            <span>•</span>
                            <span className="text-[#c93638] font-black">{post.ten_danh_muc}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="relative post-menu-container">
                    <button 
                      onClick={() => setOpenMenuPostId(openMenuPostId === post.id ? null : post.id)}
                      className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center border border-slate-200/60 cursor-pointer shadow-2xs"
                      title="Tùy chọn"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {openMenuPostId === post.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                        {(post.is_owner || Number(currentUser?.id) === Number(post.nguoi_dung_id) || Number(currentUser?.vai_tro_id) >= 2 || currentUser?.email === 'superadmin@clubtrainghiem.com') ? (
                          <>
                            <button
                              onClick={() => {
                                setOpenMenuPostId(null);
                                const sp = post.san_pham_list && post.san_pham_list.length > 0 ? post.san_pham_list[0] : null;
                                const lk = sp && sp.lien_ket_mua && sp.lien_ket_mua.length > 0 ? sp.lien_ket_mua[0] : null;
                                setEditPostModal({
                                  isOpen: true,
                                  id: post.id,
                                  tieu_de: post.tieu_de || '',
                                  noi_dung: post.noi_dung || '',
                                  hashtags: Array.isArray(post.hashtags) ? post.hashtags.join(', ') : '',
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
                                setDeleteModal({ isOpen: true, postId: post.id, isLoading: false });
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
                              showToast('🚩 Đã gửi báo cáo vi phạm đến quản trị viên Club.');
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
                
                {post.tieu_de && (
                  <div className="pb-3 mb-3 border-b border-dashed border-slate-200">
                    <h3 className="font-black text-lg sm:text-xl text-slate-900 leading-snug flex items-center gap-2 m-0">
                      <span className="w-1.5 h-5 bg-gradient-to-b from-[#c93638] to-rose-500 rounded-full inline-block shrink-0"></span>
                      <span>{post.tieu_de}</span>
                    </h3>
                  </div>
                )}
                <div className="text-slate-800 font-normal leading-relaxed text-base space-y-3 whitespace-pre-line">
                  {post.noi_dung}
                </div>
                
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.hashtags.map((tag, i) => (
                      <span key={i} className="text-xs font-black bg-rose-50 text-[#c93638] px-3 py-1 rounded-xl border border-rose-100 hover:bg-[#c93638] hover:text-white transition-colors cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {renderPostImages(post)}
                {renderProductLinks(post)}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-extrabold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-[11px]">❤️</span>
                      <strong>{post.likes_count}</strong> người quan tâm
                    </span>
                    <span>•</span>
                    <span><strong>{post.comments_count}</strong> thảo luận</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">⚡ Realtime Sync</span>
                </div>
                
                <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100">
                  <button 
                    onClick={() => handleLikePost(post.id)}
                    className={`flex-1 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border cursor-pointer ${post.is_liked ? 'bg-rose-50 border-rose-300 text-[#c93638] shadow-2xs' : 'bg-slate-50 border-transparent hover:bg-rose-50 hover:text-[#c93638] text-slate-600'}`}
                  >
                    <Heart size={18} className={post.is_liked ? 'fill-[#c93638] text-[#c93638]' : 'text-slate-500'} />
                    <span>{post.is_liked ? 'Đã yêu thích' : 'Quan tâm'}</span>
                  </button>
                  <button 
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex-1 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors bg-slate-50 border border-transparent hover:bg-rose-50 hover:text-[#c93638] text-slate-600 cursor-pointer"
                  >
                    <MessageCircle size={18} className="text-slate-500" />
                    <span>Thảo luận</span>
                  </button>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Đã sao chép liên kết chia sẻ!'); }}
                    className="flex-1 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors bg-slate-50 border border-transparent hover:bg-rose-50 hover:text-[#c93638] text-slate-600 cursor-pointer"
                  >
                    <Share2 size={18} className="text-slate-500" />
                    <span>Chia sẻ</span>
                  </button>
                </div>

              </article>
            ))
          )}

          {posts.length > 0 && (
            <div className="flex justify-center mt-8 pb-4">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  fetchFeedData();
                }}
                className="bg-white border border-slate-200/80 text-slate-700 hover:text-[#c93638] hover:border-rose-200 px-6 py-3 rounded-full font-black text-sm transition-all shadow-sm hover:shadow flex items-center gap-2"
              >
                <RefreshCcw size={16} />
                Làm mới & Quay về đầu trang
              </button>
            </div>
          )}
        </main>

        <aside className="flex flex-col gap-6">
          
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-extrabold text-base text-slate-900 mb-5 flex items-center justify-between">
              <span>Gợi ý kết nối mới</span>
              <Users size={18} className="text-slate-400" />
            </h3>
            <div className="flex flex-col gap-4">
              {suggestions.map(user => (
                <div key={user.id} className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3 cursor-pointer group flex-1 overflow-hidden" onClick={() => navigate(`/profile/${user.id}`)}>
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600 shadow-2xs">
                      {user.anh_dai_dien ? (
                        <img src={user.anh_dai_dien} alt={user.ten_hien_thi} className="w-full h-full object-cover" />
                      ) : (
                        <span>{(user.ten_hien_thi || user.ho_ten || 'S').charAt(0)}</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#c93638] transition-colors truncate m-0">
                        {user.ten_hien_thi || user.ho_ten}
                      </h4>
                      <p className="text-xs text-slate-500 font-bold m-0 flex items-center gap-1">
                        {user.anh_cap_bac && (
                          <img 
                            src={user.anh_cap_bac} 
                            alt="badge" 
                            className="w-3.5 h-3.5 rounded object-cover"
                            onClick={(e) => { e.stopPropagation(); setPreviewImage({ isOpen: true, url: user.anh_cap_bac, title: user.ten_cap_bac, caption: `Huy hiệu của ${user.ten_hien_thi || user.ho_ten}` }); }}
                          />
                        )}
                        <span className="truncate">{user.ten_cap_bac || 'Thành viên'}</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { showToast(`Đã gửi tín hiệu kết nối tới ${user.ten_hien_thi || user.ho_ten}!`); }}
                    className="bg-rose-50 hover:bg-[#c93638] text-[#c93638] hover:text-white px-4 py-2 rounded-2xl font-black text-xs border border-rose-100 hover:border-transparent cursor-pointer transition-all shadow-2xs shrink-0 active:scale-95"
                  >
                    Kết Nối
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="flex items-center gap-2 font-extrabold text-base text-slate-900 mb-5">
              <Sparkles className="text-[#c93638]" size={18} />
              <span>Chủ đề thảo luận nổi bật</span>
            </h3>
            <div className="flex flex-col gap-3.5">
              {topics.map((item, idx) => (
                <div key={idx} onClick={() => showToast(`Đang lọc khoảnh khắc theo thẻ ${item.tag}`)} className="p-3.5 rounded-2xl bg-slate-50 hover:bg-rose-50/60 border border-slate-100 hover:border-rose-200 transition-all cursor-pointer group flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-sm text-slate-900 group-hover:text-[#c93638] transition-colors m-0">{item.tag}</h4>
                    <p className="text-xs text-slate-500 font-bold m-0 mt-0.5">{item.count}</p>
                  </div>
                  <span className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 group-hover:border-rose-300 flex items-center justify-center font-black text-xs text-slate-600 group-hover:text-[#c93638] shadow-2xs">
                    #
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md border border-slate-700">
            <div className="flex items-center gap-2 mb-2 font-black text-rose-400 text-sm">
              <Shield size={18} />
              <span>ĐẶC QUYỀN CLUB 2026</span>
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4">
              Mỗi bài review được đăng tải hoặc thảo luận tích cực sẽ lập tức tích lũy XP. Đạt mốc <strong>5.000 XP</strong> để mở khóa huy hiệu <strong>Huyền Thoại Club</strong> cùng vé dự Offline VIP miễn phí!
            </p>
            <button onClick={() => navigate('/profile/me')} className="w-full py-3 rounded-2xl bg-[#c93638] hover:bg-[#a82527] font-black text-xs text-white border-none cursor-pointer transition-colors shadow-sm">
              Kiểm Tra Huy Hiệu & Tiến Trình XP 🏆
            </button>
          </div>

        </aside>

      </div>

      <ImageModal
        isOpen={previewImage.isOpen}
        onClose={() => setPreviewImage({ isOpen: false, url: '', title: '', caption: '' })}
        imageUrl={previewImage.url}
        title={previewImage.title}
        caption={previewImage.caption}
      />

      <FormModal
        isOpen={createPostModal.isOpen}
        onClose={() => setCreatePostModal({ isOpen: false, title: '', content: '', inputUrl: '', images: [], isSaving: false })}
        onSubmit={handleCreatePostSubmit}
        title="Tạo Khoảnh Khắc & Album Review Mới"
        submitText="Xuất Bản (+20 XP ✨)"
        cancelText="Hủy bỏ"
        isSaving={createPostModal.isSaving}
        size="xl"
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-3 text-xs font-bold text-slate-700">
            <span className="text-xl">🔥</span>
            <span>Chia sẻ thỏa thích <strong>bộ sưu tập ảnh (album)</strong> về Cà Phê, Công Nghệ hoặc Không gian của bạn tới toàn bộ Club qua hệ thống Realtime!</span>
          </div>
          
          <div>
            <label className="block font-extrabold text-xs uppercase tracking-wider text-slate-600 mb-2">
              Tiêu đề khoảnh khắc (Tùy chọn)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Review chi tiết bộ setup làm việc tối giản 2026 & góc cà phê quen thuộc..."
              value={createPostModal.title}
              onChange={(e) => setCreatePostModal(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl font-bold text-sm text-slate-800 outline-none focus:border-rose-400 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block font-extrabold text-xs uppercase tracking-wider text-slate-600 mb-2">
              Nội dung trải nghiệm <span className="text-[#c93638]">*</span>
            </label>
            <textarea
              rows="5"
              required
              placeholder="Chia sẻ trọn vẹn cảm xúc, hương vị hay đánh giá chi tiết của bạn tại đây..."
              value={createPostModal.content}
              onChange={(e) => setCreatePostModal(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl font-normal text-sm text-slate-800 outline-none focus:border-rose-400 focus:bg-white transition-all resize-none leading-relaxed"
            ></textarea>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-extrabold text-xs uppercase tracking-wider text-slate-600">
                Thêm hình ảnh / Album minh họa ({createPostModal.images.length} ảnh)
              </label>
              <label className="bg-[#c93638]/10 hover:bg-[#c93638] text-[#c93638] hover:text-white px-4 py-1.5 rounded-xl font-black text-xs cursor-pointer transition-all flex items-center gap-1.5">
                <PlusCircle size={15} />
                <span>Chọn nhiều ảnh từ máy</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <input
                type="text"
                placeholder="Hoặc dán đường dẫn URL ảnh (Unsplash, Imgur...) và nhấn Thêm"
                value={createPostModal.inputUrl}
                onChange={(e) => setCreatePostModal(prev => ({ ...prev, inputUrl: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl font-medium text-sm text-slate-800 outline-none focus:border-rose-400 focus:bg-white transition-all"
              />
              <button 
                type="button"
                onClick={handleAddImageUrl}
                disabled={!createPostModal.inputUrl.trim()}
                className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white px-6 py-3 rounded-2xl font-black text-xs cursor-pointer transition-all shrink-0"
              >
                + Thêm URL
              </button>
            </div>

            {createPostModal.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-100/80 rounded-2xl border border-slate-200/80">
                {createPostModal.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 bg-white shadow-xs group">
                    <img src={img.url} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-slate-900/70 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                      #{idx + 1}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white font-bold flex items-center justify-center border-none cursor-pointer shadow-md transition-transform active:scale-90"
                      title="Xóa ảnh này"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => setCreatePostModal(prev => ({ ...prev, showProduct: !prev.showProduct }))}
                className="flex items-center gap-2 text-xs font-black text-slate-700 hover:text-[#c93638] bg-amber-50 hover:bg-amber-100/70 px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-amber-200"
              >
                <ShoppingBag size={16} className="text-orange-500" />
                <span>{createPostModal.showProduct ? 'Ẩn form gắn link mua sắm' : '+ Gắn Linh Kiện / Link Mua Sắm (Affiliate)'}</span>
              </button>

              {createPostModal.showProduct && (
                <div className="mt-3 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
                  <div className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <span>🛍️ Chi tiết sản phẩm & link mua sắm</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-600 mb-1">Tên linh kiện / Sản phẩm *</label>
                      <input
                        type="text"
                        placeholder="VD: Cối xay Comandante C40 / Bàn phím Rainy75"
                        value={createPostModal.productName || ''}
                        onChange={(e) => setCreatePostModal(prev => ({ ...prev, productName: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 outline-none focus:border-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-600 mb-1">Giá tham khảo (VNĐ)</label>
                      <input
                        type="number"
                        placeholder="VD: 5500000"
                        value={createPostModal.productPrice || ''}
                        onChange={(e) => setCreatePostModal(prev => ({ ...prev, productPrice: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 outline-none focus:border-orange-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1">Đường dẫn Mua sắm / Affiliate URL *</label>
                    <input
                      type="text"
                      placeholder="https://... dán link sản phẩm hoặc affiliate tại đây"
                      value={createPostModal.productUrl || ''}
                      onChange={(e) => setCreatePostModal(prev => ({ ...prev, productUrl: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-800 outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null, isLoading: false })}
        onConfirm={confirmDeletePost}
        title="Xác Nhận Xóa Khoảnh Khắc"
        message="Bạn có chắc chắn muốn xóa vĩnh viễn bài review này khỏi bảng tin của Club Trải Nghiệm không?"
        variant="danger"
        confirmText="Xác nhận xóa"
        cancelText="Giữ lại"
        isLoading={deleteModal.isLoading}
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
        post={posts.find(p => parseInt(p.id, 10) === parseInt(activeCommentPostId, 10))}
        currentUser={currentUser}
        onSendComment={handleSendComment}
        onLikeComment={handleLikeComment}
        onPreviewImage={setPreviewImage}
      />

    </div>
  );
};

export default Feed;
