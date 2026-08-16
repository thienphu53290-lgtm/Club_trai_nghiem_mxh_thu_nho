import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Mail, Phone, Ticket } from 'lucide-react';
import api from '../../api/axios';

const EventAttendees = ({ eventSlug }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendees();
  }, [eventSlug]);

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/events/${eventSlug}/attendees`);
      if (res.data.status === 'success') {
        setAttendees(res.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người tham gia:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const checkedInCount = attendees.filter(a => a.thoi_gian_checkin).length;

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border-4 border-[#0f172a] p-12 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border-4 border-[#0f172a] p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl border-2 border-blue-200 flex items-center justify-center shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Tổng đăng ký</p>
            <p className="text-3xl font-black">{attendees.length}</p>
          </div>
        </div>
        <div className="bg-emerald-50 rounded-3xl border-4 border-emerald-500 p-6 shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl border-2 border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-700">Đã Check-in</p>
            <p className="text-3xl font-black text-emerald-900">{checkedInCount}</p>
          </div>
        </div>
        <div className="bg-amber-50 rounded-3xl border-4 border-amber-500 p-6 shadow-[6px_6px_0px_0px_rgba(245,158,11,1)] flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl border-2 border-amber-200 flex items-center justify-center shrink-0">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-700">Chưa đến</p>
            <p className="text-3xl font-black text-amber-900">{attendees.length - checkedInCount}</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border-4 border-[#0f172a] p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        <h3 className="font-black text-xl mb-6 flex items-center gap-2">
          <Users className="text-blue-500" /> Danh Sách Người Tham Gia
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-4 border-[#0f172a]">
                <th className="py-4 px-4 font-black">Khách Hàng</th>
                <th className="py-4 px-4 font-black">Mã Vé</th>
                <th className="py-4 px-4 font-black">Liên Hệ</th>
                <th className="py-4 px-4 font-black text-center">Trạng Thái</th>
                <th className="py-4 px-4 font-black text-center">Thời Gian Check-in</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee) => (
                <tr key={attendee.id} className="border-b-2 border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={attendee.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(attendee.ho_ten)} alt={attendee.ho_ten} className="w-10 h-10 rounded-full border-2 border-[#0f172a]" />
                      <span className="font-bold">{attendee.ho_ten}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg border-2 border-slate-300 flex items-center gap-2 w-max">
                      <Ticket size={16} /> {attendee.ma_ve}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2 text-slate-600"><Mail size={14} /> {attendee.email}</div>
                      {attendee.so_dien_thoai && <div className="flex items-center gap-2 text-slate-600"><Phone size={14} /> {attendee.so_dien_thoai}</div>}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {attendee.thoi_gian_checkin ? (
                      <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full border-2 border-emerald-300 text-xs">
                        Đã tham gia
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full border-2 border-amber-300 text-xs">
                        Chưa đến
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-slate-600">
                    {formatDate(attendee.thoi_gian_checkin)}
                  </td>
                </tr>
              ))}
              {attendees.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 font-bold">Chưa có khách đăng ký</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventAttendees;
