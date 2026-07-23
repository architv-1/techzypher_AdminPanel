import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const AdminSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/admin/dashboard', { replace: true }), 1800);
      } else {
        setError(data.message || 'Signup failed. Admin may already exist.');
      }
    } catch {
      setError('Network error. Is the server running on port 8080?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden px-4">

      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8b5cf6]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#3b82f6]/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.5)]">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 mb-4">
              <ShieldCheck className="text-[#8b5cf6]" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create Admin Account</h1>
            <p className="text-gray-500 text-sm mt-1">
              <span className="text-[#3b82f6] font-semibold">Tech</span>
              <span className="text-[#8b5cf6] font-semibold">Zypher</span>
              {' '}— One-time setup
            </p>
          </div>

          {/* Success State */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-6 text-center"
              >
                <CheckCircle2 className="text-green-400" size={48} />
                <p className="text-green-400 font-semibold">Admin account created!</p>
                <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          {!success && (
            <>
              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" id="admin-signup-form">

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="admin-name" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    id="admin-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Arjun Sharma"
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6]/60 focus:bg-white/[0.07] transition-all duration-200"
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="admin-signup-email" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    id="admin-signup-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@techzypher.com"
                    autoComplete="email"
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6]/60 focus:bg-white/[0.07] transition-all duration-200"
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="admin-signup-password" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Password <span className="text-gray-600 normal-case tracking-normal">(min. 8 chars)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="admin-signup-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6]/60 focus:bg-white/[0.07] transition-all duration-200"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="admin-confirm-password" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Confirm Password
                  </label>
                  <input
                    id="admin-confirm-password"
                    name="confirm"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6]/60 focus:bg-white/[0.07] transition-all duration-200"
                    disabled={loading}
                  />
                </div>

                {/* Submit */}
                <button
                  id="admin-signup-btn"
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-bold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Admin Account'
                  )}
                </button>
              </form>

              <p className="text-center text-gray-600 text-xs mt-5">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/admin/login')}
                  className="text-[#3b82f6] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-gray-700 text-xs mt-4">
          © {new Date().getFullYear()} TechZypher. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminSignup;
