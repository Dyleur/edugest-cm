import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { Toaster } from './components/ui/sonner';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LegalPage from './pages/LegalPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Subjects from './pages/Subjects';
import Timetable from './pages/Timetable';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import ReportCards from './pages/ReportCards';
import Payments from './pages/Payments';
import Discipline from './pages/Discipline';
import Messages from './pages/Messages';
import Annonces from './pages/Annonces';
import Reports from './pages/Reports';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherMyClasses from './pages/teacher/TeacherMyClasses';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherGrades from './pages/teacher/TeacherGrades';
import TeacherReportCards from './pages/teacher/TeacherReportCards';
import TeacherDiscipline from './pages/teacher/TeacherDiscipline';

import ParentDashboard from './pages/parent/ParentDashboard';
import ParentChildProfile from './pages/parent/ParentChildProfile';
import ParentGrades from './pages/parent/ParentGrades';
import ParentAttendance from './pages/parent/ParentAttendance';
import ParentReportCard from './pages/parent/ParentReportCard';
import ParentPayments from './pages/parent/ParentPayments';
import ActivityHistory from './pages/ActivityHistory';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function RoleRoute({
  admin, teacher, parent
}: {
  admin: React.ReactNode;
  teacher: React.ReactNode;
  parent: React.ReactNode;
}) {
  const { user } = useAuth();
  if (user?.role === 'ENSEIGNANT') return <>{teacher}</>;
  if (user?.role === 'PARENT') return <>{parent}</>;
  return <>{admin}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/app" /> : <LoginPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/legal" element={<LegalPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleRoute admin={<Dashboard />} teacher={<TeacherDashboard />} parent={<ParentDashboard />} />} />
        <Route path="attendance" element={<RoleRoute admin={<Attendance />} teacher={<TeacherAttendance />} parent={<ParentAttendance />} />} />
        <Route path="grades" element={<RoleRoute admin={<Grades />} teacher={<TeacherGrades />} parent={<ParentGrades />} />} />
        <Route path="report-cards" element={<RoleRoute admin={<ReportCards />} teacher={<TeacherReportCards />} parent={<ParentReportCard />} />} />
        <Route path="messages" element={<RoleRoute admin={<Messages />} teacher={<Messages />} parent={<Messages />} />} />
        <Route path="annonces" element={<RoleRoute admin={<Annonces />} teacher={<Annonces />} parent={<Annonces />} />} />
        <Route path="payments" element={<RoleRoute admin={<Payments />} teacher={<Payments />} parent={<ParentPayments />} />} />
        <Route path="discipline" element={<RoleRoute admin={<Discipline />} teacher={<TeacherDiscipline />} parent={<Discipline />} />} />
        <Route path="history" element={<ActivityHistory />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="classes" element={<Classes />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="reports" element={<Reports />} />
        <Route path="my-classes" element={<TeacherMyClasses />} />
        <Route path="child-profile" element={<ParentChildProfile />} />
        <Route path="dashboard" element={<Navigate to="/app" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
          <ActivityProvider>
            <BrowserRouter>
              <Toaster />
              <AppRoutes />
            </BrowserRouter>
          </ActivityProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
