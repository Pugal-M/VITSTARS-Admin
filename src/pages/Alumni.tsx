import { Briefcase } from 'lucide-react';

export default function Alumni() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Alumni Directory</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Manage alumni profiles and student mappings</p>
        </div>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
        <Briefcase size={32} color="var(--color-text-muted)" style={{ margin: '0 auto', marginBottom: 'var(--spacing-4)' }} />
        <h3>Alumni Module</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>Alumni data integration is pending API finalization.</p>
      </div>
    </div>
  );
}
