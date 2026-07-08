import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  GraduationCap, TrendingUp, Wallet, FileText,
  ClipboardList, ChevronRight, CheckCircle, XCircle, Clock,
  TrendingDown, Minus, User
} from 'lucide-react';
import { Link } from 'react-router';
import { elevesAPI } from '../../services/api';
import { useSelectedChild } from '../../hooks/useSelectedChild';
import { mockPayments, mockAttendance, mockGrades } from '../../data/mock-data';
import { ChildSelector } from '../../components/ui/child-selector';

function NoteTrend({ note, noteMax }: { note: number; noteMax: number }) {
  const pct = note / noteMax;
  if (pct >= 0.75) return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (pct >= 0.5) return <Minus className="w-4 h-4 text-yellow-500" />;
  return <TrendingDown className="w-4 h-4 text-red-500" />;
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { selected: enfant, selectChild } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>(mockPayments);
  const [attendance, setAttendance] = useState<any[]>(() => mockAttendance.map((a: any) => ({
    commentaire: a.statut === 'present' ? 'PRESENT' : a.statut === 'absent' ? 'ABSENT' : 'RETARD',
    datePresence: new Date(Date.now() - Math.random() * 86400000 * 10).toISOString(),
  })));
  const [grades, setGrades] = useState<any[]>(mockGrades);
  useEffect(() => {
    if (!enfant?.matricule) { setLoading(false); return; }
    Promise.all([
      elevesAPI.paiements(enfant.matricule).catch(() => mockPayments),
      elevesAPI.presences(enfant.matricule).catch(() => mockAttendance.map((a: any) => ({ commentaire: a.statut === 'present' ? 'PRESENT' : a.statut === 'absent' ? 'ABSENT' : 'RETARD', datePresence: new Date(Date.now() - Math.random() * 86400000 * 10).toISOString() }))),
      elevesAPI.notes(enfant.matricule).catch(() => mockGrades),
    ]).then(([p, a, g]) => {
      setPayments(p);
      setAttendance(a);
      setGrades(g);
    }).finally(() => setLoading(false));
  }, [enfant?.matricule]);

  const moyenneGenerale = grades.length
    ? grades.reduce((s: number, n: any) => s + ((n.note || 0) / (n.noteMax || 20)) * 20 * (n.coefficient || 1), 0) /
      grades.reduce((s: number, n: any) => s + (n.coefficient || 1), 0)
    : 0;

  const tauxPresence = attendance.length
    ? Math.round(attendance.filter((a: any) => a.commentaire === 'PRESENT').length / attendance.length * 100)
    : 0;

  const outstandingBalance = payments
    .filter((p: any) => p.statut === 'Impayé')
    .reduce((s: number, p: any) => s + (p.montant || 0), 0);

  const recentPayments = payments.slice(0, 3);
  const recentAttendance = attendance.slice(0, 5);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-gradient-to-r from-orange-600 to-orange-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border-2 border-white/40 flex-shrink-0">
              {enfant ? `${enfant.prenom?.charAt(0)}${enfant.nom?.charAt(0)}` : '?'}
            </div>
            <div className="flex-1">
              <p className="text-orange-200 text-sm">{t('parent.dashboard.greeting')}, {user?.prenom} {user?.nom}</p>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-2xl font-bold">{enfant ? `${enfant.prenom} ${enfant.nom}` : (language === 'fr' ? 'Aucun enfant trouvé' : 'No child found')}</h1>
                <ChildSelector onChildChange={(e) => selectChild(e.matricule)} selectedMatricule={enfant?.matricule} />
              </div>
              {enfant && (
                <div className="flex items-center gap-3 mt-1">
                  <Badge className="bg-white/20 text-white border-white/30">{enfant.classe || enfant.Frequentes?.[0]?.Salle?.Classe?.libelle || '-'}</Badge>
                  <span className="text-orange-100 text-sm">{t('parent.dashboard.child')}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: t('parent.dashboard.overallAverage'), value: grades.length ? `${moyenneGenerale.toFixed(2)}/20` : '-', icon: GraduationCap, color: 'from-blue-400 to-blue-500', sub: t('parent.dashboard.currentTerm') },
          { label: t('parent.dashboard.attendanceRate'), value: attendance.length ? `${tauxPresence}%` : '-', icon: TrendingUp, color: 'from-green-500 to-green-600', sub: t('parent.dashboard.last30Days') },
          { label: t('parent.dashboard.outstandingBalance'), value: outstandingBalance > 0 ? `${outstandingBalance.toLocaleString()} FCFA` : t('payments.paid'), icon: Wallet, color: 'from-red-500 to-red-600', sub: t('parent.dashboard.tuitionFees') },
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
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-5 h-5 text-blue-500" /> {t('parent.dashboard.recentGrades')}
                </CardTitle>
                        <Link to="/app/grades">
                          <Button variant="ghost" size="sm" className="text-blue-500 gap-1">
                            {t('parent.dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {grades.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">{language === 'fr' ? 'Aucune note disponible' : 'No grades available'}</p>
                ) : grades.slice(0, 4).map((n: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{n.cours?.libelle || n.matiere || 'Matière'}</p>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <NoteTrend note={n.note || 0} noteMax={n.noteMax || 20} />
                          <span className={`text-sm font-bold ${(n.note || 0) / (n.noteMax || 20) >= 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                            {n.note || '-'}/{n.noteMax || 20}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full transition-all ${(n.note || 0) / (n.noteMax || 20) >= 0.75 ? 'bg-green-500' : (n.note || 0) / (n.noteMax || 20) >= 0.5 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${((n.note || 0) / (n.noteMax || 20)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardList className="w-5 h-5 text-orange-600" /> {t('parent.dashboard.recentAttendance')}
                </CardTitle>
                        <Link to="/app/attendance">
                          <Button variant="ghost" size="sm" className="text-orange-600 gap-1">
                            {t('parent.dashboard.viewAll')} <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
              </CardHeader>
              <CardContent>
                {attendance.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">{language === 'fr' ? 'Aucune présence disponible' : 'No attendance data'}</p>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {recentAttendance.map((a: any, i: number) => {
                      const isPresent = a.commentaire === 'PRESENT';
                      const isAbsent = a.commentaire?.startsWith('ABSENT');
                      const Icon = isPresent ? CheckCircle : isAbsent ? XCircle : Clock;
                      const color = isPresent ? 'text-green-600' : isAbsent ? 'text-red-600' : 'text-yellow-600';
                      const label = isPresent ? t('parent.dashboard.present') : isAbsent ? t('parent.dashboard.absent') : t('parent.dashboard.late');
                      return (
                        <div key={i} className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-xl min-w-[80px]">
                          <p className="text-xs text-muted-foreground font-medium">{i + 1}</p>
                          <Icon className={`w-5 h-5 ${color}`} />
                          <p className={`text-xs font-medium ${color}`}>{label}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wallet className="w-5 h-5 text-emerald-600" /> {t('parent.dashboard.recentPayments')}
                </CardTitle>
                        <Link to="/app/payments">
                          <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 p-0">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentPayments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">{language === 'fr' ? 'Aucun paiement' : 'No payments'}</p>
                ) : recentPayments.map((p: any, i: number) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${p.statut === 'Impayé' ? 'bg-red-50 border border-red-200' : 'bg-muted/50'}`}>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.motif || 'Scolarité'}</p>
                      {p.datePaiement && <p className="text-xs text-muted-foreground">{new Date(p.datePaiement).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${p.statut === 'Impayé' ? 'text-red-600' : 'text-foreground'}`}>
                        {(p.montant || 0).toLocaleString()}F
                      </p>
                      <Badge className={`text-xs ${p.statut === 'Payé' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.statut === 'Payé' ? t('parent.dashboard.paid') : t('parent.dashboard.unpaid')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-600" /> {language === 'fr' ? 'Accès rapide' : 'Quick Access'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/app/child-profile">
                  <Button className="w-full justify-start gap-2 bg-orange-600 hover:bg-orange-700">
                    <User className="w-4 h-4" /> {t('nav.childProfile')}
                  </Button>
                </Link>
                <Link to="/app/report-cards">
                  <Button variant="outline" className="w-full justify-start gap-2 border-blue-300 text-blue-700 hover:bg-blue-50">
                    <FileText className="w-4 h-4" /> {t('nav.reportCards')}
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
