import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell } from 'lucide-react';

export default function Header() {
  const { adminProfile, signOut } = useAuth();

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
        {/* Breadcrumbs or page title could go here dynamically */}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', position: 'relative' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: 'var(--color-status-critical)', borderRadius: '50%' }}></span>
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', borderLeft: '1px solid var(--color-border)', paddingLeft: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '50%' }}>
            <User size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{adminProfile?.name || 'Admin'}</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{adminProfile?.employee_id || 'Administrator'}</span>
          </div>
          <button onClick={signOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', marginLeft: 'var(--spacing-4)' }} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
