import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard, PieChart } from 'lucide-react';

const FinanceAdmin = () => {
  const context = useOutletContext();
  const activeTabContext = context?.activeTab;
  
  const isEmbedded = !['cashflow', 'withdrawals', 'vip'].includes(activeTabContext);
  const [localTab, setLocalTab] = useState('cashflow');
  const currentTab = isEmbedded ? localTab : activeTabContext;

  const handleTabChange = (tab) => {
    if (isEmbedded) setLocalTab(tab);
    else if (context?.setActiveTab) context.setActiveTab(tab);
  };

  const renderCashflowTab = () => (
    <div className="w-full flex flex-col gap-6 mt-6 animate-slideUp">
      {/* KHỐI THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-teal-50 rounded-[2rem] border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-400 text-slate-900 border-2 border-[#0f172a] flex items-center justify-center">
              <DollarSign size={24} strokeWidth={3} />
            </div>
            <h3 className="font-black text-slate-600 uppercase">Tổng Doanh Thu</h3>
          </div>
          <p className="text-4xl font-black text-slate-900 mb-2">124.5M ₫</p>
          <p className="text-sm font-bold text-teal-600 flex items-center gap-1">
            <TrendingUp size={16} /> +15.3% so với tháng trước
          </p>
        </div>

        <div className="bg-rose-50 rounded-[2rem] border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-400 text-slate-900 border-2 border-[#0f172a] flex items-center justify-center">
              <Wallet size={24} strokeWidth={3} />
            </div>
            <h3 className="font-black text-slate-600 uppercase">Chiết Khấu Đã Trả</h3>
          </div>
          <p className="text-4xl font-black text-slate-900 mb-2">32.8M ₫</p>
          <p className="text-sm font-bold text-rose-600 flex items-center gap-1">
            <TrendingDown size={16} /> Rút tiền Affiliate tăng
          </p>
        </div>

        <div className="bg-amber-50 rounded-[2rem] border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 border-2 border-[#0f172a] flex items-center justify-center">
              <CreditCard size={24} strokeWidth={3} />
            </div>
            <h3 className="font-black text-slate-600 uppercase">Lợi Nhuận Ròng</h3>
          </div>
          <p className="text-4xl font-black text-slate-900 mb-2">91.7M ₫</p>
          <p className="text-sm font-bold text-amber-600 flex items-center gap-1">
            <TrendingUp size={16} /> Ổn định
          </p>
        </div>
      </div>

      {/* BIỂU ĐỒ GIẢ LẬP (MOCK) */}
      <div className="w-full bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-8 mt-4">
        <h3 className="font-black text-2xl text-slate-900 mb-6 flex items-center gap-2">
          <PieChart size={28} className="text-teal-500" /> Biểu Đồ Doanh Thu Tháng Này
        </h3>
        <div className="w-full h-[400px] bg-slate-50 border-4 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-4">
          <TrendingUp size={64} className="text-teal-200" />
          <p className="font-bold text-xl">Đang tải dữ liệu từ Két Sắt...</p>
          <p className="text-sm">Mô-đun biểu đồ Recharts sẽ được nhúng vào đây.</p>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title) => (
    <div className="bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-12 text-center mt-10">
      <h2 className="text-3xl font-black text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-500 font-bold text-lg">Tính năng đang được phát triển...</p>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-4 border-b-4 border-slate-900">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">
            {currentTab === 'cashflow' && 'Báo cáo Dòng tiền'}
            {currentTab === 'withdrawals' && 'Duyệt Rút tiền Affiliate'}
            {currentTab === 'vip' && 'Doanh thu Gói VIP'}
          </h1>
          <p className="text-slate-500 font-bold text-sm sm:text-base m-0">
            Trang thống kê và quản lý tài chính chỉ dành riêng cho Finance Admin.
          </p>
        </div>

        {isEmbedded && (
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'cashflow', label: 'Báo cáo Dòng tiền' },
              { id: 'withdrawals', label: 'Duyệt Rút tiền' },
              { id: 'vip', label: 'Doanh thu Gói VIP' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`px-5 py-2.5 rounded-xl font-black text-sm border-2 border-slate-900 transition-all cursor-pointer ${
                  currentTab === t.id 
                    ? 'bg-teal-400 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px]' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {currentTab === 'cashflow' && renderCashflowTab()}
      {currentTab === 'withdrawals' && renderPlaceholder('Quản lý Lệnh Rút Tiền')}
      {currentTab === 'vip' && renderPlaceholder('Báo cáo Người Dùng VIP')}
    </div>
  );
};

export default FinanceAdmin;
