const fs = require('fs');
const crypto = require('crypto');

const branches = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT'];
const programs = ['B.Tech', 'M.Tech', 'BCA', 'MCA'];
const hostels = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E'];
const statuses = ['active', 'on_leave', 'suspended'];

const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Siddharth', 'Rohan', 'Kabir', 'Aryan', 'Krishna', 'Ishaan', 'Dev', 'Dhruv', 'Reyansh', 'Ayush', 'Atharv', 'Shaurya', 'Ayaan', 'Kartik', 'Yash', 'Ananya', 'Diya', 'Aadhya', 'Pari', 'Saanvi', 'Avni', 'Myra', 'Kiara', 'Navya', 'Prisha', 'Riya', 'Kavya', 'Ira', 'Anika', 'Aarohi', 'Sara', 'Pihu', 'Shruti', 'Neha', 'Priya', 'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Jessica', 'Robert', 'Ashley'];
const lastNames = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Gupta', 'Rao', 'Patil', 'Deshmukh', 'Reddy', 'Menon', 'Nair', 'Iyer', 'Pillai', 'Joshi', 'Mishra', 'Das', 'Sen', 'Bose', 'Chakraborty', 'Banerjee', 'Chatterjee', 'Roy', 'Trivedi', 'Dwivedi', 'Pandey', 'Shukla', 'Tiwari', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateStudent = (i) => {
    const cgpa = (Math.random() * 4 + 6).toFixed(2); // 6.0 to 10.0
    const attendance = (Math.random() * 30 + 70).toFixed(2); // 70% to 100%
    const arrears = Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0;
    
    let risk = 'GOOD';
    if (cgpa < 7.0 || attendance < 75 || arrears > 2) risk = 'CRITICAL';
    else if (cgpa < 8.0 || attendance < 80 || arrears > 0) risk = 'HIGH';
    else if (cgpa < 8.5 || attendance < 85) risk = 'WATCH';

    const branch = getRandomElement(branches);
    const regNo = `22${branch}${String(i).padStart(4, '0')}`;
    const name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
    const lastName = name.split(' ')[1];

    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const vit_email = `${name.toLowerCase().replace(' ', '.')}2022@vitstars.edu`;
    const personal_email = `${name.toLowerCase().replace(' ', '.')}@gmail.com`;
    const phone = `+91 98${Math.floor(Math.random() * 90000000 + 10000000)}`;
    const dob = new Date(2004, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('en-GB');

    const family_background = {
        parents: [
            { name: `${getRandomElement(firstNames)} ${lastName}`, number: `+91 99${Math.floor(Math.random() * 90000000 + 10000000)}`, occupation: 'Engineer' },
            { name: `${getRandomElement(firstNames)} ${lastName}`, number: `+91 97${Math.floor(Math.random() * 90000000 + 10000000)}`, occupation: 'Teacher' }
        ],
        siblings: [
            { name: `${getRandomElement(firstNames)} ${lastName}`, occupation: 'Student' }
        ],
        family_income: '₹12,00,000 p.a.'
    };
    
    const initial_sgpas = [
        { semester: 1, credits: 24, sgpa: Math.random() * 2 + 7 },
        { semester: 2, credits: 24, sgpa: Math.random() * 2 + 7 }
    ];
    
    const initial_arrears = arrears > 0 ? [
        { courseCode: 'MAT1011', courseName: 'Calculus for Engineers' }
    ] : [];
    
    const initial_courses = [
        { courseCode: 'CSE1001', courseName: 'Problem Solving and Programming', attendancePercentage: parseFloat(attendance) },
        { courseCode: 'ENG1011', courseName: 'English for Engineers', attendancePercentage: Math.floor(Math.random() * 15 + 85) }
    ];
    
    const hostel_info = {
        status: Math.random() > 0.2 ? 'Hosteller' : 'Day Scholar',
        block: getRandomElement(hostels),
        room: `${Math.floor(Math.random() * 500) + 100}`
    };

    return {
        id: crypto.randomUUID(),
        register_number: regNo,
        stars_id: `STARS${String(i).padStart(5, '0')}`,
        name: name,
        full_name: name,
        gender: gender,
        vit_email: vit_email,
        personal_email: personal_email,
        phone: phone,
        date_of_birth: dob,
        family_background: family_background,
        initial_sgpas: initial_sgpas,
        initial_arrears: initial_arrears,
        initial_courses: initial_courses,
        hostel_info: hostel_info,
        programs: { name: getRandomElement(programs) },
        branches: { name: branch },
        academic_year: Math.floor(Math.random() * 4) + 1,
        current_semester: Math.floor(Math.random() * 8) + 1,
        batch: `2022-2026`,
        cgpa: parseFloat(cgpa),
        attendance_percentage: parseFloat(attendance),
        active_arrears: arrears,
        hostel_block: hostel_info.block,
        room_number: hostel_info.room,
        risk_level: risk,
        status: getRandomElement(statuses)
    };
};

function seedData() {
    console.log('Generating 300 mock students and related records...');
    const students = [];
    const academic_records = [];
    const attendance_records = [];
    const leave_requests = [];
    const outing_requests = [];

    for (let i = 1; i <= 300; i++) {
        const student = generateStudent(i);
        students.push(student);

        // Academic Records
        academic_records.push({
            id: crypto.randomUUID(),
            student_id: student.id,
            cgpa: student.cgpa,
            arrears: student.active_arrears,
            semester: student.current_semester,
            created_at: new Date().toISOString()
        });

        // Attendance Records
        attendance_records.push({
            id: crypto.randomUUID(),
            student_id: student.id,
            percentage: student.attendance_percentage,
            courses: { code: 'CSE1001', name: 'Problem Solving and Programming' },
            created_at: new Date().toISOString()
        });

        // Leave Requests
        if (Math.random() > 0.8) {
            leave_requests.push({
                id: crypto.randomUUID(),
                student_id: student.id,
                students: { name: student.name, register_number: student.register_number },
                reason: 'Family event',
                status: getRandomElement(['submitted', 'under_review', 'approved', 'rejected']),
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 86400000 * 3).toISOString(),
                created_at: new Date().toISOString()
            });
        }

        // Outing Requests
        if (Math.random() > 0.8) {
            outing_requests.push({
                id: crypto.randomUUID(),
                student_id: student.id,
                students: { name: student.name, register_number: student.register_number },
                reason: 'Going to city',
                status: getRandomElement(['pending', 'approved', 'rejected']),
                date: new Date().toISOString(),
                time_out: '10:00',
                time_in: '18:00',
                created_at: new Date().toISOString()
            });
        }
    }
    
    // Write to local JSON files
    fs.writeFileSync('mock_students.json', JSON.stringify(students, null, 2));
    fs.writeFileSync('mock_academic_records.json', JSON.stringify(academic_records, null, 2));
    fs.writeFileSync('mock_attendance_records.json', JSON.stringify(attendance_records, null, 2));
    fs.writeFileSync('mock_leave_requests.json', JSON.stringify(leave_requests, null, 2));
    fs.writeFileSync('mock_outing_requests.json', JSON.stringify(outing_requests, null, 2));
    
    console.log('Wrote realistic students and related data to mock JSON files');
}

seedData();
