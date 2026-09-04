import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
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

  const speakText = (text, onFinish) => {
    if (!('speechSynthesis' in window)) {
      if (onFinish) setTimeout(onFinish, Math.max(3000, text.length * 100));
      return;
    }
    
    // Tạm bỏ window.speechSynthesis.cancel() ở đây vì trên một số trình duyệt nó cắt luôn câu sắp nói
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.1; 
    
    // Thử tìm giọng tiếng Việt chuẩn nếu máy có cài sẵn
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    if (onFinish) {
      let isFinished = false;
      const finishHandle = () => {
        if (isFinished) return;
        isFinished = true;
        onFinish();
      };
      utterance.onend = finishHandle;
      utterance.onerror = finishHandle;
      // Đề phòng lỗi trình duyệt không gọi onend, set cứng một thời gian tối đa để đóng bong bóng
      const fallbackTime = Math.max(4000, text.length * 150);
      setTimeout(finishHandle, fallbackTime);
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleClick = () => {
    if (isListening) return; // Không kích hoạt lại nếu đang nghe

    // Mẹo nhỏ: Bật âm thanh rỗng ngay khi click để "đánh thức" quyền phát âm thanh trên điện thoại (đặc biệt là iOS/Safari)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
    }

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
      let matched = true;

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
      } else {
        matched = false;
      }

      if (matched) {
        setSpeech(reply);
        const textToSpeak = typeof reply === 'string' ? reply : "Đây là các mục khám phá";
        speakText(textToSpeak, () => {
          // Chỉ tự động đóng bong bóng khi nói xong nếu nó là đoạn text bình thường
          if (typeof reply === 'string') {
            setSpeech(null);
          }
        });
        
        // Nếu là menu nút bấm (Khám phá), giữ bong bóng 10 giây để người dùng kịp bấm
        if (typeof reply !== 'string') {
          setTimeout(() => setSpeech(null), 10000);
        }
        
        setTimeout(() => setIsWaving(false), 3000);
      } else {
        // Fallback to AI Chatbot
        setSpeech("Đang suy nghĩ... 🤔");
        api.post('/chatbot/ask', { message: command })
          .then(res => {
            if (res.data && res.data.success) {
              setSpeech(res.data.reply);
              speakText(res.data.reply, () => setSpeech(null));
            } else {
              setSpeech("AI đang ngủ rồi, không trả lời được! 😴");
              speakText("AI đang ngủ rồi, không trả lời được!", () => setSpeech(null));
            }
          })
          .catch(err => {
            console.error("AI Error:", err);
            setSpeech("Xin lỗi, kết nối AI bị lỗi rồi! ❌");
            speakText("Xin lỗi, kết nối bị lỗi rồi!", () => setSpeech(null));
          })
          .finally(() => {
            setIsWaving(false);
          });
      }
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
