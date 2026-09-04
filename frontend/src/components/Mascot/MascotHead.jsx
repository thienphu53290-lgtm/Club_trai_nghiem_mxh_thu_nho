import React from 'react';
import { motion } from 'framer-motion';

const MascotHead = ({ isHovered, isDragging, isBlinking }) => {
  return (
    <motion.div 
      className="relative z-20"
      animate={isHovered ? { rotate: [0, -5, 5, 0] } : { rotate: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Cái mũ (Cap) đội lệch */}
      <div className="absolute -top-4 left-3 w-[70px] h-[25px] bg-[#facc15] border-[3.5px] border-[#0f172a] rounded-t-[20px] z-30">
        <div className="absolute top-2 -right-5 w-[25px] h-[12px] bg-[#facc15] border-[3.5px] border-[#0f172a] rounded-r-full border-l-0"></div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-2 bg-[#facc15] border-[3px] border-[#0f172a] rounded-t-full border-b-0"></div>
      </div>

      {/* Khuôn mặt chính (Tóc mái ngang + Base) */}
      <div className="w-[110px] h-[95px] bg-[#c93638] rounded-[50px] border-[3.5px] border-[#0f172a] relative flex items-end justify-center overflow-hidden z-20">
        
        {/* Lớp da mặt */}
        <div className="w-[90%] h-[65%] bg-[#ffdfcf] rounded-t-[40px] rounded-b-[30px] border-t-[2.5px] border-[#0f172a] relative">
          
          {/* Hai mắt to bự */}
          <div className="flex justify-between px-2 absolute -top-5 w-full">
            
            {/* Mắt trái */}
            <motion.div 
              className="w-[42px] h-[48px] bg-white border-[3.5px] border-[#0f172a] rounded-full overflow-hidden flex items-center justify-center relative shadow-[inset_0_4px_0_rgba(0,0,0,0.05)]"
              animate={isDragging ? { scaleY: 1.2, scaleX: 1.1 } : (isBlinking ? { scaleY: 0.1, scaleX: 1 } : { scaleY: 1, scaleX: 1 })}
              transition={{ duration: 0.1 }}
            >
              {/* Mí mắt (Eyelid) */}
              <motion.div 
                className="absolute top-0 left-0 w-full bg-[#c93638] border-b-[3.5px] border-[#0f172a] z-10"
                animate={isDragging ? { height: '0%' } : { height: '45%' }}
              ></motion.div>
              {/* Tròng đen */}
              <motion.div 
                className="w-[22px] h-[26px] bg-[#3f2015] rounded-[10px] relative ml-2"
                animate={isHovered ? { x: 5 } : { x: 0 }}
              >
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-white rounded-full"></div>
              </motion.div>
            </motion.div>

            {/* Mắt phải (to hơn một xíu giống ảnh gốc) */}
            <motion.div 
              className="w-[48px] h-[54px] bg-white border-[3.5px] border-[#0f172a] rounded-full overflow-hidden flex items-center justify-center relative shadow-[inset_0_4px_0_rgba(0,0,0,0.05)] -mt-1"
              animate={isDragging ? { scaleY: 1.2, scaleX: 1.1 } : (isBlinking ? { scaleY: 0.1, scaleX: 1 } : { scaleY: 1, scaleX: 1 })}
              transition={{ duration: 0.1 }}
            >
              {/* Mí mắt (Eyelid) */}
              <motion.div 
                className="absolute top-0 left-0 w-full bg-[#c93638] border-b-[3.5px] border-[#0f172a] z-10"
                animate={isDragging ? { height: '0%' } : { height: '45%' }}
              ></motion.div>
              {/* Tròng đen */}
              <motion.div 
                className="w-[26px] h-[30px] bg-[#3f2015] rounded-[12px] relative mr-2"
                animate={isHovered ? { x: 5 } : { x: 0 }}
              >
                <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-white rounded-full"></div>
              </motion.div>
            </motion.div>

          </div>

          {/* Miệng */}
          <motion.div 
            className="absolute top-6 left-1/2 -translate-x-1/2 border-[2.5px] border-[#0f172a] bg-[#fca5a5]"
            animate={isDragging ? { scaleY: 4, scaleX: 2, y: 5, borderRadius: '50%', borderTopWidth: '2.5px' } : (isHovered ? { scaleY: 2, scaleX: 1.5, y: 1, borderRadius: '0 0 50% 50%', borderTopWidth: 0 } : { scaleY: 1, scaleX: 1, y: 0, borderRadius: '0 0 50% 50%', borderTopWidth: 0 })}
            style={{ width: 14, height: 8 }}
          ></motion.div>

        </div>
      </div>
      
      {/* Lỗ tai (ẩn đằng sau tóc) */}
      <div className="absolute top-[40%] -left-2 w-6 h-8 bg-[#ffdfcf] border-[3px] border-[#0f172a] rounded-l-full -z-10"></div>
      <div className="absolute top-[40%] -right-2 w-6 h-8 bg-[#ffdfcf] border-[3px] border-[#0f172a] rounded-r-full -z-10"></div>
    </motion.div>
  );
};

export default MascotHead;
