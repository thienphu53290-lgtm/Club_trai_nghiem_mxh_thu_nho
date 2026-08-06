import React from 'react';

const teamMembers = [
  {
    id: 1,
    name: 'Hoàng Quân',
    role: 'Co-founder / Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Phương Linh',
    role: 'Co-founder / Content',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Trần Đạt',
    role: 'Community Manager',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Mai Hoa',
    role: 'Partnership',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'
  }
];

const Team = () => {
  return (
    <section className="px-5 py-[60px] bg-bg-secondary border-t border-border-color">
      <div className="max-w-[1320px] mx-auto text-center">
        <h2 className="text-2xl md:text-[2rem] font-extrabold text-text-dark mb-4">Đội ngũ sáng lập</h2>
        <p className="text-text-light text-[1.05rem] max-w-[600px] mx-auto mb-10 leading-relaxed">
          Chúng tôi là những người cuồng mua sắm online, từng mua phải hàng lởm và quyết định lập ra club này để không ai bị lừa nữa.
        </p>

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
