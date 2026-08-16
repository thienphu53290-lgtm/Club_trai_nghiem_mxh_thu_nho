import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Check, X, AlertTriangle, MessageSquare, Image as ImageIcon, Users, UserX, ShieldAlert, Key, Eye, EyeOff, Plus, FileText, Send, Search, PlusCircle } from 'lucide-react';
import { Modal, ConfirmModal } from '../../components/Modal';
import api from '../../api/axios';

const ContentAdmin = () => {
  const context = useOutletContext();
  const activeTabContext = context?.activeTab;
  const showNotification = context?.showNotification || (() => {});
  
  const isEmbedded = !['review', 'spam', 'posts'].includes(activeTabContext);
  const [localTab, setLocalTab] = useState('review');
  const currentTab = isEmbedded ? localTab : activeTabContext;

  const handleTabChange = (tab) => {
    if (isEmbedded) setLocalTab(tab);
    else if (context?.setActiveTab) context.setActiveTab(tab);
  };

  const [reportedPosts, setReportedPosts] = useState([]);
  const [spamUsers, setSpamUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [createPostImages, setCreatePostImages] = useState([]);
  const [createPostInputUrl, setCreatePostInputUrl] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, postId: null, actionType: null });
  const [topicModal, setTopicModal] = useState({ isOpen: false, isEdit: false, id: null, ten: '', mo_ta: '' });

  useEffect(() => {
    if (currentTab === 'review') {
      fetchReports();
    } else if (currentTab === 'spam') {
      fetchSpamUsers();
    } else if (currentTab === 'posts') {
      fetchPosts();
    } else if (currentTab === 'comments') {
      fetchComments();
    } else if (currentTab === 'topics') {
      fetchTopics();
    }
  }, [currentTab]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/content/reports?status=0');
      if (response.data.status === 'success') {
         const formatted = response.data.data.data.map(item => ({
            id: item.id,
            author: item.target_detail?.nguoi_dung?.ho_ten || item.target_detail?.ho_ten || 'Người dùng ẩn danh',
            avatar: item.target_detail?.nguoi_dung?.anh_dai_dien || item.target_detail?.anh_dai_dien || 'https://via.placeholder.com/150',
            time: new Date(item.created_at).toLocaleString(),
            tieu_de: item.target_detail?.tieu_de || '',
            content: item.target_detail?.noi_dung || item.target_detail?.email || 'Không có nội dung',
            image: item.target_detail?.anh_bia || item.target_detail?.hinh_anh || null,
            reason: item.ly_do,
            reporter_name: item.nguoi_gui?.ho_ten || 'Người dùng ẩn danh',
            reporter_avatar: item.nguoi_gui?.anh_dai_dien || 'https://via.placeholder.com/150',
            reporter_email: item.nguoi_gui?.email || '',
            reportCount: 1, // Đang lấy danh sách phẳng
            loai: item.loai,
            target_id: item.doi_tuong_id
         }));
         setReportedPosts(formatted);
      }
    } catch (error) {
      console.error(error);
      showNotification('Lỗi khi tải danh sách báo cáo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpamUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/content/spam-users');
      if (response.data.status === 'success') {
         setSpamUsers(response.data.data);
      }
    } catch (error) {
      console.error(error);
      showNotification('Lỗi khi tải danh sách người dùng spam', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/content/posts');
      if (response.data.status === 'success') {
         setAllPosts(response.data.data.data);
      }
    } catch (error) {
      console.error(error);
      showNotification('Lỗi khi tải danh sách bài viết', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/content/comments');
      if (response.data.status === 'success') {
        setAllComments(response.data.data.data || []);
      }
    } catch (error) {
      console.error(error);
      showNotification('Lỗi khi tải danh sách bình luận', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/content/topics');
      if (response.data.status === 'success') {
        setAllTopics(response.data.data || []);
      }
    } catch (error) {
      console.error(error);
      showNotification('Lỗi khi tải danh sách chủ đề', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openToggleConfirm = (id, currentStatus, type = 'post') => {
    setConfirmModal({
      isOpen: true,
      postId: id,
      actionType: currentStatus === 1 ? 'hide' : 'unhide',
      itemType: type
    });
  };

  const handleConfirmToggle = () => {
    if (confirmModal.postId) {
      if (confirmModal.itemType === 'post') handleTogglePost(confirmModal.postId);
      if (confirmModal.itemType === 'comment') handleToggleComment(confirmModal.postId);
      if (confirmModal.itemType === 'topic') handleToggleTopic(confirmModal.postId);
    }
    setConfirmModal({ isOpen: false, postId: null, actionType: null, itemType: null });
  };

  const handleToggleComment = async (id) => {
    try {
      const response = await api.put(`/admin/content/comments/${id}/status`);
      if (response.data.status === 'success') {
        setAllComments(prev => prev.map(c => {
          if (c.id === id) {
            return { ...c, trang_thai: c.trang_thai === 1 ? 0 : 1 };
          }
          return c;
        }));
        showNotification(response.data.message || 'Cập nhật trạng thái thành công', 'success');
      }
    } catch (error) {
      console.error(error);
      showNotification('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const handleToggleTopic = async (id) => {
    try {
      const response = await api.put(`/admin/content/topics/${id}/status`);
      if (response.data.status === 'success') {
        setAllTopics(prev => prev.map(t => {
          if (t.id === id) {
            return { ...t, trang_thai: t.trang_thai === 1 ? 0 : 1 };
          }
          return t;
        }));
        showNotification(response.data.message || 'Cập nhật trạng thái thành công', 'success');
      }
    } catch (error) {
      console.error(error);
      showNotification('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    if (!topicModal.ten.trim()) {
      showNotification('Tên danh mục không được để trống', 'error');
      return;
    }
    setLoading(true);
    try {
      if (topicModal.isEdit) {
        const res = await api.put(`/admin/content/topics/${topicModal.id}`, { ten: topicModal.ten, mo_ta: topicModal.mo_ta });
        if (res.data.status === 'success') {
          showNotification('Cập nhật danh mục thành công', 'success');
        }
      } else {
        const res = await api.post(`/admin/content/topics`, { ten: topicModal.ten, mo_ta: topicModal.mo_ta });
        if (res.data.status === 'success') {
          showNotification('Thêm danh mục thành công', 'success');
        }
      }
      setTopicModal({ isOpen: false, isEdit: false, id: null, ten: '', mo_ta: '' });
      fetchTopics();
    } catch (error) {
      console.error(error);
      showNotification('Có lỗi xảy ra', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + createPostImages.length > 5) {
      showNotification('Chỉ được tải lên tối đa 5 ảnh', 'error');
      return;
    }
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setCreatePostImages(prev => [...prev, ...newImages]);
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!createPostInputUrl.trim()) return;
    if (createPostImages.length >= 5) {
      showNotification('Chỉ được tải lên tối đa 5 ảnh', 'error');
      return;
    }
    setCreatePostImages(prev => [...prev, { file: null, url: createPostInputUrl.trim() }]);
    setCreatePostInputUrl('');
  };

  const handleRemoveImage = (index) => {
    setCreatePostImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleTogglePost = async (id) => {
    try {
      const response = await api.put(`/admin/content/posts/${id}/status`);
      if (response.data.status === 'success') {
        setAllPosts(prev => prev.map(p => {
          if (p.id === id) {
            return { ...p, trang_thai: p.trang_thai === 1 ? 0 : 1 };
          }
          return p;
        }));
        showNotification(response.data.message || 'Cập nhật trạng thái thành công', 'success');
      }
    } catch (error) {
      console.error(error);
      showNotification('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      showNotification('Vui lòng nhập nội dung bài viết', 'error');
      return;
    }
    setCreatingPost(true);
    try {
      const formData = new FormData();
      formData.append('noi_dung', newPostContent);
      if (newPostTitle.trim()) {
        formData.append('tieu_de', newPostTitle);
      }
      
      if (createPostImages.length > 0) {
        createPostImages.forEach(img => {
          if (img.file) {
            formData.append('danh_sach_file[]', img.file);
          } else if (img.url) {
            formData.append('danh_sach_url[]', img.url);
          }
        });
      }

      const response = await api.post('/feed/posts', formData);
      if (response.data.status === 'success' || response.status === 201 || response.status === 200) {
        showNotification('Thêm bài viết thành công!', 'success');
        setCreatePostModalOpen(false);
        setNewPostContent('');
        setNewPostTitle('');
        setCreatePostImages([]);
        setCreatePostInputUrl('');
        fetchPosts(); // Cập nhật lại danh sách sau khi thêm
      }
    } catch (error) {
      console.error(error);
      showNotification('Lỗi khi thêm bài viết', 'error');
    } finally {
      setCreatingPost(false);
    }
  };

  const handleAction = async (id, actionType) => {
    const post = reportedPosts.find(p => p.id === id);
    if (!post) return;

    try {
      const payloadAction = actionType === 'keep' ? 'ignore' : 'delete';
      await api.put(`/admin/content/reports/${id}`, { action: payloadAction });
      
      if (actionType === 'keep') {
        showNotification(`🟢 Đã BỎ QUA nội dung của ${post.author}`);
      } else {
        showNotification(`🔴 Đã XÓA nội dung của ${post.author} và cảnh cáo!`);
      }

      setReportedPosts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
       showNotification('Có lỗi xảy ra khi xử lý', 'error');
    }
  };

  const handleToggleUserPunish = async (userId) => {
    try {
        const response = await api.put(`/admin/content/users/${userId}/punish`);
        if (response.data.status === 'success') {
            showNotification(response.data.message);
            // Refresh list
            fetchSpamUsers();
        }
    } catch (error) {
        showNotification(error.response?.data?.message || 'Lỗi khi xử lý người dùng', 'error');
    }
  };

  const renderReviewTab = () => {
    if (loading) {
        return <div className="text-center mt-20 font-bold text-slate-500">Đang tải dữ liệu...</div>;
    }

    if (reportedPosts.length === 0) {
      return (
        <div className="w-full max-w-2xl mx-auto mt-20 text-center bg-white p-12 rounded-3xl border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-full flex items-center justify-center border-4 border-[#0f172a] mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <Check size={48} className="text-emerald-500" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Tuyệt Vời!</h2>
          <p className="text-slate-500 font-bold text-lg">Không còn bài viết nào cần kiểm duyệt lúc này.</p>
        </div>
      );
    }

    const currentPost = reportedPosts[0];

    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-slideUp">
        {/* THẺ BÀI VIẾT (TINDER-STYLE CARD) */}
        <div className="w-full bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-hidden mb-8 transition-all">
          {/* Header Báo Cáo */}
          <div className="bg-rose-50 border-b-4 border-[#0f172a] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-rose-600 font-black">
              <AlertTriangle size={24} />
              <span className="text-lg uppercase">Phiếu Tố Cáo ({currentPost.loai})</span>
            </div>
            <div className="bg-rose-600 text-white px-3 py-1 rounded-xl font-bold border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              Mã đối tượng: {currentPost.target_id}
            </div>
          </div>

          {/* Thông tin Người Báo Cáo & Lý do */}
          <div className="bg-white border-b-4 border-[#0f172a] p-4 sm:p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center relative">
            <div className="flex items-center gap-3">
              <img src={currentPost.reporter_avatar?.startsWith('http') ? currentPost.reporter_avatar : `http://127.0.0.1:8000/storage/${currentPost.reporter_avatar}`} alt="Reporter Avatar" className="w-12 h-12 rounded-full border-2 border-[#0f172a] object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Người đứng đơn tố cáo</p>
                <p className="font-black text-slate-900 text-sm">{currentPost.reporter_name}</p>
                {currentPost.reporter_email && <p className="text-xs font-bold text-slate-500">{currentPost.reporter_email}</p>}
              </div>
            </div>
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 flex-1 w-full sm:max-w-[50%]">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider mb-1">Chi tiết lý do vi phạm</p>
              <p className="text-sm font-bold text-rose-900 line-clamp-3" title={currentPost.reason}>{currentPost.reason}</p>
            </div>
          </div>

          {/* Nội dung bài viết gốc bị báo cáo */}
          <div className="p-6 sm:p-8 bg-slate-50 relative">
            <button 
              onClick={() => setPreviewPost(reportedPosts[0])}
              title="Mở bài viết này dưới dạng giao diện Bảng tin"
              className="absolute top-4 right-4 bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2 border-slate-200 hover:border-emerald-300 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={12} /> Xem Modal Trải Nghiệm
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <img src={currentPost.avatar?.startsWith('http') ? currentPost.avatar : `http://127.0.0.1:8000/storage/${currentPost.avatar}`} alt="Avatar" className="w-14 h-14 rounded-2xl border-2 border-[#0f172a] object-cover shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} />
              <div>
                <h3 className="font-black text-lg text-slate-900 leading-tight">{currentPost.author}</h3>
                <p className="text-slate-500 font-bold text-xs mt-0.5">Thời gian tạo: {currentPost.time}</p>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 mb-4 shadow-sm">
              {currentPost.tieu_de && (
                <h4 className="text-xl font-black text-slate-900 mb-3">{currentPost.tieu_de}</h4>
              )}
              <p className="text-base text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                {currentPost.content}
              </p>
            </div>

            {currentPost.image ? (
              <div className="w-full aspect-video rounded-2xl border-4 border-[#0f172a] overflow-hidden bg-slate-100 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mb-2">
                <img src={currentPost.image.startsWith('http') ? currentPost.image : `http://127.0.0.1:8000/storage/${currentPost.image}`} alt="Post media" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 flex items-center justify-center gap-2 text-slate-400 font-bold mb-2">
                <ImageIcon size={20} /> Không có hình ảnh đính kèm
              </div>
            )}
          </div>
        </div>

        {/* CÁC NÚT THAO TÁC (ACTION BUTTONS) */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={() => handleAction(currentPost.id, 'keep')}
            title="Bỏ qua (Giữ lại nội dung)"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-400 hover:bg-emerald-300 border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group"
          >
            <Check size={48} className="text-slate-900 group-hover:scale-125 transition-transform" strokeWidth={3} />
          </button>
          
          <button 
            onClick={() => handleAction(currentPost.id, 'delete')}
            title="Xóa vi phạm và Cảnh cáo"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-500 hover:bg-rose-400 border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group"
          >
            <X size={48} className="text-slate-900 group-hover:scale-125 transition-transform" strokeWidth={3} />
          </button>
        </div>
        <p className="mt-6 text-slate-400 font-bold text-sm">Còn lại: {reportedPosts.length} nội dung chờ duyệt.</p>
      </div>
    );
  };

  const renderSpamTab = () => {
    if (loading) {
        return <div className="text-center mt-20 font-bold text-slate-500">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="bg-white rounded-3xl border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-8 mt-10">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <ShieldAlert className="text-rose-500" size={28} /> Quản lý User Spam
            </h2>
            
            {spamUsers.length === 0 ? (
                <div className="text-center text-slate-500 font-bold py-10">Không có người dùng nào bị báo cáo.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-4 border-[#0f172a] text-slate-900">
                                <th className="p-4 font-black">Người Dùng</th>
                                <th className="p-4 font-black">Email</th>
                                <th className="p-4 font-black text-center">Số Lần Bị Báo Cáo</th>
                                <th className="p-4 font-black text-center">Trạng Thái</th>
                                <th className="p-4 font-black text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spamUsers.map((user) => (
                                <tr key={user.id} className="border-b-2 border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={user.anh_dai_dien?.startsWith('http') ? user.anh_dai_dien : `http://127.0.0.1:8000/storage/${user.anh_dai_dien}`} className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
                                            <span className="font-bold text-slate-900">{user.ho_ten}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-600">{user.email}</td>
                                    <td className="p-4 text-center font-black text-rose-600 text-lg">
                                        {user.report_count}
                                    </td>
                                    <td className="p-4 text-center">
                                        {user.trang_thai === 1 ? (
                                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold text-xs border border-emerald-300">Hoạt Động</span>
                                        ) : (
                                            <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full font-bold text-xs border border-rose-300">Bị Khóa</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleToggleUserPunish(user.id)}
                                            className={`px-4 py-2 rounded-xl font-black text-xs border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-transform active:translate-y-1 active:shadow-none flex items-center justify-center gap-1 mx-auto ${
                                                user.trang_thai === 1 
                                                ? 'bg-rose-400 hover:bg-rose-500 text-slate-950' 
                                                : 'bg-amber-300 hover:bg-amber-400 text-slate-950'
                                            }`}
                                        >
                                            {user.trang_thai === 1 ? <><UserX size={14} /> Khóa TK</> : <><Key size={14} /> Mở Khóa</>}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
  };

  const renderPostsTab = () => {
    if (loading) {
        return <div className="text-center mt-20 font-bold text-slate-500">Đang tải danh sách bài viết...</div>;
    }

    const filteredPosts = allPosts.filter(post => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const title = (post.tieu_de || '').toLowerCase();
        const content = (post.noi_dung || '').toLowerCase();
        const author = (post.ho_ten || '').toLowerCase();
        return title.includes(q) || content.includes(q) || author.includes(q);
    });

    return (
        <div className="bg-white rounded-3xl border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-4 sm:p-8 mt-10">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 whitespace-nowrap">
                    <MessageSquare className="text-blue-500" size={28} /> Quản lý Toàn Bộ Bài Viết
                </h2>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Tìm tác giả, nội dung..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 font-bold text-sm text-slate-900 transition-colors"
                        />
                    </div>
                    <button 
                        onClick={() => setCreatePostModalOpen(true)}
                        className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-transform active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto whitespace-nowrap"
                    >
                        <Plus size={18} /> Thêm bài viết mới
                    </button>
                </div>
            </div>
            
            {allPosts.length === 0 ? (
                <div className="text-center text-slate-500 font-bold py-10">Không có bài viết nào trên hệ thống.</div>
            ) : (
                <div className="overflow-x-auto overflow-y-auto max-h-[600px] border-t-2 border-slate-100 relative">
                    <table className="w-full text-left relative">
                        <thead className="sticky top-0 bg-white z-10 shadow-sm">
                            <tr className="border-b-4 border-[#0f172a] text-slate-900">
                                <th className="p-4 font-black">Người Đăng</th>
                                <th className="p-4 font-black">Nội Dung</th>
                                <th className="p-4 font-black text-center">Trạng Thái</th>
                                <th className="p-4 font-black text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className={`border-b-2 border-slate-100 hover:bg-slate-50 transition-colors ${post.trang_thai === 0 ? 'opacity-60 bg-slate-50' : ''}`}>
                                    <td className="p-4 min-w-[200px]">
                                        <div className="flex items-center gap-3">
                                            <img src={post.anh_dai_dien?.startsWith('http') ? post.anh_dai_dien : `http://127.0.0.1:8000/storage/${post.anh_dai_dien}`} className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
                                            <div>
                                                <span className="block font-bold text-slate-900">{post.ho_ten}</span>
                                                <span className="block text-[10px] text-slate-500 font-bold">{new Date(post.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 w-1/2 min-w-[300px]">
                                        {post.tieu_de && <p className="font-black text-sm text-slate-900 mb-1">{post.tieu_de}</p>}
                                        <p className="font-medium text-xs text-slate-600 line-clamp-2">{post.noi_dung || '(Không có văn bản)'}</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        {post.trang_thai === 1 ? (
                                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold text-xs border border-emerald-300">Hoạt Động</span>
                                        ) : (
                                            <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold text-xs border border-slate-300">Đã Ẩn</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => setPreviewPost({
                                                    author: post.ho_ten || 'Người dùng ẩn danh',
                                                    avatar: post.anh_dai_dien || 'https://via.placeholder.com/150',
                                                    time: new Date(post.created_at).toLocaleString(),
                                                    tieu_de: post.tieu_de,
                                                    content: post.noi_dung,
                                                    image: post.anh_bia
                                                })}
                                                className="px-3 py-1.5 rounded-xl font-black text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center shadow-xs"
                                                title="Xem giao diện Feed"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button 
                                                onClick={() => openToggleConfirm(post.id, post.trang_thai)}
                                                className={`px-3 py-1.5 rounded-xl font-black text-xs border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-transform active:translate-y-1 active:shadow-none flex items-center justify-center gap-1 ${
                                                    post.trang_thai === 1 
                                                    ? 'bg-rose-400 hover:bg-rose-500 text-slate-950' 
                                                    : 'bg-emerald-300 hover:bg-emerald-400 text-slate-950'
                                                }`}
                                            >
                                                {post.trang_thai === 1 ? <><EyeOff size={14} /> Ẩn</> : <><Check size={14} /> Hiện</>}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
  };

  const renderCommentsTab = () => {
    if (loading) {
        return <div className="text-center mt-20 font-bold text-slate-500">Đang tải danh sách bình luận...</div>;
    }

    const filteredComments = allComments.filter(comment => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const content = (comment.noi_dung || '').toLowerCase();
        const author = (comment.ho_ten || '').toLowerCase();
        return content.includes(q) || author.includes(q);
    });

    return (
        <div className="bg-white rounded-3xl border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-4 sm:p-8 mt-10">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 whitespace-nowrap">
                    <MessageSquare className="text-blue-500" size={28} /> Quản lý Bình Luận
                </h2>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Tìm tác giả, nội dung..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 font-bold text-sm text-slate-900 transition-colors"
                        />
                    </div>
                </div>
            </div>
            
            {allComments.length === 0 ? (
                <div className="text-center text-slate-500 font-bold py-10">Không có bình luận nào trên hệ thống.</div>
            ) : (
                <div className="overflow-x-auto overflow-y-auto max-h-[600px] border-t-2 border-slate-100 relative">
                    <table className="w-full text-left relative">
                        <thead className="sticky top-0 bg-white z-10 shadow-sm">
                            <tr className="border-b-4 border-[#0f172a] text-slate-900">
                                <th className="p-4 font-black">Người Bình Luận</th>
                                <th className="p-4 font-black">Nội Dung</th>
                                <th className="p-4 font-black text-center">Trạng Thái</th>
                                <th className="p-4 font-black text-center">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComments.map((comment) => (
                                <tr key={comment.id} className={`border-b-2 border-slate-100 hover:bg-slate-50 transition-colors ${comment.trang_thai === 0 ? 'opacity-60 bg-slate-50' : ''}`}>
                                    <td className="p-4 min-w-[200px]">
                                        <div className="flex items-center gap-3">
                                            <img src={comment.anh_dai_dien?.startsWith('http') ? comment.anh_dai_dien : `http://127.0.0.1:8000/storage/${comment.anh_dai_dien}`} className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} />
                                            <div>
                                                <span className="block font-bold text-slate-900">{comment.ho_ten}</span>
                                                <span className="block text-[10px] text-slate-500 font-bold">{new Date(comment.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 w-1/2 min-w-[300px]">
                                        <p className="font-medium text-xs text-slate-600 mb-1">{comment.noi_dung || '(Không có văn bản)'}</p>
                                        <p className="text-[10px] text-blue-500 font-bold">Bài viết: {comment.bai_viet_tieu_de || `#${comment.bai_viet_id}`}</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        {comment.trang_thai === 1 ? (
                                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold text-xs border border-emerald-300">Hoạt Động</span>
                                        ) : (
                                            <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold text-xs border border-slate-300">Đã Ẩn</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => openToggleConfirm(comment.id, comment.trang_thai, 'comment')}
                                            className={`px-3 py-1.5 mx-auto rounded-xl font-black text-xs border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-transform active:translate-y-1 active:shadow-none flex items-center justify-center gap-1 ${
                                                comment.trang_thai === 1 
                                                ? 'bg-rose-400 hover:bg-rose-500 text-slate-950' 
                                                : 'bg-emerald-300 hover:bg-emerald-400 text-slate-950'
                                            }`}
                                        >
                                            {comment.trang_thai === 1 ? <><EyeOff size={14} /> Ẩn</> : <><Check size={14} /> Hiện</>}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
  };

  const renderTopicsTab = () => {
    if (loading) {
        return <div className="text-center mt-20 font-bold text-slate-500">Đang tải danh sách chủ đề...</div>;
    }

    return (
        <div className="bg-white rounded-3xl border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-4 sm:p-8 mt-10">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 whitespace-nowrap">
                    <ShieldAlert className="text-purple-500" size={28} /> Quản lý Danh Mục
                </h2>
                
                <button 
                    onClick={() => setTopicModal({ isOpen: true, isEdit: false, id: null, ten: '', mo_ta: '' })}
                    className="w-full lg:w-auto px-6 py-2.5 rounded-xl font-black text-sm border-2 border-[#0f172a] bg-purple-300 hover:bg-purple-400 text-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    Thêm Danh Mục Mới
                </button>
            </div>
            
            {allTopics.length === 0 ? (
                <div className="text-center text-slate-500 font-bold py-10">Không có danh mục nào trên hệ thống.</div>
            ) : (
                <div className="overflow-x-auto overflow-y-auto max-h-[600px] border-t-2 border-slate-100 relative">
                    <table className="w-full text-left relative">
                        <thead className="sticky top-0 bg-white z-10 shadow-sm">
                            <tr className="border-b-4 border-[#0f172a] text-slate-900">
                                <th className="p-4 font-black">Tên Danh Mục</th>
                                <th className="p-4 font-black">Slug</th>
                                <th className="p-4 font-black text-center">Trạng Thái</th>
                                <th className="p-4 font-black text-center">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTopics.map((topic) => (
                                <tr key={topic.id} className={`border-b-2 border-slate-100 hover:bg-slate-50 transition-colors ${topic.trang_thai === 0 ? 'opacity-60 bg-slate-50' : ''}`}>
                                    <td className="p-4 font-bold text-slate-900">{topic.ten}</td>
                                    <td className="p-4 text-xs font-medium text-slate-500">#{topic.slug}</td>
                                    <td className="p-4 text-center">
                                        {topic.trang_thai === 1 ? (
                                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold text-xs border border-emerald-300">Hoạt Động</span>
                                        ) : (
                                            <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold text-xs border border-slate-300">Đã Ẩn</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => setTopicModal({ isOpen: true, isEdit: true, id: topic.id, ten: topic.ten, mo_ta: topic.mo_ta || '' })}
                                                className="px-3 py-1.5 rounded-xl font-black text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center shadow-xs"
                                                title="Sửa danh mục"
                                            >
                                                Sửa
                                            </button>
                                            <button 
                                                onClick={() => openToggleConfirm(topic.id, topic.trang_thai, 'topic')}
                                                className={`px-3 py-1.5 rounded-xl font-black text-xs border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-transform active:translate-y-1 active:shadow-none flex items-center justify-center gap-1 ${
                                                    topic.trang_thai === 1 
                                                    ? 'bg-rose-400 hover:bg-rose-500 text-slate-950' 
                                                    : 'bg-emerald-300 hover:bg-emerald-400 text-slate-950'
                                                }`}
                                            >
                                                {topic.trang_thai === 1 ? <><EyeOff size={14} /> Ẩn</> : <><Check size={14} /> Hiện</>}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
  };


  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-4 border-b-4 border-slate-900">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">
            {currentTab === 'review' ? 'Duyệt bài đăng' : currentTab === 'spam' ? 'Spam & Báo cáo' : 'Quản lý Bài viết'}
          </h1>
          <p className="text-slate-500 font-bold text-sm sm:text-base m-0">
            {currentTab === 'review' ? 'Xử lý các nội dung vi phạm tiêu chuẩn cộng đồng.' : currentTab === 'spam' ? 'Danh sách các thành viên bị báo cáo nhiều lần.' : 'Kiểm soát và quản lý toàn bộ bài viết trên bảng tin.'}
          </p>
        </div>

        {/* HIỂN THỊ MENU PHỤ NẾU ĐANG NHÚNG TRONG SUPER ADMIN */}
        {isEmbedded && (
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'review', label: 'Duyệt bài đăng' },
              { id: 'spam', label: 'Spam & Báo cáo' },
              { id: 'posts', label: 'Danh sách bài viết' },
              { id: 'comments', label: 'Quản lý Bình Luận' },
              { id: 'topics', label: 'Quản lý Danh Mục' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`px-5 py-2.5 rounded-xl font-black text-sm border-2 border-slate-900 transition-all cursor-pointer ${
                  currentTab === t.id 
                    ? 'bg-emerald-400 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px]' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {currentTab === 'review' && renderReviewTab()}
      {currentTab === 'spam' && renderSpamTab()}
      {currentTab === 'posts' && renderPostsTab()}
      {currentTab === 'comments' && renderCommentsTab()}
      {currentTab === 'topics' && renderTopicsTab()}

      {previewPost && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewPost(null)}
          title="Mô phỏng hiển thị trên Feed"
          icon={Eye}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-100 border-emerald-200"
          size="lg"
        >
          <div className="border border-slate-200 rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 bg-white shadow-sm flex flex-col gap-5">                
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center font-black text-slate-600 shadow-2xs">
                <img src={previewPost.avatar?.startsWith('http') ? previewPost.avatar : `http://127.0.0.1:8000/storage/${previewPost.avatar}`} alt="Avatar" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} />
              </div>
              <div>
                <h4 className="font-black text-base sm:text-lg text-slate-900 m-0">
                  {previewPost.author}
                </h4>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
                  <span>{previewPost.time}</span>
                  <span>•</span>
                  <span>🌍 Public</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {previewPost.tieu_de && (
                <h3 className="font-black text-lg sm:text-xl text-slate-900 leading-tight m-0">
                  {previewPost.tieu_de}
                </h3>
              )}
              <div className="text-slate-800 font-normal leading-relaxed text-base space-y-3 whitespace-pre-wrap">
                {previewPost.content}
              </div>
              
              {previewPost.image && (
                <div className="mt-2 rounded-[24px] overflow-hidden border border-slate-200 shadow-xs max-h-[420px] bg-slate-950">
                  <img src={previewPost.image.startsWith('http') ? previewPost.image : `http://127.0.0.1:8000/storage/${previewPost.image}`} alt="Post media" className="w-full max-h-[420px] object-cover mx-auto" />
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-extrabold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-[11px]">❤️</span>
                  <strong>...</strong> người quan tâm
                </span>
                <span>•</span>
                <span><strong>...</strong> thảo luận</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {createPostModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => {
            if (!creatingPost) {
                setCreatePostModalOpen(false);
                setCreatePostImages([]);
                setCreatePostInputUrl('');
            }
          }}
          title="Tạo Bài Viết Mới"
          icon={FileText}
          iconColor="text-blue-500"
          iconBg="bg-blue-100 border-blue-200"
          size="lg"
        >
          <div className="p-6 bg-white border border-slate-200 rounded-[24px] shadow-sm flex flex-col gap-5">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3 text-xs font-bold text-slate-700">
              <span className="text-xl shrink-0">✨</span>
              <span>Chia sẻ <strong>bộ sưu tập ảnh (album)</strong> hoặc bài viết tới toàn bộ cộng đồng ngay từ bảng điều khiển Admin!</span>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">
                Tiêu đề (Không bắt buộc)
              </label>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Ví dụ: Review tính năng mới..."
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 font-bold text-slate-900 transition-colors"
                disabled={creatingPost}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">
                Nội dung <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Nội dung bài viết thông báo hoặc đánh giá..."
                className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 font-medium text-sm text-slate-900 transition-colors min-h-[160px] resize-none leading-relaxed"
                disabled={creatingPost}
              />
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Thêm hình ảnh ({createPostImages.length}/5)
                </label>
                <label className="bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white px-3 py-1.5 rounded-lg font-black text-[10px] cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                  <PlusCircle size={14} />
                  <span>Chọn ảnh từ máy</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={creatingPost}
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Hoặc dán link ảnh vào đây (Unsplash, Imgur...)"
                  value={createPostInputUrl}
                  onChange={(e) => setCreatePostInputUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                  className="flex-1 p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-xs text-slate-800 outline-none focus:border-blue-400 transition-colors"
                  disabled={creatingPost}
                />
                <button 
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={!createPostInputUrl.trim() || creatingPost}
                  className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl font-black text-xs cursor-pointer transition-colors shrink-0"
                >
                  + Thêm URL
                </button>
              </div>

              {createPostImages.length > 0 && (
                <div className="mt-4 flex gap-3 p-3 bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                  {createPostImages.map((img, idx) => (
                    <div key={idx} className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-300 bg-white">
                      <img src={img.url} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-md">
                        #{idx + 1}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(idx)}
                        disabled={creatingPost}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center justify-center cursor-pointer shadow-md transition-transform active:scale-90"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-5 border-t-2 border-slate-100">
              <button
                onClick={handleCreatePost}
                disabled={creatingPost || !newPostContent.trim()}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-black rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-transform active:translate-y-1 active:shadow-none flex items-center gap-2 cursor-pointer"
              >
                {creatingPost ? 'Đang Đăng...' : <><Send size={18} /> Xuất Bản Bảng Tin</>}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {topicModal.isOpen && (
        <Modal
          isOpen={true}
          onClose={() => setTopicModal({ isOpen: false, isEdit: false, id: null, ten: '', mo_ta: '' })}
          title={topicModal.isEdit ? "Cập Nhật Danh Mục" : "Thêm Danh Mục Mới"}
          icon={ShieldAlert}
          iconColor="text-purple-500"
          iconBg="bg-purple-100 border-purple-200"
          size="md"
        >
          <form onSubmit={handleTopicSubmit} className="border-t border-slate-100 pt-4 flex flex-col gap-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tên danh mục <span className="text-red-500">*</span></label>
                <input 
                    type="text" 
                    value={topicModal.ten}
                    onChange={(e) => setTopicModal(prev => ({...prev, ten: e.target.value}))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 font-bold text-slate-900 transition-colors"
                    placeholder="Ví dụ: Công nghệ, Thể thao..."
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả (Tuỳ chọn)</label>
                <textarea 
                    value={topicModal.mo_ta}
                    onChange={(e) => setTopicModal(prev => ({...prev, mo_ta: e.target.value}))}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-400 font-medium text-sm text-slate-900 transition-colors resize-none"
                    rows="3"
                    placeholder="Nhập mô tả ngắn gọn..."
                ></textarea>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button type="button" onClick={() => setTopicModal({ isOpen: false, isEdit: false, id: null, ten: '', mo_ta: '' })} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                    Huỷ Bỏ
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl font-black text-sm border-2 border-slate-900 bg-purple-300 hover:bg-purple-400 text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] transition-all cursor-pointer">
                    {loading ? 'Đang xử lý...' : (topicModal.isEdit ? 'Lưu Thay Đổi' : 'Thêm Mới')}
                </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, postId: null, actionType: null })}
        onConfirm={handleConfirmToggle}
        title={confirmModal.actionType === 'hide' ? 'Xác nhận ẩn bài viết' : 'Xác nhận khôi phục'}
        message={confirmModal.actionType === 'hide' ? 'Bạn có chắc chắn muốn ẩn bài viết này? Bài viết sẽ bị gỡ khỏi Feed và không còn hiển thị với người dùng nữa.' : 'Bạn có chắc chắn muốn khôi phục bài viết này? Bài viết sẽ được hiển thị lại bình thường trên Feed.'}
        variant={confirmModal.actionType === 'hide' ? 'danger' : 'success'}
        confirmText={confirmModal.actionType === 'hide' ? 'Ẩn Bài' : 'Khôi Phục'}
        cancelText="Hủy bỏ"
      />
    </div>
  );
};

export default ContentAdmin;
