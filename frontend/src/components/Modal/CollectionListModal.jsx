import React from 'react';
import Modal from './Modal';
import { FolderHeart } from 'lucide-react';

const CollectionListModal = ({ isOpen, onClose, collections = [], onSelectCollection }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tất Cả Bộ Sưu Tập" maxWidth="max-w-2xl">
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {collections.map((col, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                if (onSelectCollection) onSelectCollection(col);
              }}
              className="border-2 border-slate-200 rounded-[24px] p-4 bg-white hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="h-32 rounded-xl overflow-hidden bg-slate-900 mb-3 relative">
                  <img src={col.anh_bia} alt={col.ten_bo_suu_tap} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/70 text-amber-300 font-black text-[10px] px-2 py-1 rounded-full backdrop-blur-md border border-white/20">
                    🌟 {col.so_luong} món đồ
                  </div>
                </div>
                <h3 className="font-black text-base text-slate-900 leading-tight mb-2 line-clamp-2">
                  {col.ten_bo_suu_tap}
                </h3>
                <div className="space-y-1">
                  {col.items && col.items.slice(0, 2).map((item, i) => (
                    <p key={i} className="text-[11px] font-bold text-slate-500 bg-slate-50 p-1.5 rounded-md truncate m-0">
                      • {item.tieu_de}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default CollectionListModal;
