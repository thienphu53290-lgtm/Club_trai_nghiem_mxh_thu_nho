import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Flag } from 'lucide-react';

const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Báo Cáo Nội Dung',
  message = 'Vui lòng cho chúng tôi biết lý do bạn báo cáo nội dung này.',
  isLoading = false
}) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const predefinedReasons = [
    'Spam hoặc Lừa đảo',
    'Nội dung phản cảm, không phù hợp',
    'Quấy rối hoặc bắt nạt',
    'Thông tin sai lệch',
    'Khác'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalReason = reason;
    if (reason === 'Khác') {
        finalReason = customReason.trim();
    }
    
    if (!finalReason) {
      setError('Vui lòng chọn hoặc nhập lý do báo cáo.');
      return;
    }
    setError('');
    onSubmit(finalReason);
  };

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setReason('');
      setCustomReason('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={Flag}
      iconColor="text-rose-600"
      iconBg="bg-rose-50 border-rose-200"
      size="sm"
      footer={
        <div className="w-full flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            disabled={isLoading}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={isLoading}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white shadow-[0_4px_12px_rgba(225,29,72,0.35)] font-extrabold text-xs rounded-xl transition-all border-none cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            <span>Gửi báo cáo</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="text-slate-800 py-1 space-y-5">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full border bg-rose-50 text-rose-800 border-rose-200">
          <span>⚡ Cảnh báo an toàn cộng đồng</span>
        </div>
        
        <p className="text-sm text-slate-600 font-medium leading-relaxed m-0">
          {message}
        </p>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-700">Lý do báo cáo:</label>
          <div className="flex flex-col gap-2">
            {predefinedReasons.map((r, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                <input 
                  type="radio" 
                  name="reportReason" 
                  value={r} 
                  checked={reason === r} 
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-rose-600 border-slate-300 focus:ring-rose-500"
                />
                <span className="text-sm font-medium text-slate-700">{r}</span>
              </label>
            ))}
          </div>
          
          {reason === 'Khác' && (
            <textarea
              className="w-full mt-2 p-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
              rows={3}
              placeholder="Nhập chi tiết lý do vi phạm..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </div>

        {error && <p className="text-rose-500 text-xs font-bold mt-1 m-0 animate-slideUp">{error}</p>}
      </form>
    </Modal>
  );
};

export default ReportModal;
