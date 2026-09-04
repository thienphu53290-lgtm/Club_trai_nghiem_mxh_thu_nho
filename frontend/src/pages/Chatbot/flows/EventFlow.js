import api from '../../../api/axios'; // Import API của dự án

export const handleCreateEventFlow = async (answer, context) => {
  const { eventStep, setEventStep, eventData, setEventData, setChatMode, addBotMessage } = context;
  let nextData = { ...eventData };
  
  switch (eventStep) {
    case 1:
      nextData.tieu_de = answer;
      setEventData(nextData);
      setEventStep(2);
      addBotMessage(`Đã ghi nhận tên: "${answer}". Tiếp theo, sự kiện này sẽ tổ chức ở đâu?`, ["Online (Google Meet)", "Offline (Trung tâm triển lãm)", "Tự nhập địa điểm"]);
      break;

    case 2:
      nextData.dia_diem = answer;
      setEventData(nextData);
      setEventStep(3);
      addBotMessage(`Địa điểm: "${answer}". Sự kiện sẽ diễn ra vào ngày giờ nào? (Định dạng chuẩn: YYYY-MM-DD HH:mm:ss, ví dụ: 2026-12-25 20:00:00)`);
      break;

    case 3:
      nextData.thoi_gian_bat_dau = answer;
      setEventData(nextData);
      setEventStep(3.5); // Thêm bước hỏi thời gian kết thúc
      addBotMessage(`Ghi nhận lúc bắt đầu: ${answer}. Vậy thời gian kết thúc là khi nào? (Ví dụ: 2026-12-25 23:00:00)`);
      break;

    case 3.5:
      nextData.thoi_gian_ket_thuc = answer;
      setEventData(nextData);
      setEventStep(4);
      addBotMessage(`Đã ghi nhận thời gian kết thúc. Bạn hãy viết một đoạn mô tả ngắn cho sự kiện nhé!`);
      break;

    case 4:
      nextData.mo_ta = answer;
      setEventData(nextData);
      setEventStep(5);
      addBotMessage(`Đã lưu mô tả. Cuối cùng, giá vé tham gia là bao nhiêu?`, ["0", "100000", "500000"]);
      break;

    case 5:
      nextData.gia_ve = answer;
      setEventData(nextData);
      setEventStep(6);
      
      const summary = `Cảm ơn bạn! Dưới đây là Phiếu yêu cầu tạo sự kiện:\n
- **Tên:** ${nextData.tieu_de}
- **Địa điểm:** ${nextData.dia_diem}
- **Bắt đầu:** ${nextData.thoi_gian_bat_dau}
- **Kết thúc:** ${nextData.thoi_gian_ket_thuc}
- **Giá vé:** ${nextData.gia_ve} VNĐ\n
Bạn có chắc chắn muốn TẠO SỰ KIỆN này lên hệ thống PIVO không?`;
      addBotMessage(summary, ["Gửi cho Admin duyệt", "Hủy bỏ và làm lại"]);
      break;

    case 6:
      if (answer.toLowerCase().includes("gửi") || answer.toLowerCase().includes("đồng ý")) {
        addBotMessage("⏳ Đang gửi yêu cầu tạo sự kiện lên máy chủ, vui lòng đợi trong giây lát...");
        
        try {
          // Chuẩn bị payload khớp với EventController@store
          const payload = {
            tieu_de: nextData.tieu_de,
            dia_diem: nextData.dia_diem,
            thoi_gian_bat_dau: nextData.thoi_gian_bat_dau,
            thoi_gian_ket_thuc: nextData.thoi_gian_ket_thuc,
            mo_ta: nextData.mo_ta,
            gia_ve: nextData.gia_ve,
            goi_dich_vu_id: 1, // Mặc định gói Free
            anh_bia_url: 'https://placehold.co/800x400' // Ảnh bìa mặc định
          };

          // Chú ý: Ở frontend này user phải login thì backend mới cho tạo event (do API có auth:sanctum)
          const response = await api.post('/events', payload);
          
          addBotMessage(`✅ Tuyệt vời! Sự kiện của bạn đã được khởi tạo thành công với ID: ${response.data.event?.id || 'Thành công'}. Bạn có thể vào phần Sự kiện để xem nhé!`, ["Quay lại Menu chính"]);
        } catch (error) {
          console.error(error);
          addBotMessage(`❌ Có lỗi xảy ra khi tạo sự kiện: ${error.response?.data?.message || error.message}. Vui lòng thử lại sau!`, ["Tạo sự kiện mới", "Quay lại Menu chính"]);
        }

        setChatMode("normal");
        setEventStep(0);
        setEventData({ tieu_de: "", dia_diem: "", mo_ta: "", thoi_gian_bat_dau: "", thoi_gian_ket_thuc: "", gia_ve: "" });
      } else {
        addBotMessage("Đã hủy quy trình tạo sự kiện. Bạn cần hỗ trợ gì khác không?", ["Tạo sự kiện mới", "Quay lại Menu chính"]);
        setChatMode("normal");
        setEventStep(0);
      }
      break;

    default:
      setChatMode("normal");
      setEventStep(0);
      break;
  }
};
