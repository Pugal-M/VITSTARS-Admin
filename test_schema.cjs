const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://oteijgwivctlznzdysqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWlqZ3dpdmN0bHpuemR5c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzUxMTcsImV4cCI6MjEwMTk1MTExN30.6M3Q8TQWWQU2aaEtH0MQis64Nhv7SSzJQc6Uowy048Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('forms').select('*').limit(1);
  console.log("Forms schema:", data ? (data[0] ? Object.keys(data[0]) : 'empty table') : error);
  
  const { data: s, error: e2 } = await supabase.from('form_sections').select('*').limit(1);
  console.log("Sections schema:", s ? (s[0] ? Object.keys(s[0]) : 'empty table') : e2);
  
  const { data: f, error: e3 } = await supabase.from('form_fields').select('*').limit(1);
  console.log("Fields schema:", f ? (f[0] ? Object.keys(f[0]) : 'empty table') : e3);

  const { data: a, error: e4 } = await supabase.from('form_assignments').select('*').limit(1);
  console.log("Assignments schema:", a ? (a[0] ? Object.keys(a[0]) : 'empty table') : e4);
}
test();
