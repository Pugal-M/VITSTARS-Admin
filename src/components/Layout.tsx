import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VtopHeader from './VtopHeader';
import VtopNavbar from './VtopNavbar';

export default function Layout() {
  const { user, adminProfile, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading Admin Workspace...</div>;
  }

  if (!user || !adminProfile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <VtopHeader toggleMobileMenu={toggleMobileMenu} />
      <VtopNavbar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      <div className="main-wrapper">
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
