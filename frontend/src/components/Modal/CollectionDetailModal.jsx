import React, { useState } from 'react';
import Modal from './Modal';
import { Layers, Calendar, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CollectionDetailModal = ({ isOpen, onClose, collection }) => {
  const navigate = useNavigate();

  if (!isOpen || !collection) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={collection.ten_bo_suu_tap} maxWidth="max-w-4xl">
      <div className="p-6 bg-slate-50/50 min-h-[50vh] max-h-[75vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-slate-200">
            <img src={collection.anh_bia} alt="Bìa" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-black text-2xl text-slate-900 mb-1">{collection.ten_bo_suu_tap}</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <span className="flex items-center gap-1"><Layers size={16} /> {collection.so_luong} bài viết</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collection.items && collection.items.map((item, idx) => {
            return (
            <div 
              key={idx} 
              onClick={() => {
                onClose();
                navigate('/feed', { state: { scrollToPostId: item.id } });
              }}
              className="bg-white border-2 border-slate-200 rounded-[28px] overflow-hidden hover:border-indigo-400 transition-colors shadow-sm flex flex-col cursor-pointer"
            >
              {item.anh_minh_hoa && (
                <div className="h-48 w-full relative bg-slate-900">
                  <img src={item.anh_minh_hoa} alt={item.tieu_de || 'Ảnh'} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-black text-lg text-slate-900 mb-2 leading-tight">
                  {item.tieu_de || 'Bài viết không tiêu đề'}
                </h3>
                
                <div className={`text-sm text-slate-600 mb-4 flex-1 whitespace-pre-line line-clamp-3`}>
                  {item.noi_dung || ''}
                </div>
                
                {item.hashtags && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {JSON.parse(item.hashtags || '[]').map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> 
                    {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' }).format(new Date(item.saved_at || item.created_at))}
                  </span>
                  <span className="flex items-center gap-1 text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                    <Package size={12} /> Đã lưu
                  </span>
                </div>
              </div>
            </div>
          )})}
        </div>
        
        {(!collection.items || collection.items.length === 0) && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-medium">Bộ sưu tập này chưa có bài viết nào.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CollectionDetailModal;
