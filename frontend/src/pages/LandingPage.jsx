import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LANDING_FEATURES, HOW_IT_WORKS } from '../utils/data';
import { useUser } from '../context/userContext';
import logo from '../assets/PrepAi_logo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleGetStarted = () => {
    if (user) navigate('/dashboard');
    else navigate('/signup');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        overflowX: 'hidden',
      }}
    >
      {/* ─── NAVBAR ─────────────────────────────────────────────── */}
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
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src={logo}
              alt="PrepAI Logo"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
              }}
            />
            <span
              style={{
                fontWeight: 800,
                fontSize: '1.15rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              PrepAI
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                Dashboard →
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-ghost" style={{ padding: '0.5rem 1.1rem' }}>
                  Sign In
                </button>
                <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 1.5rem 5rem',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background orbs */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            style={{ marginBottom: '1.5rem' }}
          >
            <span
              className="badge badge-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
            >
              ⚡ Powered by Google Gemini AI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
              color: 'var(--color-text-primary)',
            }}
          >
            Ace Your Next{' '}
            <span className="gradient-text">Tech Interview</span>
            <br />
            with AI-Powered Prep
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            style={{
              fontSize: '1.15rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}
          >
            Get role-specific interview questions and detailed answers generated by Google Gemini.
            Study smarter, practice better, and land your dream job.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button
              onClick={handleGetStarted}
              className="btn-primary"
              id="hero-get-started-btn"
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              🚀 Start Preparing Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-ghost"
              style={{ padding: '0.875rem 2rem', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
            >
              Sign In
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}
          >
            Free to start • No credit card required • Powered by Gemini AI
          </motion.p>
        </div>

        {/* Floating UI preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{ maxWidth: '680px', margin: '4rem auto 0' }}
        >
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              textAlign: 'left',
              background: 'rgba(22,22,42,0.9)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                {['#ef4444', '#f59e0b', '#10b981'].map((c, i) => (
                  <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
                ))}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                PrepAI — Senior React Developer Session
              </span>
            </div>

            {[
              { q: 'What is the difference between useCallback and useMemo?', open: true },
              { q: 'Explain React\'s reconciliation algorithm' },
              { q: 'How do you optimize performance in a large React app?' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '0.875rem 1rem',
                  background: item.open ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${item.open ? 'rgba(99,102,241,0.3)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: item.open ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: item.open ? 'white' : 'var(--color-text-muted)',
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: item.open ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', fontWeight: item.open ? 600 : 400 }}>
                    {item.q}
                  </span>
                </div>
                {item.open && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      paddingLeft: '2rem',
                      fontSize: '0.82rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.6,
                      borderLeft: '2px solid rgba(99,102,241,0.3)',
                      paddingLeft: '0.875rem',
                    }}
                  >
                    <code style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary-light)', padding: '0.1em 0.35em', borderRadius: '4px', fontSize: '0.85em' }}>useCallback</code> memoizes a <em>function reference</em> while <code style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary-light)', padding: '0.1em 0.35em', borderRadius: '4px', fontSize: '0.85em' }}>useMemo</code> memoizes the <em>computed value</em>. Use <code style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary-light)', padding: '0.1em 0.35em', borderRadius: '4px', fontSize: '0.85em' }}>useCallback</code> for event handlers passed as props...
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(22,22,42,0.4)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              Everything You Need to{' '}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              A complete interview prep toolkit powered by cutting-edge AI
            </p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {LANDING_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="glass-card"
                style={{ padding: '1.75rem' }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99,102,241,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              How It{' '}
              <span className="gradient-text">Works</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              From zero to interview-ready in four simple steps
            </p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                style={{ textAlign: 'center', padding: '0.5rem' }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: 'white',
                    boxShadow: 'var(--shadow-glow)',
                  }}
                >
                  {step.step}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 50%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glowing orb background */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                marginBottom: '1rem',
              }}
            >
              Ready to Land Your Dream Job?
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '1rem',
                marginBottom: '2rem',
                lineHeight: 1.7,
              }}
            >
              Join thousands of developers who use PrepAI to ace their technical interviews.
              Start your first session today — it's completely free.
            </p>
            <button
              onClick={handleGetStarted}
              className="btn-primary"
              id="cta-get-started-btn"
              style={{
                padding: '0.875rem 2.5rem',
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              🚀 Start Preparing Now — Free
            </button>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <img
            src={logo}
            alt="PrepAI Logo"
            style={{
              width: '24px',
              height: '24px',
              objectFit: 'contain',
            }}
          />
          <span
            style={{
              fontWeight: 700,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PrepAI
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          AI-powered interview preparation • Built with Google Gemini
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
