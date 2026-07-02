import { useState, useEffect } from 'react';
import { Plus, Search, Download, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { enseignantsAPI, classesAPI } from '../services/api';

export default function Teachers() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      enseignantsAPI.list(),
      classesAPI.list(),
    ])
      .then(([enseignants, classes]) => {
        const teachersData = (Array.isArray(enseignants) ? enseignants : []).map((t: any) => {
          const teacherClasses = Array.isArray(classes) 
            ? classes.filter((c: any) => c.idEnseign === t.idEnseign || c.titulaire?.idEnseign === t.idEnseign)
            : [];
          return {
            id: t.idEnseign,
            nom: t.nom,
            prenom: t.prenom,
            specialite: t.specialite || '',
            email: t.email || '',
            telephone: t.telephone || '',
            classes: teacherClasses.map((c: any) => c.libelle),
          };
        });
        setTeachers(teachersData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1771765767087-ce71e4a7916a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwdGVhY2hpbmclMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3Nzc0NTc5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('teachers.title')}</h1>
            <p className="text-lg">{t('teachers.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={t('teachers.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4" />
            {t('teachers.new')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Total Enseignants</p>
            <p className="text-3xl font-bold mt-2">{teachers.length}</p>
            <p className="text-xs opacity-75 mt-1">Personnel actif</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Ratio Élèves/Enseignant</p>
            <p className="text-3xl font-bold mt-2">{teachers.length > 0 ? `${Math.round(1247/teachers.length)}:1` : 'N/A'}</p>
            <p className="text-xs opacity-75 mt-1">Approximatif</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Spécialités</p>
            <p className="text-3xl font-bold mt-2">{new Set(teachers.map((t: any) => t.specialite).filter(Boolean)).size}</p>
            <p className="text-xs opacity-75 mt-1">Matières enseignées</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher: any) => (
            <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {teacher.prenom?.charAt(0)}{teacher.nom?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">
                      {teacher.prenom} {teacher.nom}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{teacher.specialite || 'Généraliste'}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{teacher.email || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{teacher.telephone || 'Non renseigné'}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {teacher.classes?.map((classe: string) => (
                        <Badge key={classe} variant="outline" className="text-xs">
                          {classe}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
