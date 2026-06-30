import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { HiBookmark } from 'react-icons/hi';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import RoleInfoHeader from './components/RoleInfoHeader';
import QuestionCard from './components/QuestionCard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const QUESTIONS_PER_PAGE = 5;

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(QUESTIONS_PER_PAGE);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.SESSIONS.BY_ID(sessionId));
      setSession(data);
      // Sort: pinned first, then by creation
      const sorted = [...(data.questions || [])].sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
      });
      setQuestions(sorted);
    } catch {
      toast.error('Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const handleGenerateMore = async () => {
    setGeneratingMore(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.SESSIONS.GENERATE_MORE(sessionId));
      setSession(data);
      const sorted = [...(data.questions || [])].sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
      });
      setQuestions(sorted);
      setVisibleCount(sorted.length); // Show all questions including new ones
      toast.success('Generated 5 more unique questions! 🚀');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate more questions');
    } finally {
      setGeneratingMore(false);
    }
  };

  const handlePinToggle = (questionId) => {
    setQuestions((prev) => {
      const updated = prev.map((q) =>
        q._id === questionId ? { ...q, isPinned: !q.isPinned } : q
      );
      // Re-sort after toggle
      return [...updated].sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
      });
    });
  };

  const pinnedQuestions = questions.filter((q) => q.isPinned);
  const allQuestions = questions;
  const visibleQuestions = allQuestions.slice(0, visibleCount);
  const hasMore = visibleCount < allQuestions.length;

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
          <SpinnerLoader size={48} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Loading your session...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" toastOptions={{ style: { background: '#16162a', color: '#f0f0ff', border: '1px solid rgba(99,102,241,0.2)' } }} />

      {/* Session header */}
      <RoleInfoHeader session={session} />

      {/* Pinned Questions Section */}
      {pinnedQuestions.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <HiBookmark size={18} color="var(--color-warning)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Pinned Questions
            </h2>
            <span
              className="badge badge-warning"
              style={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              {pinnedQuestions.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pinnedQuestions.map((q, i) => (
              <QuestionCard key={q._id} question={q} index={i} onPinToggle={handlePinToggle} />
            ))}
          </div>
        </section>
      )}

      {/* All Questions Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📚</span>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              All Questions
            </h2>
            <span className="badge badge-primary">{allQuestions.length}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Click a question to expand the answer • 💡 for AI explanation • 📌 to pin
          </p>
        </div>

        {allQuestions.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🤖</div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              No questions generated yet. The AI may have encountered an issue.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {visibleQuestions.map((q, i) => (
                <QuestionCard key={q._id} question={q} index={i} onPinToggle={handlePinToggle} />
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              {hasMore && (
                <button
                  onClick={() => setVisibleCount((n) => n + QUESTIONS_PER_PAGE)}
                  className="btn-ghost"
                  style={{ width: 'fit-content' }}
                >
                  Load More Questions ({allQuestions.length - visibleCount} remaining)
                </button>
              )}

              <button
                onClick={handleGenerateMore}
                disabled={generatingMore}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 2rem',
                  borderRadius: '999px',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-glow)',
                  opacity: generatingMore ? 0.7 : 1,
                  cursor: generatingMore ? 'not-allowed' : 'pointer',
                }}
              >
                {generatingMore ? (
                  <>
                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Generating 5 More Questions...
                  </>
                ) : (
                  <>🤖 Generate 5 More AI Questions</>
                )}
              </button>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
};

export default InterviewPrep;
