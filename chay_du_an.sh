#!/usr/bin/env bash

trap 'trap - SIGINT SIGTERM EXIT; echo ""; echo "🛑 Đang tắt toàn bộ máy chủ (Backend, Reverb, Frontend)..."; lsof -ti:8000 -ti:8080 -ti:5173 | xargs kill -9 2>/dev/null' SIGINT SIGTERM EXIT

echo "=========================================================="
echo "🧹 Đang kiểm tra và giải phóng các cổng 8000, 8080, 5173..."
lsof -ti:8000 -ti:8080 -ti:5173 | xargs kill -9 2>/dev/null
sleep 1

echo "=========================================================="
echo " ĐANG KHỞI CHẠY HỆ THỐNG PIVO MXH THU NHỎ"
echo "=========================================================="

echo " [1/4] Khởi động Backend Laravel (Cổng 8000)..."
(trap - SIGINT SIGTERM EXIT; cd backend && php artisan serve --port=8000) &

echo "⚡ [2/4] Khởi động máy chủ Realtime Reverb (Cổng 8080)..."
(trap - SIGINT SIGTERM EXIT; cd backend && php artisan reverb:start --port=8080) &

echo " [3/4] Khởi động Frontend React (Cổng 5173)..."
(trap - SIGINT SIGTERM EXIT; cd frontend && npm run dev) &

echo "🤖 [4/4] Khởi động AI Moderation Worker (Hàng đợi ngầm)..."
(trap - SIGINT SIGTERM EXIT; cd backend && php artisan queue:work) &

echo "=========================================================="
echo " TOÀN BỘ HỆ THỐNG ĐÃ SẴN SÀNG! (Nhấn Ctrl+C để tắt)"
echo "=========================================================="

wait
