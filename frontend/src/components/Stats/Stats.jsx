import React from 'react';

const Stats = () => {
  return (
    <section className="px-5 pb-10">
      <div className="max-w-[1320px] mx-auto grid grid-cols-3 border border-border-color rounded-[24px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <div className="px-8 py-6 border-r border-border-color">
          <div className="text-[1rem] text-text-light mb-2 font-medium">Thành viên trải nghiệm</div>
          <div className="text-[2.5rem] font-extrabold text-primary tracking-tight">1.240+</div>
        </div>
        <div className="px-8 py-6 border-r border-border-color">
          <div className="text-[1rem] text-text-light mb-2 font-medium">Bài đánh giá thật</div>
          <div className="text-[2.5rem] font-extrabold text-primary tracking-tight">3.800+</div>
        </div>
        <div className="px-8 py-6">
          <div className="text-[1rem] text-text-light mb-2 font-medium">Đánh giá có ảnh/video</div>
          <div className="text-[2.5rem] font-extrabold text-primary tracking-tight">96%</div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
