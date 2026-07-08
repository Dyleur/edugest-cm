import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSelectedChild } from '../../hooks/useSelectedChild';
import { ChildSelector } from '../../components/ui/child-selector';
import { elevesAPI } from '../../services/api';
import { mockEnfant } from '../../data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { User, Calendar, MapPin, BookOpen, School, Users, Phone, Mail, Award, Loader2, AlertCircle } from 'lucide-react';

const age = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
};

export default function ParentChildProfile() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { selected: enfant, selectChild } = useSelectedChild();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eleve, setEleve] = useState<any>(mockEnfant);
  const [parents, setParents] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.idPers) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!enfant) {
          setError('Aucun enfant trouvé');
          setLoading(false);
          return;
        }

        const [eleveRes, parentsRes] = await Promise.all([
          elevesAPI.get(enfant.matricule).catch(() => ({ data: mockEnfant })),
          elevesAPI.parents(enfant.matricule).catch(() => ({ data: [] })),
        ]);

        setEleve(eleveRes.data || eleveRes);
        setParents(parentsRes.data || parentsRes);
      } catch (err: any) {
        setEleve(mockEnfant);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.idPers, enfant]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error || !enfant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-lg font-medium text-muted-foreground">{error || 'Aucun enfant trouvé'}</p>
      </div>
    );
  }

  const childInfo = eleve || enfant;
  const lieuNaissance = childInfo.lieuNaissance || '';
  const classe = enfant.classe || childInfo.classe || '';

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-gradient-to-r from-orange-600 to-orange-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border-2 border-white/40 flex-shrink-0">
              {enfant ? `${enfant.prenom?.charAt(0)}${enfant.nom?.charAt(0)}` : '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{enfant ? `${enfant.nom} ${enfant.prenom}` : 'Chargement...'}</h1>
                <ChildSelector onChildChange={(e) => selectChild(e.matricule)} selectedMatricule={enfant?.matricule} />
              </div>
              <div className="flex items-center gap-3 mt-1">
                <Badge className="bg-white/20 text-white border-white/30">{classe}</Badge>
                <Badge className="bg-green-500/80 text-white">{t('common.active')}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-5 h-5 text-orange-600" /> {t('parent.childProfile.personalInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: t('parent.childProfile.studentId'), value: enfant?.matricule, icon: Award },
                    { label: t('parent.childProfile.fullName'), value: `${enfant?.nom} ${enfant?.prenom}`, icon: User },
                    { label: t('parent.childProfile.dateOfBirth'), value: enfant?.dateNaissance ? new Date(enfant.dateNaissance).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '-', icon: Calendar },
                    { label: t('parent.childProfile.placeOfBirth'), value: lieuNaissance || 'Abidjan', icon: MapPin },
                    { label: t('parent.childProfile.gender'), value: enfant?.sexe === 'M' ? (language === 'fr' ? 'Masculin' : 'Male') : (language === 'fr' ? 'Féminin' : 'Female'), icon: User },
                    { label: `${t('parent.dashboard.age')}`, value: enfant?.dateNaissance ? `${age(enfant.dateNaissance)} ${t('parent.dashboard.age')}` : '-', icon: Calendar },
                  ].map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="bg-muted/50 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">{f.label}</p>
                          <p className="font-semibold text-foreground mt-0.5">{f.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="w-5 h-5 text-blue-500" /> {t('parent.childProfile.academicInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: t('parent.childProfile.currentClass'), value: classe, icon: School, color: 'from-blue-400 to-blue-500' },
                    { label: t('parent.childProfile.academicYear'), value: '2025-2026', icon: Calendar, color: 'from-green-500 to-green-600' },
                    { label: t('parent.childProfile.language'), value: language === 'fr' ? 'Français' : 'French', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
                  ].map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="bg-muted/50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">{f.label}</p>
                        </div>
                        <p className="font-semibold text-foreground">{f.value}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-5 h-5 text-purple-600" /> {t('parent.childProfile.parentInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {parents.length > 0 ? parents.map((p: any, i: number) => (
                  <div key={i} className="bg-muted/50 rounded-xl p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-foreground text-sm">{p.nom} {p.prenom}</p>
                      <Badge className="bg-purple-100 text-purple-700 text-xs">{p.lienParente}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{p.telephone}</span>
                      </div>
                      {p.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{p.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {language === 'fr' ? 'Aucune information' : 'No information'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <School className="w-5 h-5 text-green-600" /> {t('parent.childProfile.academicYear')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: language === 'fr' ? 'Trimestre 1' : 'Term 1', periode: language === 'fr' ? 'Sept – Nov 2025' : 'Sep – Nov 2025', statut: 'terminé' as const },
                  { label: language === 'fr' ? 'Trimestre 2' : 'Term 2', periode: language === 'fr' ? 'Déc 2025 – Mar 2026' : 'Dec 2025 – Mar 2026', statut: 'en cours' as const },
                  { label: language === 'fr' ? 'Trimestre 3' : 'Term 3', periode: language === 'fr' ? 'Avr – Jun 2026' : 'Apr – Jun 2026', statut: 'à venir' as const },
                ].map((term, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <div>
                      <p className="font-medium text-foreground text-sm">{term.label}</p>
                      <p className="text-xs text-muted-foreground">{term.periode}</p>
                    </div>
                    <Badge className={
                      term.statut === 'en cours' ? 'bg-green-100 text-green-700' :
                      term.statut === 'terminé' ? 'bg-muted text-muted-foreground' :
                      'bg-blue-100 text-blue-700'
                    }>
                      {term.statut}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
