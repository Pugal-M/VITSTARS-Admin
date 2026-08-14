import mockStudents from '../../mock_students.json';
import mockAcademic from '../../mock_academic_records.json';
import mockAttendance from '../../mock_attendance_records.json';
import mockLeave from '../../mock_leave_requests.json';
import mockOuting from '../../mock_outing_requests.json';

export const initMockDb = () => {
  if (typeof window === 'undefined') return;

  // Force reload for the updated student fields
  const version = 'v2';
  if (localStorage.getItem('sb_mock_version') !== version) {
    console.log('Seeding full mock database (v2)...');
    localStorage.setItem('sb_mock_version', version);
    localStorage.setItem('sb_mock_students', JSON.stringify(mockStudents));
    localStorage.setItem('sb_mock_academic_records', JSON.stringify(mockAcademic));
    localStorage.setItem('sb_mock_attendance_records', JSON.stringify(mockAttendance));
    localStorage.setItem('sb_mock_leave_requests', JSON.stringify(mockLeave));
    localStorage.setItem('sb_mock_outing_requests', JSON.stringify(mockOuting));
    
    // Seed basic forms
    const formsKey = 'sb_mock_forms';
    const initialForms = [
      {
        id: '1',
        title: 'Mid-Term Evaluation',
        description: 'Mandatory evaluation for all students.',
        status: 'published',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(formsKey, JSON.stringify(initialForms));
  }
};
