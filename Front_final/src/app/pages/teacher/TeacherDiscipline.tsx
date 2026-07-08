import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ShieldAlert, Plus, X, Info, Clock, AlertTriangle, Frown, Siren } from 'lucide-react';
import { toast } from 'sonner';
import { disciplineAPI, elevesAPI } from '../../services/api';
import { mockDiscipline, mockStudents } from '../../data/mock-data';

type TypeIncident = 'Indiscipline' | 'Bagarre' | 'Tricherie' | 'Insolence' | 'Autre';
const typesIncidents: TypeIncident[] = ['Indiscipline', 'Bagarre', 'Tricherie', 'Insolence', 'Autre'];

const statutColors: Record<string, string> = {
  'Signalé': 'bg-orange-100 text-orange-700',
  'En traitement': 'bg-blue-100 text-blue-700',
  'Sanctionné': 'bg-red-100 text-red-700',
  'Classé': 'bg-gray-100 text-gray-600',
};

function deriveGravite(points) {
  if (points >= 8) return 'Grave';
  if (points >= 4) return 'Moyenne';
  return 'Mineure';
}

function mapIncident(r) {
  const eleve = r.Eleve || r.eleve;
  const nomEleve = eleve ? `${eleve.nom} ${eleve.prenom}` : (r.matricule || '');
  const points = Math.abs(r.points || 0);
  return {
    id: r.idDiscipline || r.idRapport,
    matricule: r.matricule,
    nom: nomEleve,
    classe: 'CM2 A',
    type: r.typeIncident || r.type,
    date: r.dateIncident,
    description: r.description,
    statut: r.statut === 'Résolu' ? 'Classé' : r.statut === 'En cours' ? 'En traitement' : 'Signalé',
    gravite: deriveGravite(points),
    points,
    sanction: r.sanction || '',
  };
}

export default function TeacherDiscipline() {
  const { t, language } = useLanguage();
  const [apiIncidents, setApiIncidents] = useState<any[]>([]);
  const [apiEleves, setApiEleves] = useState<any[]>(mockStudents);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    disciplineAPI.list().then(d => setApiIncidents(Array.isArray(d) ? d : [])).catch(() => setApiIncidents(mockDiscipline));
    elevesAPI.list().then(d => setApiEleves(Array.isArray(d) ? d : [])).catch(() => setApiEleves(mockStudents));
  }, []);

  const incidents = apiIncidents.map(mapIncident);
  const elevesDisponibles = apiEleves.slice(0, 50);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    matricule: '',
    type: 'Indiscipline' as TypeIncident,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const total = incidents.length;
  const mineurs = incidents.filter(i => i.gravite === 'Mineure').length;
  const moyens = incidents.filter(i => i.gravite === 'Moyenne').length;
  const graves = incidents.filter(i => i.gravite === 'Grave').length;

  const handleSubmit = async () => {
    if (!form.matricule || !form.description.trim()) {
      toast.error(language === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await disciplineAPI.create({
        matricule: form.matricule,
        typeIncident: form.type,
        dateIncident: form.date,
        description: form.description,
      });
      toast.success(language === 'fr' ? 'Incident signalé avec succès' : 'Incident reported successfully');
      setShowForm(false);
      setForm({ matricule: '', type: 'Indiscipline', date: new Date().toISOString().split('T')[0], description: '' });
      disciplineAPI.list().then(d => setApiIncidents(Array.isArray(d) ? d : [])).catch(() => setApiIncidents(mockDiscipline));
    } catch {
      toast.error(language === 'fr' ? 'Erreur lors du signalement' : 'Error reporting incident');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('discipline.total'), value: total, icon: AlertTriangle, color: 'from-red-500 to-red-600', sub: language === 'fr' ? 'Signalés' : 'Reported' },
          { label: t('discipline.minor'), value: mineurs, icon: Frown, color: 'from-yellow-500 to-yellow-600', sub: language === 'fr' ? 'Mineurs' : 'Minor' },
          { label: t('discipline.moderate'), value: moyens, icon: AlertTriangle, color: 'from-orange-500 to-orange-600', sub: language === 'fr' ? 'Moyens' : 'Moderate' },
          { label: t('discipline.severe'), value: graves, icon: Siren, color: 'from-red-700 to-red-800', sub: language === 'fr' ? 'Graves' : 'Severe' },
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

      <div className="flex items-start gap-2 p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm text-amber-700">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          {language === 'fr'
            ? 'En tant qu\'enseignant, vous pouvez signaler des incidents disciplinaires. La mise à jour des sanctions relève du Directeur.'
            : 'As a teacher, you can report disciplinary incidents. Sanction updates are handled by the Director.'}
        </span>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className={`gap-2 ${showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
          {showForm ? <><X className="w-4 h-4" /> {language === 'fr' ? 'Annuler' : 'Cancel'}</> : <><Plus className="w-4 h-4" /> {t('discipline.report')}</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-base text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> {language === 'fr' ? "Nouveau signalement d'incident" : 'New incident report'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{language === 'fr' ? 'Élève concerné' : 'Student'} *</label>
                <select
                  value={form.matricule}
                  onChange={e => setForm({ ...form, matricule: e.target.value })}
                  className="w-full border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <option value="">-- {language === 'fr' ? 'Sélectionner un élève' : 'Select a student'} --</option>
                  {elevesDisponibles.map(e => (
                    <option key={e.matricule} value={e.matricule}>
                      {e.nom} {e.prenom} ({e.matricule})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{language === 'fr' ? "Type d'incident" : 'Incident type'} *</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as TypeIncident })}
                  className="w-full border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:outline-none"
                >
                  {typesIncidents.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('teacher.discipline.incidentDate')} *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t('teacher.discipline.description')} *</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder={language === 'fr' ? "Décrivez l'incident de manière précise et factuelle..." : "Describe the incident accurately and factually..."}
                  className="w-full border border-border/50 rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleSubmit} disabled={submitting} className="bg-red-600 hover:bg-red-700 gap-2">
                <ShieldAlert className="w-4 h-4" /> {submitting ? '...' : language === 'fr' ? 'Soumettre le signalement' : 'Submit report'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            {t('discipline.recent')} ({incidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{language === 'fr' ? 'Aucun incident signalé' : 'No incidents reported'}</p>
          ) : (
            <div className="space-y-3">
              {incidents.map((inc, i) => (
                <div key={inc.id} className="animate-fade-in-up p-4 border border-border/50 rounded-xl bg-muted/30 hover:bg-card transition-colors" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <ShieldAlert className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{inc.nom}</p>
                          <p className="text-xs text-muted-foreground">{inc.classe} · {new Date(inc.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11">{inc.description}</p>
                      {inc.sanction && (
                        <p className="text-xs text-muted-foreground ml-11 mt-1">
                          {language === 'fr' ? 'Sanction' : 'Sanction'} : {inc.sanction} ({inc.points} pts)
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Badge variant="outline" className="border-red-200 text-red-700 text-xs">{inc.type}</Badge>
                      <Badge className={`text-xs ${statutColors[inc.statut] || 'bg-gray-100 text-gray-700'}`}>{inc.statut}</Badge>
                      <Badge variant="outline" className="text-xs text-muted-foreground">{inc.gravite}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
