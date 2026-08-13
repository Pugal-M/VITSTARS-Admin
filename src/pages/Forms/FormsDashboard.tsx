import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, CheckCircle, Clock, AlertTriangle, Users, FileText, Calendar, Shield, Settings, Activity, XCircle } from 'lucide-react';
import { formsApi } from '../../api/forms';
import type { Form } from '../../types/forms';

export default function FormsDashboard() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'published' | 'draft' | 'closed' | 'BLOCKED'>('ALL');
  const [isClosing, setIsClosing] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    scheduled: 0,
    mandatoryActive: 0,
    pendingResponses: 0,
    submitted: 0,
    blockedStudents: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [formsData, statsData] = await Promise.all([
        formsApi.getForms(),
        formsApi.getFormsStats()
      ]);
      setForms(formsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching forms data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = async (formId: string) => {
    if (!window.confirm('Are you sure you want to close this form? Students will no longer be able to submit responses.')) return;
    
    try {
      setIsClosing(formId);
      await formsApi.updateForm(formId, { status: 'closed' });
      setForms(forms.map(f => f.id === formId ? { ...f, status: 'closed' } : f));
      
      // Update stats silently
      const statsData = await formsApi.getFormsStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error closing form:', error);
      alert('Failed to close form. Please try again.');
    } finally {
      setIsClosing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <span className="badge badge-good">Published</span>;
      case 'draft': return <span className="badge badge-info">Draft</span>;
      case 'closed': return <span className="badge badge-critical">Closed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const filteredForms = forms.filter(form => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'published') return form.status === 'published';
    if (activeTab === 'draft') return form.status === 'draft';
    if (activeTab === 'closed') return form.status === 'closed';
    return true; // For BLOCKED, we'd ideally show a different list entirely
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem', fontSize: '1.75rem', letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={28} color="var(--color-primary)" />
            Forms & Data Collection
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Manage predefined forms, academic updates, and mandatory data collection.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/forms/launch')}
          style={{ boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)', padding: '0.6rem 1.2rem' }}
        >
          <Plus size={20} />
          Launch Form
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-text-muted)' }}>
          <Activity size={40} className="animate-pulse" style={{ margin: '0 auto 1rem', color: 'var(--color-primary)' }} />
          Loading forms dashboard...
        </div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--color-status-info-bg)', color: 'var(--color-status-info)' }}>
                <ClipboardList size={24} />
              </div>
              <div className="stat-content">
                <h3>Total Forms</h3>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-subtitle">{stats.active} active, {stats.scheduled} scheduled</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--color-status-good-bg)', color: 'var(--color-status-good)' }}>
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <h3>Submitted Responses</h3>
                <div className="stat-value">{stats.submitted}</div>
                <div className="stat-subtitle">All time submissions</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--color-status-attention-bg)', color: 'var(--color-status-attention)' }}>
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <h3>Pending Responses</h3>
                <div className="stat-value">{stats.pendingResponses}</div>
                <div className="stat-subtitle">Requires action</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--color-status-critical-bg)', color: 'var(--color-status-critical)' }}>
                <AlertTriangle size={24} />
              </div>
              <div className="stat-content">
                <h3>Students Blocked</h3>
                <div className="stat-value">{stats.blockedStudents}</div>
                <div className="stat-subtitle">{stats.mandatoryActive} Mandatory Forms Active</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '0', overflow: 'hidden', border: 'none', background: 'transparent', boxShadow: 'none' }}>
            <div className="tabs" style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', gap: '1.5rem', padding: '0 0.5rem' }}>
              <button className={`tab ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')} style={{ paddingBottom: '0.75rem', fontSize: '0.95rem' }}>All Forms</button>
              <button className={`tab ${activeTab === 'published' ? 'active' : ''}`} onClick={() => setActiveTab('published')} style={{ paddingBottom: '0.75rem', fontSize: '0.95rem' }}>Active</button>
              <button className={`tab ${activeTab === 'draft' ? 'active' : ''}`} onClick={() => setActiveTab('draft')} style={{ paddingBottom: '0.75rem', fontSize: '0.95rem' }}>Draft</button>
              <button className={`tab ${activeTab === 'closed' ? 'active' : ''}`} onClick={() => setActiveTab('closed')} style={{ paddingBottom: '0.75rem', fontSize: '0.95rem' }}>Closed</button>
              <button className={`tab ${activeTab === 'BLOCKED' ? 'active' : ''}`} onClick={() => setActiveTab('BLOCKED')} style={{ color: 'var(--color-status-critical)', paddingBottom: '0.75rem', fontSize: '0.95rem' }}>
                <Users size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                Blocked Students
              </button>
            </div>

            {activeTab === 'BLOCKED' ? (
              <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <AlertTriangle size={56} style={{ margin: '0 auto 1.5rem', opacity: 0.3, color: 'var(--color-status-critical)' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Blocked Students View</h3>
                <p>This view will list all students currently blocked by mandatory forms.</p>
              </div>
            ) : (
              <div>
                {filteredForms.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                    <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                    <p style={{ fontSize: '1.1rem' }}>No forms found for the selected filter.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {filteredForms.map(form => (
                      <div key={form.id} className="card hoverable" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                        <div style={{ height: '4px', width: '100%', backgroundColor: form.status === 'published' ? 'var(--color-status-good)' : form.status === 'draft' ? 'var(--color-status-info)' : 'var(--color-text-muted)' }} />
                        
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ 
                                width: '42px', height: '42px', borderRadius: '10px', 
                                backgroundColor: 'var(--color-bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--color-primary)'
                              }}>
                                <FileText size={20} />
                              </div>
                              <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-text-main)', fontWeight: 600, lineHeight: 1.2, marginBottom: '4px' }}>
                                  {form.title}
                                </h3>
                                {getStatusBadge(form.status)}
                              </div>
                            </div>
                          </div>
                          
                          <p style={{ 
                            color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', 
                            flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            lineHeight: 1.5
                          }}>
                            {form.description || 'No description provided for this form. Click to view details.'}
                          </p>

                          <div style={{ 
                            display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', 
                            padding: '1rem', backgroundColor: 'var(--color-bg-app)', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                                <Calendar size={16} />
                                <span>Deadline</span>
                              </div>
                              <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                                {form.deadline ? new Date(form.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline'}
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                                <Shield size={16} />
                                <span>Policy</span>
                              </div>
                              {form.deadline_policy === 'STRICT_BLOCK' ? (
                                <span style={{ color: 'var(--color-status-critical)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <AlertTriangle size={14} /> Strict Block
                                </span>
                              ) : (
                                <span style={{ color: 'var(--color-status-info)', fontWeight: 500 }}>Allow Late</span>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="btn btn-primary" 
                              style={{ flex: 1, padding: '0.6rem' }} 
                              onClick={() => navigate(`/forms/${form.id}/submissions`)}
                            >
                              <Users size={16} /> View Submissions
                            </button>
                            {form.status === 'published' ? (
                              <button 
                                className="btn btn-outline hover-lift" 
                                style={{ padding: '0.6rem 0.75rem', backgroundColor: 'var(--color-status-critical-bg)', color: 'var(--color-status-critical)', borderColor: 'transparent' }} 
                                onClick={() => handleCloseForm(form.id)}
                                disabled={isClosing === form.id}
                                title="Close Form"
                              >
                                {isClosing === form.id ? <Activity size={18} className="animate-pulse" /> : <XCircle size={18} />}
                              </button>
                            ) : (
                              <button 
                                className="btn btn-outline" 
                                style={{ padding: '0.6rem 0.75rem', backgroundColor: 'transparent' }} 
                                disabled 
                                title="Form Settings"
                              >
                                <Settings size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
