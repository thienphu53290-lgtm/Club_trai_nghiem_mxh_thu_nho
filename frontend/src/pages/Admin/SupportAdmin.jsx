import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MessageCircle, Send, Search, Phone, Video, MoreVertical, CheckCircle2, ShieldCheck } from 'lucide-react';

const SupportAdmin = () => {
  const context = useOutletContext();
  const activeTabContext = context?.activeTab;
  const showNotification = context?.showNotification || (() => {});
  
  const isEmbedded = !['livechat', 'tickets', 'faq'].includes(activeTabContext);
  const [localTab, setLocalTab] = useState('livechat');
  const currentTab = isEmbedded ? localTab : activeTabContext;

  const handleTabChange = (tab) => {
    if (isEmbedded) setLocalTab(tab);
    else if (context?.setActiveTab) context.setActiveTab(tab);
  };

  // MOCK DATA: Danh sách chat
  const [activeChat, setActiveChat] = useState(1);
  const chatList = [
    { id: 1, name: 'Nguyễn Trần Vy', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', lastMsg: 'Mình không nạp được gói VIP ạ...', time: '2p trước', unread: 2 },
    { id: 2, name: 'Lê Hoàng Phong', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', lastMsg: 'Sự kiện tối nay mấy giờ bắt đầu?', time: '15p trước', unread: 0 },
    { id: 3, name: 'Phạm Thị Cúc', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', lastMsg: 'Cảm ơn ad nhiều nhé!', time: '1h trước', unread: 0 },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    showNotification('Đã gửi tin nhắn phản hồi cho khách hàng!');
    e.target.reset();
  };

  const renderLiveChatTab = () => (
    <div className="w-full flex h-[70vh] bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-hidden animate-slideUp mt-6">
      {/* SIDEBAR DANH SÁCH CHAT */}
      <div className="w-1/3 border-r-4 border-[#0f172a] flex flex-col bg-slate-50">
        <div className="p-4 border-b-4 border-[#0f172a] bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm user hoặc mã ticket..." 
              className="w-full bg-slate-100 border-2 border-[#0f172a] rounded-xl py-2.5 pl-10 pr-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatList.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-center gap-3 p-4 border-b-2 border-[#0f172a] cursor-pointer transition-colors ${
                activeChat === chat.id ? 'bg-pink-100' : 'hover:bg-pink-50'
              }`}
            >
              <div className="relative shrink-0">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full border-2 border-[#0f172a] object-cover" />
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-black rounded-full border-2 border-[#0f172a] flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-black text-slate-900 text-sm truncate">{chat.name}</h4>
                  <span className="text-xs font-bold text-slate-500">{chat.time}</span>
                </div>
                <p className={`text-xs truncate ${chat.unread > 0 ? 'font-black text-slate-900' : 'font-bold text-slate-500'}`}>
                  {chat.lastMsg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KHUNG CHAT CHÍNH */}
      <div className="w-2/3 flex flex-col bg-slate-50">
        <div className="p-4 border-b-4 border-[#0f172a] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={chatList.find(c => c.id === activeChat)?.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-[#0f172a] object-cover" />
            <div>
              <h3 className="font-black text-slate-900">{chatList.find(c => c.id === activeChat)?.name}</h3>
              <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Đang hoạt động
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-600 border-2 border-[#0f172a] flex items-center justify-center transition-colors">
              <Phone size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border-2 border-[#0f172a] flex items-center justify-center transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {/* Mock messages */}
          <div className="flex items-start gap-3">
            <img src={chatList.find(c => c.id === activeChat)?.avatar} className="w-8 h-8 rounded-full border-2 border-[#0f172a]" alt="" />
            <div className="bg-white border-2 border-[#0f172a] rounded-2xl rounded-tl-none p-3 max-w-[70%] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <p className="text-sm font-semibold text-slate-800">Chào Admin, mình vừa chuyển khoản mua gói VIP 1 năm nhưng tài khoản chưa được nâng cấp. Nhờ check giúp mình nhé!</p>
              <span className="text-[10px] text-slate-400 font-bold mt-1 block">10:42 AM</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <img src={chatList.find(c => c.id === activeChat)?.avatar} className="w-8 h-8 rounded-full border-2 border-[#0f172a]" alt="" />
            <div className="bg-white border-2 border-[#0f172a] rounded-2xl rounded-tl-none p-3 max-w-[70%] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <img src="https://images.unsplash.com/photo-1614064007886-d24b61b7f2b9?w=300&auto=format&fit=crop&q=80" alt="Bill" className="rounded-xl border-2 border-slate-200 mt-1" />
              <span className="text-[10px] text-slate-400 font-bold mt-1 block">10:43 AM</span>
            </div>
          </div>
          
          {/* Admin reply mock */}
          <div className="flex items-start gap-3 flex-row-reverse mt-2">
            <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-[#0f172a] flex items-center justify-center text-white shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div className="bg-pink-400 border-2 border-[#0f172a] text-slate-900 rounded-2xl rounded-tr-none p-3 max-w-[70%] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <p className="text-sm font-bold">Dạ chào bạn, hệ thống bên mình đã ghi nhận giao dịch. Mình sẽ kích hoạt gói VIP thủ công cho bạn ngay bây giờ nhé. Xin lỗi bạn vì sự bất tiện này ạ!</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-slate-800 font-bold">10:45 AM</span>
                <CheckCircle2 size={12} className="text-slate-900" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t-4 border-[#0f172a]">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nhập phản hồi..." 
              className="flex-1 bg-slate-100 border-2 border-[#0f172a] rounded-xl px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <button type="submit" className="w-12 h-12 bg-pink-500 hover:bg-pink-400 text-white rounded-xl border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
              <Send size={20} className="ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title) => (
    <div className="bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-12 text-center mt-10">
      <h2 className="text-3xl font-black text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-500 font-bold text-lg">Tính năng đang được phát triển...</p>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-4 border-b-4 border-slate-900">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">
            {currentTab === 'livechat' && 'Live Chat Hỗ Trợ Khách Hàng'}
            {currentTab === 'tickets' && 'Quản lý Khiếu nại (Tickets)'}
            {currentTab === 'faq' && 'Cập nhật Ngân hàng Câu hỏi'}
          </h1>
          <p className="text-slate-500 font-bold text-sm sm:text-base m-0">
            Kết nối và giải quyết vấn đề của người dùng một cách nhanh chóng.
          </p>
        </div>

        {isEmbedded && (
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'livechat', label: 'Live Chat' },
              { id: 'tickets', label: 'Tickets' },
              { id: 'faq', label: 'FAQ' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`px-5 py-2.5 rounded-xl font-black text-sm border-2 border-slate-900 transition-all cursor-pointer ${
                  currentTab === t.id 
                    ? 'bg-pink-400 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px]' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {currentTab === 'livechat' && renderLiveChatTab()}
      {currentTab === 'tickets' && renderPlaceholder('Hệ thống Ticket Khiếu nại')}
      {currentTab === 'faq' && renderPlaceholder('Chỉnh sửa Trang FAQ')}
    </div>
  );
};

export default SupportAdmin;
