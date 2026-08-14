import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Filter, Download, MoreVertical, Plus, X, UserPlus, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Student Modal State
  const [showModal, setShowModal] = useState(false);
  const [newRegNo, setNewRegNo] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          programs (name),
          branches (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegNo || !newPassword) return;

    setIsCreating(true);
    setCreateMessage(null);
    
    try {
      const { error } = await supabase.rpc('create_student_user', {
        p_regno: newRegNo,
        p_password: newPassword
      });

      if (error) throw error;

      setCreateMessage({ type: 'success', text: `Success! Student ${newRegNo} can now log in.` });
      setNewRegNo('');
      setNewPassword('');
    } catch (err: any) {
      console.error('Failed to create student:', err);
      setCreateMessage({ type: 'error', text: err.message || 'Failed to create student.' });
    } finally {
      setIsCreating(false);
    }
  };



  const filteredStudents = students.filter(s => {
    const name = s.name || s.full_name || '';
    const regNo = s.register_number || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           regNo.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Student Directory</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Manage and view all enrolled STARS students</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} /> Filters
          </button>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 'var(--spacing-4)' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search by Name or Register Number..." 
              style={{ paddingLeft: '38px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Register No.</th>
                <th>Name</th>
                <th>Program & Branch</th>
                <th>Batch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>Loading students...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>No students found.</td></tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} onClick={() => navigate(`/students/${student.id}`)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 500 }}>{student.register_number?.toUpperCase()}</td>
                    <td>
                      <div>{student.name || student.full_name || 'N/A'}</div>
                    </td>
                    <td>
                      <div>{student.programs?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{student.branches?.name || 'N/A'}</div>
                    </td>
                    <td>{student.batch || 'N/A'}</td>
                    <td>
                      <span className={`badge ${student.status === 'active' ? 'badge-good' : 'badge-attention'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '6px 12px', fontSize: '0.875rem' }} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigate(`/students/${student.id}`); 
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <span>Showing {filteredStudents.length} results</span>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <button className="btn btn-outline" disabled>Previous</button>
            <button className="btn btn-outline" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Create Student Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', margin: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} color="var(--color-primary)" /> Generate Credentials
              </h2>
              <button onClick={() => { setShowModal(false); setCreateMessage(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-6)', fontSize: '0.875rem' }}>
              Create a secure login for a new student. Once created, they will be forced into the onboarding flow on their first login to fill out their remaining details.
            </p>

            {createMessage && (
              <div style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)', fontSize: '0.875rem', backgroundColor: createMessage.type === 'success' ? 'var(--color-status-good-bg)' : 'var(--color-status-critical-bg)', color: createMessage.type === 'success' ? 'var(--color-status-good)' : 'var(--color-status-critical)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {createMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                {createMessage.text}
              </div>
            )}

            <form onSubmit={handleCreateStudent}>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <label className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Register Number</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. 21BCE1234" 
                  required
                  value={newRegNo}
                  onChange={e => setNewRegNo(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <label className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Temporary Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Minimum 6 characters" 
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} disabled={isCreating}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
