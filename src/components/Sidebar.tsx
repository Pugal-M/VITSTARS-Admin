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
  const navGroups = [
    {
      title: '', // Uncategorized top items
      items: [
        { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
      ]
    },
    {
      title: 'Students Info',
      items: [
        { to: '/students', icon: <Users size={18} />, label: 'Students' },
      ]
    },
    {
      title: 'Academics',
      items: [
        { to: '/academic', icon: <GraduationCap size={18} />, label: 'Academic Overview' },
        { to: '/attendance', icon: <CalendarCheck size={18} />, label: 'Attendance' },
      ]
    },
    {
      title: 'Examinations',
      items: [
        { to: '/grade-history', icon: <FileText size={18} />, label: 'Grade History' },
        { to: '/mark-details', icon: <ClipboardList size={18} />, label: 'Mark Details' },
        { to: '/arrears', icon: <FileText size={18} />, label: 'Arrear History' },
      ]
    },
    {
      title: 'Leave Management',
      items: [
        { to: '/leave', icon: <PlaneTakeoff size={18} />, label: 'STARS Leave Approval' },
        { to: '/late-night-leave', icon: <PlaneTakeoff size={18} />, label: 'Late night Leave approval' },
        { to: '/outing', icon: <PlaneTakeoff size={18} />, label: 'Outing Approval' },
        { to: '/hostel', icon: <Building size={18} />, label: 'Hostel Attendance' },
      ]
    },
    {
      title: 'Other Modules',
      items: [
        { to: '/library', icon: <Library size={18} />, label: 'Library' },
        { to: '/mentoring', icon: <Users2 size={18} />, label: 'Mentoring' },
        { to: '/alumni', icon: <Briefcase size={18} />, label: 'Alumni' },
        { to: '/forms', icon: <ClipboardList size={18} />, label: 'Forms & Data Collection' },
      ]
    },
    {
      title: 'System',
      items: [
        { to: '/alerts', icon: <BellRing size={18} />, label: 'Alerts & Follow-up' },
        { to: '/reports', icon: <FileText size={18} />, label: 'Reports & Analytics' },
        { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
        { to: '/audit-log', icon: <History size={18} />, label: 'Audit Log' },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ height: 'auto', minHeight: 'var(--header-height)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <img src="/logo.png" alt="VIT STARS Logo" style={{ width: '100%', height: 'auto', maxHeight: '120px', objectFit: 'contain' }} />
        </div>
      </div>
      <nav className="sidebar-nav" style={{ paddingBottom: '2rem' }}>
        {navGroups.map((group, idx) => (
          <div key={idx} style={{ marginBottom: group.title ? '1.5rem' : '0.5rem' }}>
            {group.title && (
              <div style={{ 
                padding: '0 1.25rem 0.5rem', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: 'var(--color-text-muted)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                {group.title}
              </div>
            )}
            {group.items.map((item) => (
              <NavLink 
                key={item.label} 
                to={item.to} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end={item.to === '/'}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding: 'var(--spacing-4)', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid var(--color-border)' }}>
        v1.0.0
      </div>
    </aside>
  );
}
