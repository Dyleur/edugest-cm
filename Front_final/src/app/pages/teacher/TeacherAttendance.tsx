import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { classesAPI, presencesAPI } from '../../services/api';

type Statut = 'present' | 'absent' | 'retard' | 'justifie';

const statutConfig: Record<Statut, { label: string; color: string; activeColor: string; icon: React.ElementType }> = {
  present: { label: 'Présent', color: 'border-green-300 text-green-700 hover:bg-green-50', activeColor: 'bg-green-600 text-white hover:bg-green-700', icon: CheckCircle },
  absent: { label: 'Absent', color: 'border-red-300 text-red-700 hover:bg-red-50', activeColor: 'bg-red-600 text-white hover:bg-red-700', icon: XCircle },
  retard: { label: 'Retard', color: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50', activeColor: 'bg-yellow-500 text-white hover:bg-yellow-600', icon: Clock },
  justifie: { label: 'Justifié', color: 'border-blue-300 text-blue-700 hover:bg-blue-50', activeColor: 'bg-blue-500 text-white hover:bg-blue-600', icon: AlertCircle }
};

export default function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appel, setAppel] = useState<Record<string, { statut: Statut; motif: string }>>({});
  const [motifOpen, setMotifOpen] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [eleves, setEleves] = useState<any[]>([]);

  useEffect(() => {
    classesAPI.list()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setClasses(list);
        if (list.length > 0) setSelectedClass(list[0].idClasse);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    classesAPI.getEleves(selectedClass)
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setEleves(list);
        setAppel({});
        setValidated(false);
      })
      .catch(() => {});
  }, [selectedClass]);

  const setStatut = (matricule: string, statut: Statut) => {
    setAppel((prev) => ({
      ...prev,
      [matricule]: { statut, motif: prev[matricule]?.motif || '' }
    }));
    if (statut === 'present') setMotifOpen(null);
  };

  const setMotif = (matricule: string, motif: string) => {
    setAppel((prev) => ({
      ...prev,
      [matricule]: { ...prev[matricule], motif }
    }));
  };

  const getStatut = (matricule: string): Statut => appel[matricule]?.statut || 'present';

  const stats = {
    present: eleves.filter((e) => getStatut(e.matricule) === 'present').length,
    absent: eleves.filter((e) => getStatut(e.matricule) === 'absent').length,
    retard: eleves.filter((e) => getStatut(e.matricule) === 'retard').length,
    justifie: eleves.filter((e) => getStatut(e.matricule) === 'justifie').length
  };

  const taux = eleves.length > 0 ? ((stats.present / eleves.length) * 100).toFixed(1) : '0';

  const handleValidate = () => {
    const data = Object.entries(appel).map(([matricule, val]) => ({
      matricule,
      date: selectedDate,
      statut: val.statut.toUpperCase(),
      motif: val.motif || undefined,
    }));
    presencesAPI.appel({ presences: data, idClasse: selectedClass, date: selectedDate })
      .then(() => {
        setValidated(true);
        toast.success(`Appel validé pour ${classes.find((c: any) => c.idClasse === selectedClass)?.libelle} — ${selectedDate}`);
      })
      .catch((err) => toast.error(err.message || 'Erreur lors de la validation'));
  };

  return (
    <div className="space-y-6">
      <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-orange-800 to-orange-600">
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-1">Saisie de l'Appel</h1>
            <p className="text-orange-100">Enregistrement des présences</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setValidated(false); }}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div className="flex gap-2">
              {classes.map((cls: any) => (
                <button
                  key={cls.idClasse}
                  onClick={() => setSelectedClass(cls.idClasse)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedClass === cls.idClasse
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cls.libelle}
                </button>
              ))}
            </div>
            {validated && (
              <Badge className="bg-green-100 text-green-700 px-3 py-1">
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Appel validé
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Présents', value: stats.present, color: 'text-green-700 bg-green-50' },
          { label: 'Absents', value: stats.absent, color: 'text-red-700 bg-red-50' },
          { label: 'Retards', value: stats.retard, color: 'text-yellow-700 bg-yellow-50' },
          { label: 'Justifiés', value: stats.justifie, color: 'text-blue-700 bg-blue-50' },
          { label: 'Taux', value: `${taux}%`, color: 'text-purple-700 bg-purple-50' }
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Feuille d'appel — {classes.find((c: any) => c.idClasse === selectedClass)?.libelle || ''}</span>
            <Button
              onClick={handleValidate}
              disabled={validated}
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              <Save className="w-4 h-4" />
              {validated ? 'Appel validé' : "Valider l'appel"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eleves.map((eleve: any) => {
              const statut = getStatut(eleve.matricule);
              const showMotif = statut !== 'present' && motifOpen === eleve.matricule;

              return (
                <div key={eleve.matricule} className="border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {eleve.prenom?.charAt(0)}{eleve.nom?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{eleve.nom} {eleve.prenom}</p>
                        <p className="text-xs text-gray-400">{eleve.matricule}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {(Object.keys(statutConfig) as Statut[]).map((s) => {
                        const cfg = statutConfig[s];
                        const Icon = cfg.icon;
                        const isActive = statut === s;
                        return (
                          <button
                            key={s}
                            onClick={() => {
                              setStatut(eleve.matricule, s);
                              if (s !== 'present') setMotifOpen(eleve.matricule);
                              else setMotifOpen(null);
                            }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                              isActive ? cfg.activeColor : cfg.color + ' bg-white'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{cfg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {showMotif && (
                    <div className="px-4 pb-3 bg-gray-50 border-t">
                      <input
                        type="text"
                        placeholder="Motif (facultatif)..."
                        value={appel[eleve.matricule]?.motif || ''}
                        onChange={(e) => setMotif(eleve.matricule, e.target.value)}
                        className="w-full text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white mt-2"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
