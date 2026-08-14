import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Student360 from './pages/Student360';
import Academic from './pages/Academic';
import Attendance from './pages/Attendance';
import LeaveRequests from './pages/LeaveRequests';
import OutingRequests from './pages/OutingRequests';
import Hostel from './pages/Hostel';
import Mentoring from './pages/Mentoring';
import Alumni from './pages/Alumni';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AuditLog from './pages/AuditLog';
import GradeHistory from './pages/GradeHistory';
import MarkDetails from './pages/MarkDetails';

// Forms Module
import FormsDashboard from './pages/Forms/FormsDashboard';
import LaunchForm from './pages/Forms/LaunchForm';
import FormSubmissions from './pages/Forms/FormSubmissions';
import SubmissionReview from './pages/Forms/SubmissionReview';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:id" element={<Student360 />} />
            <Route path="academic" element={<Academic />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="grade-history" element={<GradeHistory />} />
            <Route path="mark-details" element={<MarkDetails />} />
            <Route path="leave" element={<LeaveRequests />} />
            <Route path="outing" element={<OutingRequests />} />
            <Route path="hostel" element={<Hostel />} />
            <Route path="mentoring" element={<Mentoring />} />
            <Route path="alumni" element={<Alumni />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="audit-log" element={<AuditLog />} />

            <Route path="forms">
              <Route index element={<FormsDashboard />} />
              <Route path="launch" element={<LaunchForm />} />
              <Route path=":id/submissions" element={<FormSubmissions />} />
              <Route path=":id/submissions/:submissionId" element={<SubmissionReview />} />
            </Route>

            <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}>Module Under Construction</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
