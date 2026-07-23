import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, BookOpen, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

const emptyForm = { thumbnail: '', title: '', description: '', content: '', category: '' };

const FORM_FIELDS = [
  { label: 'Title', key: 'title', placeholder: 'Blog post title' },
  { label: 'Category', key: 'category', placeholder: 'e.g. Technology, Product Insights' },
];

const Toast = memo(({ msg, type }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 40 }}
    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium ${
      type === 'success'
        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
        : 'bg-red-500/10 border border-red-500/30 text-red-400'
    }`}
  >
    {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
    {msg}
  </motion.div>
));

Toast.displayName = 'Toast';

const BlogsManager = memo(() => {
  const [blogs, setBlogs]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [toast, setToast]         = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const toastTimerRef = useRef(null);

  const showToast = useCallback((msg, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ msg, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

const SAMPLE_BLOGS = [
  {
    _id: 'blog-1',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    title: 'Building High-Performance Web Applications with React & Vite',
    description: 'Explore modern techniques and architectural patterns for ultra-responsive web applications.',
    content: 'Full article content describing React optimization, code splitting, dynamic imports, and performance patterns...',
    category: 'Engineering',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'blog-2',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
    title: 'Next-Gen UI/UX Design Trends in 2026',
    description: 'A deep dive into dark-mode aesthetics, glassmorphism, micro-animations, and fluid design systems.',
    content: 'Modern web experiences require striking visuals paired with effortless usability...',
    category: 'Design Insights',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'blog-3',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
    title: 'Architecting Scalable Cloud Microservices',
    description: 'How to build high-availability microservices with minimal latency and automatic failover.',
    content: 'Cloud native architectures provide seamless scalability for growing platforms...',
    category: 'Technology',
    createdAt: new Date().toISOString()
  }
];

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ base64: reader.result, name: file.name }),
          });
          const data = await res.json();
          if (data.success) {
            setForm(prev => ({ ...prev, thumbnail: data.url }));
            showToast('Thumbnail uploaded successfully!');
            setUploadingImage(false);
            return;
          }
        } catch {
          // offline fallback
        }
        setForm(prev => ({ ...prev, thumbnail: reader.result }));
        showToast('Image uploaded successfully!');
        setUploadingImage(false);
      };
    } catch {
      showToast('Failed to read file.', 'error');
      setUploadingImage(false);
    }
  }, [showToast]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/blogs', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
        setLoading(false);
        return;
      }
    } catch {
      // offline fallback
    }

    try {
      const stored = localStorage.getItem('cms_blogs');
      if (stored) {
        setBlogs(JSON.parse(stored));
      } else {
        localStorage.setItem('cms_blogs', JSON.stringify(SAMPLE_BLOGS));
        setBlogs(SAMPLE_BLOGS);
      }
    } catch {
      setBlogs(SAMPLE_BLOGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const openCreate = useCallback(() => { setEditItem(null); setForm(emptyForm); setShowModal(true); }, []);
  const openEdit   = useCallback((item) => {
    setEditItem(item);
    setForm({ thumbnail: item.thumbnail, title: item.title, description: item.description, content: item.content, category: item.category });
    setShowModal(true);
  }, []);
  const closeModal = useCallback(() => { setShowModal(false); setEditItem(null); setForm(emptyForm); }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editItem ? `/api/blogs/${editItem._id}` : '/api/blogs';
      const method = editItem ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editItem ? 'Blog updated!' : 'Blog created!');
        closeModal();
        fetchBlogs();
        setSaving(false);
        return;
      }
    } catch {
      // offline fallback
    }

    // UI Local State Edit/Create
    setBlogs(prev => {
      let updated;
      if (editItem) {
        updated = prev.map(b => b._id === editItem._id ? { ...b, ...form } : b);
      } else {
        const newItem = { _id: `blog-${Date.now()}`, ...form, createdAt: new Date().toISOString() };
        updated = [newItem, ...prev];
      }
      try { localStorage.setItem('cms_blogs', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast(editItem ? 'Blog updated!' : 'Blog created!');
    closeModal();
    setSaving(false);
  }, [editItem, form, closeModal, fetchBlogs, showToast]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    setDeleting(id);
    try {
      const res  = await fetch(`/api/blogs/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        showToast('Blog deleted.');
        fetchBlogs();
        setDeleting(null);
        return;
      }
    } catch {
      // offline fallback
    }

    setBlogs(prev => {
      const updated = prev.filter(b => b._id !== id);
      try { localStorage.setItem('cms_blogs', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast('Blog deleted.');
    setDeleting(null);
  }, [fetchBlogs, showToast]);

  const fmt = useCallback((d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-white">Blogs</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{blogs.length} post{blogs.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#8b5cf6] hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] shrink-0"
        >
          <Plus size={14} className="sm:size-[16px]" /> Add Blog
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#8b5cf6]" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen size={40} className="text-gray-700 mb-3" />
          <p className="text-gray-500 text-sm">No blog posts yet. Click "Add Blog" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {blogs.map((b) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:bg-white/[0.05] transition-all duration-200"
            >
              <div className="h-36 overflow-hidden relative">
                <img
                  src={b.thumbnail}
                  alt={b.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x144/1a1a1a/555?text=IMG'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#8b5cf6]/80 text-white">
                  {b.category}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-white line-clamp-1 mb-1">{b.title}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{b.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar size={11} />{fmt(b.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(b._id)} disabled={deleting === b._id} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                      {deleting === b._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-hidden"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0d0d0d] border border-white/[0.09] rounded-2xl shadow-2xl flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
                <h3 className="font-bold text-white">{editItem ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
                <button onClick={closeModal} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"><X size={16} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Thumbnail Image</label>
                  <div className="flex items-center gap-3">
                    {form.thumbnail && (
                      <img
                        src={form.thumbnail}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                        onError={(e) => { e.target.src = 'https://placehold.co/48x48/1a1a1a/555?text=IMG'; }}
                      />
                    )}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={form.thumbnail}
                        onChange={(e) => setForm(f => ({ ...f, thumbnail: e.target.value }))}
                        placeholder="Upload file or paste URL..."
                        required
                        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-4 pr-24 py-2.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
                      />
                      <label className="absolute right-2 top-1.5 bottom-1.5 flex items-center justify-center px-3 bg-white/10 hover:bg-white/15 text-white text-[10px] font-semibold rounded-lg cursor-pointer transition-colors border border-white/5">
                        {uploadingImage ? <Loader2 size={12} className="animate-spin" /> : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {FORM_FIELDS.map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">{label}</label>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Short Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief summary shown on blog card..."
                    required
                    rows={3}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors max-h-32 overflow-y-auto resize-y"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Full Content</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Full blog article content. Use **bold** for bold text..."
                    required
                    rows={8}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6]/50 transition-colors max-h-64 overflow-y-auto resize-y"
                  />
                </div>

                <div className="flex gap-3 ">
                  <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white hover:border-white/20 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-violet-500 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : (editItem ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
});

BlogsManager.displayName = 'BlogsManager';

export default BlogsManager;

