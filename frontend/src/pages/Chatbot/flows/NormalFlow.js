import api from '../../../api/axios';

export const handleNormalChat = async (question, context) => {
  const { setChatMode, setEventStep, addBotMessage } = context;
  const lowerQ = question.toLowerCase();
  
  // Các kịch bản cố định (Rule-based)
  if (lowerQ.includes("tạo sự kiện") || lowerQ.includes("tạo event")) {
    setChatMode("creating_event");
    setEventStep(1);
    addBotMessage("OK! Quy trình tạo sự kiện sẽ gồm 5 bước. Đầu tiên, bạn muốn đặt **Tên sự kiện** là gì?");
    return;
  }

  if (lowerQ.includes("nâng cấp") || lowerQ.includes("vip")) {
    addBotMessage("Để nâng cấp VIP, bạn vui lòng truy cập menu 'Gói dịch vụ' ở thanh điều hướng phía trên nhé!", ["Quay lại Menu chính"]);
    return;
  }

  if (lowerQ.includes("báo cáo") || lowerQ.includes("lỗi")) {
    addBotMessage("Bạn đang gặp lỗi gì? Hãy mô tả ngắn gọn để mình ghi nhận nhé.", ["Lỗi đăng nhập", "Lỗi nạp tiền", "Khác", "Quay lại Menu chính"]);
    return;
  }

  if (lowerQ.includes("menu")) {
    addBotMessage("Đây là các chức năng mình có thể hỗ trợ theo kịch bản:", ["Tạo sự kiện mới", "Nâng cấp gói VIP", "Báo cáo lỗi"]);
    return;
  }

  // Nếu không khớp kịch bản nào -> Gọi AI (Gemini) xử lý
  try {
    const response = await api.post('/chatbot/ask', { message: question });
    const aiReply = response.data.reply;
    addBotMessage(aiReply);
  } catch (error) {
    console.error("Lỗi khi gọi AI:", error);
    addBotMessage("Dạ mình đang bị mất kết nối với hệ thống AI rồi. Tạm thời bạn có thể chọn các chức năng có sẵn nhé:", ["Tạo sự kiện mới", "Nâng cấp gói VIP", "Báo cáo lỗi"]);
  }
};
