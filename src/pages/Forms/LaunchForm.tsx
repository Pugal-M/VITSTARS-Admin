import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Calendar, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Form } from '../../types/forms';

export default function LaunchForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [category, setCategory] = useState<'Attendance' | 'Academics' | 'Semester'>('Attendance');
  
  const defaultTemplates = {
    Attendance: {
      title: 'Attendance Update',
      description: 'Allow students to update their attendance percentage for existing courses.',
    },
    Academics: {
      title: 'Academic Details Update',
      description: 'Allow students to update their CGPA and other academic details.',
    },
    Semester: {
      title: 'New Semester Course Registration',
      description: 'Allow students to add new courses for the upcoming semester.',
    }
  };

  const [form, setForm] = useState<Partial<Form> & { is_mandatory: boolean; block_portal: boolean }>({
    title: defaultTemplates.Attendance.title,
    description: defaultTemplates.Attendance.description,
    status: 'published',
    allow_resubmission: false,
    is_mandatory: true,
    block_portal: true,
  });

  const handleCategoryChange = (newCategory: 'Attendance' | 'Academics' | 'Semester') => {
    setCategory(newCategory);
    setForm({
      ...form,
      title: defaultTemplates[newCategory].title,
      description: defaultTemplates[newCategory].description,
    });
  };

  const handleLaunch = async () => {
    if (!form.title) {
      alert("Please provide a title for this data collection campaign.");
      return;
    }
    
    try {
      setLoading(true);
      
      // 1. Create Form
      const { data: newForm, error: formError } = await supabase.from('forms').insert({
        title: form.title,
        description: form.description,
        deadline: form.deadline,
        deadline_policy: form.block_portal ? 'STRICT_BLOCK' : 'ALLOW_LATE',
        status: 'published',
        allow_resubmission: false
      }).select().single();
      
      if (formError || !newForm) throw formError || new Error('Failed to create form');

      // 2. Create predefined Sections and Fields based on category
      const { data: section } = await supabase.from('form_sections').insert({
        form_id: newForm.id,
        title: category,
        order_index: 1,
        repeat_type: category === 'Attendance' ? 'course' : 'none'
      }).select().single();

      if (section) {
        if (category === 'Attendance') {
          // Add fields for attendance
          await supabase.from('form_fields').insert([
            { section_id: section.id, key_name: 'course_code', label: 'Course Code', type: 'read_only_text', is_required: true, is_editable: false, order_index: 1 },
            { section_id: section.id, key_name: 'attendance_pct', label: 'Attendance %', type: 'number', is_required: true, is_editable: true, order_index: 2 }
          ]);
        } else if (category === 'Academics') {
          await supabase.from('form_fields').insert([
            { section_id: section.id, key_name: 'current_cgpa', label: 'Current CGPA', type: 'number', is_required: true, is_editable: true, order_index: 1 }
          ]);
        } else if (category === 'Semester') {
          await supabase.from('form_fields').insert([
            { section_id: section.id, key_name: 'new_courses', label: 'Courses to Register (comma separated codes)', type: 'text', is_required: true, is_editable: true, order_index: 1 }
          ]);
        }
      }

      // 3. Fetch all active students
      const { data: students } = await supabase.from('students').select('id').eq('status', 'active');
      
      // 4. Assign form to all students
      if (students && students.length > 0) {
        const assignments = students.map(student => ({
          form_id: newForm.id,
          student_id: student.id,
          is_mandatory: form.is_mandatory,
          status: 'not_started'
        }));
        
        await supabase.from('form_assignments').insert(assignments);
      }
      
      alert('Data collection launched successfully!');
      navigate('/forms');
    } catch (error: any) {
      console.error('Error launching form:', error);
      alert('Failed to launch data collection. ' + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ padding: '8px', border: 'none' }} onClick={() => navigate('/forms')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>Launch Data Collection</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Activate a predefined data collection workflow for students.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary" onClick={handleLaunch} disabled={loading} style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}>
            <Rocket size={18} />
            {loading ? 'Launching...' : 'Launch Now'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Category Selection */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>1. Select Data Category</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {(['Attendance', 'Academics', 'Semester'] as const).map(cat => (
              <div 
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{ 
                  padding: '1.5rem', 
                  border: `2px solid ${category === cat ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  backgroundColor: category === cat ? 'rgba(30, 58, 138, 0.05)' : 'white',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: category === cat ? '0 4px 6px -1px rgba(30, 58, 138, 0.1)' : 'none',
                  transform: category === cat ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', color: category === cat ? 'var(--color-primary)' : '#0f172a' }}>
                  {cat}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {cat === 'Attendance' && 'Update existing courses attendance'}
                  {cat === 'Academics' && 'Update CGPA and academic details'}
                  {cat === 'Semester' && 'Register new courses for semester'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>2. Configure Settings</h3>
          
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Campaign Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Instructions / Description</label>
            <textarea 
              className="input-field" 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})}
              rows={3}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Deadline (Optional)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="#64748b" />
              <input 
                type="datetime-local" 
                className="input-field" 
                value={form.deadline ? form.deadline.slice(0, 16) : ''}
                onChange={e => setForm({...form, deadline: new Date(e.target.value).toISOString()})}
                style={{ maxWidth: '250px' }}
              />
            </div>
          </div>

          <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border)' }} />

          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c' }}>
            <AlertTriangle size={18} />
            Mandatory Enforcement
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1px solid #fca5a5', marginBottom: 'var(--spacing-4)' }}>
            <input 
              type="checkbox" 
              id="is_mandatory"
              checked={form.is_mandatory} 
              onChange={e => {
                setForm({
                  ...form, 
                  is_mandatory: e.target.checked,
                  block_portal: e.target.checked ? form.block_portal : false
                });
              }}
              style={{ transform: 'scale(1.2)' }}
            />
            <div style={{ flex: 1 }}>
              <label htmlFor="is_mandatory" style={{ margin: 0, fontWeight: 600, color: '#991b1b', display: 'block' }}>Mandatory Form</label>
              <div style={{ fontSize: '0.85rem', color: '#b91c1c', marginTop: '2px' }}>Students must complete this data collection.</div>
            </div>
          </div>

          {form.is_mandatory && (
            <div style={{ paddingLeft: '2rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <input 
                  type="checkbox" 
                  id="block_portal"
                  checked={form.block_portal} 
                  onChange={e => setForm({...form, block_portal: e.target.checked})}
                />
                <label htmlFor="block_portal" style={{ margin: 0, fontWeight: 500 }}>Block portal access until completed (STRICT_BLOCK)</label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
