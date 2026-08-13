import { Download, FileText } from 'lucide-react';

export default function Reports() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Reports & Analytics</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Generate and export system reports</p>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} /> Monthly STARS Report</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--spacing-4)' }}>Comprehensive report of all student activities, academic performance, and alerts.</p>
          <button className="btn btn-primary"><Download size={16} /> Export to PDF</button>
        </div>
      </div>
    </div>
  );
}
