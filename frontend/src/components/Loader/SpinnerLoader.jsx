const SpinnerLoader = ({ size = 40, color = 'var(--color-primary)' }) => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: `3px solid rgba(99, 102, 241, 0.15)`,
          borderTop: `3px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SpinnerLoader;
