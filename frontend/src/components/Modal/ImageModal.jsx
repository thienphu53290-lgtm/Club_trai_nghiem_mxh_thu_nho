import React from 'react';
import Modal from './Modal';
import { Image, ExternalLink, Download, Maximize2 } from 'lucide-react';

const ImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  images = [],
  initialIndex = 0,
  title = 'Chi Tiết Hình Ảnh',
  caption,
  downloadable = true
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const displayImages = imageUrl ? [imageUrl] : images;
  if (!isOpen || displayImages.length === 0) return null;

  const currentImage = displayImages[currentIndex];
  
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
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
          src={currentImage} 
          alt={title} 
          className="w-full h-auto max-h-[70vh] object-contain transition-transform duration-300 group-hover:scale-[1.01]" 
        />
        
        {displayImages.length > 1 && (
          <>
            <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all border-none cursor-pointer flex items-center justify-center z-10 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all border-none cursor-pointer flex items-center justify-center z-10 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </>
        )}

        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <a
            href={currentImage}
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

      {(caption || displayImages.length > 1) && (
        <div className="mt-4 px-4 py-3 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-3">
          <Maximize2 size={18} className="text-slate-400 shrink-0" />
          <p className="text-sm font-semibold text-slate-700 m-0 leading-relaxed">
            {displayImages.length > 1 ? `Ảnh ${currentIndex + 1} / ${displayImages.length} - PIVO` : caption}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default ImageModal;
