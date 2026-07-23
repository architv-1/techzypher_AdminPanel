import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Loader2, Briefcase, MapPin, IndianRupee, AlertCircle, CheckCircle2 } from 'lucide-react';

const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];

const FORM_INPUTS = [
  { label: 'Job Title', key: 'title', placeholder: 'e.g. Senior React Developer' },
  { label: 'Location', key: 'location', placeholder: 'e.g. Remote / Hybrid' },
  { label: 'Salary Range', key: 'salary', placeholder: 'e.g. 80k - 120k' },
];

const emptyForm = { image: '', title: '', type: 'Full Time', location: '', salary: '' };

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

const CareersManager = memo(() => {
  const [careers, setCareers]   = useState([]);
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

const SAMPLE_CAREERS = [
  {
    _id: 'career-1',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
    title: 'Senior React & Frontend Engineer',
    type: 'Full Time',
    location: 'Remote / Hybrid',
    salary: '$90k - $130k'
  },
  {
    _id: 'career-2',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
    title: 'Full-Stack Node.js Developer',
    type: 'Full Time',
    location: 'Bangalore, India',
    salary: '₹18L - ₹25L'
  },
  {
    _id: 'career-3',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60',
    title: 'UI/UX Product Designer',
    type: 'Contract',
    location: 'Remote',
    salary: '$60 - $80/hr'
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

  const fetchCareers = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/careers', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setCareers(data.data);
        setLoading(false);
        return;
      }
    } catch {
      // offline fallback
    }

    try {
      const stored = localStorage.getItem('cms_careers');
      if (stored) {
        setCareers(JSON.parse(stored));
      } else {
        localStorage.setItem('cms_careers', JSON.stringify(SAMPLE_CAREERS));
        setCareers(SAMPLE_CAREERS);
      }
    } catch {
      setCareers(SAMPLE_CAREERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCareers(); }, [fetchCareers]);

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
  const openEdit   = useCallback((item) => { setEditItem(item); setForm({ image: item.image, title: item.title, type: item.type, location: item.location, salary: item.salary }); setShowModal(true); }, []);
  const closeModal = useCallback(() => { setShowModal(false); setEditItem(null); setForm(emptyForm); }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editItem ? `/api/careers/${editItem._id}` : '/api/careers';
      const method = editItem ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editItem ? 'Career updated!' : 'Career created!');
        closeModal();
        fetchCareers();
        setSaving(false);
        return;
      }
    } catch {
      // offline fallback
    }

    setCareers(prev => {
      let updated;
      if (editItem) {
        updated = prev.map(c => c._id === editItem._id ? { ...c, ...form } : c);
      } else {
        const newItem = { _id: `career-${Date.now()}`, ...form };
        updated = [newItem, ...prev];
      }
      try { localStorage.setItem('cms_careers', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast(editItem ? 'Career updated!' : 'Career created!');
    closeModal();
    setSaving(false);
  }, [editItem, form, closeModal, fetchCareers, showToast]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this job listing?')) return;
    setDeleting(id);
    try {
      const res  = await fetch(`/api/careers/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        showToast('Career deleted.');
        fetchCareers();
        setDeleting(null);
        return;
      }
    } catch {
      // offline fallback
    }

    setCareers(prev => {
      const updated = prev.filter(c => c._id !== id);
      try { localStorage.setItem('cms_careers', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast('Career deleted.');
    setDeleting(null);
  }, [fetchCareers, showToast]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-white">Careers</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{careers.length} job listing{careers.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#3b82f6] hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] shrink-0"
        >
          <Plus size={14} className="sm:size-[16px]" /> Add Job
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#3b82f6]" />
        </div>
      ) : careers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Briefcase size={40} className="text-gray-700 mb-3" />
          <p className="text-gray-500 text-sm">No job listings yet. Click "Add Job" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {careers.map((c) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 sm:gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 sm:p-4 hover:bg-white/[0.05] transition-all duration-200"
            >
              <img
                src={c.image}
                alt={c.title}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0 border border-white/10"
                onError={(e) => { e.target.src = 'https://placehold.co/56x56/1a1a1a/555?text=IMG'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-white truncate">{c.title}</p>
                <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 mt-1">
                  <span className="text-[10px] sm:text-xs text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded-full shrink-0">{c.type}</span>
                  <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 truncate"><MapPin size={11} className="shrink-0" />{c.location}</span>
                  <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 shrink-0"><IndianRupee size={11} className="shrink-0" />{c.salary}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button onClick={() => openEdit(c)} className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id} className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40">
                  {deleting === c._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
                <h3 className="font-bold text-white">{editItem ? 'Edit Job' : 'Add New Job'}</h3>
                <button onClick={closeModal} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"><X size={16} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Image</label>
                  <div className="flex items-center gap-3">
                    {form.image && (
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                        onError={(e) => { e.target.src = 'https://placehold.co/48x48/1a1a1a/555?text=IMG'; }}
                      />
                    )}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={form.image}
                        onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))}
                        placeholder="Upload file or paste URL..."
                        required
                        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-4 pr-24 py-2.5 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
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

                {FORM_INPUTS.map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">{label}</label>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      required
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Job Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full bg-[#111] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#3b82f6]/50 transition-colors"
                  >
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white hover:border-white/20 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : (editItem ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
});

CareersManager.displayName = 'CareersManager';

export default CareersManager;

