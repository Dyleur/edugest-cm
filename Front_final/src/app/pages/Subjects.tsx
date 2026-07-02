import { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { coursAPI } from '../services/api';

const couleurPalette = [
  'bg-blue-500', 'bg-purple-500', 'bg-red-500', 'bg-green-500',
  'bg-yellow-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500',
  'bg-teal-500',
];

export default function Subjects() {
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    coursAPI.list()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setSubjects(list.map((s: any, i: number) => ({
          id: s.idCours,
          nom: s.libelle,
          coefficient: s.coefficient,
          couleur: couleurPalette[i % couleurPalette.length],
          enseignants: s.enseignants?.length || s.Enseignants?.length || 0,
          actif: s.actif !== undefined ? s.actif : true,
        })));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1752920299211-28be8c9b0121?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwYm9va3MlMjBsaWJyYXJ5fGVufDF8fHx8MTc3NzQ1NzkwN3ww&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">Gestion des Matières</h1>
            <p className="text-lg">Programme scolaire et matières enseignées</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Matières enseignées</h2>
          <p className="text-gray-600">Programme de l'enseignement primaire</p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          Nouvelle matière
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Total Matières</p>
            <p className="text-3xl font-bold mt-2">{subjects.length}</p>
            <p className="text-xs opacity-75 mt-1">Toutes actives</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Coefficient Total</p>
            <p className="text-3xl font-bold mt-2">
              {subjects.reduce((sum: number, s: any) => sum + s.coefficient, 0)}
            </p>
            <p className="text-xs opacity-75 mt-1">Points au total</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Enseignants affectés</p>
            <p className="text-3xl font-bold mt-2">
              {subjects.reduce((sum: number, s: any) => sum + s.enseignants, 0)}
            </p>
            <p className="text-xs opacity-75 mt-1">Au total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject: any) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`${subject.couleur} p-4 rounded-xl`}>
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{subject.nom}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">
                      Coefficient: {subject.coefficient}
                    </Badge>
                    {subject.actif && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Actif
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {subject.enseignants} enseignant{subject.enseignants > 1 ? 's' : ''} affecté{subject.enseignants > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
