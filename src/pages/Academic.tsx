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
        const { data: students, error: stuError } = await supabase
          .from('students')
          .select(`
            id, name, register_number, initial_sgpas, initial_arrears,
            programs(name), branches(name)
          `);

        if (stuError) throw stuError;

        const { data: acadData } = await supabase
          .from('academic_records')
          .select('*');

        let mergedRecords: any[] = [];

        (students || []).forEach(student => {
           const formalRecords = (acadData || []).filter(r => r.student_id === student.id);
           
           if (formalRecords.length > 0) {
              const latest = formalRecords[0];
              mergedRecords.push({
                 id: latest.id,
                 student_id: student.id,
                 students: student,
                 cgpa: latest.cgpa,
                 arrears: latest.arrears || 0
              });
           } else {
              let cgpa = null;
              if (student.initial_sgpas && Array.isArray(student.initial_sgpas) && student.initial_sgpas.length > 0) {
                 const sgpas = student.initial_sgpas;
                 const totalSgpa = sgpas.reduce((sum: number, s: any) => sum + (parseFloat(s.sgpa) || 0), 0);
                 cgpa = totalSgpa / sgpas.length;
              }
              
              const arrearsCount = student.initial_arrears && Array.isArray(student.initial_arrears) ? student.initial_arrears.length : 0;

              mergedRecords.push({
                id: `mock-${student.id}`,
                student_id: student.id,
                students: student,
                cgpa: cgpa,
                arrears: arrearsCount
              });
           }
        });

        // Sort by arrears (high to low), then by CGPA (low to high)
        mergedRecords.sort((a, b) => {
          const arrearsA = a.arrears || 0;
          const arrearsB = b.arrears || 0;
          if (arrearsA !== arrearsB) {
            return arrearsB - arrearsA; // High to low
          }
          return (a.cgpa || 0) - (b.cgpa || 0); // Low to high
        });

        setRecords(mergedRecords);
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
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {records.length > 0 ? (records.reduce((sum, r) => sum + (r.cgpa || 0), 0) / records.length).toFixed(2) : 'N/A'}
          </div>
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
                records
                  .filter(r => r.cgpa < 6.5)
                  .map(record => {
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
