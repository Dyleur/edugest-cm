import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  UserCircle, FileText, ClipboardList, Wallet, MessageSquare,
  ChevronRight, TrendingUp, TrendingDown, Minus, AlertCircle,
  CheckCircle, Clock, XCircle
} from 'lucide-react';
import { Link } from 'react-router';
import { parentsAPI, elevesAPI, messagesAPI, paiementsAPI } from '../../services/api';

function NoteTrend({ note, noteMax }: { note: number; noteMax: number }) {
  const pct = note / noteMax;
  if (pct >= 0.75) return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (pct >= 0.5) return <Minus className="w-4 h-4 text-yellow-500" />;
  return <TrendingDown className="w-4 h-4 text-red-500" />;
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [enfant, setEnfant] = useState<any>(null);
  const [notesRecentes, setNotesRecentes] = useState<any[]>([]);
  const [presencesRecentes, setPresencesRecentes] = useState<any[]>([]);
  const [paiementsRecents, setPaiementsRecents] = useState<any[]>([]);
  const [messagesNonLus, setMessagesNonLus] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.idPers) return;

    parentsAPI.enfants(user.idPers).then(async (enfants) => {
      const list = Array.isArray(enfants) ? enfants : [];
      if (list.length === 0) return;

      const first = list[0];
      setEnfant({
        matricule: first.matricule,
        nom: first.nom,
        prenom: first.prenom,
        classe: first.Classe?.libelle || '',
        cycle: first.cycle || '',
      });

      try {
        const [notes, presences, paiements] = await Promise.all([
          elevesAPI.notes(first.matricule),
          elevesAPI.presences(first.matricule),
          elevesAPI.paiements(first.matricule),
        ]);
        setNotesRecentes((Array.isArray(notes) ? notes : []).slice(0, 4).map((n: any) => ({
          matiere: n.cours?.libelle || n.matiere || 'Matière',
          note: n.note || 0,
          noteMax: n.noteMax || 20,
          type: n.type || n.epreuve?.type || 'Devoir',
          date: n.date || n.epreuve?.dateEpreuve || '',
          coeff: n.coefficient || n.cours?.coefficient || 1,
        })));
        setPresencesRecentes((Array.isArray(presences) ? presences : []).slice(0, 5));
        setPaiementsRecents((Array.isArray(paiements) ? paiements : []).slice(0, 3).map((p: any) => ({
          libelle: p.type || 'Scolarité',
          montant: p.montant || 0,
          statut: p.statut === 'paye' || p.statut === 'Payé' ? 'payé' : 'impayé',
          date: p.datePaiement || null,
          mode: p.mode || null,
        })));
      } catch {}
    }).catch(() => {});

    messagesAPI.mesMessages().then(data => {
      const list = Array.isArray(data) ? data : [];
      setMessagesNonLus(list.slice(0, 2).map((m: any) => ({
        id: m.idMessage,
        objet: m.objet || '(Sans objet)',
        expediteur: 'Administration',
        date: m.dateEnvoi || new Date().toISOString(),
      })));
    }).catch(() => {});
  }, []);

  const moyenneGenerale = notesRecentes.length
    ? notesRecentes.reduce((s, n) => s + (n.note / n.noteMax) * 20 * n.coeff, 0) /
      notesRecentes.reduce((s, n) => s + n.coeff, 0)
    : 0;
  const tauxPresence = presencesRecentes.length
    ? Math.round(presencesRecentes.filter(p => p.statut === 'present' || p.statut === 'PRESENT').length / presencesRecentes.length * 100)
    : 0;
  const soldeImpayes = paiementsRecents.filter(p => p.statut === 'impayé').reduce((s, p) => s + p.montant, 0);

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-orange-900 to-amber-700 h-48">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative h-full flex items-center px-8 gap-6 text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex-shrink-0 overflow-hidden border-2 border-white/40 flex items-center justify-center text-3xl font-bold">
            {enfant ? `${enfant.prenom?.charAt(0)}${enfant.nom?.charAt(0)}` : '?'}
          </div>
          <div>
            <p className="text-orange-200 text-sm mb-1">{t('parent.dashboard.greeting')}, {user?.prenom} {user?.nom}</p>
            <h1 className="text-3xl font-bold">{enfant ? `${enfant.prenom} ${enfant.nom}` : 'Chargement...'}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge className="bg-white/20 text-white border-white/30">{enfant?.classe || ''}</Badge>
              <span className="text-orange-100 text-sm">{enfant?.cycle || ''}</span>
              <span className="text-orange-100 text-sm">{enfant ? `Mat. ${enfant.matricule}` : ''}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('parent.dashboard.overallAverage'), value: `${moyenneGenerale.toFixed(2)}/20`, sub: 'Notes récentes', color: 'border-l-4 border-blue-500', badge: moyenneGenerale >= 10 ? 'Admis' : 'En difficulté', badgeColor: moyenneGenerale >= 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600' },
          { label: t('parent.dashboard.attendanceRate'), value: `${tauxPresence}%`, sub: 'Période récente', color: 'border-l-4 border-green-500', badge: tauxPresence >= 90 ? 'Excellent' : 'À surveiller', badgeColor: tauxPresence >= 90 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700' },
          { label: 'Rang en classe', value: '—', sub: 'Non disponible', color: 'border-l-4 border-yellow-500', badge: 'N/A', badgeColor: 'bg-gray-100 text-gray-700' },
          { label: t('parent.dashboard.outstandingBalance'), value: soldeImpayes > 0 ? `${soldeImpayes.toLocaleString()} FCFA` : 'À jour', sub: 'Scolarité', color: 'border-l-4 border-red-500', badge: soldeImpayes > 0 ? 'Impayé' : 'Réglé', badgeColor: soldeImpayes > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700' },
        ].map((kpi) => (
          <Card key={kpi.label} className={`${kpi.color} hover:shadow-md transition-shadow`}>
            <CardContent className="pt-5">
              <p className="text-xs text-gray-500 font-medium">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{kpi.value}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-400">{kpi.sub}</p>
                <Badge className={`text-xs ${kpi.badgeColor}`}>{kpi.badge}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> {t('parent.dashboard.recentGrades')}
              </CardTitle>
              <Link to="/grades"><Button variant="ghost" size="sm" className="text-blue-600 gap-1 text-xs">{t('parent.dashboard.viewAll')} <ChevronRight className="w-3.5 h-3.5" /></Button></Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {notesRecentes.map((n: any) => (
                <div key={n.matiere} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700 truncate">{n.matiere}</p>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <NoteTrend note={n.note} noteMax={n.noteMax} />
                        <span className={`text-sm font-bold ${n.note / n.noteMax >= 0.5 ? 'text-green-700' : 'text-red-600'}`}>
                          {n.note}/{n.noteMax}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${n.note / n.noteMax >= 0.75 ? 'bg-green-500' : n.note / n.noteMax >= 0.5 ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${(n.note / n.noteMax) * 100}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{n.type} · {n.date ? new Date(n.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' }) : ''}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-orange-600" /> {t('parent.dashboard.recentAttendance')}
              </CardTitle>
              <Link to="/attendance"><Button variant="ghost" size="sm" className="text-orange-600 gap-1 text-xs">{t('parent.dashboard.viewAll')} <ChevronRight className="w-3.5 h-3.5" /></Button></Link>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {presencesRecentes.map((p: any) => {
                  const statutKey = (p.statut || '').toLowerCase();
                  const isPresent = statutKey === 'present';
                  const isAbsent = statutKey === 'absent';
                  const isRetard = statutKey === 'retard';
                  const Icon = isPresent ? CheckCircle : isAbsent ? XCircle : isRetard ? Clock : AlertCircle;
                  const color = isPresent ? 'text-green-600' : isAbsent ? 'text-red-600' : isRetard ? 'text-yellow-600' : 'text-blue-600';
                  const label = isPresent ? 'Présent' : isAbsent ? 'Absent' : isRetard ? 'Retard' : 'Justifié';
                  return (
                    <div key={p.date} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg min-w-[72px]">
                      <p className="text-xs text-gray-400 font-medium">
                        {p.date ? new Date(p.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short', day: 'numeric' }) : ''}
                      </p>
                      <Icon className={`w-5 h-5 ${color}`} />
                      <p className={`text-xs font-medium ${color}`}>{label}</p>
                      {p.motif && <p className="text-xs text-gray-400 text-center">{p.motif}</p>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" /> {t('parent.dashboard.recentPayments')}
              </CardTitle>
              <Link to="/payments"><Button variant="ghost" size="sm" className="text-emerald-600 gap-1 p-0"><ChevronRight className="w-4 h-4" /></Button></Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {paiementsRecents.map((p: any) => (
                <div key={p.libelle} className={`flex items-center justify-between p-2.5 rounded-lg ${p.statut === 'impayé' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{p.libelle}</p>
                    {p.date && <p className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${p.statut === 'impayé' ? 'text-red-600' : 'text-gray-700'}`}>
                      {p.montant.toLocaleString()}F
                    </p>
                    <Badge className={`text-xs ${p.statut === 'payé' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.statut === 'payé' ? 'Payé' : 'Impayé'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" /> {t('nav.messages')}
                {messagesNonLus.length > 0 && <Badge className="bg-orange-500 text-white text-xs">{messagesNonLus.length}</Badge>}
              </CardTitle>
              <Link to="/messages"><Button variant="ghost" size="sm" className="text-purple-600 gap-1 p-0"><ChevronRight className="w-4 h-4" /></Button></Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {messagesNonLus.map((m: any) => (
                <div key={m.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium">{m.expediteur}</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{m.objet}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(m.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">{language === 'fr' ? 'Accès rapide' : 'Quick Access'}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Link to="/child-profile">
                <Button className="w-full justify-start gap-2 bg-orange-600 hover:bg-orange-700 text-sm">
                  <UserCircle className="w-4 h-4" /> Dossier de l'enfant
                </Button>
              </Link>
              <Link to="/report-cards">
                <Button variant="outline" className="w-full justify-start gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 text-sm">
                  <FileText className="w-4 h-4" /> Bulletin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
