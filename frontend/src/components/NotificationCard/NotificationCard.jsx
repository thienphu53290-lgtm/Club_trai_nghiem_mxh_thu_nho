import React from 'react';

const NotificationCard = ({ notification, onClick, onClose, isToast = false }) => {
  if (!notification) return null;

  const { title, message, time = 'Vừa xong', badge = 'THÔNG BÁO CLUB' } = notification;

  if (isToast) {
    return (
      <div className="fixed bottom-6 right-6 bg-white border-2 border-[#0f172a] p-4 rounded-[24px] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] z-[9999] max-w-[360px] w-full flex items-start gap-3.5 animate-bounce">
        <div className="w-10 h-10 rounded-full bg-[#fcebeb] border border-[#c93638]/40 flex items-center justify-center text-[#c93638] font-extrabold text-lg shrink-0 shadow-sm">
          ⚡
        </div>
        <div className="flex-1 min-w-0" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
          <div className="flex justify-between items-center gap-2 mb-1">
            <span className="font-extrabold text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider truncate">{badge}</span>
            <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap shrink-0">{time}</span>
          </div>
          <strong className="text-slate-900 font-extrabold text-[0.98rem] block mb-1 truncate">{title}</strong>
          <p className="text-slate-600 font-medium text-xs leading-relaxed m-0 line-clamp-2">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 bg-transparent border-none cursor-pointer text-base font-extrabold p-0 shrink-0">✕</button>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={onClick} 
      className="p-3.5 bg-[#fff5f5] border border-[#fcebeb] rounded-2xl transition-colors cursor-pointer hover:bg-[#fbdada] w-full text-left"
    >
      <div className="flex justify-between items-start gap-2 mb-1">
        <strong className="text-slate-900 font-extrabold text-sm leading-snug flex-1 truncate">{title}</strong>
        <span className="text-[11px] font-extrabold text-[#c93638] bg-white px-2.5 py-0.5 rounded-full border border-[#f3a4a4] whitespace-nowrap shrink-0">{time}</span>
      </div>
      <p className="text-slate-700 font-medium text-xs leading-relaxed m-0 line-clamp-2">{message}</p>
    </div>
  );
};

export default NotificationCard;
