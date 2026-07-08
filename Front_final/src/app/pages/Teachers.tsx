import { useState, useEffect } from 'react';
import { Plus, Search, Download, Mail, Phone, GraduationCap, BookOpen, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { enseignantsAPI, classesAPI } from '../services/api';
import { mockTeachers } from '../data/mock-data';
import { toast } from 'sonner';
import CreateTeacherModal from '../components/modals/CreateTeacherModal';

export default function Teachers() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<any[]>(() => mockTeachers.map((t: any) => ({
    id: t.idEnseign, nom: t.nom, prenom: t.prenom, specialite: t.specialite,
    email: t.email, telephone: t.telephone, classes: [],
  })));
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    enseignantsAPI.list()
      .then((enseignants) => {
        const teachersData = (Array.isArray(enseignants) ? enseignants : (enseignants?.data || [])).map((t: any) => {
          const tPersonne = t.Personne || t.personne || {};
          const tSalle = t.salle;
          return {
            id: t.idEnseignant || t.idEnseign,
            nom: tPersonne.nom,
            prenom: tPersonne.prenom,
            specialite: t.Specialite?.libelle || t.specialite || '',
            email: tPersonne.email || '',
            telephone: tPersonne.mobile || '',
            classes: tSalle ? [`${tSalle.Classe?.libelle || ''} ${tSalle.libelle || ''}`.trim()] : [],
          };
        });
        setTeachers(teachersData);
      })
      .catch(() => { setTeachers(mockTeachers); setLoading(false); })
      .finally(() => setLoading(false));
  }, []);

  const filteredTeachers = teachers.filter(t =>
    `${t.nom} ${t.prenom} ${t.specialite}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const specialiteCount = new Set(teachers.map((t: any) => t.specialite).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Enseignants', value: teachers.length.toString(), sub: 'Personnel actif', icon: GraduationCap, color: 'from-blue-400 to-blue-500', delay: '0s' },
          { label: 'Ratio Élèves/Enseignant', value: teachers.length > 0 ? `${Math.round(1247/teachers.length)}:1` : 'N/A', sub: 'Approximatif', icon: Users, color: 'from-violet-500 to-violet-600', delay: '0.1s' },
          { label: 'Spécialités', value: specialiteCount.toString(), sub: 'Matières enseignées', icon: BookOpen, color: 'from-emerald-500 to-emerald-600', delay: '0.15s' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: stat.delay }}>
              <Card className="border-border/50 overflow-hidden group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                    </div>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder={t('teachers.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success(language === 'fr' ? 'Export démarré' : 'Export started')}>
            <Download className="w-3.5 h-3.5" />
            {t('common.export')}
          </Button>
              <Button size="sm" className="gap-1.5" onClick={() => setShowModal(true)}>
                <Plus className="w-3.5 h-3.5" />
                {t('teachers.new')}
              </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Chargement...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((teacher: any, i: number) => (
            <div key={teacher.id} className="animate-fade-in-up" style={{ animationDelay: `${0.25 + i * 0.05}s` }}>
              <Card className="border-border/50 hover:shadow-md transition-all duration-300 group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-lg font-bold flex-shrink-0 shadow-sm">
                      {teacher.prenom?.charAt(0)}{teacher.nom?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {teacher.prenom} {teacher.nom}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{teacher.specialite || 'Généraliste'}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{teacher.email || 'Non renseigné'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{teacher.telephone || 'Non renseigné'}</span>
                        </div>
                      </div>
                      {teacher.classes?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {teacher.classes.map((classe: string) => (
                            <Badge key={classe} variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                              {classe}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
      <CreateTeacherModal open={showModal} onOpenChange={setShowModal} onSuccess={() => {
        enseignantsAPI.list().then(data => {
          const teachersData = (Array.isArray(data) ? data : (data?.data || [])).map((t: any) => {
            const tPersonne = t.Personne || t.personne || {};
            const tSalle = t.salle;
            return {
              id: t.idEnseignant || t.idEnseign,
              nom: tPersonne.nom,
              prenom: tPersonne.prenom,
              specialite: t.Specialite?.libelle || t.specialite || '',
              email: tPersonne.email || '',
              telephone: tPersonne.mobile || '',
              classes: tSalle ? [`${tSalle.Classe?.libelle || ''} ${tSalle.libelle || ''}`.trim()] : [],
            };
          });
          setTeachers(teachersData);
        }).catch(() => { setTeachers(mockTeachers); });
      }} />
    </div>
  );
}
