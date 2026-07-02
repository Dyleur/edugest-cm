import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { UserCircle, Phone, MapPin, Calendar, School, Users, BookOpen, Eye } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { parentsAPI, elevesAPI, coursAPI } from '../../services/api';

const age = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
};

export default function ParentChildProfile() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [enfant, setEnfant] = useState<any>(null);
  const [parents, setParents] = useState<any[]>([]);
  const [coursClasse, setCoursClasse] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.idPers) return;

    parentsAPI.enfants(user.idPers).then(async (enfants) => {
      const list = Array.isArray(enfants) ? enfants : [];
      if (list.length === 0) return;

      const first = list[0];
      setEnfant({
        matricule: first.matricule,
        nom: first.nom,
        prenom: first.prenom,
        dateNaissance: first.dateNaissance || '2015-01-01',
        lieuNaissance: first.lieuNaissance || 'N/A',
        sexe: first.sexe || 'M',
        langue: first.langue || 'FR',
        classe: first.Classe?.libelle || '',
        cycle: first.cycle || '',
        salle: first.salle || 'N/A',
        adresse: first.adresse || 'N/A',
        actif: true,
      });

      try {
        const [eleveParents, allCours] = await Promise.all([
          elevesAPI.parents(first.matricule),
          coursAPI.list(),
        ]);
        setParents(Array.isArray(eleveParents) ? eleveParents.map((p: any) => ({
          nom: `${p.prenom} ${p.nom}`,
          lien: p.lienParente || 'Parent',
          telephone: p.telephone || '',
          email: p.email || '',
          profession: p.profession || '',
          adresse: p.adresse || '',
          tuteur: p.tuteur || false,
        })) : []);
        setCoursClasse((Array.isArray(allCours) ? allCours : []).map((c: any) => ({
          matiere: c.libelle,
          coefficient: c.coefficient,
          enseignant: c.enseignants?.[0] ? `${c.enseignants[0].prenom} ${c.enseignants[0].nom}` : 'Non assigné',
        })));
      } catch {}
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-orange-900 to-amber-700 h-44">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80)', backgroundSize: 'cover' }} />
        <div className="relative h-full flex items-center px-8 gap-6 text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold border-2 border-white/40 flex-shrink-0">
            {enfant ? `${enfant.prenom?.charAt(0)}${enfant.nom?.charAt(0)}` : '?'}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{enfant ? `${enfant.nom} ${enfant.prenom}` : 'Chargement...'}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <Badge className="bg-white/20 text-white border-white/30">{enfant?.classe || ''}</Badge>
              <span className="text-orange-100 text-sm">{enfant?.cycle || ''}</span>
              <Badge className={`${enfant?.actif ? 'bg-green-500/80' : 'bg-red-500/80'} text-white`}>
                {enfant?.actif ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-orange-600" /> {t('parent.childProfile.personalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: t('parent.childProfile.studentId'), value: enfant?.matricule || '-' },
                  { label: t('parent.childProfile.fullName'), value: enfant ? `${enfant.nom} ${enfant.prenom}` : '-' },
                  { label: t('parent.childProfile.dateOfBirth'), value: enfant?.dateNaissance ? new Date(enfant.dateNaissance).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' },
                  { label: 'Âge', value: enfant?.dateNaissance ? `${age(enfant.dateNaissance)} ans` : '-' },
                  { label: t('parent.childProfile.placeOfBirth'), value: enfant?.lieuNaissance || '-' },
                  { label: t('parent.childProfile.gender'), value: enfant?.sexe === 'M' ? 'Masculin' : 'Féminin' },
                  { label: 'Section', value: enfant?.langue === 'EN' ? 'Anglophone' : 'Francophone' },
                  { label: t('parent.childProfile.language'), value: enfant?.langue === 'FR' ? 'Français' : enfant?.langue === 'EN' ? 'Anglais' : 'Bilingue' },
                ].map((f) => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{f.label}</p>
                    <p className="font-semibold text-gray-800 mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />Adresse</p>
                <p className="font-semibold text-gray-800 mt-0.5">{enfant?.adresse || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> Matières enseignées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {coursClasse.map((c: any) => (
                  <div key={c.matiere} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div>
                      <p className="font-medium text-sm text-gray-800">{c.matiere}</p>
                      <p className="text-xs text-gray-400">{c.enseignant}</p>
                    </div>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">Coeff. {c.coefficient}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <School className="w-4 h-4 text-orange-600" /> Scolarité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Classe', value: enfant?.classe || '-' },
                { label: 'Cycle', value: enfant?.cycle || '-' },
                { label: 'Salle', value: enfant?.salle || '-' },
              ].map((f) => (
                <div key={f.label} className="flex justify-between text-sm border-b pb-2 last:border-0">
                  <span className="text-gray-500">{f.label}</span>
                  <span className="font-medium text-gray-800">{f.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-4 h-4 text-purple-600" /> Parents / Tuteurs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parents.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucune information</p>
              ) : (
                parents.map((p: any) => (
                  <div key={p.nom} className={`p-3 rounded-xl border ${p.tuteur ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm text-gray-800">{p.nom}</p>
                      {p.tuteur && <Badge className="bg-orange-500 text-white text-xs">Tuteur principal</Badge>}
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p className="flex items-center gap-1.5"><span className="w-14 text-gray-400">Lien</span>{p.lien}</p>
                      <p className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{p.telephone || 'Non renseigné'}</p>
                      <p className="flex items-center gap-1.5"><span className="w-14 text-gray-400">Email</span>{p.email || 'Non renseigné'}</p>
                      <p className="flex items-center gap-1.5"><span className="w-14 text-gray-400">Profession</span>{p.profession || 'Non renseignée'}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4 text-green-600" /> Année 2025-2026
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Trimestre 1', periode: 'Sept – Nov 2025', statut: 'terminé' },
                { label: 'Trimestre 2', periode: 'Déc 2025 – Mar 2026', statut: 'en cours' },
                { label: 'Trimestre 3', periode: 'Avr – Jun 2026', statut: 'à venir' },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-700">{t.label}</p>
                    <p className="text-xs text-gray-400">{t.periode}</p>
                  </div>
                  <Badge className={t.statut === 'en cours' ? 'bg-green-100 text-green-700' : t.statut === 'terminé' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}>
                    {t.statut}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
