import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Filter } from 'lucide-react';

export default function Attendance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('attendance_records')
          .select(`
            *,
            students (name, register_number, programs(name), branches(name))
          `)
          .order('percentage', { ascending: true }); // Show lowest first

        if (error) throw error;
        setRecords(data || []);
      } catch (err) {
        console.error('Error fetching attendance:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Attendance Tracking</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Monitor student attendance and identify risks</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Program/Branch</th>
                <th>Total Classes</th>
                <th>Attended</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>No attendance records found.</td></tr>
              ) : (
                records.map(record => {
                  const pct = record.percentage;
                  const isCritical = pct < 75;
                  const isWarning = pct >= 75 && pct < 80;
                  
                  return (
                    <tr key={record.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{record.students?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{record.students?.register_number?.toUpperCase()}</div>
                      </td>
                      <td>
                        <div>{record.students?.programs?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{record.students?.branches?.name}</div>
                      </td>
                      <td>{record.total_classes || 0}</td>
                      <td>{record.attended_classes || 0}</td>
                      <td style={{ fontWeight: 600, color: isCritical ? 'var(--color-status-critical)' : 'inherit' }}>
                        {pct?.toFixed(2)}%
                      </td>
                      <td>
                        {isCritical ? (
                          <span className="badge badge-critical">CRITICAL</span>
                        ) : isWarning ? (
                          <span className="badge badge-attention">WARNING</span>
                        ) : (
                          <span className="badge badge-good">GOOD</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
