import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertTriangle, Bell } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('alerts')
          .select(`
            *,
            students (name, register_number)
          `)
          .order('created_at', { ascending: false });

        let fetchedAlerts = data || [];
        if (fetchedAlerts.length === 0) {
          // Fallback mock data
          fetchedAlerts = [
            { id: 'mock-1', priority: 'Critical', students: { name: 'Rahul Verma', register_number: '21BCE0561' }, category: 'Attendance', message: 'Consecutive absence for 5 days in Data Structures', status: 'open' },
            { id: 'mock-2', priority: 'Medium', students: { name: 'Sneha Patel', register_number: '22BCE1532' }, category: 'Academic', message: 'Failed to submit CAT 1 assignment', status: 'open' },
            { id: 'mock-3', priority: 'Critical', students: { name: 'Arjun Kumar', register_number: '21BCE1042' }, category: 'Hostel', message: 'Late entry to hostel after 11 PM', status: 'open' },
            { id: 'mock-4', priority: 'Medium', students: { name: 'Priya Sharma', register_number: '22BCE2091' }, category: 'General', message: 'Pending tuition fee payment', status: 'resolved' },
          ];
        }
        setAlerts(fetchedAlerts);
      } catch (err) {
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleResolve = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    // Ideally this would also update Supabase
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Alerts & Follow-up</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Centralized view for student issues requiring attention</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-status-critical)', padding: 'var(--spacing-3)', borderRadius: '12px' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-status-critical)' }}>
              {alerts.filter(a => a.status !== 'resolved' && a.priority === 'Critical').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Critical Issues</div>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-status-attention)', padding: 'var(--spacing-3)', borderRadius: '12px' }}>
            <Bell size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {alerts.filter(a => a.status !== 'resolved' && a.priority === 'Medium').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Open Alerts</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-status-good)', padding: 'var(--spacing-3)', borderRadius: '12px' }}>
            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-status-good)' }}>
              {alerts.filter(a => a.status === 'resolved').length}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Resolved</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Student</th>
                <th>Category</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>Loading...</td></tr>
              ) : alerts.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>No alerts at this time.</td></tr>
              ) : (
                alerts.map(alert => (
                  <tr key={alert.id}>
                    <td>
                      {alert.priority === 'Critical' ? (
                        <span style={{ color: 'var(--color-status-critical)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <AlertTriangle size={16} /> High
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-status-attention)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Bell size={16} /> Medium
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{alert.students?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{alert.students?.register_number?.toUpperCase()}</div>
                    </td>
                    <td>{alert.category || 'General'}</td>
                    <td style={{ maxWidth: '300px' }}>{alert.message}</td>
                    <td>
                      <span className={`badge ${alert.status === 'resolved' ? 'badge-good' : 'badge-critical'}`}>
                        {alert.status?.toUpperCase() || 'OPEN'}
                      </span>
                    </td>
                    <td>
                      {alert.status !== 'resolved' && (
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                          onClick={() => handleResolve(alert.id)}
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
