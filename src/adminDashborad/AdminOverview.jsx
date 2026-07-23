import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, BookOpen, Wrench, ArrowRight, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, count, color, path, delay }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={() => navigate(path)}
      className="cursor-pointer bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <ArrowRight size={16} className="text-gray-600 group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-200" />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{count}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </motion.div>
  );
};

const AdminOverview = ({ adminData }) => {
  const [counts, setCounts] = useState({ careers: 0, blogs: 0, services: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [c, b, s] = await Promise.all([
          fetch('/api/careers', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/blogs', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/services', { credentials: 'include' }).then(r => r.json()),
        ]);
        if (c.success && b.success && s.success) {
          setCounts({
            careers: c.data?.length ?? 0,
            blogs: b.data?.length ?? 0,
            services: s.data?.length ?? 0,
          });
          setLoading(false);
          return;
        }
      } catch {
        // pure UI fallback
      }

      // Check localStorage or default sample counts
      const getStoredCount = (key, defaultCount) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item).length : defaultCount;
        } catch { return defaultCount; }
      };

      setCounts({
        careers: getStoredCount('cms_careers', 3),
        blogs: getStoredCount('cms_blogs', 3),
        services: getStoredCount('cms_services', 3),
      });
      setLoading(false);
    };
    fetchCounts();
  }, []);

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back{adminData ? `, ${adminData.name}` : ''} 👋
        </h1>
        <p className="text-gray-500 text-sm">Manage your website content from here.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Briefcase}
          label="Total Job Listings"
          count={loading ? '—' : counts.careers}
          color="bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20"
          path="/admin/dashboard/careers"
          delay={0.1}
        />
        <StatCard
          icon={BookOpen}
          label="Total Blog Posts"
          count={loading ? '—' : counts.blogs}
          color="bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20"
          path="/admin/dashboard/blogs"
          delay={0.2}
        />
        <StatCard
          icon={Wrench}
          label="Total Services"
          count={loading ? '—' : counts.services}
          color="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          path="/admin/dashboard/services"
          delay={0.3}
        />
      </div>

      {/* Quick tips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-[#3b82f6]" />
          <p className="text-sm font-semibold text-gray-300">Quick Tips</p>
        </div>
        <ul className="space-y-2 text-sm text-gray-500">
          <li className="flex items-start gap-2">
            <span className="text-[#3b82f6] mt-0.5">•</span>
            Use the sidebar to navigate between Careers, Blogs, and Services.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#3b82f6] mt-0.5">•</span>
            All content is saved to MongoDB and instantly reflected on the public website.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#3b82f6] mt-0.5">•</span>
            Use public image URLs (e.g. Unsplash, Cloudinary) for images.
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
