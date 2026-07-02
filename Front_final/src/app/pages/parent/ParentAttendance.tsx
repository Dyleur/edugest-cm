import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ClipboardList, CheckCircle, XCircle, Clock, AlertCircle, Eye, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { parentsAPI, elevesAPI } from '../../services/api';

type Statut = 'present' | 'absent' | 'retard' | 'justifie';

const statutCfg: Record<Statut, { label: string; icon: React.ElementType; textColor: string; bgColor: string; badgeColor: string }> = {
  present:  { label: 'Présent',  icon: CheckCircle, textColor: 'text-green-700',  bgColor: 'bg-green-50',  badgeColor: 'bg-green-100 text-green-700' },
  absent:   { label: 'Absent',   icon: XCircle,     textColor: 'text-red-700',    bgColor: 'bg-red-50',    badgeColor: 'bg-red-100 text-red-700' },
  retard:   { label: 'Retard',   icon: Clock,       textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', badgeColor: 'bg-yellow-100 text-yellow-700' },
  justifie: { label: 'Justifié', icon: AlertCircle, textColor: 'text-blue-700',   bgColor: 'bg-blue-50',   badgeColor: 'bg-blue-100 text-blue-700' },
};

export default function ParentAttendance() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [presences, setPresences] = useState<any[]>([]);
  const [filter, setFilter] = useState<Statut | 'all'>('all');

  useEffect(() => {
    if (!user?.idPers) return;

    parentsAPI.enfants(user.idPers).then(async (enfants) => {
      const list = Array.isArray(enfants) ? enfants : [];
      if (list.length === 0) return;
      try {
        const data2 = await elevesAPI.presences(list[0].matricule);
        setPresences(Array.isArray(data2) ? data2 : []);
      } catch {}
    }).catch(() => {});
  }, []);

  const counts = {
    present: presences.filter(p => (p.statut || '').toLowerCase() === 'present').length,
    absent: presences.filter(p => (p.statut || '').toLowerCase() === 'absent').length,
    retard: presences.filter(p => (p.statut || '').toLowerCase() === 'retard').length,
    justifie: presences.filter(p => (p.statut || '').toLowerCase() === 'justifie').length,
  };
  const total = presences.length;
  const taux = total ? Math.round((counts.present / total) * 100) : 0;

  const chartData = [
    { name: 'Présents', value: counts.present, fill: '#22c55e' },
    { name: 'Absents', value: counts.absent, fill: '#ef4444' },
    { name: 'Retards', value: counts.retard, fill: '#eab308' },
    { name: 'Justifiés', value: counts.justifie, fill: '#3b82f6' },
  ];

  const filtered = filter === 'all' ? presences : presences.filter(p => (p.statut || '').toLowerCase() === filter);

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-orange-800 to-amber-700 h-40">
        <div className="relative h-full flex items-center px-8 text-white">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{t('parent.attendance.title')}</h1>
            <p className="text-orange-100">{t('parent.attendance.subtitle')}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-orange-200 bg-white/10 rounded-xl px-4 py-2">
            <Eye className="w-4 h-4" /> Lecture seule
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Consultation des présences de votre enfant.</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="md:col-span-1 bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-700">{taux}%</p>
          <p className="text-xs font-medium text-orange-600 mt-1">Taux présence</p>
          <p className="text-xs text-gray-400">{total} jours</p>
        </div>
        {(Object.keys(counts) as Statut[]).map((s) => {
          const cfg = statutCfg[s];
          const Icon = cfg.icon;
          return (
            <div key={s} className={`${cfg.bgColor} rounded-xl p-4 text-center cursor-pointer border-2 transition-all ${filter === s ? 'border-gray-400' : 'border-transparent hover:border-gray-200'}`}
              onClick={() => setFilter(filter === s ? 'all' : s)}>
              <Icon className={`w-5 h-5 mx-auto ${cfg.textColor} mb-1`} />
              <p className={`text-2xl font-bold ${cfg.textColor}`}>{counts[s]}</p>
              <p className={`text-xs font-medium ${cfg.textColor}`}>{cfg.label}{counts[s] > 1 ? 's' : ''}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Répartition</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
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

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Historique</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Tous
                </button>
                {(Object.keys(statutCfg) as Statut[]).map((s) => (
                  <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {statutCfg[s].label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filtered.map((p: any) => {
                  const statutKey = (p.statut || '').toLowerCase() as Statut;
                  const cfg = statutCfg[statutKey] || statutCfg.present;
                  const Icon = cfg.icon;
                  return (
                    <div key={p.date || Math.random()} className={`flex items-center gap-4 p-3 rounded-lg ${cfg.bgColor}`}>
                      <Icon className={`w-5 h-5 ${cfg.textColor} flex-shrink-0`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {p.date ? new Date(p.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Date inconnue'}
                        </p>
                        {p.motif && <p className="text-xs text-gray-500 mt-0.5">Motif : {p.motif}</p>}
                      </div>
                      <Badge className={`text-xs flex-shrink-0 ${cfg.badgeColor}`}>{cfg.label}</Badge>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-center text-gray-400 py-6">Aucune entrée pour ce filtre</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
