import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home/Home';
import Feed from './pages/Feed/Feed';
import Profile from './pages/Profile/Profile';
import Messages from './pages/Messages/Messages';
import About from './pages/About/About';
import Auth from './pages/Auth/Auth';
import api from './api/axios';
import { runOneSignal } from './api/onesignal';

function App() {
  useEffect(() => {
    // Khởi động trạm OneSignal Web Push Notification
    runOneSignal();

    // Kiểm tra kết nối tới Backend khi app khởi chạy
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
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="feed" element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="about" element={<About />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
