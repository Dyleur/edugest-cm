import { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { epreuvesAPI, evaluationsAPI, coursAPI } from '../services/api';

const couleurPalette = ['bg-blue-500', 'bg-purple-500', 'bg-red-500', 'bg-green-500'];

export default function Grades() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedEpreuve, setSelectedEpreuve] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      epreuvesAPI.list(),
      coursAPI.list(),
      evaluationsAPI.getByEleve(''),
    ])
      .then(([epreuvesData, coursData, evalData]) => {
        const coursMap = new Map();
        (Array.isArray(coursData) ? coursData : []).forEach((c: any) => {
          coursMap.set(c.idCours, c.libelle);
        });

        const epreuves = Array.isArray(epreuvesData) ? epreuvesData : [];
        setEvaluations(epreuves.map((ep: any, i: number) => ({
          id: ep.idEpreuve,
          matiere: coursMap.get(ep.idCours) || ep.cours?.libelle || 'Matière',
          type: ep.type || ep.libelle || 'Devoir',
          date: ep.dateEpreuve || '',
          noteMax: ep.noteMax || 20,
          moyenne: 0,
          couleur: couleurPalette[i % couleurPalette.length],
        })));

        if (epreuves.length > 0) setSelectedEpreuve(epreuves[0].idEpreuve);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedEpreuve) return;
    const evalData = Array.isArray(evaluations) ? evaluations : [];
    const epreuveNotes: Record<string, number> = {};

    evaluationsAPI.getByEleve('')
      .then(data => {
        if (Array.isArray(data)) {
          data.forEach((e: any) => {
            if (e.idEpreuve === selectedEpreuve) {
              epreuveNotes[e.matricule] = e.note;
            }
          });
        }
      })
      .catch(() => {});
  }, [selectedEpreuve]);

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1678822872007-698d622afeb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx0ZWFjaGVyJTIwdGVhY2hpbmclMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3Nzc0NTc5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">Saisie des Notes</h1>
            <p className="text-lg">Évaluations et résultats scolaires</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Évaluations récentes</h2>
          <p className="text-gray-600">Toutes les évaluations</p>
        </div>
        <Button className="gap-2 bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4" />
          Nouvelle évaluation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {evaluations.map((evaluation) => (
          <Card key={evaluation.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className={`${evaluation.couleur} p-3 rounded-lg`}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{evaluation.matiere}</h3>
                  <p className="text-sm text-gray-600">{evaluation.type}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-500">{evaluation.date ? new Date(evaluation.date).toLocaleDateString() : 'N/A'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Note max:</span>
                      <Badge variant="outline">{evaluation.noteMax}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Évaluations disponibles</span>
            <Button className="bg-red-600 hover:bg-red-700">
              Enregistrer les notes
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Matière</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-center p-3">Date</th>
                  <th className="text-center p-3">Note Max</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evalItem) => (
                  <tr key={evalItem.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{evalItem.matiere}</td>
                    <td className="p-3">{evalItem.type}</td>
                    <td className="p-3 text-center">{evalItem.date ? new Date(evalItem.date).toLocaleDateString() : '-'}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline">{evalItem.noteMax}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
