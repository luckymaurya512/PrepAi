import { useState } from 'react';
import { HiBookmark, HiChevronDown, HiLightBulb, HiCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import AIResponseRenderer from './AIResponseRenderer';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import toast from 'react-hot-toast';

const QuestionCard = ({ question, index, onPinToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  const handleTogglePin = async (e) => {
    e.stopPropagation();
    setPinLoading(true);
    try {
      await axiosInstance.put(API_PATHS.QUESTIONS.TOGGLE_PIN(question._id));
      onPinToggle(question._id);
    } catch {
      toast.error('Failed to toggle pin');
    } finally {
      setPinLoading(false);
    }
  };

  const handleExplain = async (e) => {
    e.stopPropagation();
    if (explanation) {
      setShowExplanation((v) => !v);
      return;
    }
    setLoadingExplanation(true);
    setShowExplanation(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
        concept: question.question,
        context: question.answer,
      });
      setExplanation(data.explanation);
    } catch {
      toast.error('Failed to generate explanation');
      setShowExplanation(false);
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="glass-card"
      style={{ overflow: 'hidden' }}
    >
      {/* Question Header */}
      <div
        onClick={() => setIsOpen((v) => !v)}
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Question number */}
        <div
          style={{
            minWidth: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
            marginTop: '1px',
          }}
        >
          {index + 1}
        </div>

        {/* Question text */}
        <p
          style={{
            flex: 1,
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 1.5,
          }}
        >
          {question.question}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Explain button */}
          <button
            onClick={handleExplain}
            title="Get AI explanation"
            style={{
              background: explanation ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)',
              border: explanation ? '1px solid rgba(6,182,212,0.3)' : '1px solid var(--color-border)',
              color: explanation ? '#67e8f9' : 'var(--color-text-muted)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all var(--transition-fast)',
            }}
          >
            <HiLightBulb size={16} />
          </button>

          {/* Pin button */}
          <button
            onClick={handleTogglePin}
            disabled={pinLoading}
            title={question.isPinned ? 'Unpin question' : 'Pin question'}
            style={{
              background: question.isPinned ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
              border: question.isPinned ? '1px solid rgba(245,158,11,0.3)' : '1px solid var(--color-border)',
              color: question.isPinned ? '#fcd34d' : 'var(--color-text-muted)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'all var(--transition-fast)',
              opacity: pinLoading ? 0.5 : 1,
            }}
          >
            <HiBookmark size={16} />
          </button>

          {/* Expand chevron */}
          <div
            style={{
              color: 'var(--color-text-muted)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform var(--transition-normal)',
              display: 'flex',
            }}
          >
            <HiChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* Answer section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderTop: '1px solid var(--color-border)',
                background: 'rgba(99, 102, 241, 0.03)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <HiCheck size={16} color="var(--color-success)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-success)' }}>
                  Answer
                </span>
              </div>
              <AIResponseRenderer content={question.answer} />
            </div>

            {/* AI Explanation section */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderTop: '1px solid var(--color-border)',
                      background: 'rgba(6, 182, 212, 0.03)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <HiLightBulb size={16} color="#67e8f9" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#67e8f9' }}>
                        AI Deep Explanation
                      </span>
                    </div>
                    {loadingExplanation ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            border: '2px solid rgba(6,182,212,0.2)',
                            borderTop: '2px solid #67e8f9',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                          }}
                        />
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          Generating explanation...
                        </span>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      </div>
                    ) : (
                      <AIResponseRenderer content={explanation} />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionCard;
