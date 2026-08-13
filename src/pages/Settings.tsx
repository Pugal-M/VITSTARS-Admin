import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>System Settings</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Configure thresholds and application preferences</p>
        </div>
      </div>
      <div className="card" style={{ maxWidth: '600px' }}>
        <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>Academic Thresholds</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div>
            <label className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Critical CGPA Threshold</label>
            <input type="number" className="input-field" defaultValue={6.5} step={0.1} />
          </div>
          <div>
            <label className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Critical Attendance Threshold (%)</label>
            <input type="number" className="input-field" defaultValue={75} />
          </div>
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}><Save size={16} /> Save Changes</button>
        </div>
      </div>
    </div>
  );
}
