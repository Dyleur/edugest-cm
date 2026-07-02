import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { School, Users, ChevronDown, ChevronUp, BookOpen, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { classesAPI, elevesAPI } from '../../services/api';

export default function TeacherMyClasses() {
  const { t, language } = useLanguage();
  const [openClass, setOpenClass] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classesData, setClassesData] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      classesAPI.list(),
      elevesAPI.list(),
    ])
      .then(([classes, eleves]) => {
        const cls = Array.isArray(classes) ? classes : [];
        const eleveList = Array.isArray(eleves) ? eleves : [];

        const transformed = cls.slice(0, 5).map((c: any) => {
          const classEleves = eleveList.filter((e: any) =>
            e.inscriptions?.some((ins: any) => ins.idClasse === c.idClasse) ||
            e.idClasse === c.idClasse
          );
          return {
            id: c.idClasse,
            libelle: c.libelle,
            cycle: c.cycle?.libelle || '',
            niveau: c.libelle,
            salle: c.salle?.libelle || 'N/A',
            effectif: classEleves.length || c.effectif || 0,
            garcons: classEleves.filter((e: any) => e.sexe === 'M').length,
            filles: classEleves.filter((e: any) => e.sexe === 'F').length,
            matieres: ['Général'],
            eleves: classEleves.slice(0, 20).map((e: any) => ({
              matricule: e.matricule,
              nom: e.nom,
              prenom: e.prenom,
              sexe: e.sexe,
              langue: e.langue || 'FR',
            })),
          };
        });

        setClassesData(transformed);
        if (transformed.length > 0) setOpenClass(transformed[0].id);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-green-900 to-teal-700">
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t('teacher.myClasses.title')}</h1>
            <p className="text-green-100">{t('teacher.myClasses.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-gray-500">{t('teacher.dashboard.myClasses')} assignées</p>
            <p className="text-3xl font-bold text-green-700">{classesData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-gray-500">Total élèves</p>
            <p className="text-3xl font-bold text-blue-700">{classesData.reduce((s, c) => s + c.effectif, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-gray-500">{t('common.male')}</p>
            <p className="text-3xl font-bold text-indigo-700">{classesData.reduce((s, c) => s + c.garcons, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-gray-500">{t('common.female')}</p>
            <p className="text-3xl font-bold text-pink-700">{classesData.reduce((s, c) => s + c.filles, 0)}</p>
          </CardContent>
        </Card>
      </div>

      {classesData.map((cls: any) => (
        <Card key={cls.id} className="overflow-hidden">
          <CardHeader
            className="cursor-pointer hover:bg-gray-50 transition-colors"
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
                    <span className="text-sm text-gray-500 flex items-center gap-1"><School className="w-3.5 h-3.5" />{cls.salle}</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1"><Users className="w-3.5 h-3.5" />{cls.effectif} élèves</span>
                    <span className="text-sm text-gray-500">{cls.garcons}G / {cls.filles}F</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-2">
                  {cls.matieres.map((m: string) => (
                    <Badge key={m} variant="outline" className="text-green-700 border-green-300 bg-green-50">
                      <BookOpen className="w-3 h-3 mr-1" />{m}
                    </Badge>
                  ))}
                </div>
                {openClass === cls.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cls.eleves
                  .filter((el: any) => {
                    const q = searchTerm.toLowerCase();
                    return el.nom.toLowerCase().includes(q) || el.prenom.toLowerCase().includes(q) || el.matricule.includes(q);
                  })
                  .map((el: any) => (
                    <div key={el.matricule} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${el.sexe === 'M' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                        {el.prenom?.charAt(0)}{el.nom?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">{el.nom} {el.prenom}</p>
                        <p className="text-xs text-gray-400">{el.matricule}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-xs px-1.5 py-0">{el.langue}</Badge>
                        <span className="text-xs text-gray-400">{el.sexe === 'M' ? 'G' : 'F'}</span>
                      </div>
                    </div>
                  ))}
              </div>
              <p className="mt-3 text-xs text-gray-400 text-right">
                {cls.eleves.filter((el: any) => {
                  const q = searchTerm.toLowerCase();
                  return el.nom.toLowerCase().includes(q) || el.prenom.toLowerCase().includes(q) || el.matricule.includes(q);
                }).length} élèves affichés sur {cls.effectif}
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
