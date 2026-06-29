import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiBriefcase, HiTag } from 'react-icons/hi';
import { getExperienceColor } from '../../../utils/helper';

const RoleInfoHeader = ({ session }) => {
  const navigate = useNavigate();

  if (!session) return null;

  const expColor = getExperienceColor(session.experience);
  const topics = session.topicsToFocus
    ? session.topicsToFocus.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
      }}
    >
      {/* Back button + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.75rem',
            color: 'var(--color-text-secondary)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all var(--transition-fast)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'var(--color-primary-light)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          <HiArrowLeft size={16} />
          Dashboard
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
            }}
          >
            {session.role}
          </h1>
          {session.description && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              {session.description}
            </p>
          )}
        </div>
      </div>

      {/* Badges row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
        {/* Experience badge */}
        <span
          className="badge"
          style={{
            background: `${expColor}20`,
            color: expColor,
            border: `1px solid ${expColor}40`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <HiBriefcase size={12} />
          {session.experience}
        </span>

        {/* Topics */}
        {topics.length > 0 ? (
          topics.slice(0, 5).map((topic, i) => (
            <span
              key={i}
              className="badge"
              style={{
                background: 'rgba(139,92,246,0.1)',
                color: '#c4b5fd',
                border: '1px solid rgba(139,92,246,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <HiTag size={10} />
              {topic}
            </span>
          ))
        ) : null}

        {topics.length > 5 && (
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            +{topics.length - 5} more
          </span>
        )}

        {/* AI status badge */}
        {session.isAIGenerated ? (
          <span
            className="badge"
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              marginLeft: 'auto',
            }}
          >
            🤖 AI Generated
          </span>
        ) : (
          <span
            className="badge"
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              marginLeft: 'auto',
            }}
          >
            💾 System Fallback
          </span>
        )}
      </div>
    </div>
  );
};

export default RoleInfoHeader;
