import React from 'react';

const Stats = () => {
  return (
    <section className="px-5 pb-10">
      <div className="max-w-[1320px] mx-auto grid grid-cols-3 border border-border-color rounded-[16px] sm:rounded-[24px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <div className="px-2 py-4 sm:px-8 sm:py-6 border-r border-border-color text-center sm:text-left">
          <div className="text-[0.65rem] sm:text-[1rem] text-text-light mb-1 sm:mb-2 font-medium leading-tight">Thành viên trải nghiệm</div>
          <div className="text-[1.25rem] sm:text-[2.5rem] font-extrabold text-primary tracking-tight">1.240+</div>
        </div>
        <div className="px-2 py-4 sm:px-8 sm:py-6 border-r border-border-color text-center sm:text-left">
          <div className="text-[0.65rem] sm:text-[1rem] text-text-light mb-1 sm:mb-2 font-medium leading-tight">Bài đánh giá thật</div>
          <div className="text-[1.25rem] sm:text-[2.5rem] font-extrabold text-primary tracking-tight">3.800+</div>
        </div>
        <div className="px-2 py-4 sm:px-8 sm:py-6 text-center sm:text-left">
          <div className="text-[0.65rem] sm:text-[1rem] text-text-light mb-1 sm:mb-2 font-medium leading-tight">Đánh giá có ảnh/video</div>
          <div className="text-[1.25rem] sm:text-[2.5rem] font-extrabold text-primary tracking-tight">96%</div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
