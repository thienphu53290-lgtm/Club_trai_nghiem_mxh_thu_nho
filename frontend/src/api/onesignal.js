import OneSignal from 'react-onesignal';

export const runOneSignal = async () => {
  try {
    const appId = import.meta.env.VITE_ONESIGNAL_APP_ID || '82c07ec7-ebdf-4221-8255-a0bc8ba14502';
    
    await OneSignal.init({
      appId: appId,
      allowLocalhostAsSecureOrigin: true, // Bắt buộc mở khóa cho localhost test không cần SSL (HTTPS)
      notifyButton: {
        enable: true, // Hiện quả chuông Subscription góc trái dưới
        size: 'medium',
        position: 'bottom-left',
        showCredit: false,
        text: {
          'tip.state.unsubscribed': 'Bấm vào để bật thông báo Desktop Push (OneSignal)',
          'tip.state.subscribed': 'Bạn đang bật thông báo Desktop OS Push',
          'tip.state.blocked': 'Bạn đã từ chối nhận thông báo Push trên trình duyệt này',
          'message.action.subscribed': 'Đã bật thông báo OS Push từ PIVO!',
          'message.action.resubscribed': 'Đã khôi phục thông báo OS Push!',
          'message.action.unsubscribed': 'Đã tắt nhận thông báo OS Push ngoài màn hình.',
        },
        colors: {
          'circle.background': '#c93638',
          'circle.foreground': 'white',
          'badge.background': '#c93638',
          'badge.foreground': 'white',
          'badge.bordercolor': 'white',
          'pulse.color': '#c93638',
          'dialog.button.background.hovered': '#c93638',
          'dialog.button.background': '#f2a9a9',
          'dialog.button.foreground': 'white',
        }
      },
      promptOptions: {
        slidedown: {
          prompts: [
            {
              type: "push",
              autoPrompt: true,
              text: {
                actionMessage: "Bạn có muốn nhận thông báo nháy ra góc màn hình máy tính ngay cả khi đóng web từ PIVO?",
                acceptButton: "CHO PHÉP PUSH",
                cancelButton: "ĐỂ SAU",
              },
              delay: {
                pageViews: 1,
                timeDelay: 2,
              },
            },
          ],
        },
      },
    });

    console.log("🚀 [OneSignal] Web Push SDK đã khởi tạo thành công trên thiết bị!");
  } catch (error) {
    console.error("❌ [OneSignal] Lỗi khởi tạo Web Push:", error);
  }
};
