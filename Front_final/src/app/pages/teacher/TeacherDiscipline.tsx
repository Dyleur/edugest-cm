import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ShieldAlert, Plus, X, Info, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { disciplineAPI, elevesAPI, classesAPI } from '../../services/api';

type TypeIncident = 'Indiscipline' | 'Bagarre' | 'Tricherie' | 'Insolence' | 'Autre';
const typesIncidents: TypeIncident[] = ['Indiscipline', 'Bagarre', 'Tricherie', 'Insolence', 'Autre'];

const statutColors: Record<string, string> = {
  'Signalé': 'bg-orange-100 text-orange-700',
  'En traitement': 'bg-blue-100 text-blue-700',
  'Sanctionné': 'bg-red-100 text-red-700',
  'Classé': 'bg-gray-100 text-gray-600'
};

export default function TeacherDiscipline() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [elevesDisponibles, setElevesDisponibles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    matricule: '',
    type: 'Indiscipline' as TypeIncident,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    Promise.all([
      disciplineAPI.list(),
      elevesAPI.list(),
    ])
      .then(([discData, eleveData]) => {
        const disc = Array.isArray(discData) ? discData : [];
        setIncidents(disc.slice(0, 20).map((inc: any) => ({
          id: inc.idRapport,
          matricule: inc.matricule,
          nom: inc.eleve ? `${inc.eleve.nom} ${inc.eleve.prenom}` : inc.matricule,
          classe: inc.classe?.libelle || '',
          type: inc.type || 'Indiscipline',
          date: inc.dateIncident || inc.date || '',
          description: inc.description || '',
          statut: inc.statut === 'resolu' ? 'Classé' : inc.statut === 'traite' ? 'En traitement' : 'Signalé',
          signalePar: 'Moi',
        })));

        const eleves = Array.isArray(eleveData) ? eleveData : [];
        setElevesDisponibles(eleves.slice(0, 50));
      })
      .catch(() => {});
  }, []);

  const handleSubmit = () => {
    if (!form.matricule || !form.description.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    disciplineAPI.create({
      matricule: form.matricule,
      type: form.type,
      dateIncident: form.date,
      description: form.description,
    })
      .then(() => {
        toast.success('Incident signalé avec succès');
        setShowForm(false);
        setForm({ matricule: '', type: 'Indiscipline', date: new Date().toISOString().split('T')[0], description: '' });
      })
      .catch((err) => toast.error(err.message || 'Erreur lors du signalement'));
  };

  return (
    <div className="space-y-6">
      <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-red-900 to-red-700">
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-1">Discipline</h1>
            <p className="text-red-100">Signalement d'incidents</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          En tant qu'enseignant, vous pouvez <strong>signaler</strong> des incidents disciplinaires.
          La mise à jour des sanctions relève du Directeur.
        </span>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)} className={`gap-2 ${showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
          {showForm ? <><X className="w-4 h-4" /> Annuler</> : <><Plus className="w-4 h-4" /> Signaler un incident</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-base text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Nouveau signalement d'incident
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Élève concerné *</label>
                <select
                  value={form.matricule}
                  onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <option value="">-- Sélectionner un élève --</option>
                  {elevesDisponibles.map((e: any) => (
                    <option key={e.matricule} value={e.matricule}>
                      {e.nom} {e.prenom} ({e.matricule})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type d'incident *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as TypeIncident })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {typesIncidents.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date de l'incident *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description de l'incident *</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez l'incident de manière précise et factuelle..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700 gap-2">
                <ShieldAlert className="w-4 h-4" /> Soumettre le signalement
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Incidents ({incidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Aucun incident signalé</p>
          ) : (
            <div className="space-y-4">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-4 border rounded-xl bg-gray-50 hover:bg-white transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <ShieldAlert className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{inc.nom}</p>
                          <p className="text-xs text-gray-400">{inc.classe} · {inc.date ? new Date(inc.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 ml-11">{inc.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Badge variant="outline" className="border-red-200 text-red-700 text-xs">{inc.type}</Badge>
                      <Badge className={`text-xs ${statutColors[inc.statut] || 'bg-gray-100 text-gray-700'}`}>{inc.statut}</Badge>
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
