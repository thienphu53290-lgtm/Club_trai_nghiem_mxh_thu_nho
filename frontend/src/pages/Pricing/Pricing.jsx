import React, { useState } from 'react';
import { Check, Crown, Zap, Shield, Star, Gem } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Khởi đầu',
      price: '0',
      icon: <Star size={24} className="text-slate-500" />,
      color: 'slate',
      description: 'Dành cho người mới bắt đầu trải nghiệm.',
      features: [
        'Tạo hồ sơ cá nhân cơ bản',
        'Đăng tải bài viết & hình ảnh',
        'Nhắn tin cơ bản',
        'Tham gia cộng đồng mở'
      ],
      buttonText: 'Đang sử dụng',
      popular: false
    },
    {
      id: 'basic',
      name: 'Nâng cao',
      price: '25',
      icon: <Zap size={24} className="text-blue-500" />,
      color: 'blue',
      description: 'Nhiều tiện ích hơn để kết nối.',
      features: [
        'Mọi thứ của gói Khởi đầu',
        'Huy hiệu thành viên Nâng cao',
        'Xem ai đã ghé thăm hồ sơ',
        'Tùy chỉnh màu sắc trang cá nhân',
        'Hỗ trợ 24/7'
      ],
      buttonText: 'Chọn gói này',
      popular: false
    },
    {
      id: 'pro',
      name: 'Chuyên nghiệp',
      price: '50',
      icon: <Crown size={24} className="text-amber-500" />,
      color: 'amber',
      description: 'Tối ưu hóa mọi trải nghiệm của bạn.',
      features: [
        'Mọi thứ của gói Nâng cao',
        'Tích xanh xác minh danh tính',
        'Không bao giờ có quảng cáo',
        'Tăng 2x lượt hiển thị bài viết',
        'Tạo nhóm & cộng đồng kín'
      ],
      buttonText: 'Chọn gói này',
      popular: true
    },
    {
      id: 'premium',
      name: 'Độc tôn',
      price: '75',
      icon: <Gem size={24} className="text-purple-500" />,
      color: 'purple',
      description: 'Đặc quyền tối thượng, không giới hạn.',
      features: [
        'Mọi thứ của gói Chuyên nghiệp',
        'Tăng 5x lượt hiển thị bài viết',
        'Gửi tin nhắn ưu tiên (không vào spam)',
        'Tham gia sự kiện VIP offline',
        'Quà tặng đặc biệt sinh nhật'
      ],
      buttonText: 'Chọn gói này',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 font-sans selection:bg-[#c93638] selection:text-white flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <button 
            onClick={() => navigate('/')}
            className="absolute left-0 top-0 hidden md:block px-4 py-2 bg-white border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-xl font-extrabold hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
          >
            ← Quay lại
          </button>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight mt-12 md:mt-0">
            Nâng tầm trải nghiệm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c93638] to-purple-600">của bạn</span>
          </h1>
          <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
            Chọn gói tài khoản phù hợp để mở khóa những tính năng độc quyền, giúp bạn kết nối và tỏa sáng trên mạng xã hội của chúng tôi.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 px-2">
            <span className={`font-bold text-sm sm:text-base text-right leading-tight flex-1 sm:flex-none ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
              Thanh toán<br className="sm:hidden"/> hàng tháng
            </span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 sm:w-16 sm:h-8 bg-slate-200 border-2 border-[#0f172a] rounded-full p-1 shrink-0 transition-colors duration-300 ease-in-out focus:outline-none"
            >
              <div 
                className={`absolute left-1 top-1 w-5 h-5 bg-[#c93638] rounded-full transition-transform duration-300 ease-in-out shadow-sm ${isAnnual ? 'translate-x-6 sm:translate-x-8 bg-purple-600' : ''}`}
              />
            </button>
            <div className={`font-bold text-sm sm:text-base leading-tight flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 flex-1 sm:flex-none ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
              <span>Thanh toán<br className="sm:hidden"/> hàng năm</span>
              <span className="bg-green-100 text-green-700 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-green-200 whitespace-nowrap w-fit">
                Giảm 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-2 sm:px-0">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-3xl border-2 border-[#0f172a] p-5 sm:p-6 lg:p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 group
                ${plan.popular 
                  ? 'shadow-[8px_8px_0px_0px_rgba(201,54,56,1)] hover:shadow-[12px_12px_0px_0px_rgba(201,54,56,1)] hover:border-[#c93638]' 
                  : 'shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 bg-[#c93638] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-black text-xs sm:text-sm border-2 border-[#0f172a] flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <Star size={12} className="fill-white sm:w-[14px] sm:h-[14px]" /> ĐƯỢC CHỌN NHIỀU NHẤT
                </div>
              )}

              <div className="mb-4 sm:mb-6">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-[#0f172a] flex items-center justify-center mb-4 sm:mb-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] group-hover:scale-110 transition-transform bg-${plan.color}-50`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-1 sm:mb-2">{plan.name}</h3>
                <p className="text-slate-500 font-medium text-xs sm:text-sm min-h-[2.5rem]">{plan.description}</p>
              </div>

              <div className="mb-6 sm:mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    ${isAnnual ? Math.round(plan.price * 0.8) : plan.price}
                  </span>
                  <span className="text-slate-500 font-bold text-sm sm:text-base">/tháng</span>
                </div>
                {isAnnual && plan.price !== '0' && (
                  <p className="text-green-600 text-sm font-bold mt-1">
                    Thanh toán ${Math.round(plan.price * 0.8 * 12)} / năm
                  </p>
                )}
              </div>

              <ul className="flex-1 space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-0.5 sm:mt-1 bg-green-100 p-1 rounded-full border border-green-200 shrink-0">
                      <Check size={12} className="text-green-600 stroke-[3]" />
                    </div>
                    <span className="text-slate-700 font-semibold text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-xl font-black text-sm md:text-base border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]
                  ${plan.id === 'free' 
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed opacity-70 border-slate-300 shadow-none hover:translate-y-0' 
                    : plan.popular 
                      ? 'bg-[#c93638] text-white hover:bg-rose-700' 
                      : 'bg-white text-slate-900 hover:bg-slate-50'
                  }
                `}
                disabled={plan.id === 'free'}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
        
        {/* Mobile back button */}
        <div className="mt-12 text-center md:hidden">
            <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-white border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-xl font-extrabold"
            >
                Quay lại trang chủ
            </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
