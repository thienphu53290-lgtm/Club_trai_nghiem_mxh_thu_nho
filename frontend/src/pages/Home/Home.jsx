import React, { useState, useEffect } from 'react';
import Hero from '../../components/Hero/Hero';
import Stats from '../../components/Stats/Stats';
import HotProducts from '../../components/HotProducts/HotProducts';
import Features from '../../components/Features/Features';
import RecentReviews from '../../components/RecentReviews/RecentReviews';
import UpcomingEvents from '../../components/UpcomingEvents/UpcomingEvents';
import Team from '../../components/Team/Team';
import { DisclaimerModal } from '../../components/Modal';

const Home = () => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  useEffect(() => {
    const isShown = sessionStorage.getItem('disclaimer_shown');
    if (!isShown) {
      setIsDisclaimerOpen(true);
    }
  }, []);

  const handleCloseDisclaimer = () => {
    sessionStorage.setItem('disclaimer_shown', 'true');
    setIsDisclaimerOpen(false);
  };

  return (
    <>
      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={handleCloseDisclaimer} />
      <div className="flex flex-col gap-[30px] pb-[10px]">
        <Hero />
        <Stats />
      </div>
      <HotProducts />
      <Features />
      <RecentReviews />
      <UpcomingEvents />
      <Team />
    </>
  );
};

export default Home;
