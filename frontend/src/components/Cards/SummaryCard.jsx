const SummaryCard = ({ icon, title, value, subtitle, color = 'var(--color-primary)' }) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background orb */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `${color}15`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-md)',
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>
          {title}
        </p>
        <p
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: color,
            lineHeight: 1,
            marginBottom: '0.25rem',
          }}
        >
          {value}
        </p>
        {subtitle && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
