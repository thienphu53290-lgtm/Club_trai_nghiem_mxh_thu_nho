import React, { useState, useRef } from 'react';
import Modal from './Modal';
import { MessageCircle, Send, X, CornerDownRight, Heart, ChevronDown, ChevronUp } from 'lucide-react';

const CommentModal = ({
  isOpen,
  onClose,
  post,
  currentUser,
  onSendComment,
  onLikeComment,
  onPreviewImage
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const inputRef = useRef(null);

  if (!isOpen || !post) return null;

  const handleClose = () => {
    setReplyingTo(null);
    setCommentInput('');
    if (onClose) onClose();
  };

  const handleSend = async () => {
    if (!commentInput.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const targetParentId = replyingTo ? replyingTo.parentId : null;
    try {
      await onSendComment(post.id, commentInput.trim(), targetParentId);
      if (targetParentId) {
        setExpandedReplies(prev => ({ ...prev, [targetParentId]: true }));
      }
      setCommentInput('');
      setReplyingTo(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dt) => {
    const d = new Date(dt || Date.now());
    const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${timeStr} ${dateStr}`;
  };

  const comments = post.recent_comments || [];
  const validComments = comments.filter(c => c && c.noi_dung && c.noi_dung.trim() !== '');
  const topLevelComments = validComments.filter(c => !c.parent_id || Number(c.parent_id) === 0);

  const getReplies = (parentId) => {
    return validComments.filter(c => Number(c.parent_id) === Number(parentId)).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  const handleReplyClick = (parentId, authorName) => {
    setReplyingTo({ parentId, authorName });
    setExpandedReplies(prev => ({ ...prev, [parentId]: true }));
    const mention = `@${authorName} `;
    setCommentInput(prev => prev.startsWith(mention) ? prev : `${mention}${prev}`);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="💬 Thảo luận & Nhận xét"
      icon={MessageCircle}
      iconColor="text-[#c93638]"
      iconBg="bg-rose-50 border-rose-100"
      size="lg"
      className="!p-0 flex flex-col"
      footer={
        <div className="w-full flex flex-col gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
          {replyingTo && (
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-rose-50 text-[#c93638] rounded-xl border border-rose-200/80 text-xs font-black animate-in fade-in zoom-in-95 duration-150 shadow-2xs">
              <div className="flex items-center gap-1.5 truncate">
                <CornerDownRight size={14} className="shrink-0" />
                <span className="truncate">Đang trả lời: <b>{replyingTo.authorName}</b></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCommentInput(prev => prev.replace(`@${replyingTo.authorName} `, ''));
                  setReplyingTo(null);
                }}
                className="p-1 hover:bg-rose-100 rounded-lg text-[#c93638] border-none cursor-pointer flex items-center justify-center transition-colors shrink-0 ml-2"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center font-bold text-sm text-slate-700 shadow-xs">
              {currentUser?.anh_dai_dien ? (
                <img src={currentUser.anh_dai_dien} alt="me" className="w-full h-full object-cover" />
              ) : (
                <span>{(currentUser?.ten_hien_thi || currentUser?.ho_ten || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
              <input
                ref={inputRef}
                type="text"
                placeholder={replyingTo ? `Nhập phản hồi đến ${replyingTo.authorName}...` : "Nhập suy nghĩ thảo luận của bạn (+10 XP ✨)..."}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isSubmitting}
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400"
              />
              <button
                onClick={handleSend}
                disabled={!commentInput.trim() || isSubmitting}
                className="w-8 h-8 rounded-lg bg-[#c93638] hover:bg-[#a82527] disabled:bg-slate-200 text-white flex items-center justify-center border-none cursor-pointer transition-colors shrink-0 shadow-xs"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="p-4 sm:p-6 space-y-4 max-h-[62vh] overflow-y-auto bg-white flex-1">
        {topLevelComments.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 text-slate-300">
              <MessageCircle size={32} />
            </div>
            <p className="text-sm font-extrabold text-slate-600 mb-1">Chưa có thảo luận nào</p>
            <p className="text-xs font-medium text-slate-400 max-w-xs">Hãy là người tiên phong để lại góc nhìn sắc sảo và nhận ngay +10 điểm XP!</p>
          </div>
        ) : (
          topLevelComments.map((c, idx) => {
            const replies = getReplies(c.id);
            const authorName = c.ten_hien_thi || c.ho_ten || 'Thành viên';
            const isExpanded = expandedReplies[c.id] || false;
            return (
              <div key={c.id || idx} className="space-y-2.5">
                <div className="flex gap-3.5 items-start p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200/90 hover:bg-slate-50 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 border border-slate-300/80 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-slate-700 shadow-xs">
                    {c.anh_dai_dien ? (
                      <img src={c.anh_dai_dien} alt={c.ten_hien_thi} className="w-full h-full object-cover" />
                    ) : (
                      <span>{authorName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-xs sm:text-sm text-slate-900">{authorName}</span>
                      {c.anh_cap_bac && (
                        <img 
                          src={c.anh_cap_bac} 
                          alt="badge" 
                          className="w-4 h-4 rounded object-cover cursor-pointer hover:scale-125 transition-transform"
                          onClick={() => onPreviewImage && onPreviewImage({ isOpen: true, url: c.anh_cap_bac, title: c.ten_cap_bac, caption: `Huy hiệu của ${authorName}` })}
                        />
                      )}
                      <span className="text-[11px] font-extrabold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">{c.ten_cap_bac || 'Thành viên'}</span>
                      <span className="text-[10px] font-bold text-slate-400 ml-auto">{formatDateTime(c.created_at)}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1.5 mb-2.5 whitespace-pre-wrap leading-relaxed">{c.noi_dung}</p>
                    
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => onLikeComment && onLikeComment(post.id, c.id)}
                        className={`text-[11px] font-black bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors p-0 ${c.is_liked ? 'text-[#c93638]' : 'text-slate-500 hover:text-[#c93638]'}`}
                      >
                        <Heart size={14} className={c.is_liked ? 'fill-[#c93638] text-[#c93638]' : 'text-slate-400'} />
                        <span>{c.likes_count > 0 ? `Thích (${c.likes_count})` : 'Thích'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReplyClick(c.id, authorName)}
                        className="text-[11px] font-black text-slate-500 hover:text-[#c93638] bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors p-0"
                      >
                        <span>💬 Trả lời</span>
                      </button>
                    </div>
                  </div>
                </div>

                {replies.length > 0 && (
                  <div className="ml-6 sm:ml-10 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setExpandedReplies(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                      className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-black text-xs text-[#c93638] bg-rose-50/80 hover:bg-rose-100/90 border border-rose-200/60 transition-colors cursor-pointer w-fit shadow-2xs"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={15} className="text-[#c93638] shrink-0" />
                          <span>Ẩn phản hồi</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown size={15} className="text-[#c93638] shrink-0" />
                          <span>Xem {replies.length} phản hồi</span>
                        </>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pl-3.5 border-l-2 border-rose-300 space-y-2.5 pt-1">
                        {replies.map((r, rIdx) => {
                          const replyAuthor = r.ten_hien_thi || r.ho_ten || 'Thành viên';
                          return (
                            <div key={r.id || rIdx} className="flex gap-3 items-start p-3 rounded-2xl bg-slate-100/50 border border-slate-200/60 hover:bg-slate-100/80 transition-all">
                              <div className="w-8 h-8 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center font-bold text-[11px] text-slate-700">
                                {r.anh_dai_dien ? (
                                  <img src={r.anh_dai_dien} alt={replyAuthor} className="w-full h-full object-cover" />
                                ) : (
                                  <span>{replyAuthor.charAt(0).toUpperCase()}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-black text-xs text-slate-900">{replyAuthor}</span>
                                  {r.anh_cap_bac && (
                                    <img 
                                      src={r.anh_cap_bac} 
                                      alt="badge" 
                                      className="w-3.5 h-3.5 rounded object-cover cursor-pointer hover:scale-125 transition-transform"
                                      onClick={() => onPreviewImage && onPreviewImage({ isOpen: true, url: r.anh_cap_bac, title: r.ten_cap_bac, caption: `Huy hiệu của ${replyAuthor}` })}
                                    />
                                  )}
                                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded-md">{r.ten_cap_bac || 'Thành viên'}</span>
                                  <span className="text-[10px] font-bold text-slate-400 ml-auto">{formatDateTime(r.created_at)}</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-700 mt-1 mb-2.5 whitespace-pre-wrap leading-relaxed">{r.noi_dung}</p>
                                
                                <div className="flex items-center gap-4">
                                  <button
                                    type="button"
                                    onClick={() => onLikeComment && onLikeComment(post.id, r.id)}
                                    className={`text-[11px] font-black bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors p-0 ${r.is_liked ? 'text-[#c93638]' : 'text-slate-500 hover:text-[#c93638]'}`}
                                  >
                                    <Heart size={13} className={r.is_liked ? 'fill-[#c93638] text-[#c93638]' : 'text-slate-400'} />
                                    <span>{r.likes_count > 0 ? `Thích (${r.likes_count})` : 'Thích'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleReplyClick(c.id, replyAuthor)}
                                    className="text-[11px] font-black text-slate-500 hover:text-[#c93638] bg-transparent border-none cursor-pointer flex items-center gap-1.5 transition-colors p-0"
                                  >
                                    <span>💬 Trả lời</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};

export default CommentModal;
