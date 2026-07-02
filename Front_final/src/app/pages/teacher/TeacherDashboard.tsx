import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Users, BookOpen, Calendar, ClipboardList, CheckCircle,
  Clock, AlertCircle, MessageSquare, ChevronRight, School
} from 'lucide-react';
import { Link } from 'react-router';
import { classesAPI, elevesAPI, epreuvesAPI, messagesAPI } from '../../services/api';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const today = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const [mesClasses, setMesClasses] = useState<any[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [plannedTests, setPlannedTests] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [prochaines, setProchaines] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      classesAPI.list(),
      elevesAPI.list(),
      epreuvesAPI.list(),
      messagesAPI.mesMessages(),
    ])
      .then(([classes, eleves, epreuves, msgs]) => {
        const cls = Array.isArray(classes) ? classes : [];
        setMesClasses(cls.slice(0, 5).map((c: any) => ({
          id: c.idClasse,
          libelle: c.libelle,
          effectif: c.effectif || 0,
          tauxPresence: 90,
          matiere: c.cycle?.libelle || 'Général',
        })));

        const totalE = Array.isArray(eleves) ? eleves.length : 0;
        setTotalStudents(totalE);

        const eprs = Array.isArray(epreuves) ? epreuves : [];
        setPlannedTests(eprs.length);
        setProchaines(eprs.slice(0, 3).map((ep: any) => ({
          id: ep.idEpreuve,
          libelle: ep.libelle,
          date: ep.dateEpreuve,
          matiere: ep.cours?.libelle || '',
          type: ep.type || 'Devoir',
        })));

        const msgList = Array.isArray(msgs) ? msgs : [];
        setUnreadMessages(msgList.filter((m: any) => m.statut !== 'lu' && m.statut !== 'Lu').length);
        setRecentMessages(msgList.slice(0, 3).map((m: any) => ({
          id: m.idMessage,
          objet: m.objet || '(Sans objet)',
          expediteur: 'Administration',
          date: m.dateEnvoi || new Date().toISOString(),
          lu: m.statut === 'lu' || m.statut === 'Lu',
        })));
      })
      .catch(() => {});
  }, []);

  const activitesRecentes = [
    { texte: 'Connexion au tableau de bord', heure: new Date().toLocaleTimeString(), icon: CheckCircle, color: 'text-green-600' },
    { texte: `${mesClasses.length} classe(s) assignée(s)`, heure: 'Aujourd\'hui', icon: BookOpen, color: 'text-blue-600' },
    { texte: `${totalStudents} élève(s) inscrit(s)`, heure: 'Total établissement', icon: AlertCircle, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-green-900 to-green-700">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <p className="text-green-200 text-sm mb-1">{today}</p>
            <h1 className="text-3xl font-bold mb-1">{t('teacher.dashboard.greeting')}, {user?.prenom} {user?.nom}</h1>
            <p className="text-green-100">{t('teacher.dashboard.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('teacher.dashboard.myClasses'), value: mesClasses.length, icon: School, color: 'bg-green-500', sub: t('teacher.dashboard.assigned') },
          { label: t('teacher.dashboard.myStudents'), value: totalStudents, icon: Users, color: 'bg-blue-500', sub: t('teacher.dashboard.total') },
          { label: t('teacher.dashboard.plannedTests'), value: plannedTests, icon: BookOpen, color: 'bg-purple-500', sub: t('teacher.dashboard.thisTerm') },
          { label: t('teacher.dashboard.receivedMessages'), value: unreadMessages, icon: MessageSquare, color: 'bg-orange-500', sub: t('teacher.dashboard.unread') }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
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
              {mesClasses.map((cls: any) => (
                <div key={cls.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {cls.libelle}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{cls.libelle}</p>
                      <p className="text-sm text-gray-500">{cls.matiere}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-700">{cls.effectif} {t('teacher.dashboard.students')}</p>
                    <Badge className={cls.tauxPresence >= 90 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                      {cls.tauxPresence}% {t('teacher.dashboard.attendanceRate')}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                {t('teacher.dashboard.upcomingTests')}
              </CardTitle>
              <Link to="/grades">
                <Button variant="ghost" size="sm" className="text-purple-600 gap-1">
                  {t('common.view')} <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {prochaines.map((ep: any) => (
                <div key={ep.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{ep.libelle}</p>
                      <p className="text-xs text-gray-500">{ep.date ? new Date(ep.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : ''}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">{ep.type}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-gray-500" />
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
                      <p className="text-sm text-gray-700">{act.texte}</p>
                      <p className="text-xs text-gray-400">{act.heure}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                {t('teacher.dashboard.recentMessages')}
              </CardTitle>
              <Link to="/messages">
                <Button variant="ghost" size="sm" className="text-orange-600 gap-1 p-0">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMessages.map((msg: any) => (
                <div key={msg.id} className={`p-3 rounded-lg border ${!msg.lu ? 'bg-orange-50 border-orange-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-500">{msg.expediteur}</p>
                    {!msg.lu && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate">{msg.objet}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(msg.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{language === 'fr' ? 'Actions rapides' : 'Quick Actions'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/attendance">
                <Button className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700">
                  <ClipboardList className="w-4 h-4" /> {t('attendance.validate')}
                </Button>
              </Link>
              <Link to="/grades">
                <Button variant="outline" className="w-full justify-start gap-2 border-purple-300 text-purple-700 hover:bg-purple-50">
                  <BookOpen className="w-4 h-4" /> {t('teacher.grades.enterGrades')}
                </Button>
              </Link>
              <Link to="/my-classes">
                <Button variant="outline" className="w-full justify-start gap-2 border-blue-300 text-blue-700 hover:bg-blue-50">
                  <Calendar className="w-4 h-4" /> {t('teacher.myClasses.viewDetails')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
