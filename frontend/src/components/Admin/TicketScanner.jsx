import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle, XCircle, Camera, RefreshCcw, PowerOff, Play } from 'lucide-react';
import api from '../../api/axios';

const TicketScanner = ({ eventSlug }) => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const html5QrCode = useRef(null);

  // We need to keep a ref of isScanning so the callback has fresh value
  const isScanningRef = useRef(false);
  
  useEffect(() => {
    isScanningRef.current = isScanning;
  }, [isScanning]);

  const playBeep = (isSuccess) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (isSuccess) {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } else {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.error("Audio beep failed", e);
    }
  };

  const onScanSuccess = async (decodedText, decodedResult) => {
    // Only process if we are currently accepting scans
    if (!isScanningRef.current) return;
    
    setIsScanning(false);
    
    try {
      const response = await api.post('/admin/events/checkin', {
        code: decodedText,
        event_slug: eventSlug
      });
      
      setScanResult({
        status: 'success',
        message: response.data.message,
        data: response.data.data
      });
      playBeep(true);
    } catch (error) {
      setScanResult({
        status: 'error',
        message: error.response?.data?.message || 'Có lỗi xảy ra khi check-in',
        data: null
      });
      playBeep(false);
    }
  };

  const onScanFailure = (error) => {
    // ignore
  };

  const startScanner = async () => {
    try {
      if (!html5QrCode.current) {
        html5QrCode.current = new Html5Qrcode("reader");
      }
      await html5QrCode.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanFailure
      );
      setIsCameraOn(true);
      setIsScanning(true);
      setScanResult(null);
    } catch (err) {
      console.error("Error starting scanner", err);
      alert("Không thể khởi động camera. Vui lòng cấp quyền truy cập.");
    }
  };

  const stopScanner = async () => {
    if (html5QrCode.current && isCameraOn) {
      try {
        await html5QrCode.current.stop();
        setIsCameraOn(false);
        setIsScanning(false);
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        html5QrCode.current.stop().catch(console.error);
      }
    };
  }, []);

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-[#0f172a] p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-xl flex items-center gap-2">
          <Camera className="text-blue-500" /> Quét Mã Vé Điện Tử
        </h3>
        
        {isCameraOn ? (
          <button 
            onClick={stopScanner}
            className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors border-2 border-rose-300"
          >
            <PowerOff size={16} /> Tắt Cam
          </button>
        ) : (
          <button 
            onClick={startScanner}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors border-2 border-emerald-300"
          >
            <Play size={16} /> Bật Cam
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] relative">
          
          {/* We must keep #reader completely empty so React doesn't conflict with html5-qrcode DOM manipulation */}
          <div id="reader" className="w-full max-w-sm rounded-xl overflow-hidden bg-black mb-4 min-h-[250px]"></div>
          
          {!isCameraOn && (
            <div className="absolute top-0 left-0 w-full h-[250px] flex items-center justify-center pointer-events-none">
              <Camera size={48} className="text-slate-500 opacity-50" />
            </div>
          )}

          {isCameraOn && (
            <p className="text-sm font-bold text-slate-500 text-center">
              Đưa mã QR của khách hàng vào khung hình để quét tự động.
            </p>
          )}
        </div>

        {/* Result Area */}
        <div className="flex flex-col justify-center">
          {scanResult ? (
            <div className={`p-6 rounded-2xl border-4 ${
              scanResult.status === 'success' 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                : 'bg-rose-50 border-rose-500 text-rose-900'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {scanResult.status === 'success' ? (
                  <CheckCircle size={32} className="text-emerald-500" />
                ) : (
                  <XCircle size={32} className="text-rose-500" />
                )}
                <h4 className="font-black text-xl">
                  {scanResult.status === 'success' ? 'Thành Công!' : 'Thất Bại!'}
                </h4>
              </div>
              
              <p className="font-bold mb-4">{scanResult.message}</p>
              
              {scanResult.data && (
                <div className="bg-white/60 p-4 rounded-xl border border-black/10 space-y-2 text-sm">
                  <p><strong>Khách hàng:</strong> {scanResult.data.ho_ten}</p>
                  <p><strong>Email:</strong> {scanResult.data.email}</p>
                  <p><strong>Sự kiện:</strong> {scanResult.data.su_kien}</p>
                </div>
              )}

              {isCameraOn && (
                <button 
                  onClick={resetScanner}
                  className={`mt-6 w-full py-3 rounded-xl font-black flex items-center justify-center gap-2 border-2 ${
                    scanResult.status === 'success'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700'
                      : 'bg-rose-500 hover:bg-rose-600 text-white border-rose-700'
                  } transition-colors`}
                >
                  <RefreshCcw size={18} /> Quét vé tiếp theo
                </button>
              )}
            </div>
          ) : (
            <div className="h-full bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[300px]">
              <Camera size={48} className="mb-4 opacity-50" />
              <h4 className="font-bold text-lg mb-2">Sẵn sàng quét vé</h4>
              <p className="text-sm">Kết quả quét sẽ hiển thị tại đây.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketScanner;
