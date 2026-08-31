import React from 'react';

import { Sparkles, Quote } from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: 'Vũ Thiên Phú',
    role: 'Product Manager & Founder',
    avatar: '/img/nguoi_phat_trien/anh1.jpg'
  },
  {
    id: 2,
    name: 'Vũ Thiên Phú',
    role: 'Full-stack Developer',
    avatar: '/img/nguoi_phat_trien/anh2.jpg'
  },
  {
    id: 3,
    name: 'Vũ Thiên Phú',
    role: 'UI/UX Designer',
    avatar: '/img/nguoi_phat_trien/anh3.jpg'
  },
  {
    id: 4,
    name: 'Vũ Thiên Phú',
    role: 'Quality Assurance',
    avatar: '/img/nguoi_phat_trien/anh4.jpg'
  }
];

const Team = () => {
  return (
    <section className="px-5 py-[60px] bg-transparent border-t border-border-color">
      <div className="max-w-[1320px] mx-auto text-center">
        <div className="relative mb-12 z-10 w-full">
          {/* Glowing animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#c93638]/20 via-rose-400/20 to-[#c93638]/20 rounded-[32px] blur-xl animate-pulse"></div>
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 md:p-12 border border-white shadow-[0_12px_40px_rgba(201,54,56,0.06)] overflow-hidden group">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#c93638]/5 to-transparent rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-rose-400/5 to-transparent rounded-tr-full -z-10 transition-transform duration-700 group-hover:scale-110"></div>
            
            <div className="flex justify-center mb-5">
              <span className="bg-gradient-to-r from-[#fcebeb] to-rose-50 text-[#c93638] px-4 py-1.5 rounded-full text-[0.8rem] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm border border-[#c93638]/10">
                <Sparkles size={14} className="animate-pulse" /> Thông điệp từ Founder
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-[2.5rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-[#c93638] to-slate-800 mb-6 tracking-tight drop-shadow-sm">
              Đội ngũ sáng lập
            </h2>
            
            <div className="relative max-w-[650px] mx-auto px-4 sm:px-6">
              <Quote className="w-10 h-10 md:w-12 md:h-12 absolute -top-3 -left-1 sm:-top-4 sm:-left-4 text-[#c93638]/10 -z-10 rotate-180 transform -scale-x-100" />
              <p className="text-slate-700 text-[1rem] sm:text-[1.1rem] md:text-[1.2rem] leading-relaxed font-semibold italic relative z-10">
                "Tôi là một người cuồng mua sắm online, từng mua phải hàng lởm và quyết định một mình lập ra club này để không ai bị lừa nữa."
              </p>
              <Quote className="w-10 h-10 md:w-12 md:h-12 absolute -bottom-4 -right-1 sm:-bottom-6 sm:-right-4 text-[#c93638]/10 -z-10" />
            </div>
          </div>
        </div>

        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-[20px] sm:gap-[30px] overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
          {teamMembers.map(member => (
            <div key={member.id} className="w-[240px] sm:w-auto snap-center shrink-0 border border-border-color rounded-[24px] p-6 sm:p-8 bg-white text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
              <div className="w-[80px] sm:w-[96px] h-[80px] sm:h-[96px] mx-auto mb-3 sm:mb-4 rounded-full p-1 border-2 border-[#fcebeb]">
                <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <h3 className="text-[1.1rem] sm:text-[1.2rem] font-extrabold mb-1 sm:mb-2">{member.name}</h3>
              <p className="text-text-light text-[0.85rem] sm:text-[0.95rem]">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
