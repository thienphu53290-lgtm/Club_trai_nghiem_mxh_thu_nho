import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Check, X, AlertTriangle, MessageSquare, Image as ImageIcon } from 'lucide-react';

const ContentAdmin = () => {
  const context = useOutletContext();
  const activeTabContext = context?.activeTab;
  const showNotification = context?.showNotification || (() => {});
  
  const isEmbedded = !['review', 'spam'].includes(activeTabContext);
  const [localTab, setLocalTab] = useState('review');
  const currentTab = isEmbedded ? localTab : activeTabContext;

  const handleTabChange = (tab) => {
    if (isEmbedded) setLocalTab(tab);
    else if (context?.setActiveTab) context.setActiveTab(tab);
  };

  // MOCK DATA: Giả lập danh sách bài viết bị báo cáo
  const [reportedPosts, setReportedPosts] = useState([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=80',
      time: '2 giờ trước',
      content: 'Trang web này lừa đảo quá mọi người ơi, đừng ai dùng nhé! Vào link này để nhận quà...',
      image: 'https://images.unsplash.com/photo-1614064007886-d24b61b7f2b9?w=600&auto=format&fit=crop&q=80',
      reason: 'Spam / Lừa đảo',
      reportCount: 12
    },
    {
      id: 2,
      author: 'Trần Thị B',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      time: '5 giờ trước',
      content: 'Ai mua đồ ăn vặt thì inbox mình nha, freeship toàn quốc',
      image: null,
      reason: 'Quảng cáo trái phép',
      reportCount: 5
    }
  ]);

  const handleAction = (id, actionType) => {
    // actionType: 'keep' hoặc 'delete'
    const post = reportedPosts.find(p => p.id === id);
    if (!post) return;

    if (actionType === 'keep') {
      showNotification(`🟢 Đã BỎ QUA bài viết của ${post.author}`);
    } else {
      showNotification(`🔴 Đã XÓA bài viết của ${post.author} và cảnh cáo!`);
    }

    // Xóa bài ra khỏi danh sách chờ duyệt
    setReportedPosts(prev => prev.filter(p => p.id !== id));
  };

  const renderReviewTab = () => {
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
          <div className="bg-rose-50 border-b-4 border-[#0f172a] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 font-black">
              <AlertTriangle size={24} />
              <span className="text-lg uppercase">Bị Báo Cáo: {currentPost.reason}</span>
            </div>
            <div className="bg-rose-600 text-white px-3 py-1 rounded-xl font-bold border-2 border-[#0f172a] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              {currentPost.reportCount} người Report
            </div>
          </div>

          {/* Nội dung bài viết */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <img src={currentPost.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl border-4 border-[#0f172a] object-cover shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]" />
              <div>
                <h3 className="font-black text-xl text-slate-900">{currentPost.author}</h3>
                <p className="text-slate-500 font-bold text-sm">{currentPost.time}</p>
              </div>
            </div>

            <p className="text-lg text-slate-800 font-medium mb-6 leading-relaxed">
              {currentPost.content}
            </p>

            {currentPost.image ? (
              <div className="w-full aspect-video rounded-2xl border-4 border-[#0f172a] overflow-hidden bg-slate-100 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mb-4">
                <img src={currentPost.image} alt="Post media" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full py-8 rounded-2xl border-4 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center gap-2 text-slate-400 font-bold mb-4">
                <ImageIcon size={24} /> Không có hình ảnh đính kèm
              </div>
            )}
          </div>
        </div>

        {/* CÁC NÚT THAO TÁC (ACTION BUTTONS) */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={() => handleAction(currentPost.id, 'keep')}
            title="Bỏ qua (Giữ lại bài viết)"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-400 hover:bg-emerald-300 border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group"
          >
            <Check size={48} className="text-slate-900 group-hover:scale-125 transition-transform" strokeWidth={3} />
          </button>
          
          <button 
            onClick={() => handleAction(currentPost.id, 'delete')}
            title="Xóa bài và Cảnh cáo"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-500 hover:bg-rose-400 border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group"
          >
            <X size={48} className="text-slate-900 group-hover:scale-125 transition-transform" strokeWidth={3} />
          </button>
        </div>
        <p className="mt-6 text-slate-400 font-bold text-sm">Mẹo: Bạn có thể dùng phím mũi tên ⬅️ (Bỏ qua) và ➡️ (Xóa) để thao tác nhanh.</p>
      </div>
    );
  };

  const renderSpamTab = () => (
    <div className="bg-white rounded-3xl border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-8 text-center mt-10">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Quản lý User Spam</h2>
      <p className="text-slate-500 font-bold">Tính năng đang được phát triển...</p>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-4 border-b-4 border-slate-900">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">
            {currentTab === 'review' ? 'Duyệt bài đăng' : 'Spam & Báo cáo'}
          </h1>
          <p className="text-slate-500 font-bold text-sm sm:text-base m-0">
            {currentTab === 'review' ? 'Xử lý các nội dung vi phạm tiêu chuẩn cộng đồng.' : 'Danh sách các thành viên bị cảnh cáo nhiều lần.'}
          </p>
        </div>

        {/* HIỂN THỊ MENU PHỤ NẾU ĐANG NHÚNG TRONG SUPER ADMIN */}
        {isEmbedded && (
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'review', label: 'Duyệt bài đăng' },
              { id: 'spam', label: 'Spam & Báo cáo' }
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
    </div>
  );
};

export default ContentAdmin;
