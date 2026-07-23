import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

const emptyForm = {
  name: '',
  role: '',
  image: '',
  imagePosition: 'top',
  desc: '',
  linkedin: '',
  twitter: '',
  github: '',
  order: 0
};

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

const ProfessionalsManager = memo(() => {
  const [professionals, setProfessionals] = useState([]);
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

const SAMPLE_PROFESSIONALS = [
  {
    _id: 'prof-1',
    name: 'Alex Rivera',
    role: 'Lead Solutions Architect',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60',
    imagePosition: 'top',
    desc: '10+ years architecting scalable cloud infrastructure and enterprise React web platforms.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    github: 'https://github.com',
    order: 1
  },
  {
    _id: 'prof-2',
    name: 'Sarah Chen',
    role: 'Senior Frontend Specialist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60',
    imagePosition: 'top',
    desc: 'Passionate UI engineer specializing in high-performance Web animations and responsive design systems.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    github: 'https://github.com',
    order: 2
  },
  {
    _id: 'prof-3',
    name: 'Rahul Verma',
    role: 'Product Design Lead',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60',
    imagePosition: 'top',
    desc: 'Expert in user-centered design, prototyping, and modern dark-mode application interfaces.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    github: 'https://github.com',
    order: 3
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
            setForm(prev => ({ ...prev, image: data.url }));
            showToast('Image uploaded successfully!');
            setUploadingImage(false);
            return;
          }
        } catch {
          // offline fallback
        }
        setForm(prev => ({ ...prev, image: reader.result }));
        showToast('Image uploaded successfully!');
        setUploadingImage(false);
      };
    } catch {
      showToast('Failed to read file.', 'error');
      setUploadingImage(false);
    }
  }, [showToast]);

  const fetchProfessionals = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/professionals', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setProfessionals(data.data);
        setLoading(false);
        return;
      }
    } catch {
      // offline fallback
    }

    try {
      const stored = localStorage.getItem('cms_professionals');
      if (stored) {
        setProfessionals(JSON.parse(stored));
      } else {
        localStorage.setItem('cms_professionals', JSON.stringify(SAMPLE_PROFESSIONALS));
        setProfessionals(SAMPLE_PROFESSIONALS);
      }
    } catch {
      setProfessionals(SAMPLE_PROFESSIONALS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfessionals(); }, [fetchProfessionals]);

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
    setForm({
      name: item.name,
      role: item.role,
      image: item.image,
      imagePosition: item.imagePosition ?? 'top',
      desc: item.desc,
      linkedin: item.linkedin ?? '',
      twitter: item.twitter ?? '',
      github: item.github ?? '',
      order: item.order ?? 0
    });
    setShowModal(true);
  }, []);
  const closeModal = useCallback(() => { setShowModal(false); setEditItem(null); setForm(emptyForm); }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editItem ? `/api/professionals/${editItem._id}` : '/api/professionals';
      const method = editItem ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editItem ? 'Professional updated!' : 'Professional created!');
        closeModal();
        fetchProfessionals();
        setSaving(false);
        return;
      }
    } catch {
      // offline fallback
    }

    setProfessionals(prev => {
      let updated;
      if (editItem) {
        updated = prev.map(p => p._id === editItem._id ? { ...p, ...form, order: Number(form.order) } : p);
      } else {
        const newItem = { _id: `prof-${Date.now()}`, ...form, order: Number(form.order) };
        updated = [newItem, ...prev];
      }
      try { localStorage.setItem('cms_professionals', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast(editItem ? 'Professional updated!' : 'Professional created!');
    closeModal();
    setSaving(false);
  }, [editItem, form, closeModal, fetchProfessionals, showToast]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this professional?')) return;
    setDeleting(id);
    try {
      const res  = await fetch(`/api/professionals/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        showToast('Professional deleted.');
        fetchProfessionals();
        setDeleting(null);
        return;
      }
    } catch {
      // offline fallback
    }

    setProfessionals(prev => {
      const updated = prev.filter(p => p._id !== id);
      try { localStorage.setItem('cms_professionals', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast('Professional deleted.');
    setDeleting(null);
  }, [fetchProfessionals, showToast]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-white">Professionals</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{professionals.length} professional{professionals.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] shrink-0"
        >
          <Plus size={14} className="sm:size-[16px]" /> Add Professional
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-blue-400" />
        </div>
      ) : professionals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={40} className="text-gray-700 mb-3" />
          <p className="text-gray-500 text-sm">No professionals yet. Click "Add Professional" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {professionals.map((p) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 sm:gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 sm:p-4 hover:bg-white/[0.05] transition-all duration-200"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0 border border-white/10"
                style={{ objectPosition: p.imagePosition || 'top' }}
                onError={(e) => { e.target.src = 'https://placehold.co/56x56/1a1a1a/555?text=AVATAR'; }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">{p.name}</p>
                  <span className="text-[9px] sm:text-[10px] text-gray-600 shrink-0">#{p.order}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-blue-400 truncate">{p.role}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 mt-0.5">{p.desc}</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                  {deleting === p._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
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
              className="w-full max-w-lg bg-[#0d0d0d] border border-white/[0.09] rounded-2xl shadow-2xl flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
                <h3 className="font-bold text-white">{editItem ? 'Edit Professional' : 'Add New Professional'}</h3>
                <button onClick={closeModal} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"><X size={16} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Role / Position</label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                      placeholder="e.g. Senior Backend Developer"
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Image</label>
                    <div className="flex items-center gap-3">
                      {form.image && (
                        <img
                          src={form.image}
                          alt="Preview"
                          className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                          style={{ objectPosition: form.imagePosition || 'top' }}
                          onError={(e) => { e.target.src = 'https://placehold.co/48x48/1a1a1a/555?text=IMG'; }}
                        />
                      )}
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={form.image}
                          onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))}
                          placeholder="Upload or paste path..."
                          required
                          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-4 pr-24 py-2.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
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
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Image Position</label>
                    <input
                      type="text"
                      value={form.imagePosition}
                      onChange={(e) => setForm(f => ({ ...f, imagePosition: e.target.value }))}
                      placeholder="e.g. top, center 15%"
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Bio / Description</label>
                  <textarea
                    value={form.desc}
                    onChange={(e) => setForm(f => ({ ...f, desc: e.target.value }))}
                    placeholder="Brief description of skills, expertise, and background..."
                    required
                    rows={3}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors max-h-40 overflow-y-auto resize-y"
                  />
                </div>

                <div className="border-t border-white/[0.06] pt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Social Profiles (Optional)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        value={form.linkedin}
                        onChange={(e) => setForm(f => ({ ...f, linkedin: e.target.value }))}
                        placeholder="https://..."
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">Twitter URL</label>
                      <input
                        type="url"
                        value={form.twitter}
                        onChange={(e) => setForm(f => ({ ...f, twitter: e.target.value }))}
                        placeholder="https://..."
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">GitHub URL</label>
                      <input
                        type="url"
                        value={form.github}
                        onChange={(e) => setForm(f => ({ ...f, github: e.target.value }))}
                        placeholder="https://..."
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/[0.06] pt-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Display Order</label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={(e) => setForm(f => ({ ...f, order: e.target.value }))}
                      placeholder="0"
                      min={0}
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                    <p className="text-[10px] text-gray-600 mt-1">Lower number = shown first in marquee</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
                  <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white hover:border-white/20 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
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

ProfessionalsManager.displayName = 'ProfessionalsManager';

export default ProfessionalsManager;

