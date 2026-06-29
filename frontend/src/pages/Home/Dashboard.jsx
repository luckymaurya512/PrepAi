import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { HiPlus, HiX } from 'react-icons/hi';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import SessionCard from '../../components/Cards/SessionCard';
import SummaryCard from '../../components/Cards/SummaryCard';
import SkeletonLoader from '../../components/Loader/SkeletonLoader';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { TECH_ROLES, EXPERIENCE_LEVELS } from '../../utils/data';
import { useUser } from '../../context/userContext';

const INITIAL_FORM = {
  role: '',
  customRole: '',
  experience: '',
  topicsToFocus: '',
  description: '',
};

const Dashboard = () => {
  const { user } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchSessions = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const { data } = await axiosInstance.get(`${API_PATHS.SESSIONS.BASE}?page=${pageNum}&limit=6`);
      const newSessions = data.sessions || [];
      setSessions((prev) => append ? [...prev, ...newSessions] : newSessions);
      setHasMore(data.hasMore);
      setTotalSessions(data.totalSessions);
      setPage(pageNum);
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions(1);
  }, [fetchSessions]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchSessions(page + 1, true);
    }
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const role = form.role === 'custom' ? form.customRole.trim() : form.role;
    if (!role || !form.experience) {
      toast.error('Please select a role and experience level');
      return;
    }

    setCreating(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.SESSIONS.BASE, {
        role,
        experience: form.experience,
        topicsToFocus: form.topicsToFocus,
        description: form.description,
      });
      setSessions((prev) => [data, ...prev]);
      setTotalSessions((n) => n + 1);
      setForm(INITIAL_FORM);
      setShowModal(false);
      toast.success('Session created! AI questions are ready 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create session');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSession = async (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await axiosInstance.delete(API_PATHS.SESSIONS.DELETE(confirmDeleteId));
      setSessions((prev) => prev.filter((s) => s._id !== confirmDeleteId));
      setTotalSessions((n) => Math.max(0, n - 1));
      toast.success('Session deleted');
    } catch {
      toast.error('Failed to delete session');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const pinnedTotal = sessions.reduce(
    (sum, s) => sum + (s.questions?.filter((q) => q.isPinned).length || 0),
    0
  );

  return (
    <DashboardLayout>
      <Toaster position="top-right" toastOptions={{ style: { background: '#16162a', color: '#f0f0ff', border: '1px solid rgba(99,102,241,0.2)' } }} />

      {/* Page header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
            My Sessions
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Welcome back, <span style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>! Ready to prep?
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem' }}
          id="create-session-btn"
        >
          <HiPlus size={18} />
          New Session
        </button>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <SummaryCard
          icon="📋"
          title="Total Sessions"
          value={totalSessions}
          subtitle="Interview prep sessions"
          color="var(--color-primary)"
        />
        <SummaryCard
          icon="📌"
          title="Pinned Questions"
          value={pinnedTotal}
          subtitle="Questions saved for review"
          color="var(--color-warning)"
        />
        <SummaryCard
          icon="🤖"
          title="AI Questions"
          value={sessions.reduce((s, sess) => s + (sess.questions?.length || 0), 0)}
          subtitle="Generated across all sessions"
          color="var(--color-accent)"
        />
      </div>

      {/* Sessions grid */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : sessions.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: '4rem', textAlign: 'center' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            No sessions yet
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Create your first interview session and let AI generate questions for you.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <HiPlus size={18} />
            Create First Session
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            {sessions.map((session) => (
              <SessionCard key={session._id} session={session} onDelete={handleDeleteSession} />
            ))}
          </div>

          {hasMore && (
            <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="btn-ghost"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {loadingMore ? (
                  <>
                    <div style={{ width: '14px', height: '14px', border: '2px solid rgba(99,102,241,0.3)', borderTop: '2px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Loading...
                  </>
                ) : (
                  'Load More Sessions'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Session Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && !creating && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: '520px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Modal header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                    New Interview Session
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    AI will generate 10 tailored questions
                  </p>
                </div>
                <button
                  onClick={() => !creating && setShowModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.25rem' }}
                >
                  <HiX size={22} />
                </button>
              </div>

              <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Role select */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Target Role <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    className="input-field"
                    required
                    style={{ appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select a role...</option>
                    {TECH_ROLES.map((r) => (
                      <option key={r} value={r} style={{ background: '#16162a' }}>{r}</option>
                    ))}
                    <option value="custom" style={{ background: '#16162a' }}>Custom Role...</option>
                  </select>
                </div>

                {/* Custom role input */}
                {form.role === 'custom' && (
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                      Custom Role Name <span style={{ color: 'var(--color-danger)' }}>*</span>
                    </label>
                    <input
                      name="customRole"
                      type="text"
                      value={form.customRole}
                      onChange={handleFormChange}
                      placeholder="e.g. Rust Systems Engineer"
                      className="input-field"
                      required
                    />
                  </div>
                )}

                {/* Experience level */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Experience Level <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, experience: level }))}
                        style={{
                          padding: '0.375rem 0.875rem',
                          borderRadius: '999px',
                          border: '1px solid',
                          borderColor: form.experience === level ? 'var(--color-primary)' : 'var(--color-border)',
                          background: form.experience === level ? 'rgba(99,102,241,0.15)' : 'transparent',
                          color: form.experience === level ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topics */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Topics to Focus <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>(optional, comma-separated)</span>
                  </label>
                  <input
                    name="topicsToFocus"
                    type="text"
                    value={form.topicsToFocus}
                    onChange={handleFormChange}
                    placeholder="e.g. React Hooks, System Design, TypeScript"
                    className="input-field"
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Session Notes <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>(optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="e.g. Interview at Acme Corp for senior position"
                    className="input-field"
                    rows={3}
                    style={{ resize: 'vertical', minHeight: '80px', lineHeight: 1.6 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => !creating && setShowModal(false)}
                    className="btn-ghost"
                    style={{ flex: 1 }}
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      flex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      opacity: creating ? 0.7 : 1,
                      cursor: creating ? 'not-allowed' : 'pointer',
                    }}
                    disabled={creating}
                  >
                    {creating ? (
                      <>
                        <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Generating Questions...
                      </>
                    ) : (
                      '🤖 Create & Generate'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: '380px', padding: '2rem', textAlign: 'center' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗑️</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                Delete Session?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                This will permanently delete the session and all its questions. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setConfirmDeleteId(null)} className="btn-ghost" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button onClick={confirmDelete} className="btn-danger" style={{ flex: 1, padding: '0.625rem' }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
};

export default Dashboard;
