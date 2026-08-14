const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.from('students').select('id, name, register_number, initial_sgpas, initial_arrears, initial_courses, cgpa, active_arrears, attendance_percentage').limit(1);
    console.log("Error:", error);
    console.log("Data:", data);
}
test();
