import { useState, useEffect } from 'react';
import { Plus, FileText, BookOpen, CalendarDays, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { epreuvesAPI, evaluationsAPI, coursAPI } from '../services/api';
import { mockEvaluations, mockSubjects } from '../data/mock-data';
import { toast } from 'sonner';
import CreateGradeModal from '../components/modals/CreateGradeModal';

const couleurPalette = ['from-blue-400 to-blue-500', 'from-violet-500 to-violet-600', 'from-rose-500 to-rose-600', 'from-emerald-500 to-emerald-600'];

export default function Grades() {
  const { t, language } = useLanguage();
  const [evaluations, setEvaluations] = useState<any[]>(() => mockEvaluations.map((ep: any, i: number) => ({
    id: ep.idEpreuve,
    matiere: mockSubjects.find((s: any) => s.idCours === ep.idCours)?.libelle || 'Matière',
    type: ep.libelle || 'Devoir',
    date: ep.dateEpreuve || '',
    noteMax: ep.noteMax || 20,
    couleur: ['from-blue-400 to-blue-500', 'from-violet-500 to-violet-600', 'from-rose-500 to-rose-600', 'from-emerald-500 to-emerald-600'][i % 4],
  })));
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      epreuvesAPI.list(),
      coursAPI.list(),
    ])
      .then(([epreuvesData, coursData]) => {
        const coursMap = new Map();
        (Array.isArray(coursData) ? coursData : []).forEach((c: any) => {
          coursMap.set(c.idCours, c.libelle);
        });

        const epreuves = Array.isArray(epreuvesData) ? epreuvesData : (epreuvesData?.data || []);
        setEvaluations(epreuves.map((ep: any, i: number) => ({
          id: ep.idEpreuve,
          matiere: coursMap.get(ep.idCours) || ep.cours?.libelle || 'Matière',
          type: ep.type || ep.libelle || language === 'fr' ? 'Devoir' : 'Test',
          date: ep.dateEpreuve || '',
          noteMax: ep.noteMax || 20,
          couleur: couleurPalette[i % couleurPalette.length],
        })));
      })
      .catch(() => { setEvaluations(mockEvaluations.map((ep: any, i: number) => ({ id: ep.idEpreuve, matiere: mockSubjects.find((s: any) => s.idCours === ep.idCours)?.libelle || 'Matière', type: ep.libelle || 'Devoir', date: ep.dateEpreuve || '', noteMax: ep.noteMax || 20, couleur: ['from-blue-400 to-blue-500', 'from-violet-500 to-violet-600', 'from-rose-500 to-rose-600', 'from-emerald-500 to-emerald-600'][i % 4] }))); })
      .finally(() => setLoading(false));
  }, []);

  const handleSuccess = () => {
    epreuvesAPI.list().then(d => {
      const items = Array.isArray(d) ? d : (d?.data || []);
      setEvaluations(items.map((ep: any, i: number) => ({ id: ep.idEpreuve, matiere: ep.cours?.libelle || 'Matière', type: ep.type || ep.libelle || (language === 'fr' ? 'Devoir' : 'Test'), date: ep.dateEpreuve || '', noteMax: ep.noteMax || 20, couleur: couleurPalette[i % couleurPalette.length] })));
    }).catch(() => { setEvaluations(mockEvaluations.map((ep: any, i: number) => ({ id: ep.idEpreuve, matiere: mockSubjects.find((s: any) => s.idCours === ep.idCours)?.libelle || 'Matière', type: ep.libelle || 'Devoir', date: ep.dateEpreuve || '', noteMax: ep.noteMax || 20, couleur: couleurPalette[i % couleurPalette.length] }))); });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center animate-fade-in-up">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{language === 'fr' ? 'Évaluations récentes' : 'Recent Assessments'}</h2>
          <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Toutes les évaluations du trimestre' : 'All term assessments'}</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowModal(true)}>
          <Plus className="w-3.5 h-3.5" />
          {t('grades.new')}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {evaluations.map((evaluation, i) => (
              <div key={evaluation.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <Card className="border-border/50 hover:shadow-md transition-all duration-300 group h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${evaluation.couleur} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{evaluation.matiere}</h3>
                        <p className="text-xs text-muted-foreground">{evaluation.type}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarDays className="w-3 h-3" />
                            {evaluation.date ? new Date(evaluation.date).toLocaleDateString() : 'N/A'}
                          </div>
                          <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                            /{evaluation.noteMax}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    {language === 'fr' ? 'Évaluations disponibles' : 'Available Assessments'}
                  </span>
                  <Button size="sm" className="gap-1.5" onClick={() => toast.success(language === 'fr' ? 'Notes enregistrées' : 'Grades saved')}>
                    <Award className="w-3.5 h-3.5" />
                    {t('grades.saveGrades')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'fr' ? 'Matière' : 'Subject'}</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'fr' ? 'Type' : 'Type'}</th>
                        <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'fr' ? 'Date' : 'Date'}</th>
                        <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'fr' ? 'Note Max' : 'Max Score'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluations.map((evalItem) => (
                        <tr key={evalItem.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="p-3 font-medium text-foreground">{evalItem.matiere}</td>
                          <td className="p-3 text-muted-foreground">
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">{evalItem.type}</Badge>
                          </td>
                          <td className="p-3 text-center text-muted-foreground">{evalItem.date ? new Date(evalItem.date).toLocaleDateString() : '-'}</td>
                          <td className="p-3 text-center">
                            <Badge variant="outline" className="font-mono text-xs">{evalItem.noteMax}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      <CreateGradeModal open={showModal} onOpenChange={setShowModal} onSuccess={handleSuccess} />
    </div>
  );
}
