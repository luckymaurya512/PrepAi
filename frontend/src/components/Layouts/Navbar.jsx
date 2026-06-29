import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiLogout, HiChevronDown } from 'react-icons/hi';
import { useUser } from '../../context/userContext';
import { getInitials } from '../../utils/helper';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(15, 15, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
            }}
          >
            🤖
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.1rem',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PrepAI
          </span>
        </button>

        {/* Right side */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem 0.75rem',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            >
              {/* Avatar */}
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  {getInitials(user.name)}
                </div>
              )}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {user.name?.split(' ')[0]}
              </span>
              <HiChevronDown
                size={16}
                color="var(--color-text-muted)"
                style={{
                  transform: menuOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform var(--transition-fast)',
                }}
              />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 0.5rem)',
                  minWidth: '180px',
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  zIndex: 100,
                }}
              >
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#f87171',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    transition: 'background var(--transition-fast)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <HiLogout size={16} />
                  Sign Out
                </button>
              </div>
            )}

            {/* Click outside to close */}
            {menuOpen && (
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                onClick={() => setMenuOpen(false)}
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
