import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  School, Users, BookOpen, MessageSquare, ChevronRight, Clock,
  CheckCircle, AlertCircle, Calendar
} from 'lucide-react';
import { Link } from 'react-router';
import { classesAPI, elevesAPI, epreuvesAPI } from '../../services/api';
import { mockStudents, mockTeacherClasses, mockEvaluations } from '../../data/mock-data';

export default function TeacherDashboard() {
  const { t, language } = useLanguage();
  const [apiClasses, setApiClasses] = useState<any[]>(mockTeacherClasses);
  const [apiStudents, setApiStudents] = useState<any[]>(mockStudents);
  const [apiEpreuves, setApiEpreuves] = useState<any[]>(mockEvaluations);
  useEffect(() => {
    classesAPI.list().then(data => setApiClasses(Array.isArray(data) ? data : (data?.data || []))).catch(() => setApiClasses(mockTeacherClasses));
    elevesAPI.list().then(data => setApiStudents(Array.isArray(data) ? data : (data?.data || []))).catch(() => setApiStudents(mockStudents));
    epreuvesAPI.list().then(data => setApiEpreuves(Array.isArray(data) ? data : (data?.data || []))).catch(() => setApiEpreuves(mockEvaluations));
  }, []);

  const srcClasses = apiClasses;
  const srcStudents = apiStudents;
  const srcEpreuves = apiEpreuves;
  const mesClasses = srcClasses.map(c => ({
    id: c.idClasse || c.id,
    libelle: c.libelle,
    effectif: c.effectif || 0,
    tauxPresence: 90 + Math.floor(Math.random() * 10),
    salle: c.salle?.libelle || c.salle || '',
  }));

  const totalStudents = srcStudents.length;
  const plannedTests = srcEpreuves.length;
  const unreadMessages = 0;
  const prochaines = srcEpreuves.slice(0, 3).map((ep: any) => ({
    id: ep.idEpreuve || ep.id,
    libelle: ep.libelle,
    date: ep.dateEpreuve || ep.date,
    type: ep.type,
  }));
  const today = new Date().toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  );

  const activitesRecentes = [
    { texte: t('teacher.dashboard.validated'), heure: t('teacher.dashboard.today'), icon: CheckCircle, color: 'text-green-600' },
    { texte: t('teacher.dashboard.gradesEntered'), heure: t('teacher.dashboard.today'), icon: BookOpen, color: 'text-blue-500' },
    { texte: t('teacher.dashboard.absenceReported'), heure: t('teacher.dashboard.yesterday'), icon: AlertCircle, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <CardContent className="p-6">
          <p className="text-green-200 text-sm">{today}</p>
          <h1 className="text-2xl font-bold mt-1">{t('teacher.dashboard.greeting')}</h1>
          <p className="text-green-100 text-sm mt-1">{t('teacher.dashboard.subtitle')}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('teacher.dashboard.myClasses'), value: mesClasses.length, icon: School, color: 'from-green-500 to-green-600', sub: t('teacher.dashboard.assigned') },
          { label: t('teacher.dashboard.myStudents'), value: totalStudents, icon: Users, color: 'from-blue-400 to-blue-500', sub: t('teacher.dashboard.total') },
          { label: t('teacher.dashboard.plannedTests'), value: plannedTests, icon: BookOpen, color: 'from-purple-500 to-purple-600', sub: t('teacher.dashboard.thisTerm') },
          { label: t('teacher.dashboard.receivedMessages'), value: unreadMessages, icon: MessageSquare, color: 'from-orange-500 to-orange-600', sub: t('teacher.dashboard.unread') },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.sub}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <School className="w-5 h-5 text-green-600" />
                  {t('teacher.dashboard.classOverview')}
                </CardTitle>
                <Link to="/my-classes">
                  <Button variant="ghost" size="sm" className="text-green-600 gap-1">
                    {t('parent.dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {mesClasses.map(cls => (
                  <div key={cls.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-green-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {cls.libelle}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{cls.libelle}</p>
                        <p className="text-sm text-muted-foreground">{cls.salle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{cls.effectif} {t('teacher.dashboard.students')}</p>
                      <Badge className={cls.tauxPresence >= 90 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                        {cls.tauxPresence}% {t('teacher.dashboard.attendanceRate')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  {t('teacher.dashboard.upcomingTests')}
                </CardTitle>
                <Link to="/app/grades">
                  <Button variant="ghost" size="sm" className="text-purple-600 gap-1">
                    {t('common.view')} <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {prochaines.map(ep => (
                  <div key={ep.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{ep.libelle}</p>
                        <p className="text-xs text-muted-foreground">
                          {ep.date ? new Date(ep.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : ''}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{ep.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {t('teacher.dashboard.recentActivity')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activitesRecentes.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-0.5 ${act.color} flex-shrink-0`} />
                      <div>
                        <p className="text-sm text-foreground">{act.texte}</p>
                        <p className="text-xs text-muted-foreground">{act.heure}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">{language === 'fr' ? 'Actions rapides' : 'Quick Actions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/attendance">
                  <Button className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700">
                    <Calendar className="w-4 h-4" /> {t('attendance.validate')}
                  </Button>
                </Link>
                <Link to="/app/grades">
                  <Button variant="outline" className="w-full justify-start gap-2 border-purple-300 text-purple-700 hover:bg-purple-50">
                    <BookOpen className="w-4 h-4" /> {t('teacher.grades.enterGrades')}
                  </Button>
                </Link>
                <Link to="/my-classes">
                  <Button variant="outline" className="w-full justify-start gap-2 border-blue-300 text-blue-700 hover:bg-blue-50">
                    <School className="w-4 h-4" /> {t('teacher.myClasses.viewDetails')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
