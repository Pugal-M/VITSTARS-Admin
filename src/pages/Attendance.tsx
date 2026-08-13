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
        const { data: students, error: stuError } = await supabase
          .from('students')
          .select(`
            id, name, register_number, initial_courses,
            programs(name), branches(name)
          `);

        if (stuError) throw stuError;

        const { data: attData } = await supabase
          .from('attendance_records')
          .select('*, courses(code, name)');

        let mergedRecords: any[] = [];

        (students || []).forEach(student => {
           const formalRecords = (attData || []).filter(r => r.student_id === student.id);
           
           if (formalRecords.length > 0) {
              formalRecords.forEach(r => {
                 mergedRecords.push({
                   id: r.id,
                   student_id: student.id,
                   students: student,
                   course_code: r.courses?.code || 'Unknown',
                   course_name: r.courses?.name || 'Unknown',
                   percentage: r.percentage || 0
                 });
              });
           } else if (student.initial_courses && Array.isArray(student.initial_courses)) {
              student.initial_courses.forEach((c: any, index: number) => {
                 mergedRecords.push({
                   id: `mock-${student.id}-${index}`,
                   student_id: student.id,
                   students: student,
                   course_code: c.courseCode || 'Unknown',
                   course_name: c.courseName || 'Unknown',
                   percentage: c.attendancePercentage || 0
                 });
              });
           }
        });

        // Show lowest attendance first
        mergedRecords.sort((a, b) => a.percentage - b.percentage);

        setRecords(mergedRecords);
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
                <th>Course Code</th>
                <th>Course Name</th>
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
                      <td style={{ fontWeight: 600 }}>{record.course_code?.toUpperCase()}</td>
                      <td>{record.course_name}</td>
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
