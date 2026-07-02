import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from './components/ui/sonner';

import LoginPage from './pages/LoginPage';
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
import Reports from './pages/Reports';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherMyClasses from './pages/teacher/TeacherMyClasses';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherGrades from './pages/teacher/TeacherGrades';
import TeacherReportCards from './pages/teacher/TeacherReportCards';
import TeacherMessages from './pages/teacher/TeacherMessages';
import TeacherDiscipline from './pages/teacher/TeacherDiscipline';

import ParentDashboard from './pages/parent/ParentDashboard';
import ParentChildProfile from './pages/parent/ParentChildProfile';
import ParentGrades from './pages/parent/ParentGrades';
import ParentAttendance from './pages/parent/ParentAttendance';
import ParentReportCard from './pages/parent/ParentReportCard';
import ParentPayments from './pages/parent/ParentPayments';
import ParentMessages from './pages/parent/ParentMessages';

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
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Tableau de bord — rendu selon rôle */}
        <Route index element={<RoleRoute admin={<Dashboard />} teacher={<TeacherDashboard />} parent={<ParentDashboard />} />} />

        {/* Présences */}
        <Route path="attendance" element={<RoleRoute admin={<Attendance />} teacher={<TeacherAttendance />} parent={<ParentAttendance />} />} />

        {/* Notes */}
        <Route path="grades" element={<RoleRoute admin={<Grades />} teacher={<TeacherGrades />} parent={<ParentGrades />} />} />

        {/* Bulletins */}
        <Route path="report-cards" element={<RoleRoute admin={<ReportCards />} teacher={<TeacherReportCards />} parent={<ParentReportCard />} />} />

        {/* Messages */}
        <Route path="messages" element={<RoleRoute admin={<Messages />} teacher={<TeacherMessages />} parent={<ParentMessages />} />} />

        {/* Paiements — admin/secrétaire ou parent (lecture seule) */}
        <Route path="payments" element={<RoleRoute admin={<Payments />} teacher={<Payments />} parent={<ParentPayments />} />} />

        {/* Discipline — admin/directeur ou enseignant (signalement) */}
        <Route path="discipline" element={<RoleRoute admin={<Discipline />} teacher={<TeacherDiscipline />} parent={<Discipline />} />} />

        {/* Routes admin/directeur/secrétaire uniquement */}
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="classes" element={<Classes />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="reports" element={<Reports />} />

        {/* Routes enseignant uniquement */}
        <Route path="my-classes" element={<TeacherMyClasses />} />

        {/* Routes parent uniquement */}
        <Route path="child-profile" element={<ParentChildProfile />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
