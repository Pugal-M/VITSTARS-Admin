import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Requests() {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('leave_requests')
          .select(`
            *,
            students (name, register_number)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLeaveRequests(data || []);
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Leave & Outing Requests</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Approve, reject, and review student requests</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>Loading...</td></tr>
              ) : leaveRequests.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>No requests found.</td></tr>
              ) : (
                leaveRequests.map(req => (
                  <tr key={req.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{req.students?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{req.students?.register_number?.toUpperCase()}</div>
                    </td>
                    <td>{req.leave_type || 'General Leave'}</td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{new Date(req.start_date).toLocaleDateString()} to</div>
                      <div style={{ fontSize: '0.875rem' }}>{new Date(req.end_date).toLocaleDateString()}</div>
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {req.reason}
                    </td>
                    <td>
                      <span className={`badge ${req.status === 'approved' ? 'badge-good' : req.status === 'rejected' ? 'badge-critical' : 'badge-attention'}`}>
                        {req.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                    <td>
                      {req.status === 'pending' || req.status === 'submitted' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-outline" style={{ padding: '4px', color: 'var(--color-status-good)', borderColor: 'var(--color-status-good)' }} title="Approve">
                            <CheckCircle size={16} />
                          </button>
                          <button className="btn btn-outline" style={{ padding: '4px', color: 'var(--color-status-critical)', borderColor: 'var(--color-status-critical)' }} title="Reject">
                            <XCircle size={16} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Actioned</span>
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
