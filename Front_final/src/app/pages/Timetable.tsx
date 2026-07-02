import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { edtAPI, coursAPI, classesAPI } from '../services/api';

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const horaires = [
  { debut: '08:00', fin: '09:00' },
  { debut: '09:00', fin: '10:00' },
  { debut: '10:00', fin: '10:30', type: 'pause' },
  { debut: '10:30', fin: '11:30' },
  { debut: '11:30', fin: '12:30' },
  { debut: '12:30', fin: '14:00', type: 'pause' },
  { debut: '14:00', fin: '15:00' },
  { debut: '15:00', fin: '16:00' }
];

const coursCouleurs: Record<string, string> = {
  'MATHEMATIQUES': 'bg-blue-100 text-blue-700 border-blue-300',
  'FRANCAIS': 'bg-purple-100 text-purple-700 border-purple-300',
  'ANGLAIS': 'bg-red-100 text-red-700 border-red-300',
  'SCIENCES': 'bg-green-100 text-green-700 border-green-300',
  'HISTOIRE': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'GEOGRAPHIE': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'EDUCATION PHYSIQUE': 'bg-orange-100 text-orange-700 border-orange-300',
  'EPS': 'bg-orange-100 text-orange-700 border-orange-300',
  'ARTS': 'bg-pink-100 text-pink-700 border-pink-300',
  'MUSIQUE': 'bg-indigo-100 text-indigo-700 border-indigo-300',
  'INFORMATIQUE': 'bg-teal-100 text-teal-700 border-teal-300',
};

function getCouleurCours(libelle: string): string {
  const upper = libelle.toUpperCase();
  for (const [key, color] of Object.entries(coursCouleurs)) {
    if (upper.includes(key)) return color;
  }
  return 'bg-gray-100 text-gray-700 border-gray-300';
}

export default function Timetable() {
  const [emploiDuTemps, setEmploiDuTemps] = useState<Record<string, any[]>>({});
  const [selectedClasse, setSelectedClasse] = useState('');
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    classesAPI.list()
      .then(data => setClasses(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (classes.length > 0 && !selectedClasse) {
      setSelectedClasse(classes[0].idClasse.toString());
    }
  }, [classes, selectedClasse]);

  useEffect(() => {
    if (!selectedClasse) return;
    Promise.all([
      edtAPI.getByClasse(parseInt(selectedClasse)),
      coursAPI.list(),
    ])
      .then(([edtData, coursData]) => {
        const edtList = Array.isArray(edtData) ? edtData : [];
        const coursMap = new Map();
        (Array.isArray(coursData) ? coursData : []).forEach((c: any) => {
          coursMap.set(c.idCours, c.libelle);
        });

        const emploi: Record<string, any[]> = {};
        jours.forEach(j => { emploi[j] = []; });

        edtList.forEach((entry: any) => {
          const jourFr = entry.jour || '';
          const coursLib = coursMap.get(entry.idCours) || entry.cours?.libelle || 'Cours';
          const slot: any = {
            matiere: coursLib,
            professeur: entry.enseignant?.prenom && entry.enseignant?.nom
              ? `${entry.enseignant.prenom} ${entry.enseignant.nom}`
              : entry.professeur || '',
            salle: entry.salle || '',
            couleur: getCouleurCours(coursLib),
          };
          const heureDebut = entry.heureDebut?.substring(0, 5);
          const hIdx = horaires.findIndex(h => h.debut === heureDebut && !h.type);
          if (hIdx >= 0 && emploi[jourFr]) {
            emploi[jourFr][hIdx] = slot;
          }
        });

        setEmploiDuTemps(emploi);
      })
      .catch(() => {});
  }, [selectedClasse]);

  const currentClasse = classes.find((c: any) => c.idClasse.toString() === selectedClasse);

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1629652486845-eb09110a62b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzdXBwbGllcyUyMGVkdWNhdGlvbiUyMGNvbG9yZnVsfGVufDF8fHx8MTc3NzQ1NzkwN3ww&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">Emploi du Temps</h1>
            <p className="text-lg">Planning hebdomadaire des cours</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
        <Calendar className="w-5 h-5 text-teal-600" />
        <div>
          <select
            className="font-semibold bg-transparent border p-1 rounded"
            value={selectedClasse}
            onChange={(e) => setSelectedClasse(e.target.value)}
          >
            {classes.map((c: any) => (
              <option key={c.idClasse} value={c.idClasse}>{c.libelle}</option>
            ))}
          </select>
          <p className="text-sm text-gray-600">Semaine du 28 Avril au 02 Mai 2026</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Planning de la semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-3 bg-gray-50 text-left min-w-[100px]">Horaires</th>
                  {jours.map((jour) => (
                    <th key={jour} className="border p-3 bg-gray-50 text-center min-w-[150px]">
                      {jour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horaires.map((horaire, idx) => (
                  <tr key={idx}>
                    <td className="border p-3 bg-gray-50 font-medium text-sm">
                      {horaire.type === 'pause' ? (
                        <Badge variant="outline" className="w-full justify-center">
                          Pause
                        </Badge>
                      ) : (
                        `${horaire.debut} - ${horaire.fin}`
                      )}
                    </td>
                    {jours.map((jour) => {
                      const cours = emploiDuTemps[jour]?.[idx];

                      if (horaire.type === 'pause') {
                        return (
                          <td key={jour} className="border p-3 bg-gray-100 text-center text-gray-500 text-sm">
                            {horaire.debut === '12:30' ? 'Déjeuner' : 'Récréation'}
                          </td>
                        );
                      }

                      if (!cours) {
                        return <td key={jour} className="border p-3"></td>;
                      }

                      return (
                        <td key={jour} className="border p-1">
                          <div className={`${cours.couleur} p-2 rounded border-l-4 h-full`}>
                            <p className="font-semibold text-sm">{cours.matiere}</p>
                            <p className="text-xs mt-1">{cours.professeur}</p>
                            <p className="text-xs opacity-75">{cours.salle}</p>
                          </div>
                        </td>
                      );
                    })}
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
