import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Đã đăng ký nhận tin thành công với email: ${email}`);
      setEmail('');
    }
  };

  const handlePreventDefault = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="px-5 pt-[60px] pb-5 border-t border-border-color bg-white">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-[30px] mb-[50px]">
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5 min-w-max cursor-pointer no-underline">
              <div className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-[1.2rem]">k</div>
              <span className="font-extrabold text-[1.2rem] tracking-tight text-text-dark">club trải nghiệm</span>
            </Link>
            <p className="text-text-light text-[0.95rem] max-w-[300px] leading-relaxed">
              Cộng đồng chia sẻ trải nghiệm mua sắm online trung thực, minh bạch. Đọc trước khi mua, chia sẻ sau khi dùng.
            </p>
            <div className="flex gap-4">
              <a href="#" onClick={handlePreventDefault} className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center text-text-light transition-colors hover:border-text-dark hover:text-text-dark">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" onClick={handlePreventDefault} className="w-10 h-10 rounded-full border border-border-color flex items-center justify-center text-text-light transition-colors hover:border-text-dark hover:text-text-dark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[1.05rem] text-text-dark mb-4">Khám phá</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><Link to="/products" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Sản phẩm hot</Link></li>
              <li><Link to="/feed" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Đánh giá mới</Link></li>
              <li><Link to="/feed" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Bảng tin cộng đồng</Link></li>
              <li><Link to="/events" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Sự kiện sắp tới</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[1.05rem] text-text-dark mb-4">Hỗ trợ</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><Link to="/about" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Câu hỏi thường gặp</Link></li>
              <li><Link to="/about" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Hướng dẫn đánh giá</Link></li>
              <li><Link to="/about" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Chính sách bảo mật</Link></li>
              <li><Link to="/about" className="text-text-light text-[0.95rem] no-underline transition-colors hover:text-primary">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[1.05rem] text-text-dark mb-4">Đăng ký nhận tin</h4>
            <p className="text-text-light text-[0.95rem] mb-4">
              Nhận thông báo về các sự kiện và đánh giá mới nhất.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-border-color focus:outline-none focus:border-primary text-[0.95rem]"
                required
              />
              <button 
                type="submit"
                className="w-full bg-primary text-white font-bold py-2.5 rounded-md transition-colors hover:bg-primary-dark"
              >
                Đăng ký ngay
              </button>
            </form>
          </div>
        </div>

        <div className="flex justify-between items-center pt-5 border-t border-border-color">
          <p className="text-text-light text-[0.9rem]">&copy; 2024 Club Trải Nghiệm. Bảo lưu mọi quyền.</p>
          <div className="flex gap-5">
            <a href="#" onClick={handlePreventDefault} className="text-text-light text-[0.9rem] no-underline transition-colors hover:text-text-dark">Tiếng Việt</a>
            <a href="#" onClick={handlePreventDefault} className="text-text-light text-[0.9rem] no-underline transition-colors hover:text-text-dark">English</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
