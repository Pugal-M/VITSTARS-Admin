import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar } from 'lucide-react';

export default function Mentoring() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentoring = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('mentoring_sessions')
          .select(`
            *,
            mentors (name, designation),
            students (name, register_number)
          `)
          .order('scheduled_date', { ascending: false })
          .limit(50);

        if (error) throw error;
        setSessions(data || []);
      } catch (err) {
        console.error('Error fetching mentoring:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentoring();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Mentoring Hub</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Manage mentor assignments and sessions</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <h3 style={{ padding: 'var(--spacing-4)', margin: 0, borderBottom: '1px solid var(--color-border)' }}>Recent & Upcoming Sessions</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mentor</th>
                <th>Student</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>Loading...</td></tr>
              ) : sessions.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>No mentoring sessions found.</td></tr>
              ) : (
                sessions.map(session => (
                  <tr key={session.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{session.mentors?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{session.mentors?.designation}</div>
                    </td>
                    <td>
                      <div>{session.students?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{session.students?.register_number?.toUpperCase()}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> {new Date(session.scheduled_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${session.status === 'completed' ? 'badge-good' : session.status === 'scheduled' ? 'badge-info' : 'badge-attention'}`}>
                        {session.status?.toUpperCase() || 'SCHEDULED'}
                      </span>
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
