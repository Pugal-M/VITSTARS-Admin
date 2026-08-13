import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  PlaneTakeoff, 
  Building, 
  Library, 
  Users2, 
  Briefcase, 
  BellRing, 
  FileText, 
  Settings, 
  History,
  ClipboardList
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/students', icon: <Users size={18} />, label: 'Students' },
    { to: '/academic', icon: <GraduationCap size={18} />, label: 'Academic' },
    { to: '/attendance', icon: <CalendarCheck size={18} />, label: 'Attendance' },
    { to: '/leave-outing', icon: <PlaneTakeoff size={18} />, label: 'Leave & Outing' },
    { to: '/hostel', icon: <Building size={18} />, label: 'Hostel & Campus' },
    { to: '/library', icon: <Library size={18} />, label: 'Library' },
    { to: '/mentoring', icon: <Users2 size={18} />, label: 'Mentoring' },
    { to: '/alumni', icon: <Briefcase size={18} />, label: 'Alumni' },
    { to: '/alerts', icon: <BellRing size={18} />, label: 'Alerts & Follow-up' },
    { to: '/reports', icon: <FileText size={18} />, label: 'Reports & Analytics' },
    { to: '/forms', icon: <ClipboardList size={18} />, label: 'Forms & Data Collection' },
    { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
    { to: '/audit-log', icon: <History size={18} />, label: 'Audit Log' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ height: 'auto', minHeight: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <img src="/logo.png" alt="VIT STARS Logo" style={{ width: '100%', height: 'auto', maxHeight: '120px', objectFit: 'contain' }} />
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: 'var(--spacing-4)', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid var(--color-border)' }}>
        v1.0.0
      </div>
    </aside>
  );
}
