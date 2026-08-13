const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://oteijgwivctlznzdysqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWlqZ3dpdmN0bHpuemR5c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzUxMTcsImV4cCI6MjEwMTk1MTExN30.6M3Q8TQWWQU2aaEtH0MQis64Nhv7SSzJQc6Uowy048Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: newForm, error: formError } = await supabase.from('forms').insert({
    title: 'Test Form',
    description: 'Test',
    deadline: null,
    deadline_policy: 'STRICT_BLOCK',
    status: 'published',
    allow_resubmission: false
  }).select().single();

  console.log("Form:", formError || newForm?.id);
  if (!newForm) return;

  const { data: section, error: secErr } = await supabase.from('form_sections').insert({
    form_id: newForm.id,
    title: 'Attendance',
    order_index: 1,
    repeat_type: 'course'
  }).select().single();
  
  console.log("Section:", secErr || section?.id);
  if (!section) return;

  const { error: fErr } = await supabase.from('form_fields').insert([
    { section_id: section.id, key_name: 'course_code', label: 'Course Code', type: 'read_only_text', is_required: true, is_editable: false, order_index: 1 },
    { section_id: section.id, key_name: 'attendance_pct', label: 'Attendance %', type: 'number', is_required: true, is_editable: true, order_index: 2 }
  ]);
  console.log("Fields:", fErr || 'Success');

  const { data: students } = await supabase.from('students').select('id').eq('status', 'ACTIVE');
  console.log("Students:", students?.length);

  if (students && students.length > 0) {
    const assignments = students.map(student => ({
      form_id: newForm.id,
      student_id: student.id,
      is_mandatory: true,
      status: 'not_started'
    }));
    const { error: aErr } = await supabase.from('form_assignments').insert(assignments);
    console.log("Assignments:", aErr || 'Success');
  }
}
test();
