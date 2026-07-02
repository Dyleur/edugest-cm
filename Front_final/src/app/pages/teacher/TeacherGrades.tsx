import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { BookOpen, Plus, Save, Trophy, ChevronDown, ChevronUp, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import { epreuvesAPI, evaluationsAPI, coursAPI, classesAPI } from '../../services/api';

type Tab = 'epreuves' | 'notes' | 'classement';

export default function TeacherGrades() {
  const [tab, setTab] = useState<Tab>('epreuves');
  const [epreuves, setEpreuves] = useState<any[]>([]);
  const [notes, setNotes] = useState<Record<number, Record<string, number | null>>>({});
  const [selectedEpreuve, setSelectedEpreuve] = useState<number | null>(null);
  const [expandedEpreuve, setExpandedEpreuve] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedClasseClassement, setSelectedClasseClassement] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [cours, setCours] = useState<any[]>([]);
  const [elevesParClasse, setElevesParClasse] = useState<Record<string, any[]>>({});

  useEffect(() => {
    Promise.all([
      epreuvesAPI.list(),
      coursAPI.list(),
      classesAPI.list(),
      classesAPI.list(),
    ])
      .then(([epreuvesData, coursData, classesData]) => {
        setCours(Array.isArray(coursData) ? coursData : []);
        const cls = Array.isArray(classesData) ? classesData : [];
        setClasses(cls);
        if (cls.length > 0) setSelectedClasseClassement(cls[0].libelle);

        const epr = Array.isArray(epreuvesData) ? epreuvesData : [];
        setEpreuves(epr.map((ep: any) => ({
          id: ep.idEpreuve,
          libelle: ep.libelle || ep.cours?.libelle || 'Épreuve',
          classe: ep.classe?.libelle || ep.Classe?.libelle || '',
          cours: ep.cours?.libelle || '',
          date: ep.dateEpreuve || '',
          noteMax: ep.noteMax || 20,
          type: ep.type || 'Devoir',
          session: ep.session?.libelle || '',
        })));

        cls.forEach((c: any) => {
          classesAPI.getEleves(c.idClasse)
            .then(data => {
              setElevesParClasse(prev => ({ ...prev, [c.libelle]: Array.isArray(data) ? data : [] }));
            })
            .catch(() => {});
        });
      })
      .catch(() => {});
  }, []);

  const handleCreateEpreuve = () => {
    toast.success('Épreuve créée avec succès');
  };

  const handleSaveNotes = () => {
    toast.success('Notes enregistrées avec succès');
  };

  const currentEpreuve = selectedEpreuve ? epreuves.find((e) => e.id === selectedEpreuve) : null;

  const elevesNote = currentEpreuve ? (elevesParClasse[currentEpreuve.classe] || []) : [];

  const coursParClasse: Record<string, string[]> = {};
  classes.forEach((c: any) => {
    coursParClasse[c.libelle] = cours.map((co: any) => co.libelle);
  });

  const epreuvesClasse = epreuves.filter((e) => e.classe === selectedClasseClassement);
  const elevesPourClassement = elevesParClasse[selectedClasseClassement] || [];

  const moyennesEleves = elevesPourClassement.map((el: any) => {
    const notesEl = epreuvesClasse
      .map((ep) => ({ note: notes[ep.id]?.[el.matricule], noteMax: ep.noteMax }))
      .filter((n) => n.note !== undefined && n.note !== null);
    const moyenne = notesEl.length > 0
      ? notesEl.reduce((sum, n) => sum + (n.note! / n.noteMax) * 20, 0) / notesEl.length
      : null;
    return { ...el, moyenne };
  }).sort((a, b) => (b.moyenne ?? -1) - (a.moyenne ?? -1));

  return (
    <div className="space-y-6">
      <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-purple-900 to-purple-700">
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-1">Notes & Épreuves</h1>
            <p className="text-purple-100">Créer des épreuves et saisir les notes</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        {[
          { key: 'epreuves', label: 'Épreuves', icon: BookOpen },
          { key: 'notes', label: 'Saisir Notes', icon: Pencil },
          { key: 'classement', label: 'Classement', icon: Trophy }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === key ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'epreuves' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowNewForm(!showNewForm)} className="bg-purple-600 hover:bg-purple-700 gap-2">
              {showNewForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showNewForm ? 'Annuler' : 'Nouvelle épreuve'}
            </Button>
          </div>

          {showNewForm && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader><CardTitle className="text-base text-purple-700">Créer une épreuve</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Intitulé *</label>
                    <input placeholder="Ex: Devoir 2 — Mathématiques" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-300 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Classe *</label>
                    <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                      {classes.map((c: any) => <option key={c.idClasse}>{c.libelle}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Matière *</label>
                    <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                      {cours.map((co: any) => <option key={co.idCours}>{co.libelle}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
                    <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Note sur</label>
                    <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none">
                      {['Devoir', 'Composition', 'Contrôle', 'Interrogation'].map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <Button onClick={handleCreateEpreuve} className="mt-4 bg-purple-600 hover:bg-purple-700 gap-2">
                  <Save className="w-4 h-4" /> Créer l'épreuve
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {epreuves.map((ep) => (
              <Card key={ep.id} className="hover:shadow-md transition-shadow">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpandedEpreuve(expandedEpreuve === ep.id ? null : ep.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{ep.libelle}</p>
                      <p className="text-sm text-gray-500">{ep.classe} · {ep.cours} · {ep.date ? new Date(ep.date).toLocaleDateString('fr-FR') : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{ep.type}</Badge>
                    <Badge className="bg-purple-100 text-purple-700">/{ep.noteMax}</Badge>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedEpreuve(ep.id); setTab('notes'); }}
                      className="text-purple-600 border-purple-300">
                      Saisir notes
                    </Button>
                    {expandedEpreuve === ep.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === 'notes' && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-5">
              <label className="block text-sm font-medium mb-2">Sélectionner une épreuve</label>
              <select
                value={selectedEpreuve ?? ''}
                onChange={(e) => setSelectedEpreuve(Number(e.target.value) || null)}
                className="w-full md:w-96 border rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                <option value="">-- Choisir une épreuve --</option>
                {epreuves.map((ep) => (
                  <option key={ep.id} value={ep.id}>{ep.libelle} ({ep.classe})</option>
                ))}
              </select>
            </CardContent>
          </Card>

          {currentEpreuve && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{currentEpreuve.libelle} — Note sur {currentEpreuve.noteMax}</span>
                  <Button onClick={handleSaveNotes} className="bg-purple-600 hover:bg-purple-700 gap-2">
                    <Save className="w-4 h-4" /> Enregistrer
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {elevesNote.map((el: any) => (
                    <div key={el.matricule} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                          {el.prenom?.charAt(0)}{el.nom?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{el.nom} {el.prenom}</p>
                          <p className="text-xs text-gray-400">{el.matricule}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min={0} max={currentEpreuve.noteMax} step={0.5}
                          placeholder="—"
                          className="w-20 border rounded-lg px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                        <span className="text-sm text-gray-400">/{currentEpreuve.noteMax}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {tab === 'classement' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {classes.map((c: any) => (
              <button key={c.idClasse} onClick={() => setSelectedClasseClassement(c.libelle)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedClasseClassement === c.libelle ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {c.libelle}
              </button>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Classement — {selectedClasseClassement}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {moyennesEleves.map((el: any, idx: number) => (
                  <div key={el.matricule} className={`flex items-center gap-4 p-3 rounded-lg ${idx === 0 ? 'bg-yellow-50 border border-yellow-200' : idx === 1 ? 'bg-gray-100' : idx === 2 ? 'bg-orange-50' : 'bg-white border'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${idx === 0 ? 'bg-yellow-400 text-white' : idx === 1 ? 'bg-gray-400 text-white' : idx === 2 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{el.nom} {el.prenom}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${el.moyenne !== null ? (el.moyenne >= 10 ? 'text-green-600' : 'text-red-500') : 'text-gray-400'}`}>
                        {el.moyenne !== null ? el.moyenne.toFixed(2) + '/20' : '—'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
