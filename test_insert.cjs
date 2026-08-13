const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://oteijgwivctlznzdysqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWlqZ3dpdmN0bHpuemR5c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzUxMTcsImV4cCI6MjEwMTk1MTExN30.6M3Q8TQWWQU2aaEtH0MQis64Nhv7SSzJQc6Uowy048Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: newForm, error: formError } = await supabase.from('forms').insert({
    name: 'Test Form',
    description: 'Test',
    category: 'Attendance',
    end_date: null,
    block_portal: true,
    allow_late_submission: false,
    status: 'PUBLISHED',
    is_mandatory: true,
    allow_resubmission: false
  }).select().single();

  console.log("Form:", formError || newForm?.id);
  if (!newForm) return;

  const { data: section, error: secErr } = await supabase.from('form_sections').insert({
    form_id: newForm.id,
    title: 'Attendance',
    display_order: 1
  }).select().single();
  
  console.log("Section:", secErr || section?.id);
  if (!section) return;

  const { error: fErr } = await supabase.from('form_fields').insert([
    { section_id: section.id, field_key: 'course_code', label: 'Course Code', field_type: 'TEXT', is_required: true, is_editable: false, is_read_only: true, display_order: 1 },
    { section_id: section.id, field_key: 'attendance_pct', label: 'Attendance %', field_type: 'PERCENTAGE', is_required: true, is_editable: true, display_order: 2 }
  ]);
  console.log("Fields:", fErr || 'Success');

  const { data: students } = await supabase.from('students').select('id').eq('status', 'ACTIVE');
  console.log("Students:", students?.length);

  if (students && students.length > 0) {
    const assignments = students.map(student => ({
      form_id: newForm.id,
      student_id: student.id,
      is_mandatory: true,
      assignment_status: 'NOT_STARTED'
    }));
    const { error: aErr } = await supabase.from('form_assignments').insert(assignments);
    console.log("Assignments:", aErr || 'Success');
  }
}

test();
