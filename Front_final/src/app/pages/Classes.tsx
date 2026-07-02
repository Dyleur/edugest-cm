import { useState, useEffect } from 'react';
import { Plus, Users, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { classesAPI, cyclesAPI, elevesAPI } from '../services/api';

export default function Classes() {
  const { t } = useLanguage();
  const [cycles, setCycles] = useState<any[]>([]);
  const [totalEleves, setTotalEleves] = useState(0);

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

        const grouped = cyclesList.map((cycle: any) => {
          const cycleClasses = classesList.filter((c: any) => c.idCycle === cycle.idCycle);
          return {
            id: cycle.idCycle,
            nom: cycle.libelle,
            classes: cycleClasses.map((cl: any) => ({
              id: cl.idClasse,
              nom: cl.libelle,
              niveau: cl.niveau,
              effectif: cl.effectif || 0,
              capacite: cl.salle?.capacite || 45,
              titulaire: cl.titulaire ? `${cl.titulaire.prenom} ${cl.titulaire.nom}` : 'Non assigné',
              salle: cl.salle?.libelle || 'N/A',
            })),
          };
        });

        if (grouped.length === 0) {
          setCycles([{
            id: 1,
            nom: 'Classes',
            classes: classesList.map((cl: any) => ({
              id: cl.idClasse,
              nom: cl.libelle,
              niveau: cl.niveau,
              effectif: cl.effectif || 0,
              capacite: 45,
              titulaire: cl.titulaire ? `${cl.titulaire.prenom} ${cl.titulaire.nom}` : 'Non assigné',
              salle: 'N/A',
            })),
          }]);
        } else {
          setCycles(grouped);
        }
      })
      .catch(() => {});
  }, []);

  const totalClasses = cycles.reduce((sum: number, cycle: any) => sum + cycle.classes.length, 0);

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1730106447145-fb3f8a2bcce1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxzY2hvb2wlMjBidWlsZGluZyUyMG1vZGVybiUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3Nzc0NTc5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('classes.title')}</h1>
            <p className="text-lg">{t('classes.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('classes.byCycle')}</h2>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>
        <Button className="gap-2 bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4" />
          {t('classes.new')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">{t('classes.total')}</p>
            <p className="text-3xl font-bold mt-2">{totalClasses}</p>
            <p className="text-xs opacity-75 mt-1">{t('classes.onCycles')}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">{t('classes.totalEnrollment')}</p>
            <p className="text-3xl font-bold mt-2">{totalEleves.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-1">{t('classes.enrolled')}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">{t('classes.average')}</p>
            <p className="text-3xl font-bold mt-2">
              {totalClasses ? Math.round(totalEleves / totalClasses) : 0}
            </p>
            <p className="text-xs opacity-75 mt-1">{t('classes.students')}</p>
          </CardContent>
        </Card>
      </div>

      {cycles.map((cycle: any) => (
        <Card key={cycle.id}>
          <CardHeader>
            <CardTitle className="text-xl">{cycle.nom}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cycle.classes.map((classe: any) => {
                const tauxRemplissage = classe.capacite ? Math.round((classe.effectif / classe.capacite) * 100) : 0;
                const isFull = tauxRemplissage >= 100;

                return (
                  <Card key={classe.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{classe.nom}</h3>
                          <p className="text-sm text-gray-600">{classe.salle}</p>
                        </div>
                        <Badge variant={isFull ? 'destructive' : 'default'}>
                          {tauxRemplissage}%
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{classe.effectif}/{classe.capacite} {t('classes.students')}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{classe.titulaire}</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              isFull ? 'bg-red-500' : 'bg-green-500'
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
      ))}
    </div>
  );
}
