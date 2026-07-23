import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './adminDashborad/AdminDashboard';
import AdminLogin from './adminDashborad/AdminLogin';
import AdminSignup from './adminDashborad/AdminSignup';
import ProtectedAdminRoute from './adminDashborad/ProtectedAdminRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard/*"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default App;