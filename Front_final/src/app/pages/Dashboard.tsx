import { useState, useEffect } from 'react';
import { Users, GraduationCap, School, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState([
    { title: t('dashboard.totalStudents'), value: '...', change: '', icon: Users, color: 'bg-blue-500', trend: 'up' },
    { title: t('dashboard.teachers'), value: '...', change: '', icon: GraduationCap, color: 'bg-purple-500', trend: 'up' },
    { title: t('dashboard.classes'), value: '...', change: '', icon: School, color: 'bg-green-500', trend: 'stable' },
    { title: t('dashboard.attendanceRate'), value: '...', change: '', icon: TrendingUp, color: 'bg-yellow-500', trend: 'up' },
  ]);

  useEffect(() => {
    dashboardAPI.stats().then((stats) => {
      const totalEleves = stats?.totalEleves ?? 0;
      const totalEnseignants = stats?.totalEnseignants ?? 0;
      const totalClasses = stats?.totalClasses ?? 0;
      const tauxPresence = stats?.tauxPresence ?? 0;

      setStats([
        {
          title: t('dashboard.totalStudents'),
          value: totalEleves.toLocaleString(),
          change: language === 'fr' ? 'Inscrits cette année' : 'Enrolled this year',
          icon: Users,
          color: 'bg-blue-500',
          trend: 'up'
        },
        {
          title: t('dashboard.teachers'),
          value: totalEnseignants.toString(),
          change: language === 'fr' ? 'Enseignants actifs' : 'Active teachers',
          icon: GraduationCap,
          color: 'bg-purple-500',
          trend: 'up'
        },
        {
          title: t('dashboard.classes'),
          value: totalClasses.toString(),
          change: language === 'fr' ? 'Classes ouvertes' : 'Active classes',
          icon: School,
          color: 'bg-green-500',
          trend: 'stable'
        },
        {
          title: t('dashboard.attendanceRate'),
          value: `${tauxPresence}%`,
          change: language === 'fr' ? `Taux d'assiduité` : 'Attendance rate',
          icon: TrendingUp,
          color: 'bg-yellow-500',
          trend: 'up'
        }
      ]);
    })
    .catch(() => {});
  }, [t, language]);

  const recentActivities = language === 'fr' ? [
    { id: 1, type: 'success', message: 'Nouveau paiement reçu de KAMGA Jean (500,000 FCFA)', time: 'Il y a 5 min' },
    { id: 2, type: 'warning', message: '12 élèves absents aujourd\'hui', time: 'Il y a 15 min' },
    { id: 3, type: 'success', message: 'Notes de mathématiques saisies pour la classe CE2-A', time: 'Il y a 1h' },
    { id: 4, type: 'info', message: 'Nouvelle inscription: TALLA Marie (CP)', time: 'Il y a 2h' },
    { id: 5, type: 'warning', message: 'Rappel: 45 factures impayées', time: 'Il y a 3h' }
  ] : [
    { id: 1, type: 'success', message: 'New payment received from KAMGA Jean (500,000 FCFA)', time: '5 min ago' },
    { id: 2, type: 'warning', message: '12 students absent today', time: '15 min ago' },
    { id: 3, type: 'success', message: 'Math grades entered for class CE2-A', time: '1h ago' },
    { id: 4, type: 'info', message: 'New enrollment: TALLA Marie (CP)', time: '2h ago' },
    { id: 5, type: 'warning', message: 'Reminder: 45 unpaid invoices', time: '3h ago' }
  ];

  const upcomingEvents = language === 'fr' ? [
    { id: 1, title: 'Réunion pédagogique', date: '29 Avr 2026', time: '14:00' },
    { id: 2, title: 'Fin du 2ème trimestre', date: '30 Avr 2026', time: 'Toute la journée' },
    { id: 3, title: 'Remise des bulletins', date: '05 Mai 2026', time: '09:00' },
    { id: 4, title: 'Conseil de discipline', date: '07 Mai 2026', time: '10:00' }
  ] : [
    { id: 1, title: 'Teaching staff meeting', date: 'Apr 29, 2026', time: '2:00 PM' },
    { id: 2, title: 'End of 2nd term', date: 'Apr 30, 2026', time: 'All day' },
    { id: 3, title: 'Report card distribution', date: 'May 05, 2026', time: '9:00 AM' },
    { id: 4, title: 'Discipline council', date: 'May 07, 2026', time: '10:00 AM' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{t('dashboard.today')}</p>
          <p className="text-lg font-semibold text-gray-900">
            {language === 'fr' ? 'Mardi, 29 Avril 2026' : 'Tuesday, April 29, 2026'}
          </p>
        </div>
      </div>

      <div
        className="relative h-64 rounded-2xl bg-cover bg-center overflow-hidden shadow-xl"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1764720573370-5008f1ccc9fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjbGFzc3Jvb20lMjBzdHVkZW50cyUyMGxlYXJuaW5nJTIwbW9kZXJufGVufDF8fHx8MTc3NzQ1NzkwNXww&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/70" />
        <div className="relative h-full flex flex-col justify-center px-8 text-white">
          <h2 className="text-4xl font-bold mb-4">{t('dashboard.welcome')}</h2>
          <p className="text-xl max-w-2xl">
            {t('dashboard.description')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivities')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                  {activity.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.upcomingEvents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4 pb-3 border-b last:border-b-0">
                  <div className="bg-blue-100 rounded-lg p-3 text-center min-w-[60px]">
                    <p className="text-xs text-blue-600 font-medium">
                      {event.date.split(' ')[language === 'fr' ? 0 : 1]}
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {event.date.split(' ')[language === 'fr' ? 1 : 0]}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
