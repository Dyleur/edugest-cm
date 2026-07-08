import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { School, Users, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { classesAPI, elevesAPI } from '../../services/api';
import { mockTeacherClasses, mockStudents } from '../../data/mock-data';

export default function TeacherMyClasses() {
  const { t, language } = useLanguage();
  const [openClass, setOpenClass] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiClasses, setApiClasses] = useState<any[]>(mockTeacherClasses);
  const [apiStudents, setApiStudents] = useState<any[]>(mockStudents);

  useEffect(() => {
    classesAPI.list().then(setApiClasses).catch(() => setApiClasses(mockTeacherClasses));
    elevesAPI.list().then(setApiStudents).catch(() => setApiStudents(mockStudents));
  }, []);

  const srcClasses = apiClasses;
  const srcStudents = apiStudents;

  useEffect(() => {
    if (srcClasses.length > 0 && openClass === null) {
      setOpenClass(srcClasses[0]?.idClasse || srcClasses[0]?.id || null);
    }
  }, [srcClasses]);

  const classesData = srcClasses.map(c => {
    const id = c.idClasse || c.id;
    const libelle = c.libelle;
    const salle = c.salle?.libelle || c.salle || '';
    const effectif = c.effectif || 0;
    const classEleves = srcStudents.filter(
      (s: any) => s.Classe?.libelle === libelle || s.inscriptions?.some((i: any) => i.classe?.libelle === libelle)
    );
    return {
      id,
      libelle,
      salle,
      effectif,
      garcons: classEleves.filter((e: any) => e.sexe === 'M').length,
      filles: classEleves.filter((e: any) => e.sexe === 'F').length,
      eleves: classEleves.map((e: any) => ({
        matricule: e.matricule,
        nom: e.nom,
        prenom: e.prenom,
        sexe: e.sexe,
        langue: 'FR',
      })),
    };
  });

  const totalStudents = classesData.reduce((s, c) => s + c.effectif, 0);
  const totalGarcons = classesData.reduce((s, c) => s + c.garcons, 0);
  const totalFilles = classesData.reduce((s, c) => s + c.filles, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('teacher.dashboard.myClasses'), value: classesData.length, icon: School, color: 'from-green-500 to-green-600' },
          { label: t('teacher.dashboard.myStudents'), value: totalStudents, icon: Users, color: 'from-blue-400 to-blue-500' },
          { label: t('common.male'), value: totalGarcons, icon: Users, color: 'from-indigo-500 to-indigo-600' },
          { label: t('common.female'), value: totalFilles, icon: Users, color: 'from-pink-500 to-pink-600' },
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

      {classesData.map((cls, idx) => (
        <div key={cls.id} className="animate-fade-in-up" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
          <Card className="border-border/50 overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setOpenClass(openClass === cls.id ? null : cls.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white font-bold">
                    {cls.libelle}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{cls.libelle}</CardTitle>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <School className="w-3.5 h-3.5" />{cls.salle}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />{cls.effectif} {t('teacher.dashboard.students')}
                      </span>
                      <span className="text-sm text-muted-foreground">{cls.garcons}G / {cls.filles}F</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {openClass === cls.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </div>
              </div>
            </CardHeader>

            {openClass === cls.id && (
              <CardContent>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={t('students.search')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 px-3 py-2 border border-border/50 rounded-xl text-sm bg-muted/50 focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cls.eleves
                    .filter(el => {
                      const q = searchTerm.toLowerCase();
                      return el.nom.toLowerCase().includes(q) || el.prenom.toLowerCase().includes(q) || el.matricule.toLowerCase().includes(q);
                    })
                    .map(el => (
                      <div key={el.matricule} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-green-50/50 transition-colors">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${el.sexe === 'M' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                          {el.prenom?.charAt(0)}{el.nom?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{el.nom} {el.prenom}</p>
                          <p className="text-xs text-muted-foreground">{el.matricule}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">{el.langue}</Badge>
                          <span className="text-xs text-muted-foreground">{el.sexe === 'M' ? 'G' : 'F'}</span>
                        </div>
                      </div>
                    ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground text-right">
                  {cls.eleves.filter(el => {
                    const q = searchTerm.toLowerCase();
                    return el.nom.toLowerCase().includes(q) || el.prenom.toLowerCase().includes(q) || el.matricule.toLowerCase().includes(q);
                  }).length} {language === 'fr' ? 'élèves affichés sur' : 'students shown of'} {cls.effectif}
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
}
