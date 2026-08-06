import React from 'react';
import Hero from '../../components/Hero/Hero';
import Stats from '../../components/Stats/Stats';
import HotProducts from '../../components/HotProducts/HotProducts';
import Features from '../../components/Features/Features';
import RecentReviews from '../../components/RecentReviews/RecentReviews';
import UpcomingEvents from '../../components/UpcomingEvents/UpcomingEvents';
import Team from '../../components/Team/Team';

const Home = () => {
  return (
    <>
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
