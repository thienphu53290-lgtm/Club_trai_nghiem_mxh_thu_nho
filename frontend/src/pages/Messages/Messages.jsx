import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Send, Image, Smile, CheckCircle, Shield, Circle, Paperclip, 
  Check, MoreVertical, Phone, Video, Info, User, Bell, Pin, ChevronDown, 
  ChevronUp, Lock, ShoppingBag, Trash2, Sparkles, AlertCircle, Share2, MoreHorizontal, ChevronLeft
} from 'lucide-react';
import api from '../../api/axios';
import echo from '../../api/echo';
import { ConfirmModal } from '../../components/Modal';
import Modal from '../../components/Modal/Modal';
import { matchSearch } from '../../utils/stringUtils';

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(window.innerWidth >= 1280);
  const [openSections, setOpenSections] = useState({ product: true, media: true, privacy: true });
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  const [activeContactMenuId, setActiveContactMenuId] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [typingStatus, setTypingStatus] = useState(null);
  const typingTimeoutRef = useRef(null);
  const lastTypingEmitRef = useRef(0);
  
  const showAlert = (message, title = 'Thông Báo', variant = 'info') => {
    let finalMessage = message;
    if (typeof message === 'string') {
      finalMessage = message.split(/(\d+\s*giờ\s*\d+\s*phút)/i).map((part, index) => 
        /(\d+\s*giờ\s*\d+\s*phút)/i.test(part) ? <strong key={index} className="font-black text-slate-800">{part}</strong> : part
      );
    }
    setConfirmConfig({
      isOpen: true,
      title,
      message: finalMessage,
      variant,
      hideCancel: true,
      confirmText: 'Đã hiểu'
    });
  };

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('current_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const user = parsed?.user?.id ? parsed.user : parsed;
      if (parsed?.user?.id) localStorage.setItem('current_user', JSON.stringify(user));
      return user;
    } catch (e) {
      return null;
    }
  });

  const messageContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeIdRef = useRef(activeId);
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('current_user');
      if (!token || !savedUser) {
        setCurrentUser(null);
        setContacts([]);
        setActiveId(null);
      } else {
        try {
          const parsed = JSON.parse(savedUser);
          const user = parsed?.user?.id ? parsed.user : parsed;
          setCurrentUser(user);
          fetchConversations();
        } catch (e) {
          setCurrentUser(null);
          setContacts([]);
          setActiveId(null);
        }
      }
    };
    window.addEventListener('user_auth_change', handleAuthChange);
    return () => window.removeEventListener('user_auth_change', handleAuthChange);
  }, []);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  const fetchConversations = (targetFromState = null) => {
    api.get('/chat/conversations')
      .then(res => {
        if (res.data && res.data.status === 'success') {
          let list = res.data.contacts || [];
          
          if (targetFromState) {
            const exists = list.find(c => c.id === targetFromState.id);
            if (!exists) {
              const newContact = {
                id: targetFromState.id,
                name: targetFromState.name,
                avatar: targetFromState.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                time: 'Mới',
                lastMessage: 'Cuộc trò chuyện mới từ Trang cá nhân',
                unread: 0,
                product: targetFromState.product || 'Trao đổi trải nghiệm',
                productPrice: targetFromState.productPrice || 'Thảo luận riêng',
                online: targetFromState.online ?? true,
                isVerified: targetFromState.isVerified ?? true,
                isFollowing: targetFromState.isFollowing ?? false,
                isBlockedByMe: targetFromState.isBlockedByMe ?? false,
                isBlockedByPartner: targetFromState.isBlockedByPartner ?? false,
                roleTitle: targetFromState.roleTitle || '👑 Thành Viên Club',
                messages: [],
                quickReplies: ['Chào bạn nhen 🤝', 'Cho mình xin thêm thông tin trải nghiệm nhé', 'Quán này ở đoạn nào thế bạn ❤️'],
                sharedMedia: []
              };
              list = [newContact, ...list];
            }
            setActiveId(targetFromState.id);
          } else if (list.length > 0 && !activeIdRef.current && window.innerWidth >= 768) {
            setActiveId(list[0].id);
          }
          setContacts(prev => list.map(item => {
            const existing = prev.find(p => parseInt(p.id, 10) === parseInt(item.id, 10));
            return existing && existing.messages && existing.messages.length > 0
              ? { ...item, messages: existing.messages, sharedMedia: existing.sharedMedia || item.sharedMedia, quickReplies: existing.quickReplies || item.quickReplies }
              : item;
          }));
        }
      })
      .catch(() => {});
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    const now = Date.now();
    if (now - lastTypingEmitRef.current > 2500) {
      lastTypingEmitRef.current = now;
      api.post('/chat/typing', { receiver_id: activeId }).catch(() => {});
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    let target = null;
    if (location.state && location.state.chatTarget) {
      target = location.state.chatTarget;
    }
    fetchConversations(target);

    const channel = echo.channel('club-live');
    const handleLiveEvent = (event) => {
      if (!currentUserRef.current) return;

      if (event.type === 'chat_typing' && event.data) {
        const payload = event.data;
        const myId = (intVal(currentUserRef.current.id) || currentUserRef.current.id);
        if (intVal(payload.receiver_id) === intVal(myId) && intVal(payload.sender_id) === intVal(activeIdRef.current)) {
          setTypingStatus(payload.sender_id);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setTypingStatus(null);
          }, 3000);
        }
        return;
      }

      if (event.type === 'new_chat_message' && event.data) {
        const payload = event.data;
        const myId = (intVal(currentUserRef.current.id) || currentUserRef.current.id);
        const isForMe = (intVal(payload.receiverId) === intVal(myId));
        const isFromMe = (intVal(payload.senderId) === intVal(myId));

        if (isForMe && intVal(payload.senderId) === intVal(activeIdRef.current)) {
           setTypingStatus(null);
        }

        if (!isForMe && !isFromMe) return;

        const currentActive = intVal(activeIdRef.current);

        setContacts(prev => {
          let found = false;
          let updatedList = prev.map(c => {
            const contactId = intVal(c.id);
            if (contactId === intVal(isForMe ? payload.senderId : payload.receiverId)) {
              found = true;
              const isLookingAtThis = (contactId === currentActive);
              const newMsg = {
                id: payload.id || Date.now(),
                senderId: isFromMe ? 'me' : payload.senderId,
                text: payload.text,
                imageUrl: payload.imageUrl,
                time: payload.time,
                isMe: isFromMe
              };
              
              const currentMsgs = c.messages || [];
              const alreadyExists = currentMsgs.some(m => intVal(m.id) === intVal(newMsg.id) || (newMsg.isMe && m.isMe && ((newMsg.text && m.text === newMsg.text) || (newMsg.imageUrl && m.imageUrl === newMsg.imageUrl))));
              const msgs = alreadyExists ? currentMsgs.map(m => (newMsg.isMe && m.isMe && ((newMsg.text && m.text === newMsg.text) || (newMsg.imageUrl && m.imageUrl === newMsg.imageUrl))) ? { ...m, ...newMsg } : m) : [...currentMsgs, newMsg];
              const media = payload.imageUrl ? arrayUnique([...(c.sharedMedia || []), payload.imageUrl]) : (c.sharedMedia || []);

              return {
                ...c,
                lastMessage: isFromMe ? `Bạn: ${payload.text || '[Hình ảnh 🖼️]'}` : (payload.text || '[Hình ảnh 🖼️]'),
                time: payload.time || 'Vừa xong',
                unread: (isLookingAtThis || isFromMe) ? 0 : ((c.unread || 0) + 1),
                messages: msgs,
                sharedMedia: media
              };
            }
            return c;
          });

          if (!found && isForMe) {
            const isLookingAtThis = (intVal(payload.senderId) === currentActive);
            const newCard = {
              id: payload.senderId,
              name: payload.senderName || 'Thành viên Club',
              avatar: payload.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
              time: payload.time || 'Vừa xong',
              lastMessage: payload.text || '[Hình ảnh 🖼️]',
              unread: isLookingAtThis ? 0 : 1,
              product: payload.product || 'Trao đổi trải nghiệm',
              productPrice: payload.productPrice || 'Thảo luận riêng',
              online: true,
              isVerified: true,
              isFollowing: false,
              isBlockedByMe: false,
              isBlockedByPartner: false,
              roleTitle: '👑 Thành Viên Club',
              messages: [{
                id: payload.id || Date.now(),
                senderId: payload.senderId,
                text: payload.text,
                imageUrl: payload.imageUrl,
                time: payload.time,
                isMe: false
              }],
              quickReplies: ['Chào bạn nhen 🤝', 'Cho mình xin thêm thông tin trải nghiệm nhé', 'Quán này ở đoạn nào thế bạn ❤️'],
              sharedMedia: payload.imageUrl ? [payload.imageUrl] : []
            };
            return [newCard, ...updatedList];
          }

          const activeCardIndex = updatedList.findIndex(c => intVal(c.id) === intVal(isForMe ? payload.senderId : payload.receiverId));
          if (activeCardIndex > 0) {
            const [item] = updatedList.splice(activeCardIndex, 1);
            updatedList.unshift(item);
          }
          return updatedList;
        });

        if (isForMe && intVal(payload.senderId) === intVal(activeIdRef.current)) {
          setTimeout(() => scrollToBottom(), 100);
          api.get(`/chat/messages/${payload.senderId}`).catch(() => {});
        }
      }

      if (event.type === 'message_recalled' && event.data) {
        const payload = event.data;
        setContacts(prev => prev.map(c => {
          const hasMsg = (c.messages || []).some(m => intVal(m.id) === intVal(payload.id));
          if (hasMsg) {
            const updatedMsgs = (c.messages || []).map(m => intVal(m.id) === intVal(payload.id) ? {
              ...m,
              text: 'Tin nhắn đã thu hồi',
              imageUrl: null,
              isRecalled: true
            } : m);
            const media = updatedMsgs.filter(m => m.imageUrl).map(m => m.imageUrl);
            return { ...c, messages: updatedMsgs, sharedMedia: media };
          }
          return c;
        }));
      }

      if (event.type === 'user_status_change' && event.data) {
        setContacts(prev => prev.map(c => 
          intVal(c.id) === intVal(event.data.user_id) 
            ? { ...c, online: event.data.online, lastSeenPill: event.data.online ? null : 'Vừa rời đi' } 
            : c
        ));
      }
    };

    channel.listen('.live-event', handleLiveEvent);

    const sendHeartbeat = () => {
      api.post('/chat/heartbeat', { user_id: currentUserRef.current?.id || 1 }).catch(() => {});
    };
    sendHeartbeat();
    const heartbeatInterval = setInterval(sendHeartbeat, 30000);

    return () => {
      clearInterval(heartbeatInterval);
      channel.stopListening('.live-event', handleLiveEvent);
    };
  }, []);

  useEffect(() => {
    if (location.state && location.state.chatTarget) {
      fetchConversations(location.state.chatTarget);
    }
  }, [location.state?.chatTarget]);

  useEffect(() => {
    if (!activeId) return;
    api.get(`/chat/messages/${activeId}`)
      .then(res => {
        if (res.data && res.data.status === 'success' && res.data.partner) {
          const p = res.data.partner;
          setContacts(prev => prev.map(c => {
            if (intVal(c.id) === intVal(p.id)) {
              return {
                ...c,
                name: p.name,
                avatar: p.avatar,
                online: p.online,
                lastSeenPill: p.lastSeenPill,
                isVerified: p.isVerified,
                isFollowing: p.isFollowing,
                roleTitle: p.roleTitle,
                isBlockedByMe: p.isBlockedByMe,
                isBlockedByPartner: p.isBlockedByPartner,
                product: p.product || c.product,
                productPrice: p.productPrice || c.productPrice,
                messages: p.messages || [],
                sharedMedia: p.sharedMedia || [],
                quickReplies: p.quickReplies || c.quickReplies || [],
                unread: 0
              };
            }
            return c;
          }));
          setTimeout(() => scrollToBottom(), 100);
        }
      })
      .catch(() => {});
  }, [activeId]);

  const intVal = (val) => parseInt(val, 10);
  const arrayUnique = (arr) => Array.from(new Set(arr));

  const activeContact = contacts.find(c => intVal(c.id) === intVal(activeId)) || {};
  
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      matchSearch(c.name, searchQuery) ||
      matchSearch(c.product, searchQuery) ||
      matchSearch(c.lastMessage, searchQuery);
    
    if (filterTab === 'unread') return matchesSearch && c.unread > 0;
    if (filterTab === 'vip') return matchesSearch && c.isVerified;
    return matchesSearch;
  });

  const togglePartnerOnline = () => {
    if (!activeContact.id) return;
    const newOnlineStatus = !activeContact.online;
    api.post('/chat/broadcast-status', { 
      user_id: activeContact.id, 
      online: newOnlineStatus 
    }).catch(() => {});

    setContacts(prev => prev.map(c => 
      intVal(c.id) === intVal(activeId) ? { ...c, online: newOnlineStatus, lastSeenPill: newOnlineStatus ? null : 'Vừa rời đi' } : c
    ));
  };

  const handleSendMessage = (textToSend = null, fileObj = null, imgUrlPreview = null) => {
    if (!activeId) return;
    const content = typeof textToSend === 'string' ? textToSend : inputText;
    if (!content.trim() && !fileObj && !imgUrlPreview) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const tempMsgId = Date.now();

    const optimisticMsg = {
      id: tempMsgId,
      senderId: 'me',
      text: content,
      imageUrl: imgUrlPreview,
      time: timeStr,
      isMe: true
    };

    setContacts(prev => {
      const list = prev.map(c => {
        if (intVal(c.id) === intVal(activeId)) {
          const updatedMedia = imgUrlPreview ? [...(c.sharedMedia || []), imgUrlPreview] : c.sharedMedia;
          return {
            ...c,
            lastMessage: imgUrlPreview ? 'Bạn: [Hình ảnh 🖼️]' : `Bạn: ${content}`,
            messages: [...(c.messages || []), optimisticMsg],
            sharedMedia: updatedMedia,
            time: timeStr,
            unread: 0
          };
        }
        return c;
      });
      const index = list.findIndex(c => intVal(c.id) === intVal(activeId));
      if (index > 0) {
        const [item] = list.splice(index, 1);
        list.unshift(item);
      }
      return list;
    });

    if (typeof textToSend !== 'string') {
      setInputText('');
    }
    setShowEmojiPicker(false);
    setTimeout(() => scrollToBottom(), 80);

    const formData = new FormData();
    formData.append('receiver_id', activeId);
    formData.append('noi_dung', content);
    if (activeContact.product) formData.append('san_pham', activeContact.product);
    if (activeContact.productPrice) formData.append('gia_san_pham', activeContact.productPrice);
    if (fileObj) {
      formData.append('hinh_anh_file', fileObj);
    } else if (imgUrlPreview && typeof imgUrlPreview === 'string' && imgUrlPreview.startsWith('http')) {
      formData.append('hinh_anh_url', imgUrlPreview);
    }

    api.post('/chat/messages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
      if (res.data && res.data.status === 'success') {
        const serverMsg = res.data.data;
        setContacts(prev => prev.map(c => {
          if (intVal(c.id) === intVal(activeId)) {
            const echoAlreadyAdded = (c.messages || []).some(m => intVal(m.id) === intVal(serverMsg.id));
            let replaced = c.messages || [];
            if (echoAlreadyAdded) {
              replaced = replaced.filter(m => m.id !== tempMsgId);
            } else {
              replaced = replaced.map(m => m.id === tempMsgId ? { ...m, id: serverMsg.id, imageUrl: serverMsg.imageUrl || m.imageUrl } : m);
            }
            let updatedMedia = c.sharedMedia || [];
            if (imgUrlPreview && serverMsg.imageUrl) {
              updatedMedia = updatedMedia.map(url => url === imgUrlPreview ? serverMsg.imageUrl : url);
              updatedMedia = updatedMedia.filter((val, idx, arr) => arr.indexOf(val) === idx);
            }
            return { ...c, messages: replaced, sharedMedia: updatedMedia };
          }
          return c;
        }));
      }
    }).catch(() => {
      showAlert('Có lỗi xảy ra khi gửi tin nhắn, vui lòng thử lại!', 'Lỗi', 'danger');
    });
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    files.forEach((file, index) => {
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (upload) => {
          handleSendMessage('', file, upload.target.result);
        };
        reader.readAsDataURL(file);
      }, index * 200);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const insertEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const executeDeleteMessage = (msgId, type) => {
    setContacts(prev => prev.map(c => {
      if (intVal(c.id) === intVal(activeId)) {
        let updatedMsgs = c.messages || [];
        if (type === 'me') {
          updatedMsgs = updatedMsgs.filter(m => intVal(m.id) !== intVal(msgId));
        } else if (type === 'everyone') {
          updatedMsgs = updatedMsgs.map(m => intVal(m.id) === intVal(msgId) ? {
            ...m,
            text: 'Tin nhắn đã thu hồi',
            imageUrl: null,
            isRecalled: true
          } : m);
        }
        const media = updatedMsgs.filter(m => m.imageUrl).map(m => m.imageUrl);
        return { ...c, messages: updatedMsgs, sharedMedia: media };
      }
      return c;
    }));

    api.delete(`/chat/messages/${msgId}`, { data: { type } }).catch(() => {
      showAlert('Có lỗi xảy ra, vui lòng thử lại!', 'Lỗi', 'danger');
    });
  };

  const handleDeleteMessage = (msgId, type) => {
    setActiveMenuMsgId(null);
    if (type === 'everyone') {
      setConfirmConfig({
        isOpen: true,
        title: 'Xác Nhận Thu Hồi',
        message: 'Tin nhắn sẽ được thu hồi đối với tất cả thành viên trong hội thoại và thay thế bằng thông báo thu hồi. Bạn có chắc chắn muốn tiếp tục?',
        confirmText: 'Thu hồi ngay',
        variant: 'danger',
        onConfirm: () => executeDeleteMessage(msgId, 'everyone')
      });
    } else {
      setConfirmConfig({
        isOpen: true,
        title: 'Xác Nhận Xóa Tin Nhắn',
        message: 'Tin nhắn này sẽ được gỡ khỏi màn hình của chính bạn nhưng vẫn hiển thị với người khác trong hội thoại. Bạn có chắc chắn muốn xóa?',
        confirmText: 'Xóa phía tôi',
        variant: 'danger',
        onConfirm: () => executeDeleteMessage(msgId, 'me')
      });
    }
  };

  const handleDeleteConversation = (targetId, name) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Xóa Lịch Sử Hội Thoại',
      message: `Toàn bộ tin nhắn trao đổi với ${name} sẽ bị xóa khỏi màn hình của bạn. Đối phương vẫn giữ được lịch sử cuộc trò chuyện này. Bạn có đồng ý xóa sạch không?`,
      confirmText: 'Xóa lịch sử',
      variant: 'danger',
      onConfirm: () => {
        api.delete(`/chat/conversations/${targetId}`).then(() => {
          setContacts(prev => prev.filter(x => intVal(x.id) !== intVal(targetId)));
          if (intVal(activeId) === intVal(targetId)) setActiveId(null);
        });
      }
    });
  };

  const handleShareMessage = (msg) => {
    setActiveMenuMsgId(null);
    const contentToShare = msg.text || msg.imageUrl || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contentToShare);
      showAlert('Đã sao chép nội dung chia sẻ vào bộ nhớ tạm!', 'Thành công', 'success');
    } else {
      showAlert(`Nội dung chia sẻ: ${contentToShare}`);
    }
  };

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFollowPartner = () => {
    if (!activeId) return;
    api.post(`/users/${activeId}/follow`)
      .then(res => {
        const following = res.data.is_following ?? true;
        setContacts(prev => prev.map(c => intVal(c.id) === intVal(activeId) ? { ...c, isFollowing: following } : c));
      })
      .catch(() => {});
  };

  const handleToggleBlock = (partnerId, partnerName, isCurrentlyBlocked) => {
    setActiveContactMenuId(null);
    if (isCurrentlyBlocked) {
      api.post(`/chat/unblock/${partnerId}`).then(() => {
        setContacts(prev => prev.map(c => 
          intVal(c.id) === intVal(partnerId) ? { ...c, isBlockedByMe: false } : c
        ));
      }).catch(err => {
        if (err.response?.status === 422) {
          showAlert(err.response?.data?.message || 'Chưa hết thời gian cooldown 8 tiếng.', 'Lưu Ý Hệ Thống', 'warning');
        }
      });
    } else {
      setConfirmConfig({
        isOpen: true,
        title: 'Xác Nhận Chặn Người Dùng',
        message: `Bạn có chắc chắn muốn chặn ${partnerName}? Bạn sẽ không thể nhận hay gửi tin nhắn cho người này. Lưu ý: Cần chờ 8 tiếng (cooldown) để có thể thay đổi trạng thái chặn lần tiếp theo.`,
        confirmText: 'Chặn ngay',
        variant: 'danger',
        onConfirm: () => {
          api.post(`/chat/block/${partnerId}`).then(() => {
            setContacts(prev => prev.map(c => 
              intVal(c.id) === intVal(partnerId) ? { ...c, isBlockedByMe: true } : c
            ));
          }).catch(err => {
            if (err.response?.status === 422) {
              showAlert(err.response?.data?.message || 'Chưa hết thời gian cooldown 8 tiếng.', 'Lưu Ý Hệ Thống', 'warning');
            }
          });
        }
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-[#f8fafc] flex items-center justify-center p-5">
        <div className="max-w-[500px] w-full border-2 border-[#0f172a] rounded-[28px] p-8 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] text-center">
          <div className="w-20 h-20 bg-rose-50 border-2 border-rose-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
            <Lock size={38} className="text-[#c93638]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-3 tracking-tight">
            Bạn chưa đăng nhập Club
          </h2>
          <p className="text-slate-600 text-[1.05rem] font-medium leading-relaxed mb-8">
            Hãy đăng nhập tài khoản Club Trải Nghiệm để kết nối trực tuyến tức thì, trò chuyện Realtime và trao đổi tin nhắn riêng tư cùng cộng đồng!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="bg-[#c93638] hover:bg-[#a82527] text-white font-extrabold text-base px-8 py-3.5 rounded-full border-2 border-[#0f172a] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-base px-8 py-3.5 rounded-full border-2 border-[#0f172a] shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              Về Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#f8fafc] px-3 sm:px-6 py-4 max-w-[1780px] mx-auto font-sans flex flex-col" onClick={() => setActiveContactMenuId(null)}>
      <div className="grid grid-cols-1 md:grid-cols-12 xl:grid-cols-12 gap-4 sm:gap-5 flex-1 h-[calc(100vh-172px)] max-h-[calc(100vh-172px)] min-h-[600px]">
        
        <div className={`${activeId ? 'hidden md:flex' : 'flex'} md:col-span-5 lg:col-span-4 xl:col-span-3 border-2 border-[#0f172a] rounded-[28px] p-4 sm:p-5 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex-col h-full max-h-full min-h-0 overflow-hidden`}>
          
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-slate-100 shrink-0">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight m-0 flex items-center gap-2">
              <span>Đoạn chat Club</span>
              {contacts.filter(c => c.unread > 0).length > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c93638] text-white font-black shadow-xs">
                  {contacts.filter(c => c.unread > 0).length}
                </span>
              )}
            </h2>
            <button 
              onClick={() => navigate('/feed')}
              title="Khám phá và trò chuyện từ Bảng tin"
              className="w-9 h-9 rounded-full bg-slate-900 text-amber-300 hover:bg-slate-800 flex items-center justify-center font-black cursor-pointer border-none transition-transform active:scale-95 shadow-sm"
            >
              +
            </button>
          </div>

          <div className="border-2 border-[#0f172a] rounded-2xl py-2 px-3.5 mb-3 flex items-center gap-2 bg-white shadow-2xs shrink-0">
            <Search size={17} className="text-slate-500 shrink-0" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm người, sản phẩm..." 
              className="bg-transparent border-none outline-none text-xs font-black w-full text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 mb-3.5 shrink-0">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'unread', label: `Chưa đọc (${contacts.filter(c => c.unread > 0).length})` },
              { id: 'vip', label: '👑 VIP' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-black text-[11px] transition-all cursor-pointer border-2 ${filterTab === tab.id ? 'border-[#0f172a] bg-[#fcebeb] text-[#c93638] shadow-2xs' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 font-black text-xs">
                Chưa có hội thoại nào. Hãy ghé Bảng tin hoặc Trang cá nhân để bấm nhắn tin!
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => setActiveId(contact.id)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer border-2 ${intVal(activeId) === intVal(contact.id) ? 'border-[#0f172a] bg-slate-50/90 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] translate-x-0.5' : 'border-transparent hover:bg-slate-50/70'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img 
                        src={contact.avatar} 
                        alt={contact.name} 
                        className="w-11 h-11 rounded-full object-cover border-2 border-[#0f172a] shadow-2xs"
                      />
                      {contact.online ? (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                      ) : (
                        <span className="absolute -bottom-1 -right-2 px-1.5 py-0.5 bg-[#e8f5e9] text-[#1a7f37] border-2 border-white rounded-full font-black text-[10px] leading-none whitespace-nowrap shadow-2xs">
                          {contact.lastSeenPill || 'Offline'}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="font-black text-sm text-slate-900 truncate">{contact.name}</span>
                          {contact.isVerified && (
                            <Shield size={14} className="text-[#c93638] fill-[#fcebeb] shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0 relative">
                          <span className="text-[10px] font-black text-slate-400">{contact.time}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveContactMenuId(activeContactMenuId === contact.id ? null : contact.id);
                            }}
                            className="w-6 h-6 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-950 flex items-center justify-center transition-colors border-none bg-transparent cursor-pointer ml-0.5"
                            title="Tùy chọn"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {activeContactMenuId === contact.id && (
                            <div className="absolute top-full right-0 mt-1 w-32 bg-white border-2 border-[#0f172a] rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] py-1 z-50">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleBlock(contact.id, contact.name, contact.isBlockedByMe);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold hover:bg-slate-100 text-slate-700 cursor-pointer text-left border-b border-slate-100"
                              >
                                {contact.isBlockedByMe ? 'Mở chặn' : 'Chặn tin nhắn'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveContactMenuId(null);
                                  handleDeleteConversation(contact.id, contact.name);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold hover:bg-red-50 text-red-600 cursor-pointer text-left"
                              >
                                Xóa hội thoại
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-500 truncate m-0 flex-1">
                          {contact.lastMessage}
                        </p>
                        {contact.unread > 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#c93638] text-white font-black text-[10px] flex items-center justify-center shrink-0 border border-slate-950 shadow-2xs animate-pulse">
                            {contact.unread}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md border border-[#0f172a]/70 text-[10px] font-black text-slate-800 bg-white shadow-2xs truncate">
                          {contact.product || 'Trao đổi trải nghiệm'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`${!activeId ? 'hidden md:flex' : 'flex'} md:col-span-7 ${showRightSidebar ? 'lg:col-span-8 xl:col-span-6' : 'lg:col-span-8 xl:col-span-9'} border-2 border-[#0f172a] rounded-[28px] p-4 sm:p-6 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex-col h-full max-h-full min-h-0 overflow-hidden transition-all duration-300`}>
          
          {!activeContact.id ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-black">
              <span className="text-4xl mb-3">💬</span>
              <p>Hãy chọn một cuộc trò chuyện từ danh sách hoặc nhắn tin từ Trang cá nhân</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-3.5 border-b-2 border-slate-900 mb-4 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
                  <button 
                    onClick={() => setActiveId(null)}
                    className="md:hidden w-10 h-10 rounded-xl border-2 border-[#0f172a] bg-slate-50 flex items-center justify-center text-slate-800 shrink-0"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="relative shrink-0">
                    <img 
                      src={activeContact.avatar} 
                      alt={activeContact.name} 
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#0f172a] shadow-xs cursor-pointer"
                      onClick={() => navigate(`/profile/${activeContact.id}`)}
                    />
                    {activeContact.online ? (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                    ) : (
                      <span className="absolute -bottom-1 -right-2 px-1.5 py-0.5 bg-[#e8f5e9] text-[#1a7f37] border-2 border-white rounded-full font-black text-[10px] sm:text-[11px] leading-none whitespace-nowrap shadow-2xs">
                        {activeContact.lastSeenPill || 'Offline'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 
                      onClick={() => navigate(`/profile/${activeContact.id}`)}
                      className="font-black text-base sm:text-lg text-slate-950 m-0 flex items-center gap-1.5 truncate cursor-pointer hover:underline"
                    >
                      <span className="truncate">{activeContact.name}</span>
                      {activeContact.isVerified && (
                        <Shield size={18} className="text-[#c93638] fill-[#fcebeb] shrink-0" />
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mt-0.5">
                      {activeContact.online ? (
                        <span className="text-emerald-600 font-black flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Đang hoạt động (DB + Realtime)
                        </span>
                      ) : (
                        <span className="text-slate-500 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          {activeContact.lastSeenPill === 'Offline' ? 'Offline' : `Ngoại tuyến (${activeContact.lastSeenPill || 'Vừa rời đi'})`}
                        </span>
                      )}
                      <span>•</span>
                      <span className="text-slate-800 font-black underline decoration-[#c93638]/70 truncate max-w-[180px] sm:max-w-xs">
                        {activeContact.product || 'Trao đổi trải nghiệm'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => showAlert(`Đang khởi tạo kết nối cuộc gọi âm thanh bảo mật tới ${activeContact.name}...`, 'Tính năng đang phát triển', 'info')}
                    title="Gọi âm thanh"
                    className="w-10 h-10 rounded-xl border-2 border-[#0f172a] bg-slate-50 hover:bg-slate-100 text-[#c93638] flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-2xs"
                  >
                    <Phone size={18} />
                  </button>
                  <button 
                    onClick={() => showAlert(`Đang chuẩn bị phòng gọi Video độ nét cao tới ${activeContact.name}...`, 'Tính năng đang phát triển', 'info')}
                    title="Gọi Video"
                    className="w-10 h-10 rounded-xl border-2 border-[#0f172a] bg-slate-50 hover:bg-slate-100 text-[#c93638] flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-2xs hidden sm:flex"
                  >
                    <Video size={18} />
                  </button>
                  <button 
                    onClick={() => setShowRightSidebar(!showRightSidebar)}
                    title="Bật/Tắt thanh thông tin hội thoại"
                    className={`w-10 h-10 rounded-xl border-2 border-[#0f172a] flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-2xs ${showRightSidebar ? 'bg-[#c93638] text-white' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'}`}
                  >
                    <Info size={18} />
                  </button>
                </div>
              </div>

              {!activeContact.isFollowing && (
                <div className="mb-4 p-3.5 rounded-2xl border-2 border-[#0f172a] bg-amber-100 text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shrink-0 animate-in fade-in">
                  <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-black leading-relaxed">
                    <span className="w-8 h-8 rounded-full bg-amber-300 border-2 border-[#0f172a] flex items-center justify-center shrink-0 text-base shadow-2xs">⚠️</span>
                    <span>Người lạ: Thành viên này chưa nằm trong danh sách theo dõi của bạn. Hãy cẩn trọng khi chia sẻ thông tin cá nhân.</span>
                  </div>
                  <button 
                    type="button"
                    onClick={handleFollowPartner}
                    className="px-4 py-2 rounded-xl border-2 border-[#0f172a] bg-[#c93638] hover:bg-[#a82b2d] text-white font-black text-xs shrink-0 cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-transform active:scale-95 whitespace-nowrap ml-auto sm:ml-0"
                  >
                    ➕ Theo dõi ngay
                  </button>
                </div>
              )}

              <div ref={messageContainerRef} onClick={(e) => { if (!e.target.closest('.message-menu-box')) setActiveMenuMsgId(null); }} className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 pb-12 mb-2 scrollbar-thin">
                
                <div className="text-center py-4 my-2 border-b border-dashed border-slate-200">
                  <img 
                    src={activeContact.avatar} 
                    alt="avatar" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#0f172a] mx-auto mb-2 shadow-xs cursor-pointer" 
                    onClick={() => navigate(`/profile/${activeContact.id}`)}
                  />
                  <h4 className="font-black text-sm text-slate-900 m-0">{activeContact.name}</h4>
                  <p className="text-[11px] font-extrabold text-slate-500 m-0">{activeContact.roleTitle}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 max-w-sm mx-auto">
                    🤝 Các thành viên trong Club Trải Nghiệm luôn trao đổi trung thực và tôn trọng nhau.
                  </p>
                </div>

                {(!activeContact.messages || activeContact.messages.length === 0) && (
                  <div className="text-center py-6 text-slate-400 font-bold text-xs">
                    Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên!
                  </div>
                )}

                {(activeContact.messages || []).map((msg, idx, arr) => {
                  const isNearBottom = idx >= arr.length - 2 && idx >= 2;
                  const menuPosClass = isNearBottom ? "bottom-full mb-1.5" : "top-full mt-1.5";
                  const isLastInGroup = idx === arr.length - 1 || arr[idx + 1].isMe !== msg.isMe;

                  return (
                    <div key={msg.id} className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-[80%] group relative ${msg.isMe ? 'ml-auto justify-end' : ''}`}>
                      
                      {!msg.isMe && (
                        isLastInGroup ? (
                          <img 
                            src={activeContact.avatar} 
                            alt="partner" 
                            className="w-8 h-8 rounded-full object-cover border-2 border-[#0f172a] shrink-0 mt-1 shadow-2xs"
                          />
                        ) : (
                          <div className="w-8 h-8 shrink-0 mt-1"></div>
                        )
                      )}

                      {msg.isMe && (
                        <div className="relative flex items-center self-center message-menu-box">
                          <button
                            type="button"
                            onClick={() => setActiveMenuMsgId(activeMenuMsgId === msg.id ? null : msg.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xs"
                            title="Tùy chọn tin nhắn"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {activeMenuMsgId === msg.id && (
                            <div className={`absolute ${menuPosClass} right-0 w-44 bg-white border-2 border-[#0f172a] rounded-2xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] py-1.5 px-1 z-50 text-slate-900 animate-in zoom-in-95`}>
                              <button
                                type="button"
                                onClick={() => handleShareMessage(msg)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold hover:bg-slate-100 rounded-xl cursor-pointer transition-colors text-left"
                              >
                                <Share2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>Chia sẻ</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(msg.id, 'me')}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold hover:bg-slate-100 rounded-xl cursor-pointer transition-colors text-left text-slate-700"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>Xóa chỉ mình tôi</span>
                              </button>
                              {msg.isMe && !msg.isRecalled && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(msg.id, 'everyone')}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold hover:bg-red-50 text-red-600 rounded-xl cursor-pointer transition-colors text-left border-t border-slate-100 mt-1 pt-1.5"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                  <span>Thu hồi (Mọi người)</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <div className={`py-3 px-4 rounded-[20px] border-2 border-[#0f172a] font-black text-xs sm:text-[13px] leading-relaxed shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${msg.isRecalled ? 'italic text-slate-500 bg-slate-100 border-dashed ' + (msg.isMe ? 'rounded-tr-none' : 'rounded-tl-none') : (msg.isMe ? 'bg-[#c93638] text-white rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none')}`}>
                          {msg.imageUrl ? (
                            <img src={msg.imageUrl} alt="attached" onClick={() => window.open(msg.imageUrl, '_blank')} className="max-w-[220px] sm:max-w-[260px] rounded-xl border border-white/20 shadow-xs block my-1 object-cover cursor-pointer" />
                          ) : null}
                          {msg.text && <p className="m-0 break-words">{msg.text}</p>}
                        </div>
                        <span className={`text-[9px] font-extrabold text-slate-400 mt-1 px-1.5 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                          {msg.time} {msg.isMe && !msg.isRecalled && (msg.daDoc ? '• Đã xem' : '• Đã gửi')}
                        </span>
                      </div>

                      {!msg.isMe && (
                        <div className="relative flex items-center self-center message-menu-box">
                          <button
                            type="button"
                            onClick={() => setActiveMenuMsgId(activeMenuMsgId === msg.id ? null : msg.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xs"
                            title="Tùy chọn tin nhắn"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {activeMenuMsgId === msg.id && (
                            <div className={`absolute ${menuPosClass} left-0 w-44 bg-white border-2 border-[#0f172a] rounded-2xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] py-1.5 px-1 z-50 text-slate-900 animate-in zoom-in-95`}>
                              <button
                                type="button"
                                onClick={() => handleShareMessage(msg)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold hover:bg-slate-100 rounded-xl cursor-pointer transition-colors text-left"
                              >
                                <Share2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>Chia sẻ</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(msg.id, 'me')}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-bold hover:bg-slate-100 rounded-xl cursor-pointer transition-colors text-left text-slate-700"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>Xóa chỉ mình tôi</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {msg.isMe && (
                        isLastInGroup ? (
                          <img 
                            src={currentUser?.anh_dai_dien || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} 
                            alt="me" 
                            className="w-8 h-8 rounded-full object-cover border-2 border-[#0f172a] shrink-0 mt-1 shadow-2xs"
                          />
                        ) : (
                          <div className="w-8 h-8 shrink-0 mt-1"></div>
                        )
                      )}

                    </div>
                  );
                })}
                
                {typingStatus && (
                  <div className="flex items-end gap-3 self-start mb-6 w-full animate-fadeIn">
                    <img src={activeContact.avatar} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                    <div className="bg-white rounded-2xl rounded-bl-sm py-3 px-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                
                <div ref={messageContainerRef} />
              </div>

              <div className="relative shrink-0">
                {activeContact.isBlockedByMe ? (
                  <div className="flex flex-col items-center justify-center p-3 bg-red-50 border-2 border-red-200 rounded-2xl text-center shadow-2xs">
                    <p className="text-red-600 font-black text-sm m-0 mb-2">Bạn đã chặn người này.</p>
                    <button 
                      onClick={() => handleToggleBlock(activeContact.id, activeContact.name, true)}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-sm transition-colors border-none"
                    >
                      Bỏ chặn ngay
                    </button>
                  </div>
                ) : activeContact.isBlockedByPartner ? (
                  <div className="flex items-center justify-center p-4 bg-slate-100 border-2 border-slate-200 rounded-2xl text-center shadow-2xs">
                    <p className="text-slate-500 font-black text-sm m-0">Người này hiện không thể nhận tin nhắn.</p>
                  </div>
                ) : (
                  <>
                    {showEmojiPicker && (
                      <div className="absolute bottom-14 left-0 bg-white border-2 border-[#0f172a] rounded-3xl p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] z-50 flex flex-wrap gap-1.5 text-xl bg-slate-50 animate-in fade-in zoom-in-95 max-w-xs">
                        {['😄', '❤️', '🔥', '👍', '💯', '👏', '🎁', '✨', '☕', '🚀', '😍', '🎉', '🌟', '🤗'].map((e, i) => (
                          <button key={i} type="button" onClick={() => insertEmoji(e)} className="p-1.5 hover:bg-slate-200 rounded-xl cursor-pointer bg-transparent border-none transition-transform hover:scale-125">
                            {e}
                          </button>
                        ))}
                      </div>
                    )}

                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2 sm:gap-2.5">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoSelect} 
                        accept="image/*" 
                        multiple
                        className="hidden" 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        title="Gửi ảnh thực tế trải nghiệm"
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#0f172a] flex items-center justify-center bg-white hover:bg-slate-100 transition-colors cursor-pointer text-slate-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] shrink-0"
                      >
                        <Image size={18} />
                      </button>

                      <button 
                        type="button" 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        title="Chọn Emoji cảm xúc"
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#0f172a] flex items-center justify-center transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] shrink-0 ${showEmojiPicker ? 'bg-amber-300 text-slate-900' : 'bg-white text-slate-800 hover:bg-slate-100'}`}
                      >
                        <Smile size={18} />
                      </button>

                      <textarea
                        value={inputText}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={`Nhắn cho ${activeContact.name}...`}
                        className="flex-1 bg-white py-2.5 sm:py-3 px-5 rounded-full border-2 border-[#0f172a] font-black text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] resize-none leading-relaxed"
                        rows="1"
                      />

                      <button 
                        type="submit"
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#0f172a] bg-[#c93638] hover:bg-[#a82527] text-white flex items-center justify-center cursor-pointer transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 shrink-0"
                      >
                        <Send size={17} className="-ml-0.5" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </>
          )}

        </div>

        {showRightSidebar && activeContact.id && (
          <div className={`${showRightSidebar ? 'fixed inset-0 z-50 m-4 flex' : 'hidden'} xl:relative xl:inset-auto xl:m-0 xl:z-auto xl:flex xl:col-span-3 border-2 border-[#0f172a] rounded-[28px] p-5 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex-col h-full max-h-full min-h-0 overflow-y-auto scrollbar-thin animate-in slide-in-from-right duration-200`}>
            
            <div className="text-center pb-5 border-b-2 border-slate-100 mb-5 relative">
              <button 
                onClick={() => setShowRightSidebar(false)}
                className="xl:hidden absolute left-0 top-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors border-2 border-[#0f172a]"
              >
                <Trash2 size={14} className="opacity-0 hidden" />
                <span className="font-black text-sm text-[#c93638]">X</span>
              </button>
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img 
                  src={activeContact.avatar} 
                  alt={activeContact.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#0f172a] shadow-sm cursor-pointer"
                  onClick={() => navigate(`/profile/${activeContact.id}`)}
                />
                {activeContact.online ? (
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-xs"></span>
                ) : (
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-[#e8f5e9] text-[#1a7f37] border-2 border-white rounded-full font-black text-xs leading-none whitespace-nowrap shadow-xs">
                    {activeContact.lastSeenPill || 'Offline'}
                  </span>
                )}
              </div>
              
              <h3 
                onClick={() => navigate(`/profile/${activeContact.id}`)}
                className="font-black text-lg text-slate-900 m-0 flex items-center justify-center gap-1.5 cursor-pointer hover:underline"
              >
                <span>{activeContact.name}</span>
                {activeContact.isVerified && (
                  <Shield size={18} className="text-[#c93638] fill-[#fcebeb]" />
                )}
              </h3>
              
              <span className="inline-block px-3 py-1 rounded-full bg-[#fff5f5] text-[#c93638] font-black text-xs border border-[#fcebeb] my-1.5">
                {activeContact.roleTitle}
              </span>

              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold mb-4">
                {activeContact.online ? (
                  <span className="text-emerald-600 font-extrabold">● Đang hoạt động trên Club</span>
                ) : (
                  <span className="text-slate-400 font-extrabold">● {activeContact.lastSeenPill === 'Offline' ? 'Offline' : `Ngoại tuyến (${activeContact.lastSeenPill || 'Vừa rời đi'})`}</span>
                )}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => navigate(`/profile/${activeContact.id}`)}
                  className="flex flex-col items-center gap-1 text-slate-700 hover:text-slate-950 font-black text-[11px] bg-transparent border-none cursor-pointer group"
                >
                  <span className="w-10 h-10 rounded-2xl border-2 border-[#0f172a] bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center shadow-2xs">
                    <User size={18} />
                  </span>
                  <span>Trang cá nhân</span>
                </button>

                <button 
                  onClick={() => showAlert('Đã bật chế độ ưu tiên nhận thông báo từ thành viên này!', 'Thành công', 'success')}
                  className="flex flex-col items-center gap-1 text-slate-700 hover:text-slate-950 font-black text-[11px] bg-transparent border-none cursor-pointer group"
                >
                  <span className="w-10 h-10 rounded-2xl border-2 border-[#0f172a] bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center shadow-2xs">
                    <Bell size={18} />
                  </span>
                  <span>Thông báo</span>
                </button>

                <button 
                  onClick={() => showAlert('Đã ghim hội thoại này lên vị trí ưu tiên số 1!', 'Thành công', 'success')}
                  className="flex flex-col items-center gap-1 text-slate-700 hover:text-slate-950 font-black text-[11px] bg-transparent border-none cursor-pointer group"
                >
                  <span className="w-10 h-10 rounded-2xl border-2 border-[#0f172a] bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center shadow-2xs">
                    <Pin size={18} />
                  </span>
                  <span>Ghim chat</span>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <button
                onClick={() => toggleSection('product')}
                className="w-full flex items-center justify-between py-2 bg-transparent border-none cursor-pointer font-black text-slate-900 text-xs uppercase tracking-wider text-left"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={16} className="text-[#c93638]" />
                  <span>SẢN PHẨM QUAN Tâm</span>
                </span>
                {openSections.product ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {openSections.product && (
                <div className="mt-2 p-3.5 rounded-2xl bg-slate-50 border-2 border-[#0f172a] shadow-2xs">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Đang trao đổi về</span>
                  <p className="font-black text-slate-900 text-sm m-0">{activeContact.product || 'Trao đổi trải nghiệm'}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/80">
                    <span className="text-xs font-black text-[#c93638]">{activeContact.productPrice || 'Thảo luận riêng'}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">✓ Club Verified</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <button
                onClick={() => toggleSection('media')}
                className="w-full flex items-center justify-between py-2 bg-transparent border-none cursor-pointer font-black text-slate-900 text-xs uppercase tracking-wider text-left"
              >
                <span className="flex items-center gap-2">
                  <Image size={16} className="text-[#c93638]" />
                  <span>HÌNH ẢNH & CHI TIẾT ({activeContact.sharedMedia?.length || 0})</span>
                </span>
                {openSections.media ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {openSections.media && (
                <div className="mt-2">
                  {(!activeContact.sharedMedia || activeContact.sharedMedia.length === 0) ? (
                    <p className="text-xs text-slate-400 font-bold italic py-2 m-0 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      Chưa có hình ảnh nào được chia sẻ
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {activeContact.sharedMedia.slice(0, 6).map((imgUrl, i) => {
                        const isLastVisible = i === 5;
                        const remainingCount = activeContact.sharedMedia.length - 6;
                        
                        return (
                          <div 
                            key={i}
                            className="relative w-full h-20 rounded-xl border border-[#0f172a] shadow-2xs overflow-hidden cursor-pointer group"
                            onClick={() => {
                              if (isLastVisible && remainingCount > 0) {
                                setShowGallery(true);
                              } else {
                                window.open(imgUrl, '_blank');
                              }
                            }}
                          >
                            <img 
                              src={imgUrl} 
                              alt="shared" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                            {isLastVisible && remainingCount > 0 && (
                              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[2px]">
                                <span className="text-white font-black text-lg">+{remainingCount}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-4">
              <button
                onClick={() => toggleSection('privacy')}
                className="w-full flex items-center justify-between py-2 bg-transparent border-none cursor-pointer font-black text-slate-900 text-xs uppercase tracking-wider text-left"
              >
                <span className="flex items-center gap-2">
                  <Lock size={16} className="text-[#c93638]" />
                  <span>BẢO MẬT & QUYỀN RIÊNG TƯ</span>
                </span>
                {openSections.privacy ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {openSections.privacy && (
                <div className="mt-2 space-y-2">
                  <div className="p-3 rounded-xl bg-[#fcebeb]/60 border border-[#fcebeb] text-slate-800 text-xs font-bold flex items-center gap-2">
                    <Shield size={18} className="text-[#c93638] shrink-0" />
                    <span>Hội thoại được bảo vệ bởi lớp mã hóa end-to-end của Club Trải Nghiệm.</span>
                  </div>

                  <button 
                    onClick={() => handleToggleBlock(activeContact.id, activeContact.name, activeContact.isBlockedByMe)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-xs flex items-center justify-center gap-2 bg-white cursor-pointer transition-colors"
                  >
                    <AlertCircle size={15} />
                    <span>{activeContact.isBlockedByMe ? 'Bỏ chặn người này' : 'Chặn người này'}</span>
                  </button>

                  <button 
                    onClick={togglePartnerOnline}
                    className={`w-full py-2.5 px-3 rounded-xl border-2 border-[#0f172a] font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-2xs ${activeContact.online ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'}`}
                  >
                    <Sparkles size={16} />
                    <span>Test Realtime Presence ({activeContact.online ? 'Chuyển Offline' : 'Bật Online 🟢'})</span>
                  </button>

                  <button 
                    onClick={() => handleDeleteConversation(activeContact.id, activeContact.name)}
                    className="w-full py-2.5 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-[#c93638] font-black text-xs flex items-center justify-center gap-2 bg-white cursor-pointer transition-colors"
                  >
                    <Trash2 size={15} />
                    <span>Xóa lịch sử trò chuyện này</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest m-0">
                ⚡ CLUB TRẢI NGHIỆM CHAT 2026
              </p>
            </div>

          </div>
        )}

      </div>

      <ConfirmModal
        isOpen={!!confirmConfig?.isOpen}
        onClose={() => setConfirmConfig(null)}
        onConfirm={() => {
          if (confirmConfig?.onConfirm) confirmConfig.onConfirm();
          setConfirmConfig(null);
        }}
        title={confirmConfig?.title || 'Xác Nhận Thao Tác'}
        message={confirmConfig?.message || ''}
        confirmText={confirmConfig?.confirmText || 'Xác nhận'}
        variant={confirmConfig?.variant || 'danger'}
        hideCancel={confirmConfig?.hideCancel || false}
      />

      <Modal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        title={`Kho Ảnh của ${activeContact?.name || ''}`}
        icon={Image}
        iconColor="text-blue-600"
        iconBg="bg-blue-50 border-blue-100"
        size="lg"
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto scrollbar-thin pr-1 pt-1 pb-4">
          {activeContact?.sharedMedia?.map((imgUrl, i) => (
            <img 
              key={i} 
              src={imgUrl} 
              alt="shared" 
              onClick={() => window.open(imgUrl, '_blank')}
              className="w-full h-24 object-cover rounded-xl border-2 border-slate-200 shadow-sm cursor-pointer hover:border-[#c93638] transition-colors"
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Messages;
