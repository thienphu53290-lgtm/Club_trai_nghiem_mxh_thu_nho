import React, { useState, useEffect } from 'react';
import { CircleDollarSign, Ticket } from 'lucide-react';
import api from '../../api/axios';

const EventSpecificRevenue = ({ eventSlug }) => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, [eventSlug]);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/events/${eventSlug}/revenue`);
      if (res.data && res.data.status === 'success') {
        setRevenueData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-12 text-center mt-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold">Đang tải dữ liệu doanh thu...</p>
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div className="bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-12 text-center mt-6 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-rose-500 font-bold text-xl">Lỗi tải dữ liệu. Hãy thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-50 rounded-[2rem] border-4 border-indigo-900 shadow-[6px_6px_0px_0px_rgba(49,46,129,1)] p-6 md:p-8 flex items-center justify-between">
          <div>
            <p className="text-indigo-900 font-black mb-1 uppercase tracking-wider text-sm">Doanh Thu Sự Kiện</p>
            <h3 className="text-4xl md:text-5xl font-black text-indigo-900">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenueData.total_revenue)}
            </h3>
          </div>
          <div className="w-16 h-16 bg-white rounded-full border-4 border-indigo-900 shadow-[4px_4px_0px_0px_rgba(49,46,129,1)] flex items-center justify-center shrink-0">
            <CircleDollarSign className="text-indigo-600" size={32} />
          </div>
        </div>
        
        <div className="bg-emerald-50 rounded-[2rem] border-4 border-emerald-900 shadow-[6px_6px_0px_0px_rgba(6,78,59,1)] p-6 md:p-8 flex items-center justify-between">
          <div>
            <p className="text-emerald-900 font-black mb-1 uppercase tracking-wider text-sm">Vé Đã Bán</p>
            <h3 className="text-4xl md:text-5xl font-black text-emerald-900">{revenueData.total_tickets}</h3>
          </div>
          <div className="w-16 h-16 bg-white rounded-full border-4 border-emerald-900 shadow-[4px_4px_0px_0px_rgba(6,78,59,1)] flex items-center justify-center shrink-0">
            <Ticket className="text-emerald-600" size={32} />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-[2rem] border-4 border-[#0f172a] shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] p-6 md:p-8">
        <h3 className="text-xl font-black text-slate-900 mb-8 border-b-2 border-slate-100 pb-4">Biểu Đồ Doanh Thu (7 Ngày Gần Nhất)</h3>
        <div className="h-64 flex items-end gap-2 md:gap-4 justify-between mt-4 max-w-4xl mx-auto">
          {revenueData.chart_data.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none z-10">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(day.val)}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
              
              {/* Bar */}
              <div 
                className={`w-full max-w-[50px] rounded-t-xl transition-all duration-500 relative overflow-hidden ${day.isPeak ? 'bg-amber-400' : 'bg-indigo-500'}`}
                style={{ height: `${day.pct}%`, minHeight: '5%' }}
              >
                <div className="absolute inset-0 bg-white/20 hover:bg-transparent transition-colors"></div>
              </div>
              <div className="mt-3 text-xs md:text-sm font-bold text-slate-500 truncate w-full text-center">{day.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSpecificRevenue;
