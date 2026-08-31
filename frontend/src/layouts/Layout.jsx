import React from 'react';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const Layout = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();

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
      <Footer />
    </div>
  );
};

export default Layout;
