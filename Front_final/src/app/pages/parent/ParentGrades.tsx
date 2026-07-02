import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FileText, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { parentsAPI, elevesAPI } from '../../services/api';

function getMoy(notes: { note: number; noteMax: number; coeff: number }[]) {
  const pts = notes.reduce((s, n) => s + (n.note / n.noteMax) * 20 * n.coeff, 0);
  const coeff = notes.reduce((s, n) => s + n.coeff, 0);
  return coeff > 0 ? pts / coeff : 0;
}

function Trend({ cur, prev }: { cur: number; prev: number }) {
  if (cur > prev + 0.5) return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (cur < prev - 0.5) return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
}

export default function ParentGrades() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.idPers) return;

    parentsAPI.enfants(user.idPers).then(async (enfants) => {
      const list = Array.isArray(enfants) ? enfants : [];
      if (list.length === 0) return;
      try {
        const notesData = await elevesAPI.notes(list[0].matricule);
        const items = (Array.isArray(notesData) ? notesData : []).map((n: any) => ({
          matiere: n.cours?.libelle || n.matiere || 'Matière',
          coefficient: n.coefficient || n.cours?.coefficient || 1,
          note: n.note || 0,
          noteMax: n.noteMax || n.epreuve?.noteMax || 20,
          classMoy: n.moyenneClasse || n.moyenne || 0,
          rang: n.rang || 0,
        }));
        setNotes(items);
      } catch {}
    }).catch(() => {});
  }, []);

  const moy = getMoy(notes);

  const chartData = notes.map((n) => ({
    matiere: n.matiere.split(' ')[0],
    Note: n.note,
    Classe: n.classMoy,
  }));

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-blue-900 to-indigo-700 h-40">
        <div className="relative h-full flex items-center px-8 text-white">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{t('parent.grades.title')}</h1>
            <p className="text-blue-100">{t('parent.grades.subtitle')}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-blue-200 bg-white/10 rounded-xl px-4 py-2">
            <Eye className="w-4 h-4" /> Lecture seule
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('parent.dashboard.overallAverage'), value: `${moy.toFixed(2)}/20`, sub: 'Notes disponibles', color: moy >= 10 ? 'text-green-700' : 'text-red-600' },
          { label: 'Rang', value: notes.length > 0 ? `${Math.min(...notes.map((n: any) => n.rang || 99))}ème` : 'N/A', sub: 'Meilleur rang', color: 'text-yellow-600' },
          { label: 'Moy. classe', value: notes.length > 0 ? `${(notes.reduce((s: number, n: any) => s + n.classMoy, 0) / notes.length).toFixed(2)}/20` : 'N/A', sub: 'Classe', color: 'text-gray-700' },
          { label: 'Matières', value: notes.length.toString(), sub: 'Évaluations', color: 'text-blue-700' },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="pt-5">
              <p className="text-xs text-gray-500 font-medium">{k.label}</p>
              <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
              <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{language === 'fr' ? 'Notes par matière' : 'Grades by subject'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="matiere" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(val: number) => [`${val}/20`, '']} />
              <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="3 3" />
              <Bar dataKey="Note" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Note" />
              <Bar dataKey="Classe" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Moy. classe" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Détail par matière</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {notes.map((n: any) => {
            const pct = n.note / n.noteMax;
            const isOpen = expanded === n.matiere;
            return (
              <div key={n.matiere} className="border rounded-xl overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : n.matiere)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-medium text-sm text-gray-800">{n.matiere}</p>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${pct >= 0.5 ? 'text-green-700' : 'text-red-600'}`}>
                          {n.note}/{n.noteMax}
                        </span>
                        <Badge variant="outline" className="text-xs">coeff.{n.coefficient}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 relative">
                        <div className={`h-2 rounded-full ${pct >= 0.75 ? 'bg-green-500' : pct >= 0.5 ? 'bg-blue-500' : 'bg-red-400'}`}
                          style={{ width: `${pct * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </div>
                {isOpen && (
                  <div className="px-4 pb-4 bg-blue-50 border-t grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    {[
                      { label: 'Note', value: `${n.note}/${n.noteMax}`, color: pct >= 0.5 ? 'text-green-700' : 'text-red-600' },
                      { label: 'Moy. classe', value: `${n.classMoy.toFixed(1)}/${n.noteMax}`, color: 'text-gray-700' },
                      { label: 'Rang', value: n.rang ? `${n.rang}ème` : 'N/A', color: 'text-yellow-700' },
                      { label: 'Coefficient', value: n.coefficient, color: 'text-blue-700' },
                    ].map((f) => (
                      <div key={f.label} className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-400">{f.label}</p>
                        <p className={`font-bold text-sm ${f.color}`}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
