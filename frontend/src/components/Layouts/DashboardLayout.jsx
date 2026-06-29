import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="page-container" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
