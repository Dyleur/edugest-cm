import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Users, GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { coursAPI } from '../services/api';
import { mockSubjects } from '../data/mock-data';
import { toast } from 'sonner';
import CreateSubjectModal from '../components/modals/CreateSubjectModal';

export default function Subjects() {
  const { t, language } = useLanguage();
  const [subjects, setSubjects] = useState<any[]>(mockSubjects);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    coursAPI.list()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setSubjects(list.map((c: any) => ({
          id: c.idCours,
          libelle: c.libelle,
          coefficient: c.coefficient || 1,
          actif: c.actif !== false,
          enseignants: c.enseignants?.length || c.nbEnseignants || 0,
        })));
      })
      .catch(() => { setSubjects(mockSubjects); setLoading(false); })
      .finally(() => setLoading(false));
  }, []);

  const totalCoef = subjects.reduce((s: number, c: any) => s + c.coefficient, 0);
  const activeSubjects = subjects.filter(s => s.actif).length;
  const filteredSubjects = subjects.filter(s =>
    s.libelle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: t('subjects.total'), value: subjects.length.toString(), sub: t('subjects.allActive'), icon: BookOpen, color: 'from-blue-400 to-blue-500', delay: '0s' },
          { label: t('subjects.totalCoefficient'), value: totalCoef.toString(), sub: language === 'fr' ? 'Coefficients au total' : 'Total coefficients', icon: GraduationCap, color: 'from-violet-500 to-violet-600', delay: '0.1s' },
          { label: t('subjects.assignedTeachers'), value: subjects.reduce((s: number, c: any) => s + (typeof c.enseignants === 'number' ? c.enseignants : 0), 0).toString(), sub: t('subjects.assigned'), icon: Users, color: 'from-emerald-500 to-emerald-600', delay: '0.15s' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: stat.delay }}>
              <Card className="border-border/50 overflow-hidden group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                    </div>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input type="text" placeholder={language === 'fr' ? 'Rechercher une matière...' : 'Search subjects...'} className="pl-9 h-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowModal(true)}>
          <Plus className="w-3.5 h-3.5" />
          {t('subjects.new')}
        </Button>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              {t('subjects.program')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredSubjects.map((subject, i) => (
                  <div key={subject.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{subject.libelle}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                            Coef: {subject.coefficient}
                          </Badge>
                          {!subject.actif && (
                            <Badge variant="destructive" className="text-[10px]">Inactif</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <CreateSubjectModal open={showModal} onOpenChange={setShowModal} onSuccess={() => {
        coursAPI.list().then(data => {
          const list = Array.isArray(data) ? data : [];
          setSubjects(list.map((c: any) => ({ id: c.idCours, libelle: c.libelle, coefficient: c.coefficient || 1, actif: c.actif !== false, enseignants: c.enseignants?.length || 0 })));
        }).catch(() => { setSubjects(mockSubjects); });
      }} />
    </div>
  );
}
