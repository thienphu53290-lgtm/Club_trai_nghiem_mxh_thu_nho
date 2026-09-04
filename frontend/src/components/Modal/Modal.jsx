import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  icon: Icon,
  iconColor = 'text-[#c93638]',
  iconBg = 'bg-rose-50 border-rose-100',
  size = 'md',
  children,
  footer,
  showCloseButton = true,
  className = '',
  closeOnBackdropClick = true
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[92vw]'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  return createPortal(
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fadeIn"
    >
      <div className={`bg-white rounded-[28px] sm:rounded-[32px] border border-slate-200 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] w-full ${sizeClasses[size] || 'max-w-xl'} flex flex-col max-h-[90vh] overflow-hidden transform transition-all ${className}`}>
        
        {(title || showCloseButton) && (
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 shrink-0">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className={`w-10 h-10 rounded-2xl ${iconBg} border flex items-center justify-center shrink-0 shadow-xs`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
              )}
              {title && (
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight m-0">
                  {title}
                </h3>
              )}
            </div>
            {showCloseButton && onClose && (
              <button 
                onClick={onClose}
                type="button"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1 text-slate-700 font-normal space-y-4">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};

export default Modal;
