import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FileText, TrendingUp, TrendingDown, Minus, GraduationCap, BookOpen, Calculator, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { elevesAPI } from '../../services/api';
import { mockEvaluations, mockSubjects, mockGrades } from '../../data/mock-data';
import { useSelectedChild } from '../../hooks/useSelectedChild';
import { ChildSelector } from '../../components/ui/child-selector';

function getMoy(grades: { note: number; noteMax: number; coeff: number }[]) {
  const pts = grades.reduce((s, n) => s + (n.note / n.noteMax) * 20 * n.coeff, 0);
  const totalCoeff = grades.reduce((s, n) => s + n.coeff, 0);
  return totalCoeff > 0 ? pts / totalCoeff : 0;
}

export default function ParentGrades() {
  const { t, language } = useLanguage();
  const { selected: enfant, selectChild } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<any[]>(mockGrades);

  useEffect(() => {
    if (!enfant?.matricule) { setLoading(false); return; }
    elevesAPI.notes(enfant.matricule)
      .then(data => {
        const items = Array.isArray(data) ? data : (data?.data || []);
        setGrades(items.map((g: any) => ({
          matiere: g.cours?.libelle || g.matiere || 'Matière',
          coefficient: g.coefficient || g.cours?.coefficient || 1,
          note: g.note ?? g.moyenne ?? 0,
          noteMax: g.noteMax || 20,
          type: g.type || 'Devoir',
          date: g.dateEpreuve || g.date,
        })));
      })
      .catch(() => { setGrades(mockGrades.length > 0 ? mockGrades : mockEvaluations.map((g: any) => ({ matiere: mockSubjects.find((s: any) => s.idCours === g.idCours)?.libelle || 'Matière', coefficient: 1, note: 10, noteMax: g.noteMax || 20, type: g.libelle || 'Devoir', date: g.dateEpreuve || '' }))); })
      .finally(() => setLoading(false));
  }, [enfant?.matricule]);

  const moy = getMoy(grades);
  const highestScore = grades.length ? Math.max(...grades.map(g => (g.note / g.noteMax) * 20)) : 0;

  const chartData = grades.map(g => ({
    matiere: g.matiere.split(' ')[0],
    Note: g.note,
    Max: g.noteMax,
  }));

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{t('parent.grades.title')}</h1>
                <ChildSelector onChildChange={(e) => selectChild(e.matricule)} selectedMatricule={enfant?.matricule} />
              </div>
              <p className="text-blue-200 text-sm">{t('parent.grades.subtitle')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('parent.dashboard.overallAverage'), value: grades.length ? `${moy.toFixed(2)}/20` : '-', icon: GraduationCap, color: 'from-blue-400 to-blue-500', sub: t('grades.average') },
          { label: language === 'fr' ? 'Matières' : 'Subjects', value: grades.length.toString(), icon: BookOpen, color: 'from-purple-500 to-purple-600', sub: t('common.total') },
          { label: language === 'fr' ? 'Coefficient total' : 'Total Coefficient', value: grades.reduce((s, g) => s + g.coefficient, 0).toString(), icon: Calculator, color: 'from-green-500 to-green-600', sub: t('grades.test') },
          { label: language === 'fr' ? 'Moyenne maximale' : 'Highest Score', value: grades.length ? `${highestScore.toFixed(1)}/20` : '-', icon: TrendingUp, color: 'from-amber-500 to-amber-600', sub: t('grades.exam') },
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

      {grades.length > 0 ? (
        <>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChartIcon className="w-5 h-5 text-blue-500" /> {language === 'fr' ? 'Répartition des notes' : 'Grade Distribution'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="matiere" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(val: number) => [`${val}/20`, '']} />
                    <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="3 3" />
                    <Bar dataKey="Note" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Note" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" /> {language === 'fr' ? 'Détail par matière' : 'Subject Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {grades.map((g, i) => {
                  const pct = g.note / g.noteMax;
                  return (
                    <div key={i} className="p-4 bg-muted/50 rounded-xl border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{g.matiere}</p>
                          <Badge variant="outline" className="text-xs">{t('grades.test')}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {pct >= 0.75 ? <TrendingUp className="w-4 h-4 text-green-500" /> : pct >= 0.5 ? <Minus className="w-4 h-4 text-yellow-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                          <span className={`font-bold ${pct >= 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                            {g.note}/{g.noteMax}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div className={`h-2 rounded-full ${pct >= 0.75 ? 'bg-green-500' : pct >= 0.5 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${pct * 100}%` }} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{language === 'fr' ? 'Coefficient' : 'Coeff'}: {g.coefficient}</span>
                        <span>{t('parent.grades.maxScore')}: {g.noteMax}</span>
                        <span>{g.type}</span>
                        <span>{g.date ? new Date(g.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' }) : ''}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">{language === 'fr' ? 'Aucune note disponible' : 'No grades available'}</p>
            <p className="text-sm text-muted-foreground mt-1">{language === 'fr' ? 'Les notes de votre enfant apparaîtront ici' : 'Your child\'s grades will appear here'}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
