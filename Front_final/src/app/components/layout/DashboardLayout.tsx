import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LayoutDashboard, Users, GraduationCap, School, BookOpen, Calendar,
  ClipboardList, FileText, Receipt, CreditCard, ShieldAlert, MessageSquare,
  BarChart3, LogOut, Menu, X, Languages, BookCheck, Bell, UserCircle,
  Wallet, Eye
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

type RoleTheme = { from: string; to: string; border: string; hover: string; active: string; bg: string; text: string; label: string };

const themes: Record<string, RoleTheme> = {
  admin:   { from: 'from-blue-900', to: 'to-blue-800', border: 'border-blue-700', hover: 'hover:bg-blue-700/50', active: 'bg-blue-700 border-r-4 border-blue-300', bg: 'bg-blue-700', text: 'text-blue-200', label: 'Gestion scolaire' },
  teacher: { from: 'from-blue-900', to: 'to-blue-800', border: 'border-blue-700', hover: 'hover:bg-blue-700/50', active: 'bg-blue-700 border-r-4 border-blue-300', bg: 'bg-blue-700', text: 'text-blue-200', label: 'Espace Enseignant' },
  parent:  { from: 'from-blue-900', to: 'to-blue-800', border: 'border-blue-700', hover: 'hover:bg-blue-700/50', active: 'bg-blue-700 border-r-4 border-blue-300', bg: 'bg-blue-700', text: 'text-blue-200', label: 'Espace Parent' },
};

const roleColors: Record<string, string> = {
  ADMIN: 'bg-blue-700', DIRECTEUR: 'bg-blue-600', ENSEIGNANT: 'bg-blue-500',
  SECRETAIRE: 'bg-blue-400', PARENT: 'bg-blue-300'
};
const roleLabels: Record<string, string> = {
  ADMIN: 'Administrateur', DIRECTEUR: 'Directeur', ENSEIGNANT: 'Enseignant',
  SECRETAIRE: 'Secrétaire', PARENT: 'Parent'
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const role = user?.role;
  const isTeacher = role === 'ENSEIGNANT';
  const isParent = role === 'PARENT';

  const theme = isParent ? themes.parent : isTeacher ? themes.teacher : themes.admin;

  const adminNavItems = [
    { name: t('nav.dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('nav.students'), path: '/students', icon: Users },
    { name: t('nav.teachers'), path: '/teachers', icon: GraduationCap },
    { name: t('nav.classes'), path: '/classes', icon: School },
    { name: t('nav.subjects'), path: '/subjects', icon: BookOpen },
    { name: t('nav.timetable'), path: '/timetable', icon: Calendar },
    { name: t('nav.attendance'), path: '/attendance', icon: ClipboardList },
    { name: t('nav.grades'), path: '/grades', icon: FileText },
    { name: t('nav.reportCards'), path: '/report-cards', icon: Receipt },
    { name: t('nav.payments'), path: '/payments', icon: CreditCard },
    { name: t('nav.discipline'), path: '/discipline', icon: ShieldAlert },
    { name: t('nav.messages'), path: '/messages', icon: MessageSquare },
    { name: t('nav.reports'), path: '/reports', icon: BarChart3 },
  ];

  const teacherNavItems = [
    { name: t('nav.dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('nav.myClasses'), path: '/my-classes', icon: School },
    { name: t('nav.timetable'), path: '/timetable', icon: Calendar },
    { name: t('nav.attendance'), path: '/attendance', icon: ClipboardList },
    { name: t('nav.gradesAndTests'), path: '/grades', icon: BookCheck },
    { name: t('nav.reportCards'), path: '/report-cards', icon: Receipt },
    { name: t('nav.discipline'), path: '/discipline', icon: ShieldAlert },
    { name: t('nav.messages'), path: '/messages', icon: Bell },
  ];

  const parentNavItems = [
    { name: t('nav.dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('nav.myChild'), path: '/child-profile', icon: UserCircle },
    { name: t('nav.grades'), path: '/grades', icon: FileText },
    { name: t('nav.attendance'), path: '/attendance', icon: ClipboardList },
    { name: t('nav.reportCards'), path: '/report-cards', icon: Receipt },
    { name: t('nav.payments'), path: '/payments', icon: Wallet },
    { name: t('nav.messages'), path: '/messages', icon: MessageSquare },
  ];

  const navigationItems = isParent ? parentNavItems : isTeacher ? teacherNavItems : adminNavItems;

  const handleLogout = () => { logout(); navigate('/login'); };
  const toggleLanguage = () => setLanguage(language === 'fr' ? 'en' : 'fr');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <aside className={`fixed top-0 left-0 h-screen bg-gradient-to-b ${theme.from} ${theme.to} text-white transition-all duration-300 z-30 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${theme.border} flex-shrink-0`}>
          {isSidebarOpen && (
            <div>
              <h1 className="text-xl font-bold">EduGest CM</h1>
              <p className={`text-xs ${theme.text}`}>{theme.label}</p>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 ${theme.hover} rounded-lg transition-colors flex-shrink-0`}>
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive ? theme.active : theme.hover} ${!isSidebarOpen && 'justify-center'}`}
                title={!isSidebarOpen ? item.name : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t ${theme.border} p-4 space-y-3 flex-shrink-0`}>
          {isSidebarOpen ? (
            <>
              <button onClick={toggleLanguage} className={`w-full flex items-center gap-2 px-3 py-2 ${theme.bg} hover:opacity-90 rounded-lg transition-all text-left`}>
                <Languages className="w-4 h-4" />
                <span className="text-sm font-medium">{language === 'fr' ? 'Français' : 'English'}</span>
                <span className="ml-auto text-xs bg-black/20 px-2 py-1 rounded">{language.toUpperCase()}</span>
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full text-white ${roleColors[role || 'ADMIN']}`}>
                  {roleLabels[role || 'ADMIN']}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{user?.nom} {user?.prenom}</p>
                <p className={`text-xs ${theme.text} truncate`}>{user?.email}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" className={`w-full justify-start gap-2 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white`}>
                <LogOut className="w-4 h-4" />{t('auth.logout')}
              </Button>
            </>
          ) : (
            <>
              <button onClick={toggleLanguage} className={`w-full p-2 ${theme.hover} rounded-lg transition-colors`} title="Langue">
                <Languages className="w-5 h-5 mx-auto" />
              </button>
              <button onClick={handleLogout} className={`w-full p-2 ${theme.hover} rounded-lg transition-colors`} title={t('auth.logout')}>
                <LogOut className="w-5 h-5 mx-auto" />
              </button>
            </>
          )}
        </div>
      </aside>

      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
