import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Receipt, Download, ChevronDown, ChevronUp, Award } from 'lucide-react';
import { bulletinsAPI, classesAPI } from '../../services/api';

function getMoyenneGenerale(notes: { coefficient: number; moyenne: number }[]) {
  const totalCoeff = notes.reduce((s, n) => s + n.coefficient, 0);
  const totalPoints = notes.reduce((s, n) => s + n.coefficient * n.moyenne, 0);
  return totalCoeff > 0 ? totalPoints / totalCoeff : 0;
}

function getMention(moy: number) {
  if (moy >= 18) return { label: 'Félicitations', color: 'bg-yellow-100 text-yellow-800' };
  if (moy >= 15) return { label: 'Très Bien', color: 'bg-green-100 text-green-700' };
  if (moy >= 12) return { label: 'Bien', color: 'bg-blue-100 text-blue-700' };
  if (moy >= 10) return { label: 'Passable', color: 'bg-gray-100 text-gray-700' };
  return { label: 'Insuffisant', color: 'bg-red-100 text-red-700' };
}

export default function TeacherReportCards() {
  const [selectedClass, setSelectedClass] = useState('');
  const [expandedEleve, setExpandedEleve] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [bulletins, setBulletins] = useState<any[]>([]);

  useEffect(() => {
    classesAPI.list()
      .then(data => {
        const cls = Array.isArray(data) ? data : [];
        setClasses(cls);
        if (cls.length > 0) setSelectedClass(cls[0].libelle || cls[0].idClasse.toString());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const cls = classes.find((c: any) => c.libelle === selectedClass || c.idClasse.toString() === selectedClass);
    if (!cls) return;

    bulletinsAPI.getByClasse(cls.idClasse)
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setBulletins(list.map((b: any) => ({
          matricule: b.matricule || b.Eleve?.matricule || '',
          nom: b.eleve?.nom || b.nom || '',
          prenom: b.eleve?.prenom || b.prenom || '',
          notes: b.notes || b.evaluations?.map((ev: any) => ({
            matiere: ev.cours?.libelle || ev.matiere || '',
            coefficient: ev.coefficient || ev.cours?.coefficient || 1,
            moyenne: ev.note || 0,
          })) || [],
          rang: b.rang || 0,
          appreciation: b.appreciation || '',
        })));
      })
      .catch(() => {});
  }, [selectedClass]);

  return (
    <div className="space-y-6">
      <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-indigo-900 to-indigo-700">
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-1">Bulletins de Notes</h1>
            <p className="text-indigo-100">Consultation des bulletins de vos classes</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-5 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-gray-600">Classe :</span>
          {classes.map((c: any) => {
            const label = c.libelle;
            return (
              <button key={c.idClasse} onClick={() => setSelectedClass(label)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedClass === label || selectedClass === c.idClasse.toString() ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {label}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold text-indigo-700">{bulletins.length}</p>
          <p className="text-sm text-gray-500">Élèves</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold text-green-700">
            {(bulletins.reduce((s, e) => s + getMoyenneGenerale(e.notes), 0) / (bulletins.length || 1)).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Moy. classe</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {bulletins.filter((e) => getMoyenneGenerale(e.notes) >= 10).length}
          </p>
          <p className="text-sm text-gray-500">Admis</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <p className="text-3xl font-bold text-red-500">
            {bulletins.filter((e) => getMoyenneGenerale(e.notes) < 10).length}
          </p>
          <p className="text-sm text-gray-500">En difficulté</p>
        </CardContent></Card>
      </div>

      <div className="space-y-3">
        {bulletins.map((eleve) => {
          const moy = getMoyenneGenerale(eleve.notes);
          const mention = getMention(moy);
          const isOpen = expandedEleve === eleve.matricule;

          return (
            <Card key={eleve.matricule} className="overflow-hidden hover:shadow-md transition-shadow">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedEleve(isOpen ? null : eleve.matricule)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white flex-shrink-0 ${eleve.rang === 1 ? 'bg-yellow-400' : eleve.rang === 2 ? 'bg-gray-400' : eleve.rang === 3 ? 'bg-orange-400' : 'bg-indigo-400'}`}>
                    {eleve.rang || '-'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{eleve.nom} {eleve.prenom}</p>
                    <p className="text-xs text-gray-400">{eleve.matricule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`font-bold text-lg ${moy >= 10 ? 'text-green-700' : 'text-red-500'}`}>{moy.toFixed(2)}/20</p>
                    <Badge className={`text-xs ${mention.color}`}>{mention.label}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <Download className="w-4 h-4 text-gray-400" />
                  </Button>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {isOpen && (
                <CardContent className="pt-0 border-t bg-gray-50">
                  <div className="space-y-2 mt-3">
                    {eleve.notes.map((n: any) => (
                      <div key={n.matiere} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 flex-1">{n.matiere}</span>
                        <span className="text-gray-400 text-xs mr-4">coeff. {n.coefficient}</span>
                        <span className={`font-semibold w-16 text-right ${n.moyenne >= 10 ? 'text-green-700' : 'text-red-500'}`}>
                          {n.moyenne.toFixed(2)}/20
                        </span>
                        <div className="w-32 bg-gray-200 rounded-full h-1.5 ml-4">
                          <div className={`h-1.5 rounded-full ${n.moyenne >= 10 ? 'bg-green-500' : 'bg-red-400'}`}
                            style={{ width: `${(n.moyenne / 20) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {eleve.appreciation && (
                    <div className="mt-3 p-3 bg-white rounded-lg border flex items-start gap-2">
                      <Award className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 italic">{eleve.appreciation}</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
