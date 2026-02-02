import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import Landing from './pages/customer/Landing';
import Dashboard from './pages/admin/Dashboard';
import FoodManagement from './pages/admin/FoodManagement';
import Orders from './pages/admin/Orders';
import Cart from './pages/customer/Cart';
import OrderTracking from './pages/customer/Orders';
import Support from './pages/customer/Support';
import AdminLogin from './pages/admin/Login';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { getGuestId } from './lib/guest';
import socket, { connectSocket, disconnectSocket } from './services/socket';

const App = () => {
  React.useEffect(() => {
    // Connect with unique guestId to receive personal order updates
    const guestId = getGuestId();
    connectSocket(guestId);

    // Heartbeat mechanism for Active Customer tracking
    const heartbeatInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('user-activity');
      }
    }, 30000); // 30 seconds

    // Track activity on visibility change (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && socket.connected) {
        socket.emit('user-activity');
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      disconnectSocket();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Experience */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Landing />} />
          <Route path="cart" element={<Cart />} />
          <Route path="my-orders" element={<OrderTracking />} />
          <Route path="orders" element={<Navigate to="/my-orders" replace />} />
          <Route path="support" element={<Support />} />
          {/* Redirect /menu to home as we have a unified fast ordering landing */}
          <Route path="menu" element={<Navigate to="/" replace />} />
        </Route>

        {/* Admin Management */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="food" element={<FoodManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
