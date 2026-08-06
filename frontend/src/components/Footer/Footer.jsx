import React from 'react';

const Footer = () => {
  return (
    <footer className="px-5 pt-[60px] pb-5 border-t border-border-color bg-white">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-[30px] mb-[50px]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2.5 min-w-max cursor-pointer">
              <div className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[1.2rem]">k</div>
              <span className="font-extrabold text-[1.2rem] tracking-tight text-text-dark">club trải nghiệm</span>
            </div>
            <p className="text-text-light text-[0.95rem] max-w-[300px] leading-relaxed">
              Cộng đồng chia sẻ trải nghiệm mua sắm online trung thực, minh bạch. Đọc trước khi mua, chia sẻ sau khi dùng.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center text-text-light transition-colors hover:border-text-dark hover:text-text-dark">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center text-text-light transition-colors hover:border-text-dark hover:text-text-dark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[1.05rem] text-text-dark mb-4">Khám phá</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Sản phẩm hot</a></li>
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Đánh giá mới</a></li>
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Bảng tin cộng đồng</a></li>
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Sự kiện sắp tới</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[1.05rem] text-text-dark mb-4">Hỗ trợ</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Hướng dẫn đánh giá</a></li>
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[1.05rem] text-text-dark mb-4">Liên hệ</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">hello@clubtrainghiem.vn</a></li>
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">0123 456 789</a></li>
              <li><a href="#" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Hợp tác nhãn hàng</a></li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center pt-5 border-t border-border-color">
          <p className="text-text-light text-[0.9rem]">&copy; 2024 Club Trải Nghiệm. Bảo lưu mọi quyền.</p>
          <div className="flex gap-5">
            <a href="#" className="text-text-light text-[0.9rem] no-underline transition-colors hover:text-text-dark">Tiếng Việt</a>
            <a href="#" className="text-text-light text-[0.9rem] no-underline transition-colors hover:text-text-dark">English</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
