import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Download, ArrowRight, Monitor } from 'lucide-react';
import Hero from '../../components/Hero/Hero';
import Stats from '../../components/Stats/Stats';
import HotProducts from '../../components/HotProducts/HotProducts';
import Features from '../../components/Features/Features';
import RecentReviews from '../../components/RecentReviews/RecentReviews';
import UpcomingEvents from '../../components/UpcomingEvents/UpcomingEvents';
import Team from '../../components/Team/Team';
import TopPosts from '../../components/TopPosts/TopPosts';
import { DisclaimerModal, WelcomeAdPopup } from '../../components/Modal';
import AdBanner from '../../components/AdBanner/AdBanner';
import api from '../../api/axios';

const Home = () => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isWelcomeAdOpen, setIsWelcomeAdOpen] = useState(false);
  const [superAds, setSuperAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    const isShown = sessionStorage.getItem('disclaimer_shown');
    if (!isShown) {
      setIsDisclaimerOpen(true);
    }

    const fetchAds = async () => {
      try {
        const res = await api.get('/events/ads');
        if (res.data && res.data.super_ads && res.data.super_ads.length > 0) {
          setSuperAds(res.data.super_ads);
        }
      } catch (error) {
        console.error('Failed to fetch ads', error);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    if (superAds.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % superAds.length);
    }, 5000); // Rotate every 5 seconds
    
    return () => clearInterval(interval);
  }, [superAds]);

  useEffect(() => {
    // Chỉ mở popup quảng cáo khi popup điều khoản đã đóng VÀ có quảng cáo
    if (!isDisclaimerOpen && superAds.length > 0) {
      if (!sessionStorage.getItem('welcome_ad_shown')) {
        // Thêm một chút delay (500ms) để animation popup điều khoản biến mất hoàn toàn
        const timer = setTimeout(() => {
          setIsWelcomeAdOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isDisclaimerOpen, superAds]);

  const handleCloseDisclaimer = () => {
    sessionStorage.setItem('disclaimer_shown', 'true');
    setIsDisclaimerOpen(false);
  };

  const handleCloseWelcomeAd = () => {
    sessionStorage.setItem('welcome_ad_shown', 'true');
    setIsWelcomeAdOpen(false);
  };

  return (
    <>
      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={handleCloseDisclaimer} />
      <WelcomeAdPopup isOpen={isWelcomeAdOpen} onClose={handleCloseWelcomeAd} events={superAds} />
      <div className="flex flex-col gap-[30px] pb-[10px]">
        <Hero />
        <Stats />
      </div>
      <HotProducts />
      
      {/* Super Banner (Auto Rotating if multiple) */}
      {superAds.length > 0 && (
        <div className="max-w-[1320px] mx-auto px-5 my-8 relative group">
          <div className="overflow-hidden rounded-[24px]">
            <div 
              className="flex transition-transform duration-700 ease-in-out" 
              style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
            >
              {superAds.map((ad, idx) => (
                <div key={`${ad.id}-${idx}`} className="w-full shrink-0">
                  <AdBanner event={ad} isSuper={true} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Dots */}
          {superAds.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {superAds.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentAdIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${currentAdIndex === idx ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Features />
      <RecentReviews />
      <UpcomingEvents />
      
      {/* App Download Banner */}
      <div className="max-w-[1320px] mx-auto px-5 my-12 sm:my-20">
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#c93638] via-[#e85d5d] to-[#ff9e9e] p-8 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10 text-white max-w-2xl text-center md:text-left">
            <h2 className="text-3xl sm:text-[2.5rem] font-black mb-4 sm:mb-5 leading-tight tracking-tight flex items-center justify-center md:justify-start gap-3 sm:gap-4">
              <div className="flex items-center gap-1 shrink-0 animate-bounce">
                <Smartphone className="w-9 h-9 sm:w-11 sm:h-11" />
                <Monitor className="w-10 h-10 sm:w-12 sm:h-12 -ml-3" />
              </div>
              <span>Trải nghiệm PIVO trên Mobile và PC</span>
            </h2>
            <p className="text-rose-50 text-base sm:text-[1.15rem] font-medium leading-relaxed mb-0">
              Cài đặt ngay ứng dụng PIVO trên điện thoại và máy tính để nhận thông báo realtime, lướt bảng tin mượt mà hơn và khám phá hàng ngàn đánh giá chân thực mọi lúc mọi nơi!
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link 
              to="/download" 
              className="flex items-center gap-2.5 bg-white text-[#c93638] px-8 py-4 sm:px-10 sm:py-5 rounded-full font-black text-[1.1rem] hover:bg-rose-50 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 active:scale-95 no-underline border-4 border-white/20 bg-clip-padding"
            >
              <Download size={24} className="shrink-0" />
              Tải ứng dụng ngay
              <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform shrink-0" />
            </Link>
          </div>
        </div>
      </div>

      <TopPosts />

      <Team />
    </>
  );
};

export default Home;
