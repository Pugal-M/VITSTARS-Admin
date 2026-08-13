import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertTriangle, Filter } from 'lucide-react';

export default function Academic() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademic = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('academic_records')
          .select(`
            *,
            students (name, register_number, programs(name), branches(name))
          `)
          .order('cgpa', { ascending: true }); // Show lowest CGPA first for risk identification

        if (error) throw error;
        setRecords(data || []);
      } catch (err) {
        console.error('Error fetching academic records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademic();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Academic Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Monitor CGPA, arrears, and academic risk</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Average CGPA</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>8.24</div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Students with Arrears</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-status-attention)' }}>
            {records.filter(r => r.arrears > 0).length}
          </div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Critical Risk (CGPA &lt; 6.5)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-status-critical)' }}>
            {records.filter(r => r.cgpa < 6.5).length}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Program/Branch</th>
                <th>CGPA</th>
                <th>Arrears</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>No academic records found.</td></tr>
              ) : (
                records.map(record => {
                  const isCritical = record.cgpa < 6.5 || record.arrears > 2;
                  const isWatch = (record.cgpa >= 6.5 && record.cgpa < 7.5) || record.arrears > 0;
                  
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
                      <td style={{ fontWeight: 600, color: isCritical ? 'var(--color-status-critical)' : 'inherit' }}>
                        {record.cgpa?.toFixed(2) || 'N/A'}
                      </td>
                      <td style={{ color: record.arrears > 0 ? 'var(--color-status-attention)' : 'inherit' }}>
                        {record.arrears || 0}
                      </td>
                      <td>
                        {isCritical ? (
                          <span className="badge badge-critical" style={{ gap: '4px' }}><AlertTriangle size={12}/> CRITICAL</span>
                        ) : isWatch ? (
                          <span className="badge badge-attention">WATCH</span>
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
