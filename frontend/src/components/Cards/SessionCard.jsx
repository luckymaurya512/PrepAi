import { useNavigate } from 'react-router-dom';
import { HiTrash, HiClock, HiQuestionMarkCircle, HiBookmark } from 'react-icons/hi';
import { formatDate, getExperienceColor, truncateText } from '../../utils/helper';

const SessionCard = ({ session, onDelete }) => {
  const navigate = useNavigate();

  const pinnedCount = session.questions?.filter((q) => q.isPinned).length || 0;
  const totalQuestions = session.questions?.length || 0;

  const handleCardClick = () => {
    navigate(`/session/${session._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(session._id);
  };

  const expColor = getExperienceColor(session.experience);

  return (
    <div
      className="glass-card"
      onClick={handleCardClick}
      style={{
        padding: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${expColor}, var(--color-primary))`,
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '0.25rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '0.25rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {session.role}
          </h3>
          {session.description && (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {truncateText(session.description, 60)}
            </p>
          )}
        </div>

        <button
          onClick={handleDelete}
          className="btn-danger"
          style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', flexShrink: 0, marginLeft: '0.75rem' }}
          aria-label="Delete session"
        >
          <HiTrash size={16} />
        </button>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span
          className="badge"
          style={{
            background: `${expColor}20`,
            color: expColor,
            border: `1px solid ${expColor}40`,
          }}
        >
          {session.experience}
        </span>
        {session.topicsToFocus && (
          <span className="badge badge-primary">
            {truncateText(session.topicsToFocus, 20)}
          </span>
        )}
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}
          >
            <HiQuestionMarkCircle size={14} />
            {totalQuestions} Questions
          </span>
          {pinnedCount > 0 && (
            <span
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--color-warning)' }}
            >
              <HiBookmark size={14} />
              {pinnedCount} Pinned
            </span>
          )}
        </div>

        <span
          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
        >
          <HiClock size={13} />
          {formatDate(session.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default SessionCard;
