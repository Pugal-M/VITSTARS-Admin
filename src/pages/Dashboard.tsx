import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, AlertTriangle, UserCheck, Clock, ShieldAlert, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    academicRisk: 0,
    attendanceRisk: 0,
    pendingLeaves: 0,
    pendingOutings: 0,
    totalArrears: 0,
    activeForms: 0,
    blockedStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Use Promise.all for parallel fetching
        const [
          { data: studentsData, count: totalStudents },
          { count: pendingLeaves },
          { count: pendingOutings },
          { data: acadRecords },
          { data: attRecords }
        ] = await Promise.all([
          supabase.from('students').select('id, initial_courses, initial_sgpas, initial_arrears', { count: 'exact' }),
          supabase.from('leave_requests').select('*', { count: 'exact', head: true }).in('status', ['submitted', 'under_review']),
          supabase.from('outing_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('academic_records').select('student_id, cgpa, arrears'),
          supabase.from('attendance_records').select('student_id, percentage')
        ]);

        let academicRisk = 0;
        let totalArrears = 0;
        let attendanceRisk = 0;

        if (studentsData) {
          studentsData.forEach(student => {
            // Attendance Risk: Course < 75%
            const studentAtts = attRecords?.filter(r => r.student_id === student.id) || [];
            let isAttRisk = false;
            
            if (studentAtts.length > 0) {
              isAttRisk = studentAtts.some(r => r.percentage < 75);
            } else if (student.initial_courses && Array.isArray(student.initial_courses)) {
              isAttRisk = student.initial_courses.some((c: any) => c.attendancePercentage < 75);
            }
            if (isAttRisk) attendanceRisk++;

            // Academic Risk: CGPA < 6.5
            const studentAcad = acadRecords?.filter(r => r.student_id === student.id) || [];
            let isAcadRisk = false;
            let stuArrears = 0;

            if (studentAcad.length > 0) {
               isAcadRisk = studentAcad.some(r => r.cgpa !== null && r.cgpa < 6.5);
               stuArrears = studentAcad.reduce((sum, r) => sum + (r.arrears || 0), 0);
            } else {
               if (student.initial_sgpas && Array.isArray(student.initial_sgpas)) {
                 const totalSgpa = student.initial_sgpas.reduce((sum: number, s: any) => sum + (s.sgpa || 0), 0);
                 const cgpa = student.initial_sgpas.length > 0 ? totalSgpa / student.initial_sgpas.length : null;
                 if (cgpa !== null && cgpa < 6.5) isAcadRisk = true;
               }
               if (student.initial_arrears && Array.isArray(student.initial_arrears)) {
                 stuArrears = student.initial_arrears.length;
               }
            }

            if (isAcadRisk) academicRisk++;
            totalArrears += stuArrears;
          });
        }

        // Mock Forms Stats for now
        const activeForms = 3;
        const blockedStudents = 24;

        setStats({
          totalStudents: totalStudents || 0,
          academicRisk,
          attendanceRisk,
          pendingLeaves: pendingLeaves || 0,
          pendingOutings: pendingOutings || 0,
          totalArrears,
          activeForms,
          blockedStudents
        });

      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '-1.25rem' }}>Command Center for the STARS Program</p>
        </div>
        <button className="btn btn-primary">
          Generate Report
        </button>
      </div>

      {/* Action Required Alert Panel */}
      {(!loading && (stats.academicRisk > 0 || stats.attendanceRisk > 0 || stats.pendingLeaves > 0)) && (
        <div className="card" style={{ backgroundColor: 'var(--color-status-critical-bg)', borderColor: 'var(--color-status-critical)', marginBottom: 'var(--spacing-6)' }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--color-status-critical)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <ShieldAlert size={20} /> Action Required
          </h2>
          <div style={{ marginTop: 'var(--spacing-3)', display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap' }}>
            {stats.academicRisk > 0 && <span style={{ fontWeight: 500 }}>{stats.academicRisk} students have critical academic standing</span>}
            {stats.attendanceRisk > 0 && <span style={{ fontWeight: 500 }}>{stats.attendanceRisk} students have critical attendance</span>}
            {(stats.pendingLeaves > 0 || stats.pendingOutings > 0) && <span style={{ fontWeight: 500 }}>{stats.pendingLeaves + stats.pendingOutings} pending requests require review</span>}
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-4" style={{ marginBottom: 'var(--spacing-8)' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <h3 style={{ margin: 0, fontSize: '0.875rem' }}>Total Students</h3>
            <Users size={18} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {loading ? '...' : stats.totalStudents}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Currently Enrolled</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <h3 style={{ margin: 0, fontSize: '0.875rem' }}>Academic Watch</h3>
            <AlertTriangle size={18} color={stats.academicRisk > 0 ? "var(--color-status-critical)" : "inherit"} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: stats.academicRisk > 0 ? 'var(--color-status-critical)' : 'var(--color-text-main)' }}>
            {loading ? '...' : stats.academicRisk}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>CGPA Below 6.5</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <h3 style={{ margin: 0, fontSize: '0.875rem' }}>Attendance Critical</h3>
            <UserCheck size={18} color={stats.attendanceRisk > 0 ? "var(--color-status-critical)" : "inherit"} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: stats.attendanceRisk > 0 ? 'var(--color-status-critical)' : 'var(--color-text-main)' }}>
            {loading ? '...' : stats.attendanceRisk}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Attendance Below 75%</div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
            <h3 style={{ margin: 0, fontSize: '0.875rem' }}>Pending Requests</h3>
            <Clock size={18} color={(stats.pendingLeaves + stats.pendingOutings) > 0 ? "var(--color-status-attention)" : "inherit"} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: (stats.pendingLeaves + stats.pendingOutings) > 0 ? 'var(--color-status-attention)' : 'var(--color-text-main)' }}>
            {loading ? '...' : (stats.pendingLeaves + stats.pendingOutings)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Leaves & Outings</div>
        </div>
      </div>

      {/* Forms Integration Card */}
      <div className="card" style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <ClipboardList size={22} color="var(--color-primary)" /> Forms & Data Collection
        </h2>
        <div className="grid grid-cols-4">
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Active Mandatory Forms</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.activeForms}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Students Blocked</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stats.blockedStudents > 0 ? 'var(--color-status-critical)' : 'inherit' }}>{stats.blockedStudents}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Pending Submissions</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>42</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/forms" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Manage Forms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
