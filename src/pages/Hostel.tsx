import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, LogOut } from 'lucide-react';

export default function Hostel() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        setLoading(true);
        // Assuming there is a gate_movements table as per the schema
        const { data, error } = await supabase
          .from('gate_movements')
          .select(`
            *,
            students (name, register_number)
          `)
          .order('scan_time', { ascending: false })
          .limit(50);

        if (error) throw error;
        setMovements(data || []);
      } catch (err) {
        console.error('Error fetching hostel data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostelData();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Hostel & Campus</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Monitor gate movements and late returns</p>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card">
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Currently Outside</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>24</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Late Returns (Today)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-status-critical)' }}>3</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <h3 style={{ padding: 'var(--spacing-4)', margin: 0, borderBottom: '1px solid var(--color-border)' }}>Recent Gate Movements</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Direction</th>
                <th>Gate</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>Loading...</td></tr>
              ) : movements.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>No recent movements.</td></tr>
              ) : (
                movements.map(mov => (
                  <tr key={mov.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{mov.students?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{mov.students?.register_number?.toUpperCase()}</div>
                    </td>
                    <td>
                      {mov.direction === 'out' ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-status-attention)' }}>
                          <LogOut size={16} /> Exited Campus
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-status-good)' }}>
                          <LogIn size={16} /> Entered Campus
                        </span>
                      )}
                    </td>
                    <td>{mov.gate_name || 'Main Gate'}</td>
                    <td>{new Date(mov.scan_time).toLocaleString()}</td>
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
