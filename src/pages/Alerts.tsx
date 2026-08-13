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
        const { data, error } = await supabase
          .from('alerts')
          .select(`
            *,
            students (name, register_number)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAlerts(data || []);
      } catch (err) {
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Alerts & Follow-up</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Centralized view for student issues requiring attention</p>
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
                        <button className="btn btn-outline" style={{ padding: '4px', fontSize: '0.75rem' }}>
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
