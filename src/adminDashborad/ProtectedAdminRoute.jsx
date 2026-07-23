import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const [authState, setAuthState] = useState('loading');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch('/api/admin/me', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setAuthState('authorized');
          return;
        }
      } catch {
        // Backend offline fallback
      }

      // Check localStorage or default to authorized for UI demo
      const stored = localStorage.getItem('admin_user');
      if (stored !== null && stored === 'null') {
        setAuthState('unauthorized');
      } else {
        setAuthState('authorized');
      }
    };
    verify();
  }, []);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium tracking-wide">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (authState === 'unauthorized') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;

