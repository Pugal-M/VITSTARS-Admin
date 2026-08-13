import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, MessageSquare, AlertCircle } from 'lucide-react';

export default function SubmissionReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [remarks, setRemarks] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  const mockAnswers = [
    { field: 'Academic Year', value: '2026-2027' },
    { field: 'Semester', value: 'Fall' },
    { field: 'Previous CGPA', value: '8.45' },
    { field: 'Current Arrears', value: '0' },
  ];

  const handleAction = (action: string) => {
    if (action === 'CORRECTION') {
      setShowCorrectionModal(true);
      return;
    }
    alert(`Submission marked as ${action}`);
    navigate(`/forms/${id}/submissions`);
  };

  const submitCorrection = () => {
    if (!remarks.trim()) {
      alert('Remarks are required to request a correction.');
      return;
    }
    alert('Correction requested successfully.');
    setShowCorrectionModal(false);
    navigate(`/forms/${id}/submissions`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-icon" onClick={() => navigate(`/forms/${id}/submissions`)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">Review Submission</h1>
            <p className="page-subtitle">Rahul Kumar (23BCE1001) - Pre-Exam Academic Update</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleAction('REJECTED')}>
            <X size={18} />
            Reject
          </button>
          <button className="btn btn-outline" style={{ color: '#d97706', borderColor: '#d97706' }} onClick={() => handleAction('CORRECTION')}>
            <MessageSquare size={18} />
            Request Correction
          </button>
          <button className="btn btn-primary" style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }} onClick={() => handleAction('APPROVED')}>
            <Check size={18} />
            Approve
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left: Form Answers */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Student Responses</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {mockAnswers.map((answer, index) => (
              <div key={index} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 500 }}>{answer.field}</div>
                <div style={{ fontSize: '1.1rem', color: '#0f172a' }}>{answer.value}</div>
              </div>
            ))}

            {/* Mock Course Repeater Data */}
            <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', fontWeight: 600 }}>Registered Courses</div>
              <table className="data-table" style={{ margin: 0, boxShadow: 'none' }}>
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CS101</td>
                    <td>Programming</td>
                    <td>92.8%</td>
                  </tr>
                  <tr>
                    <td>MA201</td>
                    <td>Mathematics</td>
                    <td>85.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', backgroundColor: '#ecfdf5', padding: '1rem', borderRadius: '8px', color: '#065f46', marginTop: '1rem' }}>
              <Check size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Declaration Confirmed</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  "I confirm that the information submitted is accurate."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Submission Details */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Submission Details</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Status</span>
              <span className="status-badge status-pending">Submitted</span>
            </div>
            
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Submitted Date</span>
              <div style={{ fontWeight: 500 }}>Aug 10, 2026, 10:30 AM</div>
            </div>
            
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Student</span>
              <div style={{ fontWeight: 500 }}>Rahul Kumar</div>
              <div style={{ color: '#64748b' }}>23BCE1001</div>
            </div>
            
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Time to Complete</span>
              <div style={{ fontWeight: 500 }}>14 mins</div>
            </div>
          </div>
        </div>

      </div>

      {showCorrectionModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '500px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706' }}>
              <AlertCircle size={20} />
              Request Correction
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              The student will be notified and required to resubmit the form based on your remarks.
            </p>
            
            <div className="form-group">
              <label className="form-label">Admin Remarks *</label>
              <textarea 
                className="form-control" 
                rows={4} 
                placeholder="e.g. Please update your attendance for CS101 based on the latest report."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-outline" onClick={() => setShowCorrectionModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitCorrection}>Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
