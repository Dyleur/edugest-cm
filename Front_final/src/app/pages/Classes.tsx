import { useState, useEffect } from 'react';
import { Plus, Users, User, School, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { classesAPI, cyclesAPI, elevesAPI } from '../services/api';
import { mockClasses, mockCycles, mockStudents } from '../data/mock-data';
import { toast } from 'sonner';
import CreateClassModal from '../components/modals/CreateClassModal';

export default function Classes() {
  const { t, language } = useLanguage();
  const [cycles, setCycles] = useState<any[]>(() => {
    const classesList = mockClasses;
    const cyclesList = mockCycles;
    return cyclesList.map((cycle: any) => ({
      id: cycle.idCycle,
      nom: cycle.libelle,
      classes: classesList.filter((c: any) => c.idCycle === cycle.idCycle).map((cl: any) => ({
        id: cl.idClasse,
        nom: cl.libelle,
        niveau: cl.niveau,
        effectif: cl.effectif || 0,
        capacite: cl.salle?.capacite || 45,
        titulaire: cl.titulaire ? `${cl.titulaire.prenom} ${cl.titulaire.nom}` : 'Non assigné',
        salle: cl.salle?.libelle || 'N/A',
      })),
    }));
  });
  const [totalEleves, setTotalEleves] = useState(mockStudents.length);
  const [showModal, setShowModal] = useState(false);

  function mapClasse(cl) {
    return {
      id: cl.idClasse,
      nom: cl.libelle,
      effectif: cl.effectif || 0,
      capacite: cl.salle?.capacite || 45,
      titulaire: cl.titulaire ? `${cl.titulaire.prenom} ${cl.titulaire.nom}` : 'Non assigné',
      salle: cl.salle?.libelle || 'N/A',
    };
  }

  useEffect(() => {
    Promise.all([
      cyclesAPI.list(),
      classesAPI.list(),
      elevesAPI.list(),
    ])
      .then(([cyclesData, classesData, elevesData]) => {
        const totalE = Array.isArray(elevesData) ? elevesData.length : 0;
        setTotalEleves(totalE);

        const classesList = Array.isArray(classesData) ? classesData : [];
        const cyclesList = Array.isArray(cyclesData) ? cyclesData : [];

        const grouped = cyclesList.map((cycle) => {
          const cycleClasses = classesList.filter((c) => c.idCycle === cycle.idCycle);
          return {
            id: cycle.idCycle,
            nom: cycle.libelle,
            classes: cycleClasses.map(mapClasse),
          };
        });

        if (grouped.length === 0) {
          setCycles([{
            id: 1,
            nom: 'Classes',
            classes: classesList.map(mapClasse),
          }]);
        } else {
          setCycles(grouped);
        }
      })
      .catch(() => {
        const classesList = mockClasses;
        const cyclesList = mockCycles;
        setTotalEleves(mockStudents.length);
        const grouped = cyclesList.map((cycle) => ({
          id: cycle.idCycle,
          nom: cycle.libelle,
          classes: classesList.filter((c) => c.idCycle === cycle.idCycle).map((cl) => ({
            id: cl.idClasse,
            nom: cl.libelle,
            effectif: cl.effectif || 0,
            capacite: cl.salle?.capacite || 45,
            titulaire: cl.titulaire ? `${cl.titulaire.prenom} ${cl.titulaire.nom}` : 'Non assigné',
            salle: cl.salle?.libelle || 'N/A',
          })),
        }));
        setCycles(grouped);
      });
  }, []);

  const totalClasses = cycles.reduce((sum: number, cycle: any) => sum + cycle.classes.length, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: t('classes.total'), value: totalClasses.toString(), sub: t('classes.onCycles'), icon: School, color: 'from-blue-400 to-blue-500', delay: '0s' },
          { label: t('classes.totalEnrollment'), value: totalEleves.toLocaleString(), sub: t('classes.enrolled'), icon: Users, color: 'from-violet-500 to-violet-600', delay: '0.1s' },
          { label: t('classes.average'), value: totalClasses ? Math.round(totalEleves / totalClasses).toString() : '0', sub: t('classes.students'), icon: BookOpen, color: 'from-emerald-500 to-emerald-600', delay: '0.15s' },
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

      <div className="flex justify-between items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t('classes.byCycle')}</h2>
          <p className="text-sm text-muted-foreground">{t('classes.subtitle')}</p>
        </div>
              <Button size="sm" className="gap-1.5" onClick={() => setShowModal(true)}>
                <Plus className="w-3.5 h-3.5" />
                {t('classes.new')}
              </Button>
      </div>

      {cycles.map((cycle: any, ci: number) => (
        <div key={cycle.id} className="animate-fade-in-up" style={{ animationDelay: `${0.25 + ci * 0.1}s` }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <School className="w-4 h-4 text-primary" />
                {cycle.nom}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cycle.classes.map((classe: any) => {
                  const tauxRemplissage = classe.capacite ? Math.round((classe.effectif / classe.capacite) * 100) : 0;
                  const isFull = tauxRemplissage >= 100;

                  return (
                    <Card key={classe.id} className="border-border/50 hover:shadow-md transition-all duration-300 group">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{classe.nom}</h3>
                            <p className="text-sm text-muted-foreground">{classe.salle}</p>
                          </div>
                          <Badge variant={isFull ? 'destructive' : 'default'} className={isFull ? '' : 'bg-primary/10 text-primary border-primary/20'}>
                            {tauxRemplissage}%
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{classe.effectif}/{classe.capacite}</span>
                            <span className="text-muted-foreground">{t('classes.students')}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">{classe.titulaire}</span>
                          </div>

                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isFull ? 'bg-destructive' : tauxRemplissage > 80 ? 'bg-warning' : 'bg-success'
                              }`}
                              style={{ width: `${Math.min(tauxRemplissage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
      <CreateClassModal open={showModal} onOpenChange={setShowModal} onSuccess={() => {
        Promise.all([cyclesAPI.list(), classesAPI.list(), elevesAPI.list()]).then(([c, cl, e]) => {
          const totalE = Array.isArray(e) ? e.length : 0; setTotalEleves(totalE);
          const classesList = Array.isArray(cl) ? cl : []; const cyclesList = Array.isArray(c) ? c : [];
          const grouped = cyclesList.map((cycle: any) => ({ id: cycle.idCycle, nom: cycle.libelle, classes: classesList.filter((cl2: any) => cl2.idCycle === cycle.idCycle).map(mapClasse) }));
          setCycles(grouped.length ? grouped : [{ id: 1, nom: 'Classes', classes: classesList.map(mapClasse) }]);
        }).catch(() => {
          const groupedFromMock = mockCycles.map((cycle: any) => ({
            id: cycle.idCycle, nom: cycle.libelle,
            classes: mockClasses.filter((cl: any) => cl.idCycle === cycle.idCycle).map((cl: any) => ({ id: cl.idClasse, nom: cl.libelle, effectif: cl.effectif || 0, capacite: cl.salle?.capacite || 45, titulaire: cl.titulaire ? cl.titulaire.prenom + ' ' + cl.titulaire.nom : 'Non assigné', salle: cl.salle?.libelle || 'N/A' }))
          }));
          setCycles(groupedFromMock);
        });
      }} />
    </div>
  );
}
