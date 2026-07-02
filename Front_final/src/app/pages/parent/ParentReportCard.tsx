import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Receipt, Download, Award, Eye, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { parentsAPI, elevesAPI } from '../../services/api';

function getMoy(notes: { moyenne: number; coefficient: number }[]) {
  const pts = notes.reduce((s, n) => s + n.moyenne * n.coefficient, 0);
  const coeff = notes.reduce((s, n) => s + n.coefficient, 0);
  return coeff > 0 ? pts / coeff : 0;
}

export default function ParentReportCard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [bulletin, setBulletin] = useState<any>(null);

  useEffect(() => {
    if (!user?.idPers) return;

    parentsAPI.enfants(user.idPers).then(async (enfants) => {
      const list = Array.isArray(enfants) ? enfants : [];
      if (list.length === 0) return;
      try {
        const b = await elevesAPI.bulletin(list[0].matricule);
        setBulletin(b);
      } catch {}
    }).catch(() => {});
  }, []);

  const notes = bulletin?.notes || bulletin?.evaluations || [];
  const moy = notes.length ? getMoy(notes.map((n: any) => ({ moyenne: n.note || n.moyenne || 0, coefficient: n.coefficient || n.cours?.coefficient || 1 }))) : 0;

  const radarData = notes.map((n: any) => ({
    matiere: (n.cours?.libelle || n.matiere || '').split(' ')[0],
    Note: parseFloat((((n.note || n.moyenne || 0) / 20) * 100).toFixed(1)),
  }));

  const strengths = notes.filter((n: any) => (n.note || n.moyenne || 0) >= 14).sort((a: any, b: any) => (b.note || b.moyenne || 0) - (a.note || a.moyenne || 0));
  const weaknesses = notes.filter((n: any) => (n.note || n.moyenne || 0) < 13).sort((a: any, b: any) => (a.note || a.moyenne || 0) - (b.note || b.moyenne || 0));

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-indigo-900 to-violet-700 h-40">
        <div className="relative h-full flex items-center px-8 text-white">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{t('parent.reportCard.title')}</h1>
            <p className="text-indigo-100">{t('parent.reportCard.subtitle')}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-indigo-200 bg-white/10 rounded-xl px-4 py-2">
            <Eye className="w-4 h-4" /> Son enfant uniquement
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('parent.dashboard.overallAverage'), value: `${moy.toFixed(2)}/20`, color: moy >= 15 ? 'text-green-700' : moy >= 10 ? 'text-blue-700' : 'text-red-600' },
          { label: 'Rang', value: bulletin?.rang ? `${bulletin.rang}ème` : 'N/A', color: 'text-yellow-600' },
          { label: 'Appréciation', value: bulletin?.appreciation ? 'Voir ci-dessous' : 'N/A', color: 'text-indigo-700' },
          { label: 'Matières', value: `${notes.filter((n: any) => (n.note || n.moyenne || 0) >= 10).length}/${notes.length} au-dessus de 10`, color: 'text-gray-700' },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="pt-5">
              <p className="text-xs text-gray-500">{k.label}</p>
              <p className={`text-lg font-bold mt-1 ${k.color}`}>{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="border-2 border-indigo-200">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Bulletin Scolaire</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Année 2025-2026</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">
                    {bulletin?.eleve ? `${bulletin.eleve.nom} ${bulletin.eleve.prenom}` : bulletin?.nom || 'Élève'}
                  </p>
                  <p className="text-xs text-gray-400">Mat. {bulletin?.matricule || bulletin?.eleve?.matricule || ''}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Matière</th>
                    <th className="text-center px-3 py-3 font-semibold text-gray-600">Coeff.</th>
                    <th className="text-center px-3 py-3 font-semibold text-gray-600">Note</th>
                    <th className="text-center px-3 py-3 font-semibold text-gray-600">Moy. classe</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((n: any, i: number) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="px-4 py-2.5 font-medium text-gray-700">{n.cours?.libelle || n.matiere || 'Matière'}</td>
                      <td className="px-3 py-2.5 text-center text-gray-500">{n.coefficient || n.cours?.coefficient || 1}</td>
                      <td className={`px-3 py-2.5 text-center font-bold ${(n.note || n.moyenne || 0) >= 10 ? 'text-green-700' : 'text-red-600'}`}>
                        {(n.note || n.moyenne || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-center text-gray-500">—</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-indigo-200 bg-indigo-50">
                  <tr>
                    <td className="px-4 py-3 font-bold text-gray-800">Moyenne Générale</td>
                    <td className="px-3 py-3 text-center font-bold text-gray-700">
                      {notes.reduce((s: number, n: any) => s + (n.coefficient || n.cours?.coefficient || 1), 0)}
                    </td>
                    <td className={`px-3 py-3 text-center font-bold text-lg ${moy >= 10 ? 'text-green-700' : 'text-red-600'}`}>
                      {moy.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>

              <div className="p-4 border-t bg-amber-50">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-700">Appréciation</p>
                    </div>
                    <p className="text-sm text-gray-600 italic">{bulletin?.appreciation || 'Bulletin disponible'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                    {bulletin?.rang || '-'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-700">{bulletin?.rang ? `${bulletin.rang}ème sur ${bulletin.effectif || 'N/A'} élèves` : 'Rang non disponible'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Profil académique</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="matiere" tick={{ fontSize: 11 }} />
                  <Radar name="Note" dataKey="Note" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Points forts / à améliorer</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {strengths.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">Points forts</p>
                  {strengths.map((n: any) => (
                    <div key={n.cours?.libelle || n.matiere} className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-700">{n.cours?.libelle || n.matiere}</span>
                      <span className="font-bold text-green-700 text-sm">{(n.note || n.moyenne || 0).toFixed(2)}/20</span>
                    </div>
                  ))}
                </div>
              )}
              {weaknesses.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold text-orange-700 mb-2 uppercase tracking-wide">À améliorer</p>
                  {weaknesses.map((n: any) => (
                    <div key={n.cours?.libelle || n.matiere} className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-700">{n.cours?.libelle || n.matiere}</span>
                      <span className={`font-bold text-sm ${(n.note || n.moyenne || 0) >= 10 ? 'text-orange-600' : 'text-red-600'}`}>
                        {(n.note || n.moyenne || 0).toFixed(2)}/20
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
