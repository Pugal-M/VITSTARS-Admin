import { useState } from 'react';
import { Search, AlertTriangle, BookX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Arrears() {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy Data for Arrears History
  const dummyArrears = [
    {
      id: 'arr-1',
      studentName: 'Rahul Verma',
      registerNumber: '21BCE0561',
      courseCode: 'CSE2005',
      courseName: 'Operating Systems',
      credits: 4,
      attempt: 2,
      semester: 'Fall Sem 24-25',
      status: 'Active',
      grade: 'F'
    },
    {
      id: 'arr-2',
      studentName: 'Sneha Patel',
      registerNumber: '22BCE1532',
      courseCode: 'MAT1011',
      courseName: 'Calculus for Engineers',
      credits: 4,
      attempt: 1,
      semester: 'Winter Sem 23-24',
      status: 'Cleared',
      grade: 'C'
    },
    {
      id: 'arr-3',
      studentName: 'Arjun Kumar',
      registerNumber: '21BCE1042',
      courseCode: 'CSE2003',
      courseName: 'Data Structures and Algorithms',
      credits: 4,
      attempt: 3,
      semester: 'Fall Sem 25-26',
      status: 'Active',
      grade: 'F'
    },
    {
      id: 'arr-4',
      studentName: 'Priya Sharma',
      registerNumber: '22BCE2091',
      courseCode: 'PHY1701',
      courseName: 'Engineering Physics',
      credits: 3,
      attempt: 2,
      semester: 'Fall Sem 24-25',
      status: 'Cleared',
      grade: 'B'
    },
    {
      id: 'arr-5',
      studentName: 'Karthik Reddy',
      registerNumber: '21BCE1984',
      courseCode: 'CSE3002',
      courseName: 'Internet and Web Programming',
      credits: 4,
      attempt: 1,
      semester: 'Winter Sem 24-25',
      status: 'Active',
      grade: 'N'
    }
  ];

  const filteredArrears = dummyArrears.filter(arr => 
    arr.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    arr.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    arr.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookX size={28} color="var(--color-status-critical)" />
            Arrear History
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Track student arrear records and clearance status</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', backgroundColor: '#fdfdfd' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by student name, register number, or course code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Attempt</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredArrears.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>No arrear records found.</td></tr>
              ) : (
                filteredArrears.map(arr => (
                  <tr key={arr.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        <Link to={`/students`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                          {arr.studentName}
                        </Link>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{arr.registerNumber}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>{arr.courseCode}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{arr.courseName} ({arr.credits} Credits)</div>
                    </td>
                    <td>{arr.semester}</td>
                    <td>
                      <span style={{ 
                        display: 'inline-block', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        backgroundColor: '#f1f5f9', 
                        fontSize: '0.75rem', 
                        fontWeight: 600 
                      }}>
                        Attempt {arr.attempt}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 'bold', color: arr.grade === 'F' || arr.grade === 'N' ? 'var(--color-status-critical)' : 'var(--color-text-main)' }}>
                        {arr.grade}
                      </span>
                    </td>
                    <td>
                      {arr.status === 'Active' ? (
                        <span className="badge badge-critical" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} /> Active
                        </span>
                      ) : (
                        <span className="badge badge-good">Cleared</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
