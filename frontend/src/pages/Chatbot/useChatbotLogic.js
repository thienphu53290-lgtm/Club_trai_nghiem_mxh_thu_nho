import { useState } from 'react';
import { handleNormalChat } from './flows/NormalFlow';
import { handleCreateEventFlow } from './flows/EventFlow';

export const useChatbotLogic = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Xin chào! Mình là trợ lý tự động của PIVO. Bạn muốn mình hỗ trợ việc gì nào?", 
      sender: "bot",
      options: ["Tạo sự kiện mới", "Nâng cấp gói VIP", "Báo cáo lỗi", "Cần gặp Admin"] 
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // State quản lý luồng trò chuyện
  const [chatMode, setChatMode] = useState("normal"); 
  const [eventStep, setEventStep] = useState(0); 
  const [eventData, setEventData] = useState({
    tieu_de: "", dia_diem: "", mo_ta: "", thoi_gian_bat_dau: "", thoi_gian_ket_thuc: "", gia_ve: ""
  });

  const addBotMessage = (text, options = []) => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender: "bot", options }]);
    setIsTyping(false);
  };

  // Đóng gói context để truyền xuống các luồng
  const flowContext = {
    setChatMode,
    eventStep,
    setEventStep,
    eventData,
    setEventData,
    addBotMessage
  };

  const processMessage = (text) => {
    if (!text.trim()) return;

    // Thêm tin nhắn của User
    const userMessage = { id: Date.now(), text: text, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    
    setInputText("");
    setIsTyping(true);

    // Xử lý logic và phân nhánh luồng
    setTimeout(() => {
      if (chatMode === "normal") {
        handleNormalChat(text, flowContext);
      } else if (chatMode === "creating_event") {
        handleCreateEventFlow(text, flowContext);
      }
    }, 1000);
  };

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    chatMode,
    processMessage
  };
};
