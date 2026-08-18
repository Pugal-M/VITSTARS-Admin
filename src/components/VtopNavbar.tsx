import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, ChevronRight, Book, BookOpen, PawPrint, FileText } from 'lucide-react';

interface VtopNavbarProps {
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

export default function VtopNavbar({ isMobileMenuOpen, closeMobileMenu }: VtopNavbarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuInteraction = (menuName: string) => {
    if (isMobile) {
      setActiveMenu(activeMenu === menuName ? null : menuName);
    } else {
      setActiveMenu(menuName);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveMenu(null);
    }
  };

  const handleLinkClick = () => {
    setActiveMenu(null);
    if (isMobile) {
      closeMobileMenu();
    }
  };

  const LinkIcon = () => <span style={{ fontSize: '16px', color: '#888' }}>⇨</span>;

  return (
    <div className={`vtop-navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`} onMouseLeave={handleMouseLeave}>
      <div className="vtop-nav-item" onClick={() => { navigate('/'); handleLinkClick(); }}>
        <Menu size={18} />
      </div>

      <ChevronRight size={14} className="nav-separator" style={{ color: '#ccc', margin: 'auto 4px' }} />

      <div 
        className={`vtop-nav-item ${activeMenu === 'Academics' ? 'active' : ''}`}
        onMouseEnter={() => !isMobile && handleMenuInteraction('Academics')}
        onClick={() => isMobile && handleMenuInteraction('Academics')}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Academics
        </span>
        {activeMenu === 'Academics' && (
          <div className="mega-menu">
            <div className="mega-menu-title">Academics</div>
            <div className="mega-menu-column">
              <h4><Book size={14} color="#f472b6" /> General</h4>
              <NavLink to="/academic" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Academic Overview</NavLink>
              <NavLink to="/attendance" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Class Attendance</NavLink>
            </div>
            <div className="mega-menu-column">
              <h4><BookOpen size={14} color="#f43f5e" /> Course Registration</h4>
              <NavLink to="/forms" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Forms & Data</NavLink>
              <NavLink to="/library" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Library</NavLink>
            </div>
            <div className="mega-menu-column">
              <h4><PawPrint size={14} color="#f472b6" /> Proctor</h4>
              <NavLink to="/mentoring" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Mentoring</NavLink>
              <NavLink to="/alerts" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Alerts</NavLink>
              <NavLink to="/reports" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Reports</NavLink>
            </div>
            <div className="mega-menu-column">
              <h4><FileText size={14} color="#f43f5e" /> Project Proposal</h4>
              <NavLink to="/alumni" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Alumni</NavLink>
            </div>
          </div>
        )}
      </div>

      <ChevronRight size={14} className="nav-separator" style={{ color: '#ccc', margin: 'auto 4px' }} />

      <div 
        className={`vtop-nav-item ${activeMenu === 'Examinations' ? 'active' : ''}`}
        onMouseEnter={() => !isMobile && handleMenuInteraction('Examinations')}
        onClick={() => isMobile && handleMenuInteraction('Examinations')}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Examinations
        </span>
        {activeMenu === 'Examinations' && (
          <div className="mega-menu">
            <div className="mega-menu-title">Examinations</div>
            <div className="mega-menu-column">
              <h4><FileText size={14} color="#f472b6" /> Examinations</h4>
              <NavLink to="/grade-history" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Grade History</NavLink>
              <NavLink to="/mark-details" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Mark Details</NavLink>
            </div>
            <div className="mega-menu-column">
              <h4><FileText size={14} color="#f43f5e" /> Arrear Section</h4>
              <NavLink to="/arrears" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Arrear History</NavLink>
            </div>
          </div>
        )}
      </div>

      <ChevronRight size={14} className="nav-separator" style={{ color: '#ccc', margin: 'auto 4px' }} />

      <div 
        className={`vtop-nav-item ${activeMenu === 'Hostels' ? 'active' : ''}`}
        onMouseEnter={() => !isMobile && handleMenuInteraction('Hostels')}
        onClick={() => isMobile && handleMenuInteraction('Hostels')}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Hostels
        </span>
        {activeMenu === 'Hostels' && (
          <div className="mega-menu">
            <div className="mega-menu-title">Hostels</div>
            <div className="mega-menu-column">
              <h4><Book size={14} color="#f472b6" /> Leave Management</h4>
              <NavLink to="/leave" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> STARS Leave Approval</NavLink>
              <NavLink to="/late-night-leave" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Late night Leave approval</NavLink>
              <NavLink to="/outing" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Outing Approval</NavLink>
              <NavLink to="/hostel" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Hostel Attendance</NavLink>
            </div>
          </div>
        )}
      </div>

      <ChevronRight size={14} className="nav-separator" style={{ color: '#ccc', margin: 'auto 4px' }} />

      <div 
        className={`vtop-nav-item ${activeMenu === 'Students' ? 'active' : ''}`} 
        onMouseEnter={() => !isMobile && handleMenuInteraction('Students')}
        onClick={() => isMobile && handleMenuInteraction('Students')}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Students Info
        </span>
        {activeMenu === 'Students' && (
          <div className="mega-menu">
            <div className="mega-menu-title">Students Info</div>
            <div className="mega-menu-column">
              <h4><Book size={14} color="#f472b6" /> Directory</h4>
              <NavLink to="/students" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Students</NavLink>
            </div>
          </div>
        )}
      </div>
      
      <ChevronRight size={14} className="nav-separator" style={{ color: '#ccc', margin: 'auto 4px' }} />
      
      <div 
        className={`vtop-nav-item ${activeMenu === 'System' ? 'active' : ''}`} 
        onMouseEnter={() => !isMobile && handleMenuInteraction('System')}
        onClick={() => isMobile && handleMenuInteraction('System')}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          System
        </span>
        {activeMenu === 'System' && (
          <div className="mega-menu">
            <div className="mega-menu-title">System</div>
            <div className="mega-menu-column">
              <h4><FileText size={14} color="#f472b6" /> Configuration</h4>
              <NavLink to="/settings" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Settings</NavLink>
              <NavLink to="/audit-log" className="mega-menu-link" onClick={handleLinkClick}><LinkIcon /> Audit Log</NavLink>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
