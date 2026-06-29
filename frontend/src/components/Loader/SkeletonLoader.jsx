const SkeletonBlock = ({ width = '100%', height = '1rem', style = {} }) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius: 'var(--radius-sm)', ...style }}
  />
);

const SessionCardSkeleton = () => (
  <div
    className="glass-card"
    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <SkeletonBlock width="60%" height="1.25rem" />
      <SkeletonBlock width="24px" height="24px" style={{ borderRadius: '50%' }} />
    </div>
    <SkeletonBlock width="40%" height="0.875rem" />
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <SkeletonBlock width="80px" height="1.5rem" style={{ borderRadius: '999px' }} />
      <SkeletonBlock width="100px" height="1.5rem" style={{ borderRadius: '999px' }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SkeletonBlock width="120px" height="0.875rem" />
      <SkeletonBlock width="80px" height="2rem" style={{ borderRadius: 'var(--radius-md)' }} />
    </div>
  </div>
);

const SkeletonLoader = ({ count = 6 }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.25rem',
    }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SessionCardSkeleton key={i} />
    ))}
  </div>
);

export default SkeletonLoader;
