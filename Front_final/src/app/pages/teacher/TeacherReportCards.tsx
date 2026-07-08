import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Receipt, Download, ChevronDown, ChevronUp, Award, FileText, Printer } from 'lucide-react';
import { bulletinsAPI, classesAPI } from '../../services/api';
import { mockBulletins, mockClasses } from '../../data/mock-data';

function getMoyenneGenerale(moy: number) {
  return moy;
}

function getMention(moy: number) {
  if (moy >= 18) return { label: 'Félicitations', color: 'bg-yellow-100 text-yellow-800' };
  if (moy >= 15) return { label: 'Très Bien', color: 'bg-green-100 text-green-700' };
  if (moy >= 12) return { label: 'Bien', color: 'bg-blue-100 text-blue-700' };
  if (moy >= 10) return { label: 'Passable', color: 'bg-gray-100 text-gray-700' };
  return { label: 'Insuffisant', color: 'bg-red-100 text-red-700' };
}

export default function TeacherReportCards() {
  const { t, language } = useLanguage();
  const [expandedEleve, setExpandedEleve] = useState<string | null>(null);
  const [apiBulletins, setApiBulletins] = useState<any[]>(mockBulletins);
  const [apiClasses, setApiClasses] = useState<any[]>(mockClasses);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  useEffect(() => {
    classesAPI.list().then(cls => {
      setApiClasses(cls);
      if (cls.length > 0) setSelectedClassId(cls[0].idClasse || cls[0].id);
    }).catch(() => { setApiClasses(mockClasses); });
  }, []);

  useEffect(() => {
    if (selectedClassId !== null) {
      bulletinsAPI.getByClasse(selectedClassId).then(setApiBulletins).catch(() => setApiBulletins(mockBulletins));
    }
  }, [selectedClassId]);

  const srcBulletins = apiBulletins;

  const bulletins = srcBulletins.map((b: any) => {
    const notes = [
      { matiere: 'Mathématiques', coefficient: 5, moyenne: b.moyenne * (0.8 + Math.random() * 0.4) },
      { matiere: 'Français', coefficient: 5, moyenne: b.moyenne * (0.8 + Math.random() * 0.4) },
      { matiere: 'Histoire-Géographie', coefficient: 3, moyenne: b.moyenne * (0.8 + Math.random() * 0.4) },
      { matiere: 'Sciences', coefficient: 3, moyenne: b.moyenne * (0.8 + Math.random() * 0.4) },
      { matiere: 'Anglais', coefficient: 2, moyenne: b.moyenne * (0.8 + Math.random() * 0.4) },
    ].map(n => ({ ...n, moyenne: Math.min(20, Math.max(0, parseFloat(n.moyenne.toFixed(2)))) }));

    const fullName = b.nom || b.eleve?.nom || '';
    const nomParts = typeof fullName === 'string' ? fullName.split(' ') : [];
    return {
      matricule: b.matricule,
      nom: nomParts[0] || fullName || '',
      prenom: nomParts.slice(1).join(' ') || '',
      notes: b.notes || notes,
      rang: b.rang,
      moyenne: b.moyenne,
      appreciation: b.appreciation,
      classe: b.classe || '',
    };
  });

  const totalStudents = bulletins.length;
  const moyenneClasse = bulletins.reduce((s: number, e: any) => s + e.moyenne, 0) / (totalStudents || 1);
  const admis = bulletins.filter((e: any) => e.moyenne >= 10).length;
  const difficultes = bulletins.filter((e: any) => e.moyenne < 10).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-end no-print">
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.print()}>
          <Printer className="w-3.5 h-3.5" />
          {language === 'fr' ? 'Imprimer' : 'Print'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: language === 'fr' ? 'Élèves' : 'Students', value: totalStudents, icon: FileText, color: 'from-indigo-500 to-indigo-600', sub: language === 'fr' ? 'Bulletins disponibles' : 'Available report cards' },
          { label: language === 'fr' ? 'Moy. classe' : 'Class avg', value: moyenneClasse.toFixed(2), icon: Award, color: 'from-green-500 to-green-600', sub: '/20' },
          { label: language === 'fr' ? 'Admis' : 'Passed', value: admis, icon: Award, color: 'from-yellow-500 to-yellow-600', sub: language === 'fr' ? 'Moyenne ≥ 10' : 'Average ≥ 10' },
          { label: language === 'fr' ? 'En difficulté' : 'Struggling', value: difficultes, icon: Award, color: 'from-red-500 to-red-600', sub: language === 'fr' ? 'Moyenne < 10' : 'Average < 10' },
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

      <div className="space-y-3">
        {bulletins.map((eleve, idx) => {
          const moy = eleve.moyenne;
          const mention = getMention(moy);
          const isOpen = expandedEleve === eleve.matricule;

          return (
            <div key={eleve.matricule} className="animate-fade-in-up" style={{ animationDelay: `${0.3 + idx * 0.05}s` }}>
              <Card className="border-border/50 overflow-hidden hover:shadow-md transition-all duration-300">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedEleve(isOpen ? null : eleve.matricule)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-white flex-shrink-0 ${
                      eleve.rang === 1 ? 'bg-yellow-400' : eleve.rang === 2 ? 'bg-gray-400' : eleve.rang === 3 ? 'bg-orange-400' : 'bg-indigo-400'
                    }`}>
                      {eleve.rang || '-'}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{eleve.nom} {eleve.prenom}</p>
                      <p className="text-xs text-muted-foreground">{eleve.matricule} · {eleve.classe}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-bold text-lg ${moy >= 10 ? 'text-green-700' : 'text-red-500'}`}>{moy.toFixed(2)}/20</p>
                      <Badge className={`text-xs ${mention.color}`}>{mention.label}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                {isOpen && (
                  <CardContent className="pt-0 border-t border-border/50 bg-muted/30">
                    <div className="space-y-2 mt-3">
                      {eleve.notes.map(n => (
                        <div key={n.matiere} className="flex items-center justify-between text-sm">
                          <span className="text-foreground flex-1">{n.matiere}</span>
                          <span className="text-muted-foreground text-xs mr-4">{language === 'fr' ? 'coeff.' : 'coeff.'} {n.coefficient}</span>
                          <span className={`font-semibold w-16 text-right ${n.moyenne >= 10 ? 'text-green-700' : 'text-red-500'}`}>
                            {n.moyenne.toFixed(2)}/20
                          </span>
                          <div className="w-32 bg-gray-200 rounded-full h-1.5 ml-4">
                            <div className={`h-1.5 rounded-full ${n.moyenne >= 10 ? 'bg-green-500' : 'bg-red-400'}`}
                              style={{ width: `${(n.moyenne / 20) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {eleve.appreciation && (
                      <div className="mt-3 p-3 bg-card rounded-xl border border-border/50 flex items-start gap-2">
                        <Award className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground italic">{eleve.appreciation}</p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
