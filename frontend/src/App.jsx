import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home/Home';
import Feed from './pages/Feed/Feed';
import Profile from './pages/Profile/Profile';
import Messages from './pages/Messages/Messages';
import About from './pages/About/About';
import Auth from './pages/Auth/Auth';
import SuperAdmin from './pages/Admin/SuperAdmin';
import Products from './pages/Products/Products';
import ProductDetail from './pages/Products/ProductDetail';
import Events from './pages/Events/Events';
import Friends from './pages/Friends/Friends';
import Pricing from './pages/Pricing/Pricing';
import Onboarding from './pages/Onboarding/Onboarding';
import api from './api/axios';
import { runOneSignal } from './api/onesignal';

function App() {
  const [showLockedModal, setShowLockedModal] = useState(false);

  useEffect(() => {
    // Check if account was locked
    if (localStorage.getItem('account_locked') === 'true') {
      setShowLockedModal(true);
    }
    runOneSignal();

    const token = localStorage.getItem('auth_token');
    if (token) {
      api.get('/user')
        .then(response => {
          if (response.data.status === true) {
            localStorage.setItem('current_user', JSON.stringify(response.data.data));
          }
        })
        .catch(error => {
          console.error("❌ Token invalid or expired", error);
        });
    }

    api.get('/test-connection')
      .then(response => {
        console.log("🔥 Tín hiệu từ Backend:", response.data);
      })
      .catch(error => {
        console.error("❌ Lỗi kết nối Backend:", error);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<SuperAdmin />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="feed" element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="about" element={<About />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="friends" element={<Friends />} />
        </Route>
      </Routes>

      {showLockedModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl border-4 border-[#0f172a] shadow-[8px_8px_0px_0px_rgba(201,54,56,1)] overflow-hidden animate-slideUp text-center p-8">
            <div className="w-16 h-16 rounded-full bg-rose-100 border-2 border-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-rose-600" size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Tài khoản bị khóa</h2>
            <p className="text-sm font-medium text-slate-600 mb-6 px-2">
              Phiên đăng nhập của bạn đã kết thúc do tài khoản đã bị tạm khóa bởi Ban quản trị hệ thống.
            </p>
            
            <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 mb-6 text-left">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Thông tin hỗ trợ mở khóa</p>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <span className="text-indigo-600 font-bold text-sm">@</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Email Hỗ trợ</p>
                  <p className="text-sm font-bold text-slate-800">hotro@clubtrainghiem.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-emerald-600 font-bold text-sm">📞</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Hotline 24/7</p>
                  <p className="text-sm font-bold text-slate-800">1800 6868</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                localStorage.removeItem('account_locked');
                setShowLockedModal(false);
              }}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-sm border-2 border-[#0f172a] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              OK, TÔI ĐÃ HIỂU
            </button>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
