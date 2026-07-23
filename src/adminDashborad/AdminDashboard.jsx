import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminOverview from './AdminOverview';
import CareersManager from './cms/CareersManager';
import BlogsManager from './cms/BlogsManager';
import ServicesManager from './cms/ServicesManager';
import ProfessionalsManager from './cms/ProfessionalsManager';
import useAdminAuth from './useAdminAuth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAdminAuth();
  const [adminData, setAdminData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const res  = await fetch('/api/admin/me', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setAdminData(data.admin);
          setAuthChecked(true);
          return;
        }
      } catch {
        // pure UI fallback
      }

      const stored = localStorage.getItem('admin_user');
      const mockAdmin = stored ? JSON.parse(stored) : { name: 'Admin User', email: 'admin@techzypher.com' };
      setAdminData(mockAdmin);
      setAuthChecked(true);
    };
    init();
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout adminData={adminData}>
      <Routes>
        <Route index element={<AdminOverview adminData={adminData} />} />
        <Route path="careers"       element={<CareersManager />} />
        <Route path="blogs"         element={<BlogsManager />} />
        <Route path="services"      element={<ServicesManager />} />
        <Route path="professionals" element={<ProfessionalsManager />} />
        <Route path="*"             element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
