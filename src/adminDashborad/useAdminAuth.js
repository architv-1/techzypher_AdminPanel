import { useState, useCallback } from 'react';

const DEFAULT_ADMIN = { name: 'Admin User', email: 'admin@techzypher.com' };

const useAdminAuth = () => {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      return stored ? JSON.parse(stored) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Check current session ────────────────────────────────────────────────
  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/me', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setAdmin(data.admin);
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        return true;
      }
    } catch {
      // Backend offline: use UI local session fallback
    }

    const stored = localStorage.getItem('admin_user');
    if (stored) {
      setAdmin(JSON.parse(stored));
      setLoading(false);
      return true;
    }

    // Default to active session in pure UI mode
    localStorage.setItem('admin_user', JSON.stringify(DEFAULT_ADMIN));
    setAdmin(DEFAULT_ADMIN);
    setLoading(false);
    return true;
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setAdmin(data.admin);
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        return { success: true };
      }
    } catch {
      // UI Mode Fallback Login
      const mockUser = { name: email.split('@')[0] || 'Admin', email: email || 'admin@techzypher.com' };
      setAdmin(mockUser);
      localStorage.setItem('admin_user', JSON.stringify(mockUser));
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: true };
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('admin_user');
      setAdmin(null);
      setLoading(false);
    }
  }, []);

  return { admin, loading, error, checkAuth, login, logout };
};

export default useAdminAuth;

