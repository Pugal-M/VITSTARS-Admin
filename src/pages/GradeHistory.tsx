import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, ChevronDown, ChevronUp, FileText, Award, AlertCircle } from 'lucide-react';

export default function GradeHistory() {
  const [semesterId, setSemesterId] = useState<number>(1);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // Semesters for the dropdown
  const semesters = [
    { id: 1, name: 'Fall Sem 26-27' },
    { id: 2, name: 'Winter Sem 25-26' },
    { id: 3, name: 'Fall Sem 25-26' },
    { id: 4, name: 'Winter Sem 24-25' },
    { id: 5, name: 'Fall Sem 24-25' },
    { id: 6, name: 'Winter Sem 23-24' },
    { id: 7, name: 'Fall Sem 23-24' },
    { id: 8, name: 'Winter Sem 22-23' }
  ];

  const currentSemesterName = semesters.find(s => s.id === semesterId)?.name || `Semester ${semesterId}`;

  useEffect(() => {
    fetchStudentsForSemester();
  }, [semesterId]);

  const fetchStudentsForSemester = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id, name, register_number, cgpa, 
          programs(name), branches(name),
          initial_courses
        `);

      if (error) throw error;
      
      // Filter out students to simulate semester-specific data 
      // (in a real app, this would be an exact DB relation, here we just show all active students)
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (id: string) => {
    setExpandedStudent(expandedStudent === id ? null : id);
  };

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.register_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate deterministic mock grades based on student ID and course code
  const getMockGrade = (courseCode: string, studentId: string) => {
    const hash = (courseCode.charCodeAt(0) + studentId.charCodeAt(0) + semesterId) % 10;
    if (hash > 8) return { grade: 'S', points: 10, color: '#28a745' };
    if (hash > 6) return { grade: 'A', points: 9, color: '#20c997' };
    if (hash > 4) return { grade: 'B', points: 8, color: '#17a2b8' };
    if (hash > 2) return { grade: 'C', points: 7, color: '#ffc107' };
    if (hash > 1) return { grade: 'D', points: 6, color: '#fd7e14' };
    if (hash > 0) return { grade: 'E', points: 5, color: '#dc3545' };
    return { grade: 'F', points: 0, color: '#dc3545' };
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1b4b7f', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={28} />
            Grade History
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>View and manage student grades by semester</p>
        </div>
        
        {/* Semester Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label style={{ fontWeight: 'bold', color: '#333' }}>Select Semester:</label>
          <select 
            value={semesterId}
            onChange={(e) => setSemesterId(Number(e.target.value))}
            style={{ 
              padding: '10px 15px', 
              borderRadius: '8px', 
              border: '1px solid #ccc',
              fontSize: '15px',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            {semesters.map(sem => (
              <option key={sem.id} value={sem.id}>{sem.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Search Bar */}
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', backgroundColor: '#fdfdfd' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by student name or register number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Students List */}
        <div style={{ minHeight: '400px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading student records...</div>
          ) : filteredStudents.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 10px auto', display: 'block', opacity: 0.5 }} />
              No students found for this search.
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 150px 150px 50px', padding: '15px 20px', backgroundColor: '#f8f9fa', fontWeight: 'bold', color: '#444', fontSize: '14px', borderBottom: '2px solid #eee' }}>
                <div>#</div>
                <div>Student Name</div>
                <div>Register Number</div>
                <div>Overall CGPA</div>
                <div></div>
              </div>
              
              {/* Table Rows */}
              {filteredStudents.map((student, index) => (
                <div key={student.id} style={{ borderBottom: '1px solid #eee' }}>
                  
                  {/* Clickable Row */}
                  <div 
                    onClick={() => toggleStudent(student.id)}
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '50px 1fr 150px 150px 50px', 
                      padding: '15px 20px', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: expandedStudent === student.id ? '#f4f7fb' : 'transparent',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = expandedStudent === student.id ? '#f4f7fb' : '#fafafa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = expandedStudent === student.id ? '#f4f7fb' : 'transparent'}
                  >
                    <div style={{ color: '#888', fontWeight: 'bold' }}>{index + 1}</div>
                    <div style={{ color: '#1b4b7f', fontWeight: 'bold', fontSize: '15px' }}>
                      {student.name}
                    </div>
                    <div style={{ color: '#555' }}>
                      {student.register_number}
                    </div>
                    <div style={{ fontWeight: 'bold', color: student.cgpa < 6.5 ? '#dc3545' : '#28a745' }}>
                      {student.cgpa ? student.cgpa.toFixed(2) : 'N/A'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', color: '#1b4b7f' }}>
                      {expandedStudent === student.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                  
                  {/* Expanded Grade Details */}
                  {expandedStudent === student.id && (
                    <div style={{ padding: '20px', backgroundColor: '#fdfdfd', borderTop: '1px dashed #ddd', animation: 'fadeIn 0.3s ease' }}>
                      <h4 style={{ margin: '0 0 15px 0', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award size={18} color="#1b4b7f" />
                        {currentSemesterName} Grades
                      </h4>
                      
                      {student.initial_courses && student.initial_courses.length > 0 ? (
                        <div style={{ borderRadius: '8px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px 80px', backgroundColor: '#f0f0f0', padding: '10px 15px', fontWeight: 'bold', fontSize: '13px' }}>
                            <div>Course Code</div>
                            <div>Course Name</div>
                            <div style={{ textAlign: 'center' }}>Grade</div>
                            <div style={{ textAlign: 'center' }}>Points</div>
                          </div>
                          
                          {student.initial_courses.map((course: any, cIndex: number) => {
                            const mockGrade = getMockGrade(course.courseCode || `C${cIndex}`, student.id);
                            return (
                              <div key={cIndex} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px 80px', padding: '10px 15px', borderTop: '1px solid #eee', fontSize: '14px', alignItems: 'center' }}>
                                <div style={{ fontWeight: 'bold', color: '#555' }}>{course.courseCode || `CSE${1000 + cIndex}`}</div>
                                <div>{course.courseName || `Mock Course ${cIndex + 1}`}</div>
                                <div style={{ textAlign: 'center', fontWeight: 'bold', color: mockGrade.color, backgroundColor: `${mockGrade.color}15`, padding: '4px 8px', borderRadius: '4px', margin: '0 auto' }}>
                                  {mockGrade.grade}
                                </div>
                                <div style={{ textAlign: 'center', color: '#666', fontWeight: 'bold' }}>
                                  {mockGrade.points}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#666', fontStyle: 'italic' }}>
                          No course records found for this semester.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
