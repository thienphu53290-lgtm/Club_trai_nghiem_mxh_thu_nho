import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Trash2, HelpCircle, CheckCircle2, Info } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác Nhận Thao Tác',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này không?',
  variant = 'danger',
  confirmText = 'Xác nhận xóa',
  cancelText = 'Hủy bỏ',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: Trash2,
          iconColor: 'text-rose-600',
          iconBg: 'bg-rose-50 border-rose-200',
          badgeText: 'Cảnh Báo Thao Tác Không Thể Khôi Phục',
          badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
          buttonBg: 'bg-[#c93638] hover:bg-[#a82527] text-white shadow-[0_4px_12px_rgba(201,54,56,0.35)]'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          iconBg: 'bg-amber-50 border-amber-200',
          badgeText: 'Lưu Ý Trước Khi Quyết Định',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-[0_4px_12px_rgba(217,119,6,0.35)]'
        };
      case 'success':
        return {
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          iconBg: 'bg-emerald-50 border-emerald-200',
          badgeText: 'Thao Tác Tích Cực',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_12px_rgba(5,150,105,0.35)]'
        };
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-50 border-blue-200',
          badgeText: 'Thông Tin Thẩm Định',
          badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
          buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_12px_rgba(37,99,235,0.35)]'
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={config.icon}
      iconColor={config.iconColor}
      iconBg={config.iconBg}
      size="sm"
      footer={
        <div className="w-full flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            disabled={isLoading}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            type="button"
            disabled={isLoading}
            className={`px-6 py-2.5 ${config.buttonBg} font-extrabold text-xs rounded-xl transition-all border-none cursor-pointer flex items-center gap-2 disabled:opacity-50`}
          >
            {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            <span>{confirmText}</span>
          </button>
        </div>
      }
    >
      <div className="text-slate-800 py-1 space-y-4">
        <div className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full border ${config.badgeBg}`}>
          <span>⚡ {config.badgeText}</span>
        </div>
        <p className="text-sm text-slate-600 font-medium leading-relaxed m-0">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
