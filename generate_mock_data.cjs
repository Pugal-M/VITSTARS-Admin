const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://oteijgwivctlznzdysqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWlqZ3dpdmN0bHpuemR5c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNzUxMTcsImV4cCI6MjEwMTk1MTExN30.6M3Q8TQWWQU2aaEtH0MQis64Nhv7SSzJQc6Uowy048Q';

const supabase = createClient(supabaseUrl, supabaseKey);

const branches = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT'];
const programs = ['B.Tech', 'M.Tech', 'BCA', 'MCA'];
const hostels = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E'];
const statuses = ['ACTIVE', 'ON_LEAVE', 'SUSPENDED'];

const crypto = require('crypto');

const generateStudent = (i) => {
    const cgpa = (Math.random() * 4 + 6).toFixed(2); // 6.0 to 10.0
    const attendance = (Math.random() * 30 + 70).toFixed(2); // 70% to 100%
    const arrears = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0;
    
    let risk = 'GOOD';
    if (cgpa < 7.0 || attendance < 75 || arrears > 2) risk = 'CRITICAL';
    else if (cgpa < 8.0 || attendance < 80 || arrears > 0) risk = 'HIGH';
    else if (cgpa < 8.5 || attendance < 85) risk = 'WATCH';

    return {
        id: crypto.randomUUID(),
        register_number: `22${branches[Math.floor(Math.random() * branches.length)]}${String(i).padStart(4, '0')}`,
        stars_id: `STARS${String(i).padStart(5, '0')}`,
        full_name: `Student Name ${i}`,
        program: programs[Math.floor(Math.random() * programs.length)],
        branch: branches[Math.floor(Math.random() * branches.length)],
        academic_year: Math.floor(Math.random() * 4) + 1,
        current_semester: Math.floor(Math.random() * 8) + 1,
        cgpa: parseFloat(cgpa),
        attendance_percentage: parseFloat(attendance),
        active_arrears: arrears,
        hostel_block: hostels[Math.floor(Math.random() * hostels.length)],
        room_number: `${Math.floor(Math.random() * 500) + 100}`,
        risk_level: risk,
        status: statuses[Math.floor(Math.random() * statuses.length)]
    };
};

async function seedData() {
    console.log('Generating 300 mock students...');
    const students = [];
    for (let i = 1; i <= 300; i++) {
        students.push(generateStudent(i));
    }
    
    // Write to a local JSON file for backup/local testing
    fs.writeFileSync('mock_students.json', JSON.stringify(students, null, 2));
    console.log('Wrote 300 students to mock_students.json');

    console.log('Inserting into Supabase...');
    const { error } = await supabase.from('students').insert(students);
    
    if (error) {
        console.error('Error inserting data:', error);
    } else {
        console.log('Successfully inserted 300 students into Supabase!');
    }
}

seedData();
