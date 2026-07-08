import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ClipboardList, CheckCircle, XCircle, Clock, AlertCircle, CalendarDays, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { elevesAPI } from '../../services/api';
import { mockAttendance } from '../../data/mock-data';
import { useSelectedChild } from '../../hooks/useSelectedChild';
import { ChildSelector } from '../../components/ui/child-selector';

type Statut = 'PRESENT' | 'ABSENT' | 'RETARD' | 'JUSTIFIE';

const statutCfg: Record<string, { label: string; icon: React.ElementType; textColor: string; bgColor: string; badgeColor: string }> = {
  PRESENT:  { label: 'Présent',  icon: CheckCircle, textColor: 'text-green-700',  bgColor: 'bg-green-50',  badgeColor: 'bg-green-100 text-green-700' },
  ABSENT:   { label: 'Absent',   icon: XCircle,     textColor: 'text-red-700',    bgColor: 'bg-red-50',    badgeColor: 'bg-red-100 text-red-700' },
  RETARD:   { label: 'Retard',   icon: Clock,       textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', badgeColor: 'bg-yellow-100 text-yellow-700' },
  JUSTIFIE:  { label: 'Justifié', icon: AlertCircle, textColor: 'text-blue-700',   bgColor: 'bg-blue-50',   badgeColor: 'bg-blue-100 text-blue-700' },
};

function parseStatus(commentaire: string): string {
  if (commentaire === 'PRESENT') return 'PRESENT';
  if (commentaire?.startsWith('ABSENT')) return 'ABSENT';
  if (commentaire?.startsWith('RETARD')) return 'RETARD';
  return 'PRESENT';
}

export default function ParentAttendance() {
  const { t, language } = useLanguage();
  const { selected: enfant, selectChild } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<any[]>(() => mockAttendance.map((a: any) => ({
    commentaire: a.statut === 'present' ? 'PRESENT' : a.statut === 'absent' ? 'ABSENT' : 'RETARD',
    datePresence: new Date(Date.now() - Math.random() * 86400000 * 10).toISOString(),
  })));

  useEffect(() => {
    if (!enfant?.matricule) { setLoading(false); return; }
    elevesAPI.presences(enfant.matricule)
      .then(data => {
        const items = Array.isArray(data) ? data : (data?.data || []);
        setAttendance(items);
      })
      .catch(() => { setAttendance(mockAttendance.map((a: any) => ({ commentaire: a.statut === 'present' ? 'PRESENT' : a.statut === 'absent' ? 'ABSENT' : 'RETARD', datePresence: new Date().toISOString() }))); })
      .finally(() => setLoading(false));
  }, [enfant?.matricule]);

  const counts = {
    present: attendance.filter(a => parseStatus(a.commentaire) === 'PRESENT').length,
    absent: attendance.filter(a => parseStatus(a.commentaire) === 'ABSENT').length,
    retard: attendance.filter(a => parseStatus(a.commentaire) === 'RETARD').length,
    justifie: attendance.filter(a => parseStatus(a.commentaire) === 'JUSTIFIE').length,
  };
  const total = attendance.length;
  const taux = total ? Math.round((counts.present / total) * 100) : 0;

  const chartData = [
    { name: language === 'fr' ? 'Présents' : 'Present', value: counts.present, fill: '#22c55e' },
    { name: language === 'fr' ? 'Absents' : 'Absent', value: counts.absent, fill: '#ef4444' },
    { name: language === 'fr' ? 'Retards' : 'Late', value: counts.retard, fill: '#eab308' },
    { name: language === 'fr' ? 'Justifiés' : 'Excused', value: counts.justifie, fill: '#3b82f6' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-gradient-to-r from-orange-600 to-orange-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{t('parent.attendance.title')}</h1>
                <ChildSelector onChildChange={(e) => selectChild(e.matricule)} selectedMatricule={enfant?.matricule} />
              </div>
              <p className="text-orange-200 text-sm">{t('parent.attendance.subtitle')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('parent.dashboard.attendanceRate'), value: `${taux}%`, icon: TrendingUp, color: 'from-green-500 to-green-600', sub: t('attendance.rate') },
          { label: t('parent.attendance.presentDays'), value: counts.present.toString(), icon: CheckCircle, color: 'from-green-500 to-green-600', sub: t('attendance.present') },
          { label: t('parent.attendance.absentDays'), value: counts.absent.toString(), icon: XCircle, color: 'from-red-500 to-red-600', sub: t('attendance.absent') },
          { label: t('parent.attendance.lateDays'), value: counts.retard.toString(), icon: Clock, color: 'from-yellow-500 to-yellow-600', sub: t('attendance.late') },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-orange-600" /> {t('parent.attendance.monthlyStats')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-orange-600" /> {language === 'fr' ? 'Historique des présences' : 'Attendance History'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {attendance.map((a, i) => {
                const statutKey = parseStatus(a.commentaire);
                const cfg = statutCfg[statutKey] || statutCfg.PRESENT;
                const Icon = cfg.icon;
                return (
                  <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${cfg.bgColor} border border-border/50`}>
                    <Icon className={`w-5 h-5 ${cfg.textColor} flex-shrink-0`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {language === 'fr' ? `Jour ${i + 1}` : `Day ${i + 1}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.datePresence ? new Date(a.datePresence).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' }) : ''}
                      </p>
                    </div>
                    <Badge className={`text-xs flex-shrink-0 ${cfg.badgeColor}`}>{cfg.label}</Badge>
                  </div>
                );
              })}
              {attendance.length === 0 && (
                <p className="text-center text-muted-foreground py-6">{language === 'fr' ? 'Aucune donnée de présence' : 'No attendance data'}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
