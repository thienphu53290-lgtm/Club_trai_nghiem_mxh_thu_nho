import React from 'react';
import { motion } from 'framer-motion';

const MascotBody = ({ isHovered, isDragging, isWaving }) => {
  return (
    <div className="relative -mt-3 z-10 flex flex-col items-center">
      
      {/* Cánh tay */}
      <div className="absolute top-2 w-[130%] flex justify-between z-0">
        {/* Tay trái */}
        <motion.div 
          className="w-5 h-9 bg-[#c93638] border-[3.5px] border-[#0f172a] rounded-full origin-top flex items-end justify-center"
          animate={isDragging ? { rotate: [0, 180, 360] } : (isHovered ? { rotate: 25 } : { rotate: 15 })}
          transition={isDragging ? { duration: 0.2, repeat: Infinity } : { duration: 0.3 }}
        >
          {/* Bàn tay */}
          <div className="w-6 h-5 bg-[#ffdfcf] border-[3px] border-[#0f172a] rounded-full absolute -bottom-3 -left-1"></div>
        </motion.div>
        
        {/* Tay phải (Động tác vẫy ngang) */}
        <motion.div 
          className="w-5 h-9 bg-[#c93638] border-[3.5px] border-[#0f172a] rounded-full origin-top flex items-end justify-center"
          animate={isDragging ? { rotate: [360, 180, 0] } : (isWaving ? { rotate: [-90, -50, -90] } : (isHovered ? { rotate: -25 } : { rotate: -15 }))}
          transition={isDragging ? { duration: 0.2, repeat: Infinity } : (isWaving ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 })}
        >
          {/* Bàn tay */}
          <div className="w-6 h-5 bg-[#ffdfcf] border-[3px] border-[#0f172a] rounded-full absolute -bottom-3 -right-1"></div>
        </motion.div>
      </div>

      {/* Thân áo */}
      <div className="w-[60px] h-[40px] bg-[#c93638] border-[3.5px] border-[#0f172a] rounded-t-xl rounded-b-[10px] z-10 relative overflow-hidden">
        {/* Chi tiết logo thỏ trắng nhỏ xíu trên áo */}
        <div className="absolute right-2 bottom-1.5 w-3 h-3 bg-white rounded-full opacity-80">
          <div className="absolute -top-1 left-0 w-1 h-2 bg-white rounded-full rotate-[-20deg]"></div>
          <div className="absolute -top-1 right-0 w-1 h-2 bg-white rounded-full rotate-[20deg]"></div>
        </div>
      </div>

      {/* Đôi chân */}
      <div className="flex gap-2 -mt-1 z-0 relative">
        {/* Chân trái */}
        <motion.div 
          className="w-5 h-8 bg-[#ffdfcf] border-[3.5px] border-[#0f172a] rounded-b-full relative flex justify-center origin-top"
          animate={isDragging ? { rotate: [-45, 45, -45] } : (isHovered ? { y: -2, rotate: -5 } : { y: 0, rotate: 0 })}
          transition={isDragging ? { duration: 0.3, repeat: Infinity } : { duration: 0.3 }}
        >
          {/* Quần đùi */}
          <div className="absolute -top-1 left-[-3.5px] w-[calc(100%+7px)] h-[15px] bg-[#3b82f6] border-[3.5px] border-[#0f172a] border-t-0 rounded-b-sm"></div>
          {/* Giày */}
          <div className="absolute -bottom-2 -left-1 w-7 h-4 bg-white border-[3px] border-[#0f172a] rounded-t-lg rounded-b-sm z-10"></div>
        </motion.div>
        
        {/* Chân phải */}
        <motion.div 
          className="w-5 h-8 bg-[#ffdfcf] border-[3.5px] border-[#0f172a] rounded-b-full relative flex justify-center origin-top"
          animate={isDragging ? { rotate: [45, -45, 45] } : (isHovered ? { y: -5, rotate: 5 } : { y: 0, rotate: 0 })}
          transition={isDragging ? { duration: 0.3, repeat: Infinity } : { duration: 0.3 }}
        >
           {/* Quần đùi */}
           <div className="absolute -top-1 left-[-3.5px] w-[calc(100%+7px)] h-[15px] bg-[#3b82f6] border-[3.5px] border-[#0f172a] border-t-0 rounded-b-sm"></div>
           {/* Giày */}
           <div className="absolute -bottom-2 -right-1 w-7 h-4 bg-white border-[3px] border-[#0f172a] rounded-t-lg rounded-b-sm z-10"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default MascotBody;
