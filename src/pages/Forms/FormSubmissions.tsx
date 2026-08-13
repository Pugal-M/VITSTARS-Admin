import {} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Eye } from 'lucide-react';

export default function FormSubmissions() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for display purposes
  const mockSubmissions = [
    {
      id: 'sub-1',
      studentName: 'Rahul Kumar',
      registerNumber: '23BCE1001',
      branch: 'CSE',
      status: 'SUBMITTED',
      submittedAt: '2026-08-10T10:30:00Z',
      isLate: false,
    },
    {
      id: 'sub-2',
      studentName: 'Priya Sharma',
      registerNumber: '23BCE1042',
      branch: 'CSE',
      status: 'NEEDS_CORRECTION',
      submittedAt: '2026-08-09T14:15:00Z',
      isLate: false,
    },
    {
      id: 'sub-3',
      studentName: 'Amit Patel',
      registerNumber: '23BEE2005',
      branch: 'EEE',
      status: 'APPROVED',
      submittedAt: '2026-08-08T09:45:00Z',
      isLate: false,
    },
    {
      id: 'sub-4',
      studentName: 'Neha Singh',
      registerNumber: '23BIT3012',
      branch: 'IT',
      status: 'SUBMITTED',
      submittedAt: '2026-08-11T16:20:00Z',
      isLate: true,
    }
  ];

  const getStatusBadge = (status: string, isLate: boolean) => {
    let badge = null;
    switch (status) {
      case 'SUBMITTED': badge = <span className="status-badge status-pending">Submitted</span>; break;
      case 'UNDER_REVIEW': badge = <span className="status-badge status-scheduled">Under Review</span>; break;
      case 'APPROVED': badge = <span className="status-badge status-active">Approved</span>; break;
      case 'NEEDS_CORRECTION': badge = <span className="status-badge status-draft" style={{ backgroundColor: '#fef08a', color: '#854d0e' }}>Needs Correction</span>; break;
      case 'REJECTED': badge = <span className="status-badge status-closed">Rejected</span>; break;
      default: badge = <span className="status-badge">{status}</span>;
    }
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {badge}
        {isLate && <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>LATE</span>}
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-icon" onClick={() => navigate('/forms')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">Form Submissions</h1>
            <p className="page-subtitle">Review and manage student responses.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline">
            Export CSV
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ width: '300px' }}>
            <Search size={18} />
            <input type="text" placeholder="Search student or register number..." />
          </div>
          
          <select className="form-control" style={{ width: 'auto' }}>
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="NEEDS_CORRECTION">Needs Correction</option>
            <option value="APPROVED">Approved</option>
          </select>
          
          <select className="form-control" style={{ width: 'auto' }}>
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="EEE">EEE</option>
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Register Number</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockSubmissions.map(sub => (
              <tr key={sub.id}>
                <td style={{ fontWeight: 500 }}>{sub.studentName}</td>
                <td>{sub.registerNumber}</td>
                <td>{sub.branch}</td>
                <td>{getStatusBadge(sub.status, sub.isLate)}</td>
                <td>
                  <div style={{ fontSize: '0.9rem' }}>
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {new Date(sub.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </td>
                <td>
                  <button 
                    className="btn btn-outline" 
                    style={{ padding: '4px 8px', fontSize: '0.85rem' }} 
                    onClick={() => navigate(`/forms/${id}/submissions/${sub.id}`)}
                  >
                    <Eye size={14} style={{ marginRight: '4px' }} />
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
