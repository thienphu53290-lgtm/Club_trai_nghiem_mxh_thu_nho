import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Bookmark, FolderPlus, Sparkles, FolderHeart, Plus } from 'lucide-react';
import api from '../../api/axios';

const SavePostModal = ({ isOpen, onClose, onSave, isLoading = false }) => {
  const [newCollectionName, setNewCollectionName] = useState('');
  const [existingCollections, setExistingCollections] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewCollectionName('');
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    setFetching(true);
    try {
      const res = await api.get('/feed/collections');
      if (res.data && res.data.status === 'success') {
        setExistingCollections(res.data.collections || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách bộ sưu tập:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      onSave(newCollectionName.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lưu Bài Viết" maxWidth="max-w-md">
      <div className="p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 shadow-sm relative">
            <Bookmark size={28} className="text-indigo-600 fill-indigo-100" />
            <div className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 p-1.5 rounded-full border border-white shadow-sm">
              <Sparkles size={12} />
            </div>
          </div>
          <h3 className="font-black text-xl text-slate-900 mb-2">Thêm Vào Bộ Sưu Tập</h3>
          <p className="text-sm font-medium text-slate-500">Chọn một bộ sưu tập có sẵn hoặc tạo mới.</p>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <FolderHeart size={14} className="text-indigo-600" /> Các Bộ Sưu Tập Đã Có
          </label>
          
          {fetching ? (
            <div className="flex justify-center p-4">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : existingCollections.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
              {existingCollections.map((colName, idx) => (
                <button
                  key={idx}
                  onClick={() => onSave(colName)}
                  disabled={isLoading}
                  className="w-full p-3.5 border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 bg-white hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all text-left flex items-center justify-between group"
                >
                  <span className="truncate">{colName}</span>
                  <Bookmark size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
              <p className="text-sm font-medium text-slate-500">Sếp chưa có bộ sưu tập nào.</p>
            </div>
          )}
        </div>

        <form onSubmit={handleCreateNew} className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <FolderPlus size={14} className="text-indigo-600" /> Hoặc Tạo Mới
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCollectionName} 
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Tên bộ sưu tập mới..."
                className="flex-1 p-3.5 border border-slate-200 rounded-2xl font-semibold text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
              <button 
                type="submit" 
                disabled={isLoading || !newCollectionName.trim()}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} /> Tạo
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SavePostModal;
