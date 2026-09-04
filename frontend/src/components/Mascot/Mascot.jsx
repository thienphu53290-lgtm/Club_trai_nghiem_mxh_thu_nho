import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MascotSpeechBubble from './MascotSpeechBubble';
import MascotHead from './MascotHead';
import MascotBody from './MascotBody';

const Mascot = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [speech, setSpeech] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (isListening) return; // Không kích hoạt lại nếu đang nghe

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeech("Trình duyệt không hỗ trợ Mic 😢");
      setTimeout(() => setSpeech(null), 3000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeech("Đang nghe nè 🎧...");
      setIsWaving(true);
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      // Loại bỏ dấu tiếng Việt để bắt từ khóa dễ hơn (vd: "bảng tin" hay "bản tin" đều ra "ban tin")
      const normalizedCommand = command.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
      console.log("Nghe được lệnh:", command, "-> Normalized:", normalizedCommand);
      
      let reply = `Nghe được: "${command}". Cơ mà hông hiểu! 😅`;

      let hideDelay = 3000;

      // Command Parser (Dùng text không dấu)
      if (normalizedCommand.includes("bang tin") || normalizedCommand.includes("ban tin")) {
        reply = "Đã mở Bảng tin cho bạn! 🚀";
        navigate("/feed");
      } else if (normalizedCommand.includes("trang chu")) {
        reply = "Đã về Trang chủ! 🏠";
        navigate("/");
      } else if (normalizedCommand.includes("tin nhan")) {
        reply = "Đang mở Tin nhắn! 💬";
        navigate("/messages");
      } else if (normalizedCommand.includes("tao") && normalizedCommand.includes("su kien")) {
        reply = "Bắt đầu tạo Sự kiện mới nhé! 🎉";
        navigate("/events/create");
      } else if (normalizedCommand.includes("su kien")) {
        reply = "Đang mở danh sách Sự kiện! 📅";
        navigate("/events");
      } else if (normalizedCommand.includes("trang tai") || normalizedCommand.includes("tai ung dung")) {
        reply = "Đang mở Trang tải ứng dụng! ⬇️";
        navigate("/download");
      } else if (normalizedCommand.includes("gioi thieu")) {
        reply = "Đang mở phần Giới thiệu! ℹ️";
        navigate("/about");
      } else if (normalizedCommand.includes("chatbot") || normalizedCommand.includes("chat bot")) {
        reply = "Đang mở Chatbot AI! 🤖";
        navigate("/chatbot");
      } else if (normalizedCommand.includes("kham pha")) {
        reply = (
          <div className="flex flex-col gap-2 items-center">
            <span>Khám phá gì nè? 🤔</span>
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); navigate("/products"); setSpeech(null); }}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Sản phẩm 🛍️
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate("/events"); setSpeech(null); }}
                className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer"
              >
                Sự kiện 🎪
              </button>
            </div>
          </div>
        );
        hideDelay = 8000;
      }

      setSpeech(reply);
      setTimeout(() => setSpeech(null), hideDelay);
      setTimeout(() => setIsWaving(false), 3000);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setSpeech("Lỗi Mic hoặc nói nhỏ quá không nghe 😕");
      setTimeout(() => setSpeech(null), 3000);
      setIsWaving(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Hiệu ứng chớp mắt tự động
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-[9999] pointer-events-auto flex items-end">
      {/* Vùng chứa toàn bộ linh vật */}
      <motion.div
        drag
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        animate={isDragging ? { scale: 1.1, rotate: [-5, 5, -5], y: 0 } : { scale: 1, rotate: 0, y: 0 }}
        transition={isDragging ? { duration: 0.1, repeat: Infinity } : { duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        className="cursor-grab active:cursor-grabbing relative flex flex-col items-center group drop-shadow-[2px_4px_6px_rgba(0,0,0,0.15)]"
      >
        <MascotSpeechBubble speech={speech} />
        <MascotHead isHovered={isHovered} isDragging={isDragging} isBlinking={isBlinking} />
        <MascotBody isHovered={isHovered} isDragging={isDragging} isWaving={isWaving} />
      </motion.div>
    </div>
  );
};

export default Mascot;
