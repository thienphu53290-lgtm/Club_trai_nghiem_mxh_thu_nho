import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, UserCheck, Search, ChevronRight } from 'lucide-react';
import api from '../../api/axios';

const Friends = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [connections, setConnections] = useState({
    friends: [],
    following: [],
    followers: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await api.get('/users/connections');
      if (response.data.status) {
        setConnections(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách bạn bè:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await api.post(`/users/${userId}/follow`);
      fetchConnections(); // Refresh danh sách sau khi thao tác
      window.dispatchEvent(new Event('user_auth_change')); // Trigger update cho toàn bộ app
    } catch (error) {
      console.error("Lỗi khi thao tác:", error);
    }
  };

  const currentList = connections[activeTab] || [];
  const filteredList = currentList.filter(user => 
    user.ten_hien_thi?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.ho_ten?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionBtn = (user) => {
    if (user.is_mutual) {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); handleFollow(user.id); }}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-200"
        >
          Hủy kết bạn
        </button>
      );
    }
    
    if (user.is_following) {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); handleFollow(user.id); }}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors border border-rose-200"
        >
          Hủy theo dõi
        </button>
      );
    }

    if (user.is_follower) {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); handleFollow(user.id); }}
          className="px-4 py-2 bg-[#c93638] hover:bg-[#a82527] text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
        >
          Theo dõi lại
        </button>
      );
    }

    return (
      <button 
        onClick={(e) => { e.stopPropagation(); handleFollow(user.id); }}
        className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
      >
        Kết nối
      </button>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c93638]/30 border-t-[#c93638] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[800px] mx-auto py-6 sm:py-10 px-4 sm:px-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-xs mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-60"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-rose-100 text-[#c93638]">
                <Users size={28} strokeWidth={2.5} />
              </span>
              Kết nối & Bạn bè
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">
              Những người bạn theo dõi chéo nhau sẽ trở thành Bạn Bè chính thức tại Club Trải Nghiệm.
            </p>
          </div>

          <div className="relative w-full sm:w-auto min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200 text-slate-700 text-sm font-bold px-12 py-3.5 rounded-2xl outline-none focus:border-rose-400 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden gap-3 mb-6 bg-white p-2 rounded-2xl border border-slate-200/60 shadow-xs">
        <button 
          onClick={() => setActiveTab('friends')}
          className={`flex-1 snap-center min-w-[140px] px-4 py-3 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${activeTab === 'friends' ? 'bg-[#c93638] text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
        >
          <UserCheck size={18} />
          Bạn Bè ({connections.friends.length})
        </button>
        <button 
          onClick={() => setActiveTab('following')}
          className={`flex-1 snap-center min-w-[140px] px-4 py-3 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${activeTab === 'following' ? 'bg-slate-800 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
        >
          <ChevronRight size={18} />
          Đang theo dõi ({connections.following.length})
        </button>
        <button 
          onClick={() => setActiveTab('followers')}
          className={`flex-1 snap-center min-w-[140px] px-4 py-3 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${activeTab === 'followers' ? 'bg-slate-800 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
        >
          <UserPlus size={18} />
          Người theo dõi ({connections.followers.length})
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.length > 0 ? (
          filteredList.map(user => (
            <div 
              key={user.id} 
              onClick={() => navigate(`/profile/${user.id}`)}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer group hover:border-rose-200"
            >
              <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm ring-2 ring-slate-100 group-hover:ring-rose-200 transition-all">
                  <img 
                    src={user.anh_dai_dien || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.ten_hien_thi || user.ho_ten)}&background=random`} 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-800 truncate pr-2 group-hover:text-[#c93638] transition-colors">
                    {user.ten_hien_thi || user.ho_ten}
                  </h3>
                  {user.cap_bac_info && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 whitespace-nowrap">
                        {user.cap_bac_info.ten_cap_bac}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="shrink-0 ml-2">
                {getActionBtn(user)}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4 border border-slate-200">
              <Users size={30} />
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-1">Không có dữ liệu</h3>
            <p className="text-slate-500 font-medium text-sm">Chưa có ai ở đây cả. Hãy bắt đầu kết nối thêm nhé!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Friends;
