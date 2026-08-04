import React from 'react';
import Modal from './Modal';
import { Edit3, Check } from 'lucide-react';

const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Chỉnh Sửa Thông Tin',
  icon = Edit3,
  iconColor = 'text-amber-600',
  iconBg = 'bg-amber-50 border-amber-200',
  size = 'lg',
  tabs = [],
  activeTab,
  onTabChange,
  children,
  submitText = 'Lưu thay đổi',
  cancelText = 'Hủy bỏ',
  isSaving = false,
  submitDisabled = false,
  successMessage = ''
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={icon}
      iconColor={iconColor}
      iconBg={iconBg}
      size={size}
      className="!p-0"
      footer={
        <div className="w-full flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm rounded-xl transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            form="form-modal-body"
            disabled={isSaving || submitDisabled}
            className="px-8 py-3 bg-[#c93638] hover:bg-[#a82527] text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-[0_4px_14px_rgba(201,54,56,0.3)] hover:shadow-[0_2px_8px_rgba(201,54,56,0.4)] border-none cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>{submitText}</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="flex flex-col flex-1">
        {tabs && tabs.length > 0 && (
          <div className="flex border-b border-slate-200/80 px-6 bg-slate-50/70 gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange && onTabChange(tab.id)}
                className={`py-3.5 px-2 font-extrabold text-xs sm:text-sm border-none bg-transparent cursor-pointer transition-all border-b-[3px] flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-[#c93638] border-[#c93638]'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        <form id="form-modal-body" onSubmit={onSubmit} className="p-6 space-y-5 overflow-y-auto">
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-black text-sm text-center shadow-xs animate-fadeIn flex items-center justify-center gap-2">
              <Check size={18} className="text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {children}
        </form>
      </div>
    </Modal>
  );
};

export default FormModal;
