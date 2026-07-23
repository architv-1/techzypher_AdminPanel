import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, BookOpen, Wrench, Users,
  LogOut, Shield, User, Menu, X, ChevronRight
} from 'lucide-react';
import useAdminAuth from './useAdminAuth';

const navItems = [
  { label: 'Dashboard',     path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Careers',       path: '/admin/dashboard/careers', icon: Briefcase },
  { label: 'Blogs',         path: '/admin/dashboard/blogs', icon: BookOpen },
  { label: 'Services',      path: '/admin/dashboard/services', icon: Wrench },
  { label: 'Professionals', path: '/admin/dashboard/professionals', icon: Users },
];

const AdminLayout = ({ children, adminData }) => {
  const navigate = useNavigate();
  const { logout, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 shrink-0">
            <Shield size={15} className="text-[#3b82f6]" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">
              <span className="text-[#3b82f6]">Tech</span>
              <span className="text-[#8b5cf6]">Zypher</span>
            </p>
            <p className="text-[10px] text-gray-600 mt-0.5">Admin CMS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === '/admin/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span>{label}</span>
                <ChevronRight size={13} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin info + logout */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        {adminData && (
          <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-xl bg-white/[0.03]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shrink-0">
              <User size={13} className="text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{adminData.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{adminData.email}</p>
            </div>
          </div>
        )}
        <button
          id="admin-sidebar-logout"
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-200 disabled:opacity-40"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#080808] border-r border-white/[0.05] fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 h-full w-64 bg-[#080808] border-r border-white/[0.05] z-50 md:hidden flex flex-col"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.05]">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.07] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          {adminData && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center">
                <User size={13} className="text-white" />
              </div>
              <span className="hidden sm:block font-medium text-gray-300">{adminData.name}</span>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
