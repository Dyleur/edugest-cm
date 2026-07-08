import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { BookOpen, Plus, Save, Trophy, ChevronDown, ChevronUp, Pencil, X, FileText, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { epreuvesAPI, evaluationsAPI, classesAPI, elevesAPI, coursAPI } from '../../services/api';
import { mockStudents, mockEvaluations, mockSubjects, mockClasses } from '../../data/mock-data';

const DEMO_CLASSES = mockClasses.map((c: any) => ({ idClasse: c.idClasse, libelle: c.libelle }));
const classeMap: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, };
const DEMO_ELEVES = mockStudents.map((s: any, i: number) => ({ matricule: s.matricule, nom: s.nom, prenom: s.prenom, idClasse: (i % 10) + 1 }));
const DEMO_COURS = mockSubjects.map((s: any) => ({ id: s.idCours, nom: s.libelle }));

function loadLocalEpreuves(): any[] {
  try { const r = localStorage.getItem('edugest_epreuves'); return r ? JSON.parse(r) : []; } catch { return []; }
}

function saveLocalEpreuve(ep: any) {
  const list = loadLocalEpreuves();
  list.push(ep);
  try { localStorage.setItem('edugest_epreuves', JSON.stringify(list)); } catch {}
}

function loadLocalNotes(): Record<number, Record<string, number>> {
  try { const r = localStorage.getItem('edugest_notes'); return r ? JSON.parse(r) : {}; } catch { return {}; }
}

function saveLocalNote(idEpreuve: number, matricule: string, note: number) {
  const all = loadLocalNotes();
  if (!all[idEpreuve]) all[idEpreuve] = {};
  all[idEpreuve][matricule] = note;
  try { localStorage.setItem('edugest_notes', JSON.stringify(all)); } catch {}
}

let localEpreuveId = 0;

type Tab = 'epreuves' | 'notes' | 'classement';

export default function TeacherGrades() {
  const { t, language } = useLanguage();
  const [tab, setTab] = useState<Tab>('epreuves');
  const [notes, setNotes] = useState<Record<number, Record<string, number | null>>>({});
  const [selectedEpreuve, setSelectedEpreuve] = useState<number | null>(null);
  const [expandedEpreuve, setExpandedEpreuve] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [apiEpreuves, setApiEpreuves] = useState<any[]>(mockEvaluations);
  const [apiEleves, setApiEleves] = useState<any[]>(DEMO_ELEVES);
  const [apiClasses, setApiClasses] = useState<any[]>(DEMO_CLASSES);
  const [apiCours, setApiCours] = useState<any[]>(DEMO_COURS);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    epreuvesAPI.list().then(setApiEpreuves).catch(() => setApiEpreuves(loadLocalEpreuves()));
    elevesAPI.list().then(setApiEleves).catch(() => setApiEleves(DEMO_ELEVES));
    classesAPI.list().then(setApiClasses).catch(() => setApiClasses(DEMO_CLASSES));
    coursAPI.list().then(setApiCours).catch(() => setApiCours(DEMO_COURS));
  }, []);

  const srcEpreuves = apiEpreuves;
  const srcEleves = apiEleves;
  const classes = apiClasses;
  const coursList = apiCours;

  const epreuves = srcEpreuves.map((ep: any) => ({
    id: ep.idEpreuve || ep.id,
    libelle: ep.libelle,
    classe: typeof ep.idClasse === 'number' ? (classes.find((c: any) => c.idClasse === ep.idClasse)?.libelle || '') : (ep.classe || ''),
    cours: typeof ep.idCours === 'number' ? (coursList.find((c: any) => c.id === ep.idCours)?.nom || '') : (ep.cours || ''),
    idClasse: ep.idClasse,
    idCours: ep.idCours,
    date: ep.dateEpreuve || ep.date,
    noteMax: ep.noteMax || 20,
    type: ep.type,
    fichierUrl: ep.fichierUrl,
    fichierNom: ep.fichierNom,
  }));

  const moyenneGlobale = epreuves.length > 0
    ? (epreuves.reduce((s, ep) => s + ep.noteMax, 0) / epreuves.length / 20 * 10).toFixed(1)
    : '0';

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleCreateEpreuve = async () => {
    const titleInput = document.querySelector<HTMLInputElement>('[data-field="title"]');
    const classSelect = document.querySelector<HTMLSelectElement>('[data-field="class"]');
    const coursSelect = document.querySelector<HTMLSelectElement>('[data-field="cours"]');
    const dateInput = document.querySelector<HTMLInputElement>('[data-field="date"]');
    const noteMaxSelect = document.querySelector<HTMLSelectElement>('[data-field="noteMax"]');
    const typeSelect = document.querySelector<HTMLSelectElement>('[data-field="type"]');

    const idClasse = parseInt(classSelect?.value || '0');
    const idCours = parseInt(coursSelect?.value || '0');

    const data: any = {
      libelle: titleInput?.value || '',
      idClasse,
      idCours,
      dateEpreuve: dateInput?.value || new Date().toISOString().split('T')[0],
      noteMax: parseInt(noteMaxSelect?.value || '20'),
      type: typeSelect?.value || 'Devoir',
    };
    if (!data.libelle || !idClasse) {
      toast.error(language === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill all required fields');
      return;
    }
    if (file) {
      data.fichierUrl = await fileToBase64(file);
      data.fichierNom = file.name;
    }
    setSubmitting(true);
    try {
      await epreuvesAPI.create(data);
      toast.success(language === 'fr' ? 'Épreuve créée avec succès' : 'Test created successfully');
    } catch {
      localEpreuveId -= 1;
      saveLocalEpreuve({ idEpreuve: localEpreuveId, ...data });
      toast.success(language === 'fr' ? 'Épreuve créée (hors-ligne)' : 'Test saved (offline)');
    }
    setShowNewForm(false);
    setFile(null);
    epreuvesAPI.list().then(setApiEpreuves).catch(() => setApiEpreuves(loadLocalEpreuves()));
    setSubmitting(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedEpreuve) return;
    setSubmitting(true);
    const noteInputs = document.querySelectorAll<HTMLInputElement>('[data-note-eleve]');
    const promises: Promise<any>[] = [];
    const localNotes: { idEpreuve: number; matricule: string; note: number }[] = [];
    noteInputs.forEach(input => {
      const matricule = input.getAttribute('data-note-eleve');
      const value = input.value;
      if (matricule && value) {
        const note = parseFloat(value);
        localNotes.push({ idEpreuve: selectedEpreuve, matricule, note });
        promises.push(
          evaluationsAPI.create({ matricule, idEpreuve: selectedEpreuve, note })
            .catch(() => { saveLocalNote(selectedEpreuve, matricule, note); })
        );
      }
    });
    try {
      if (promises.length > 0) await Promise.all(promises);
      toast.success(language === 'fr' ? 'Notes enregistrées' : 'Grades saved');
    } catch {
      toast.success(language === 'fr' ? 'Notes sauvegardées (hors-ligne)' : 'Grades saved (offline)');
    } finally {
      setSubmitting(false);
    }
  };

  const currentEpreuve = selectedEpreuve ? epreuves.find(e => e.id === selectedEpreuve) : null;
  const elevesNote = currentEpreuve
    ? (currentEpreuve.idClasse
        ? srcEleves.filter((el: any) => el.idClasse === currentEpreuve.idClasse)
        : srcEleves)
    : [];

  const moyennesEleves = srcEleves.map(el => {
    const notesEl = epreuves
      .map(ep => ({ note: notes[ep.id]?.[el.matricule], noteMax: ep.noteMax }))
      .filter(n => n.note !== undefined && n.note !== null);
    const moyenne = notesEl.length > 0
      ? notesEl.reduce((sum, n) => sum + (n.note! / n.noteMax) * 20, 0) / notesEl.length
      : null;
    return { ...el, moyenne };
  }).sort((a, b) => (b.moyenne ?? -1) - (a.moyenne ?? -1));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('teacher.dashboard.plannedTests'), value: epreuves.length, icon: BookOpen, color: 'from-purple-500 to-purple-600', sub: t('teacher.dashboard.thisTerm') },
          { label: language === 'fr' ? 'Moyenne générale' : 'Overall average', value: `${moyenneGlobale}/10`, icon: Trophy, color: 'from-blue-400 to-blue-500', sub: language === 'fr' ? 'Toutes épreuves' : 'All tests' },
          { label: language === 'fr' ? 'Élèves notés' : 'Graded students', value: srcEleves.length, icon: FileText, color: 'from-green-500 to-green-600', sub: language === 'fr' ? 'Ce trimestre' : 'This term' },
          { label: language === 'fr' ? 'Note max' : 'Max score', value: '20', icon: Trophy, color: 'from-amber-500 to-amber-600', sub: language === 'fr' ? 'Par épreuve' : 'Per test' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.sub}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 border-b border-border/50">
        {[
          { key: 'epreuves', label: language === 'fr' ? 'Épreuves' : 'Tests', icon: BookOpen },
          { key: 'notes', label: language === 'fr' ? 'Saisir Notes' : 'Enter Grades', icon: Pencil },
          { key: 'classement', label: language === 'fr' ? 'Classement' : 'Ranking', icon: Trophy },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === key ? 'border-purple-600 text-purple-700' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'epreuves' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowNewForm(!showNewForm)} className={`gap-2 ${showNewForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'}`}>
              {showNewForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showNewForm ? language === 'fr' ? 'Annuler' : 'Cancel' : t('teacher.grades.newTest')}
            </Button>
          </div>

          {showNewForm && (
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader><CardTitle className="text-base text-purple-700">{language === 'fr' ? 'Créer une épreuve' : 'Create a test'}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{language === 'fr' ? 'Intitulé' : 'Title'} *</label>
                    <input data-field="title" placeholder={language === 'fr' ? 'Ex: Devoir 2 — Mathématiques' : 'Ex: Test 2 — Math'} className="w-full border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:ring-2 focus:ring-purple-300 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('students.class')} *</label>
                    <select data-field="class" className="w-full border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:outline-none">
                      <option value="">-- {language === 'fr' ? 'Choisir' : 'Select'} --</option>
                      {classes.map((c: any) => <option key={c.idClasse || c.id} value={c.idClasse || c.id}>{c.libelle}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('teacher.dashboard.subject')} *</label>
                    <select data-field="cours" className="w-full border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:outline-none">
                      <option value="">-- {language === 'fr' ? 'Choisir' : 'Select'} --</option>
                      {coursList.map((c: any) => <option key={c.id} value={c.id}>{c.nom || c.libelle}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('teacher.grades.testDate')} *</label>
                    <input data-field="date" type="date" className="w-full border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('teacher.grades.maxScore')}</label>
                    <select data-field="noteMax" className="w-full border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:outline-none">
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{language === 'fr' ? 'Type' : 'Type'}</label>
                    <select data-field="type" className="w-full border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:outline-none">
                      {['Devoir', 'Composition', 'Contrôle', 'Interrogation'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{language === 'fr' ? 'Fichier (optionnel)' : 'File (optional)'}</label>
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 w-full border border-dashed border-border/50 rounded-xl px-3 py-2 text-sm bg-card hover:bg-muted/50 transition-colors text-muted-foreground">
                      <Paperclip className="w-4 h-4" />
                      {file ? file.name : (language === 'fr' ? 'Ajouter un fichier' : 'Add a file')}
                    </button>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp" className="hidden"
                      onChange={e => setFile(e.target.files?.[0] || null)} />
                  </div>
                </div>
                <Button onClick={handleCreateEpreuve} disabled={submitting} className="mt-4 bg-purple-600 hover:bg-purple-700 gap-2">
                  <Save className="w-4 h-4" /> {submitting ? '...' : language === 'fr' ? "Créer l'épreuve" : 'Create test'}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {epreuves.map((ep, i) => (
              <div key={ep.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <Card className="border-border/50 hover:shadow-md transition-shadow">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setExpandedEpreuve(expandedEpreuve === ep.id ? null : ep.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{ep.libelle}</p>
                        <p className="text-sm text-muted-foreground">{ep.classe} · {ep.date ? new Date(ep.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US') : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{ep.type}</Badge>
                      <Badge className="bg-purple-100 text-purple-700">/{ep.noteMax}</Badge>
                      <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); setSelectedEpreuve(ep.id); setTab('notes'); }}
                        className="text-purple-600 border-purple-300">
                        {t('teacher.grades.enterGrades')}
                      </Button>
                      {expandedEpreuve === ep.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                  {expandedEpreuve === ep.id && (
                    <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{language === 'fr' ? 'Matière' : 'Subject'} :</span> {ep.cours || '—'}
                      </p>
                      {ep.fichierUrl && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-500" />
                          <a href={ep.fichierUrl.startsWith('data:') ? ep.fichierUrl : `http://localhost:8080${ep.fichierUrl}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:underline">
                            {ep.fichierNom || (language === 'fr' ? 'Voir le fichier' : 'View file')}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'notes' && (
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <label className="block text-sm font-medium mb-2">{language === 'fr' ? 'Sélectionner une épreuve' : 'Select a test'}</label>
              <select
                value={selectedEpreuve ?? ''}
                onChange={e => setSelectedEpreuve(Number(e.target.value) || null)}
                className="w-full md:w-96 border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:outline-none"
              >
                <option value="">-- {language === 'fr' ? 'Choisir une épreuve' : 'Choose a test'} --</option>
                {epreuves.map(ep => (
                  <option key={ep.id} value={ep.id}>{ep.libelle} ({ep.classe})</option>
                ))}
              </select>
            </CardContent>
          </Card>

          {currentEpreuve && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{currentEpreuve.libelle} — {language === 'fr' ? 'Note sur' : 'Score out of'} {currentEpreuve.noteMax}</span>
                  <Button onClick={handleSaveNotes} disabled={submitting} className="bg-purple-600 hover:bg-purple-700 gap-2">
                    <Save className="w-4 h-4" /> {submitting ? '...' : t('grades.saveGrades')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {elevesNote.map((el, i) => (
                    <div key={el.matricule} className="animate-fade-in-up flex items-center justify-between p-3 bg-muted/50 rounded-xl" style={{ animationDelay: `${i * 0.03}s` }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                          {el.prenom?.charAt(0)}{el.nom?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{el.nom} {el.prenom}</p>
                          <p className="text-xs text-muted-foreground">{el.matricule}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min={0} max={currentEpreuve.noteMax} step={0.5}
                          placeholder="—"
                          data-note-eleve={el.matricule}
                          className="w-20 border border-border/50 rounded-xl px-2 py-1 text-center text-sm bg-card focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                        <span className="text-sm text-muted-foreground">/{currentEpreuve.noteMax}</span>
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
              <button key={c.idClasse || c.id} className="px-4 py-2 rounded-xl text-sm font-medium bg-purple-600 text-white shadow-sm">
                {c.libelle}
              </button>
            ))}
          </div>
          <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base">{language === 'fr' ? 'Classement' : 'Ranking'} — {classes[0]?.libelle}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {moyennesEleves.map((el, idx) => (
                  <div key={el.matricule} className={`animate-fade-in-up flex items-center gap-4 p-3 rounded-xl ${idx === 0 ? 'bg-yellow-50 border border-yellow-200' : idx === 1 ? 'bg-gray-100' : idx === 2 ? 'bg-orange-50' : 'bg-card border border-border/50'}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${idx === 0 ? 'bg-yellow-400 text-white' : idx === 1 ? 'bg-gray-400 text-white' : idx === 2 ? 'bg-orange-400 text-white' : 'bg-muted text-muted-foreground'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{el.nom} {el.prenom}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${el.moyenne !== null ? (el.moyenne >= 10 ? 'text-green-600' : 'text-red-500') : 'text-muted-foreground'}`}>
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
