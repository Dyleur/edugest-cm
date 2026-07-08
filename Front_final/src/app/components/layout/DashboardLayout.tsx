import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useActivity } from '../../contexts/ActivityContext';
import { LanguageSwitcher } from '../ui/language-switcher';
import { notificationsAPI } from '../../services/api';
import {
  LayoutDashboard, Users, GraduationCap, School, BookOpen, Calendar,
  ClipboardList, FileText, Receipt, CreditCard, ShieldAlert, MessageSquare,
  BarChart3, LogOut, Menu, X, BookCheck, Bell, BellRing, UserCircle,
  Wallet, Eye, Search, ChevronDown, Sun, Moon, History,
  MessageCircle, Megaphone, FileUp, Info, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

const navConfig: Record<string, Array<{ name: string; path: string; icon: any }>> = {
  admin: [
    { name: 'nav.dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'nav.students', path: '/app/students', icon: Users },
    { name: 'nav.teachers', path: '/app/teachers', icon: GraduationCap },
    { name: 'nav.classes', path: '/app/classes', icon: School },
    { name: 'nav.subjects', path: '/app/subjects', icon: BookOpen },
    { name: 'nav.timetable', path: '/app/timetable', icon: Calendar },
    { name: 'nav.attendance', path: '/app/attendance', icon: ClipboardList },
    { name: 'nav.grades', path: '/app/grades', icon: FileText },
    { name: 'nav.reportCards', path: '/app/report-cards', icon: Receipt },
    { name: 'nav.payments', path: '/app/payments', icon: CreditCard },
    { name: 'nav.discipline', path: '/app/discipline', icon: ShieldAlert },
    { name: 'nav.messages', path: '/app/messages', icon: MessageSquare },
    { name: 'nav.annonces', path: '/app/annonces', icon: Megaphone },
    { name: 'nav.reports', path: '/app/reports', icon: BarChart3 },
    { name: 'nav.history', path: '/app/history', icon: History },
  ],
  teacher: [
    { name: 'nav.dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'nav.myClasses', path: '/app/my-classes', icon: School },
    { name: 'nav.timetable', path: '/app/timetable', icon: Calendar },
    { name: 'nav.attendance', path: '/app/attendance', icon: ClipboardList },
    { name: 'nav.gradesAndTests', path: '/app/grades', icon: BookCheck },
    { name: 'nav.reportCards', path: '/app/report-cards', icon: Receipt },
    { name: 'nav.discipline', path: '/app/discipline', icon: ShieldAlert },
    { name: 'nav.messages', path: '/app/messages', icon: Bell },
    { name: 'nav.annonces', path: '/app/annonces', icon: Megaphone },
    { name: 'nav.history', path: '/app/history', icon: History },
  ],
  parent: [
    { name: 'nav.dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'nav.myChild', path: '/app/child-profile', icon: UserCircle },
    { name: 'nav.grades', path: '/app/grades', icon: FileText },
    { name: 'nav.attendance', path: '/app/attendance', icon: ClipboardList },
    { name: 'nav.reportCards', path: '/app/report-cards', icon: Receipt },
    { name: 'nav.payments', path: '/app/payments', icon: Wallet },
    { name: 'nav.messages', path: '/app/messages', icon: MessageSquare },
    { name: 'nav.annonces', path: '/app/annonces', icon: Megaphone },
    { name: 'nav.history', path: '/app/history', icon: History },
  ],
};

const roleLabels: Record<string, { label: string; badge: string }> = {
  ADMIN:           { label: 'Administrateur',   badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  DIRECTEUR:       { label: 'Directeur',         badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  ENSEIGNANT:      { label: 'Enseignant',        badge: 'bg-green-100 text-green-700 border-green-200' },
  RESPONSABLE_ADMIN: { label: 'Responsable Admin', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  PARENT:          { label: 'Parent',            badge: 'bg-orange-100 text-orange-700 border-orange-200' },
};

function getInitials(nom?: string, prenom?: string) {
  return `${(prenom || '')[0] || ''}${(nom || '')[0] || ''}`.toUpperCase();
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { addActivity } = useActivity();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const role = user?.role;
  const isTeacher = role === 'ENSEIGNANT';
  const isParent = role === 'PARENT';
  const roleKey = isParent ? 'parent' : isTeacher ? 'teacher' : 'admin';
  const navItems = navConfig[roleKey];

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    const pageTitle = getPageTitle();
    if (pageTitle) {
      addActivity(pageTitle, `Navigation vers ${pageTitle}`, 'view');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!user?.idPers) return;
    notificationsAPI.nonLuCount().then(data => {
      setNotifCount(data?.count || 0);
    }).catch(() => {});
    notificationsAPI.mesNotifications().then(data => {
      const items = Array.isArray(data) ? data : (data?.data || []);
      setNotifications(items.slice(0, 5));
    }).catch(() => {});
  }, [user?.idPers]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as HTMLElement)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) setShowUserMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const item = navItems.find(n => n.path === location.pathname);
    return item ? t(item.name) : '';
  };

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={`fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border z-30 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-[72px]'
        }`}
      >
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border flex-shrink-0">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'mx-auto'}`}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
              EG
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-sm text-sidebar-foreground">EduGest CM</span>
                <span className="text-[10px] text-muted-foreground">Gestion scolaire</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors ${isSidebarOpen ? 'ml-auto' : 'hidden'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                } ${!isSidebarOpen && 'justify-center px-2'}`}
                title={!isSidebarOpen ? t(item.name) : undefined}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                {isSidebarOpen && <span>{t(item.name)}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3 flex-shrink-0 space-y-2">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="w-9 h-9 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getInitials(user?.nom, user?.prenom)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.nom} {user?.prenom}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleLabels[role || 'ADMIN']?.badge || ''}`}>
                    {roleLabels[role || 'ADMIN']?.label || role}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="flex-1">
                  <LanguageSwitcher variant="compact" />
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground text-xs transition-colors"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t('auth.logout')}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-9 h-9 ring-2 ring-primary/20 cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {getInitials(user?.nom, user?.prenom)}
                </AvatarFallback>
              </Avatar>
              <LanguageSwitcher variant="compact" />
              <button onClick={toggleTheme} className="p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground" title="Theme">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" title="Déconnexion">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-[72px]'}`}>
        <header className="sticky top-0 z-20 bg-header-bg border-b border-header-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
                <p className="text-xs text-muted-foreground">
                  Année académique 2025-2026 · Trimestre 2
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative max-w-xs hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('common.search') + '...'}
                  className="w-64 h-9 pl-9 pr-3 rounded-lg border border-input bg-input-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                  title={language === 'fr' ? 'Notifications' : 'Notifications'}
                >
                  {notifCount > 0 ? <BellRing className="w-5 h-5 text-orange-500" /> : <Bell className="w-5 h-5 text-muted-foreground" />}
                  {notifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-card">
                      {notifCount > 9 ? '9+' : notifCount}
                    </span>
                  )}
                </button>
                {showNotifMenu && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg shadow-black/5 animate-scale-in origin-top-right overflow-hidden">
                    <div className="p-3 border-b border-border flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">
                        {language === 'fr' ? 'Notifications' : 'Notifications'}
                      </p>
                      {notifCount > 0 && (
                        <button
                          onClick={() => {
                            notificationsAPI.markAllAsRead().then(() => {
                              setNotifCount(0);
                              setNotifications(prev => prev.map(n => ({ ...n, lu: 1 })));
                            }).catch(() => {});
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          {language === 'fr' ? 'Tout marquer lu' : 'Mark all read'}
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">{language === 'fr' ? 'Aucune notification' : 'No notifications'}</p>
                        </div>
                      ) : notifications.map((n: any) => {
                        const Icon = n.typeNotification === 'message' ? MessageCircle
                          : n.typeNotification === 'document' ? FileUp
                          : n.typeNotification === 'success' ? CheckCircle
                          : n.typeNotification === 'warning' ? AlertTriangle
                          : Info;
                        return (
                          <div
                            key={n.idNotification}
                            onClick={() => {
                              notificationsAPI.markAsRead(n.idNotification).catch(() => {});
                              setNotifCount(prev => Math.max(0, prev - (n.lu ? 0 : 1)));
                              setNotifications(prev => prev.map(x => x.idNotification === n.idNotification ? { ...x, lu: 1 } : x));
                            }}
                            className={`flex items-start gap-3 p-3 border-b border-border/50 cursor-pointer transition-colors ${
                              !n.lu ? 'bg-orange-50/70 hover:bg-orange-50' : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              n.typeNotification === 'message' ? 'bg-blue-100 text-blue-500'
                                : n.typeNotification === 'document' ? 'bg-teal-100 text-teal-600'
                                : n.typeNotification === 'warning' ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${!n.lu ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{n.titre}</p>
                              {n.message && <p className="text-xs text-muted-foreground truncate mt-0.5">{n.message}</p>}
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {new Date(n.dateCreation || n.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                              </p>
                            </div>
                            {!n.lu && <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                    <Link
                      to="/app/history"
                      onClick={() => setShowNotifMenu(false)}
                      className="block p-3 text-center text-xs text-primary hover:bg-muted/50 border-t border-border font-medium"
                    >
                      {language === 'fr' ? 'Voir tout l\'historique' : 'View all history'}
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {getInitials(user?.nom, user?.prenom)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-lg shadow-black/5 py-1 animate-scale-in origin-top-right">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{user?.nom} {user?.prenom}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                    </div>
                    <div className="px-3 py-2">
                      <LanguageSwitcher />
                    </div>
                    <button onClick={toggleTheme} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors">
                      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      {isDark ? 'Mode clair' : 'Mode sombre'}
                    </button>
                    <div className="border-t border-border mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors rounded-b-lg">
                        <LogOut className="w-4 h-4" />
                        {t('auth.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
