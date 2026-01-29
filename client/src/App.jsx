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
import ProtectedRoute from './components/auth/ProtectedRoute';

import { connectSocket, disconnectSocket } from './services/socket';

const App = () => {
  React.useEffect(() => {
    // Connect as GUEST by default since we removed auth
    connectSocket('GUEST');
    return () => disconnectSocket();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Experience */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Landing />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<OrderTracking />} />
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
          </Route>
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
