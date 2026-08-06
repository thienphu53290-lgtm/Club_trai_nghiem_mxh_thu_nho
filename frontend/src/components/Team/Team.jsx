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
        <h2 className="text-[2rem] font-extrabold text-text-dark mb-4">Đội ngũ sáng lập</h2>
        <p className="text-text-light text-[1.05rem] max-w-[600px] mx-auto mb-10 leading-relaxed">
          Chúng tôi là những người cuồng mua sắm online, từng mua phải hàng lởm và quyết định lập ra club này để không ai bị lừa nữa.
        </p>

        <div className="grid grid-cols-4 gap-[30px]">
          {teamMembers.map(member => (
            <div key={member.id} className="border border-border-color rounded-[24px] p-8 bg-white text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
              <div className="w-[96px] h-[96px] mx-auto mb-4 rounded-full p-1 border-2 border-[#fcebeb]">
                <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <h3 className="text-[1.2rem] font-extrabold mb-2">{member.name}</h3>
              <p className="text-text-light text-[0.95rem]">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
