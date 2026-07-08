import { useState, useEffect } from 'react';
import { Users, GraduationCap, School, TrendingUp, AlertCircle, CheckCircle, Calendar, ArrowUpRight, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { dashboardAPI } from '../services/api';
import { mockDashboardStats } from '../data/mock-data';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState([
    { title: t('dashboard.totalStudents'), value: '...', change: '', icon: Users, color: 'from-blue-400 to-blue-500', trend: 'up' },
    { title: t('dashboard.teachers'), value: '...', change: '', icon: GraduationCap, color: 'from-violet-500 to-violet-600', trend: 'up' },
    { title: t('dashboard.classes'), value: '...', change: '', icon: School, color: 'from-emerald-500 to-emerald-600', trend: 'stable' },
    { title: t('dashboard.attendanceRate'), value: '...', change: '', icon: TrendingUp, color: 'from-amber-500 to-amber-600', trend: 'up' },
  ]);

  useEffect(() => {
    dashboardAPI.stats().then((data) => {
      const totalEleves = data?.totalEleves ?? 0;
      const totalEnseignants = data?.totalEnseignants ?? 0;
      const totalClasses = data?.totalClasses ?? 0;
      const tauxPresence = data?.tauxPresence ?? 0;

      setStats([
        {
          title: t('dashboard.totalStudents'),
          value: totalEleves.toLocaleString(),
          change: language === 'fr' ? 'Inscrits cette année' : 'Enrolled this year',
          icon: Users,
          color: 'from-blue-400 to-blue-500',
          trend: 'up'
        },
        {
          title: t('dashboard.teachers'),
          value: totalEnseignants.toString(),
          change: language === 'fr' ? 'Enseignants actifs' : 'Active teachers',
          icon: GraduationCap,
          color: 'from-violet-500 to-violet-600',
          trend: 'up'
        },
        {
          title: t('dashboard.classes'),
          value: totalClasses.toString(),
          change: language === 'fr' ? 'Classes ouvertes' : 'Active classes',
          icon: School,
          color: 'from-emerald-500 to-emerald-600',
          trend: 'stable'
        },
        {
          title: t('dashboard.attendanceRate'),
          value: `${tauxPresence}%`,
          change: language === 'fr' ? `Taux d'assiduité` : 'Attendance rate',
          icon: TrendingUp,
          color: 'from-amber-500 to-amber-600',
          trend: 'up'
        }
      ]);
    }).catch(() => {
      const data = mockDashboardStats;
      setStats([
        { title: t('dashboard.totalStudents'), value: data.totalEleves.toLocaleString(), change: language === 'fr' ? 'Inscrits cette année' : 'Enrolled this year', icon: Users, color: 'from-blue-400 to-blue-500', trend: 'up' },
        { title: t('dashboard.teachers'), value: data.totalEnseignants.toString(), change: language === 'fr' ? 'Enseignants actifs' : 'Active teachers', icon: GraduationCap, color: 'from-violet-500 to-violet-600', trend: 'up' },
        { title: t('dashboard.classes'), value: data.totalClasses.toString(), change: language === 'fr' ? 'Classes ouvertes' : 'Active classes', icon: School, color: 'from-emerald-500 to-emerald-600', trend: 'stable' },
        { title: t('dashboard.attendanceRate'), value: `${data.tauxPresence}%`, change: language === 'fr' ? `Taux d'assiduité` : 'Attendance rate', icon: TrendingUp, color: 'from-amber-500 to-amber-600', trend: 'up' },
      ]);
    });
  }, [t, language]);

  const recentActivities = language === 'fr' ? [
    { id: 1, type: 'success' as const, message: 'Nouveau paiement reçu de KAMGA Jean (500,000 FCFA)', time: 'Il y a 5 min', icon: DollarSign },
    { id: 2, type: 'warning' as const, message: '12 élèves absents aujourd\'hui', time: 'Il y a 15 min', icon: AlertCircle },
    { id: 3, type: 'success' as const, message: 'Notes de mathématiques saisies pour la classe CE2-A', time: 'Il y a 1h', icon: CheckCircle },
    { id: 4, type: 'info' as const, message: 'Nouvelle inscription: TALLA Marie (CP)', time: 'Il y a 2h', icon: Activity },
    { id: 5, type: 'warning' as const, message: 'Rappel: 45 factures impayées', time: 'Il y a 3h', icon: AlertCircle }
  ] : [
    { id: 1, type: 'success' as const, message: 'New payment received from KAMGA Jean (500,000 FCFA)', time: '5 min ago', icon: DollarSign },
    { id: 2, type: 'warning' as const, message: '12 students absent today', time: '15 min ago', icon: AlertCircle },
    { id: 3, type: 'success' as const, message: 'Math grades entered for class CE2-A', time: '1h ago', icon: CheckCircle },
    { id: 4, type: 'info' as const, message: 'New enrollment: TALLA Marie (CP)', time: '2h ago', icon: Activity },
    { id: 5, type: 'warning' as const, message: 'Reminder: 45 unpaid invoices', time: '3h ago', icon: AlertCircle }
  ];

  const upcomingEvents = language === 'fr' ? [
    { id: 1, title: 'Réunion pédagogique', date: '29 Avr', fullDate: '29 Avr 2026', time: '14:00' },
    { id: 2, title: 'Fin du 2ème trimestre', date: '30 Avr', fullDate: '30 Avr 2026', time: 'Toute la journée' },
    { id: 3, title: 'Remise des bulletins', date: '05 Mai', fullDate: '05 Mai 2026', time: '09:00' },
    { id: 4, title: 'Conseil de discipline', date: '07 Mai', fullDate: '07 Mai 2026', time: '10:00' }
  ] : [
    { id: 1, title: 'Teaching staff meeting', date: 'Apr 29', fullDate: 'Apr 29, 2026', time: '2:00 PM' },
    { id: 2, title: 'End of 2nd term', date: 'Apr 30', fullDate: 'Apr 30, 2026', time: 'All day' },
    { id: 3, title: 'Report card distribution', date: 'May 05', fullDate: 'May 05, 2026', time: '9:00 AM' },
    { id: 4, title: 'Discipline council', date: 'May 07', fullDate: 'May 07, 2026', time: '10:00 AM' }
  ];

  const typeColors: Record<string, string> = {
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                {t('dashboard.recentActivities')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[activity.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {t('dashboard.upcomingEvents')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-medium text-primary/70 uppercase">
                        {event.date.split(' ')[0]}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {event.date.split(' ')[1]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
