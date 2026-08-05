import React, { useEffect } from 'react';
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
import api from './api/axios';
import { runOneSignal } from './api/onesignal';

function App() {
  useEffect(() => {
    runOneSignal();

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
