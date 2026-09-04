import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MascotSpeechBubble = ({ speech }) => {
  return (
    <AnimatePresence>
      {speech && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10, x: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="absolute bottom-[100%] left-[80%] mb-2 w-max max-w-[200px] bg-white border-[3px] border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-2xl rounded-bl-sm p-3 text-sm font-bold text-slate-800 z-50 pointer-events-auto"
        >
          {speech}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MascotSpeechBubble;
