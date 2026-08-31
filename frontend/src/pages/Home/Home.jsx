import React, { useState, useEffect } from 'react';
import Hero from '../../components/Hero/Hero';
import Stats from '../../components/Stats/Stats';
import HotProducts from '../../components/HotProducts/HotProducts';
import Features from '../../components/Features/Features';
import RecentReviews from '../../components/RecentReviews/RecentReviews';
import UpcomingEvents from '../../components/UpcomingEvents/UpcomingEvents';
import Team from '../../components/Team/Team';
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
      <Team />
    </>
  );
};

export default Home;
