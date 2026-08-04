import React from 'react';
import Modal from './Modal';
import { Image, ExternalLink, Download, Maximize2 } from 'lucide-react';

const ImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  title = 'Chi Tiết Hình Ảnh',
  caption,
  downloadable = true
}) => {
  if (!imageUrl && !isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = title || 'image-download';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={Image}
      iconColor="text-blue-600"
      iconBg="bg-blue-50 border-blue-100"
      size="xl"
      className="!p-0"
    >
      <div className="flex flex-col items-center justify-center bg-slate-950 rounded-2xl overflow-hidden min-h-[320px] max-h-[70vh] border border-slate-200/80 relative group">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-auto max-h-[70vh] object-contain transition-transform duration-300 group-hover:scale-[1.01]" 
        />
        
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-sm transition-transform hover:scale-105 no-underline flex items-center justify-center"
            title="Mở trong tab mới"
          >
            <ExternalLink size={16} />
          </a>
          {downloadable && (
            <button
              onClick={handleDownload}
              type="button"
              className="p-2 bg-white/90 hover:bg-white text-[#c93638] rounded-xl shadow-sm transition-transform hover:scale-105 border-none cursor-pointer flex items-center justify-center"
              title="Tải ảnh về máy"
            >
              <Download size={16} />
            </button>
          )}
        </div>
      </div>

      {caption && (
        <div className="mt-4 px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-3">
          <Maximize2 size={18} className="text-slate-400 shrink-0" />
          <p className="text-sm font-semibold text-slate-700 m-0 leading-relaxed">
            {caption}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default ImageModal;
