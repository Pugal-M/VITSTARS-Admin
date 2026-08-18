import { Home, Printer, Star, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface VtopHeaderProps {
  toggleMobileMenu: () => void;
}

export default function VtopHeader({ toggleMobileMenu }: VtopHeaderProps) {
  const { adminProfile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="vtop-header">
      <div className="vtop-logo">
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <Menu size={24} />
        </button>
        <img src="/logo.png" alt="VIT Logo" style={{ filter: 'brightness(0) invert(1)' }} />
        <div className="header-quick-links" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Home size={18} />
          </button>
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <Printer size={18} />
          </button>
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
            <Star size={16} /> Quick Links ▾
          </button>
        </div>
      </div>

      <button className="campus-btn header-campus-btn">
        <User size={14} /> Campus Etiquette
      </button>

      <div className="vtop-header-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => signOut()}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fff', color: '#1b4b7f', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <User size={20} />
          </div>
          <span className="header-user-name" style={{ fontWeight: 'bold' }}>
            {adminProfile?.name || 'ADMIN'} (STAFF)
          </span>
        </div>
      </div>
    </header>
  );
}

