import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, User, MapPin, Phone, Mail, AlertTriangle, Trash2, X, CheckCircle, Calendar, Home, Users, BookOpen, Activity, FileText } from 'lucide-react';

export default function Student360() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Delete Student Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('students')
          .select(`
            *,
            programs (name),
            branches (name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading student profile...</div>;
  }

  if (!student) {
    return <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Student not found.</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'academic', label: 'Academic' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'leave', label: 'Leave & Outing' },
    { id: 'hostel', label: 'Hostel' },
    { id: 'mentoring', label: 'Mentoring' },
    { id: 'alerts', label: 'Alerts' }
  ];

  const handleDeleteStudent = async () => {
    if (!student) return;

    setIsDeleting(true);
    setDeleteMessage(null);

    try {
      const { error } = await supabase.rpc('delete_student_user', {
        p_user_id: student.id
      });

      if (error) throw error;

      setDeleteMessage({ type: 'success', text: `Student ${student.name} has been deleted.` });
      
      setTimeout(() => {
        navigate('/students');
      }, 1500);
      
    } catch (err: any) {
      console.error('Failed to delete student:', err);
      setDeleteMessage({ type: 'error', text: err.message || 'Failed to delete student.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const family = student.family_background || {};
  const sgpas = student.initial_sgpas || [];
  const arrears = student.initial_arrears || [];
  const courses = student.initial_courses || [];
  const hostel = student.hostel_info || {};

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <button 
          onClick={() => navigate('/students')} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-4)', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} /> Back to Directory
        </button>
        
        <div className="card" style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'flex-start' }}>
          <div style={{ width: '96px', height: '96px', backgroundColor: 'var(--color-bg-app)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', border: '4px solid var(--color-bg-surface)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <User size={48} />
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{student.name}</h1>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-3)', color: 'var(--color-text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="var(--color-primary)" /> {student.register_number?.toUpperCase()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} color="var(--color-primary)" /> {student.phone || 'No Phone'}</span>
                  {student.email && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} color="var(--color-primary)" /> {student.email}</span>}
                  {student.date_of_birth && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} color="var(--color-primary)" /> {student.date_of_birth}</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginBottom: '12px' }}>
                  <span className={`badge ${student.status === 'active' ? 'badge-good' : 'badge-attention'}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
                    {student.status.toUpperCase()}
                  </span>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', border: '1px solid var(--color-status-critical)', color: 'var(--color-status-critical)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }} onClick={() => setShowDeleteModal(true)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{student.programs?.name} • {student.branches?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Batch: {student.batch} • Sem: {student.semester} • Year: {student.year}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-6)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--spacing-6)', overflowX: 'auto', paddingBottom: '4px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              padding: 'var(--spacing-2) var(--spacing-1)',
              fontSize: '0.95rem',
              fontWeight: activeTab === tab.id ? 600 : 500,
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 'var(--spacing-6)' }}>
        {activeTab === 'overview' && (
          <div className="animate-fade-in grid grid-cols-2" style={{ gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                <User size={20} /> Personal Details
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-bg-app)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Full Name</span>
                  <span style={{ fontWeight: 600 }}>{student.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-bg-app)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Register Number</span>
                  <span style={{ fontWeight: 600 }}>{student.register_number?.toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-bg-app)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Gender</span>
                  <span style={{ fontWeight: 600 }}>{student.gender || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-bg-app)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Date of Birth</span>
                  <span style={{ fontWeight: 600 }}>{student.date_of_birth || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-bg-app)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>VIT Email</span>
                  <span style={{ fontWeight: 600 }}>{student.vit_email || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-bg-app)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Personal Email</span>
                  <span style={{ fontWeight: 600 }}>{student.personal_email || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-bg-app)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Phone Number</span>
                  <span style={{ fontWeight: 600 }}>{student.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                <Users size={20} /> Family Background
              </h2>
              <div style={{ marginTop: '1rem' }}>
                {family.parents && family.parents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {family.parents.map((parent: any, i: number) => (
                      <div key={i} style={{ backgroundColor: 'var(--color-bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>Name</span>
                          <span style={{ fontWeight: 600 }}>{parent.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>Contact</span>
                          <span style={{ fontWeight: 600 }}>{parent.number}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>Occupation</span>
                          <span style={{ fontWeight: 600 }}>{parent.occupation || 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                    
                    {family.siblings && family.siblings.length > 0 && (
                      <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--color-text-main)' }}>Siblings</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {family.siblings.map((sibling: any, i: number) => (
                            <div key={`sib-${i}`} style={{ backgroundColor: 'var(--color-bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Name</span>
                                <span style={{ fontWeight: 600 }}>{sibling.name}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Occupation</span>
                                <span style={{ fontWeight: 600 }}>{sibling.occupation || 'N/A'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {family.family_income && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Family Income</span>
                        <span style={{ fontWeight: 600 }}>{family.family_income}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No family information available.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'academic' && (
          <div className="animate-fade-in grid grid-cols-2" style={{ gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <Activity size={20} /> GPA History
              </h2>
              {sgpas.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th>Credits</th>
                      <th>GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sgpas.map((s: any, i: number) => (
                      <tr key={i}>
                        <td>{s.semester}</td>
                        <td>{s.credits}</td>
                        <td style={{ fontWeight: 700, color: 'var(--color-status-good)' }}>{s.sgpa.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No GPA records found.</p>
              )}
            </div>

            <div>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <AlertTriangle size={20} /> Arrear Details
              </h2>
              {arrears.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrears.map((a: any, i: number) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{a.courseCode?.toUpperCase()}</td>
                        <td>{a.courseName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ backgroundColor: 'var(--color-status-good-bg)', color: 'var(--color-status-good)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={20} />
                  <strong>No Arrears</strong>
                  <span>Student has a clear academic record.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <BookOpen size={20} /> Current Enrolled Courses
            </h2>
            {courses.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c: any, i: number) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{c.courseCode?.toUpperCase()}</td>
                      <td>{c.courseName}</td>
                      <td style={{ fontWeight: 600 }}>{c.attendancePercentage}%</td>
                      <td>
                        {c.attendancePercentage >= 75 ? (
                          <span className="badge badge-good">Safe</span>
                        ) : (
                          <span className="badge badge-critical">Critical</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No enrolled courses found for this semester.</p>
            )}
          </div>
        )}

        {activeTab === 'hostel' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <Home size={20} /> Hostel Information
            </h2>
            {hostel.status === 'Hosteller' ? (
              <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                <div style={{ backgroundColor: 'var(--color-bg-app)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Status</span>
                    <span className="badge badge-good">Hosteller</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Block</span>
                    <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>{hostel.block || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Room Number</span>
                    <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>{hostel.room || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg-app)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <Home size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Day Scholar</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>This student is a Day Scholar or has not been assigned a hostel room.</p>
              </div>
            )}
          </div>
        )}

        {['leave', 'mentoring', 'alerts'].includes(activeTab) && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', backgroundColor: 'var(--color-bg-app)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
            <FileText size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text-main)' }}>No Data Available</h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', maxWidth: '400px', textAlign: 'center' }}>Detailed records for {activeTab} will be populated here when available.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', margin: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-status-critical)' }}>
                <AlertTriangle size={20} /> Delete Student
              </h2>
              <button onClick={() => { setShowDeleteModal(false); setDeleteMessage(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-6)', fontSize: '0.875rem' }}>
              Are you sure you want to delete the student <strong>{student.name} ({student.register_number?.toUpperCase()})</strong>? This action cannot be undone and will remove all their data including submissions and history.
            </p>

            {deleteMessage && (
              <div style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)', fontSize: '0.875rem', backgroundColor: deleteMessage.type === 'success' ? 'var(--color-status-good-bg)' : 'var(--color-status-critical-bg)', color: deleteMessage.type === 'success' ? 'var(--color-status-good)' : 'var(--color-status-critical)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {deleteMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                {deleteMessage.text}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" style={{ backgroundColor: 'var(--color-status-critical)', borderColor: 'var(--color-status-critical)' }} onClick={handleDeleteStudent} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
