import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Mascot from '../components/Mascot/Mascot';

const Layout = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const [showMascot, setShowMascot] = useState(localStorage.getItem('app-mascot') !== 'false');

  useEffect(() => {
    const handleToggle = () => {
      setShowMascot(localStorage.getItem('app-mascot') !== 'false');
    };
    window.addEventListener('mascot-toggle', handleToggle);
    return () => window.removeEventListener('mascot-toggle', handleToggle);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="w-full h-full"
          >
            {currentOutlet}
          </motion.div>
        </AnimatePresence>
      </main>
      {!location.pathname.startsWith('/chatbot') && (
        <>
          {showMascot && <Mascot />}
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;
