import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Save, Users } from 'lucide-react';
import { toast } from 'sonner';
import { classesAPI, elevesAPI, presencesAPI } from '../../services/api';
import { mockAttendance, mockClasses } from '../../data/mock-data';

type Statut = 'present' | 'absent' | 'retard' | 'justifie';

const statutConfig: Record<Statut, { label: string; color: string; activeColor: string; icon: React.ElementType }> = {
  present: { label: 'Présent', color: 'border-green-300 text-green-700 hover:bg-green-50', activeColor: 'bg-green-600 text-white hover:bg-green-700', icon: CheckCircle },
  absent: { label: 'Absent', color: 'border-red-300 text-red-700 hover:bg-red-50', activeColor: 'bg-red-600 text-white hover:bg-red-700', icon: XCircle },
  retard: { label: 'Retard', color: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50', activeColor: 'bg-yellow-500 text-white hover:bg-yellow-600', icon: Clock },
  justifie: { label: 'Justifié', color: 'border-blue-300 text-blue-700 hover:bg-blue-50', activeColor: 'bg-blue-500 text-white hover:bg-blue-500', icon: AlertCircle },
};

export default function TeacherAttendance() {
  const { t, language } = useLanguage();
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appel, setAppel] = useState<Record<string, { statut: Statut; motif: string }>>({});
  const [motifOpen, setMotifOpen] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [apiClasses, setApiClasses] = useState<any[]>(mockClasses);
  const [apiEleves, setApiEleves] = useState<any[]>(mockAttendance);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    classesAPI.list().then(cls => {
      setApiClasses(cls);
      if (cls.length > 0 && selectedClass === 0) {
        setSelectedClass(cls[0].idClasse || cls[0].id);
      }
    }).catch(() => { setApiClasses(mockClasses); });
    elevesAPI.list().then(setApiEleves).catch(() => setApiEleves(mockAttendance));
  }, []);

  const classes = apiClasses;
  const srcAttendance = apiEleves;
  const eleves = srcAttendance.map((a: any) => ({
    matricule: a.matricule,
    nom: a.nom,
    prenom: a.prenom,
  }));

  const setStatut = (matricule: string, statut: Statut) => {
    setAppel(prev => ({ ...prev, [matricule]: { statut, motif: prev[matricule]?.motif || '' } }));
    if (statut === 'present') setMotifOpen(null);
  };

  const setMotif = (matricule: string, motif: string) => {
    setAppel(prev => ({ ...prev, [matricule]: { ...prev[matricule], motif } }));
  };

  const getStatut = (matricule: string): Statut => appel[matricule]?.statut || 'present';

  const stats = {
    present: eleves.filter(e => getStatut(e.matricule) === 'present').length,
    absent: eleves.filter(e => getStatut(e.matricule) === 'absent').length,
    retard: eleves.filter(e => getStatut(e.matricule) === 'retard').length,
    justifie: eleves.filter(e => getStatut(e.matricule) === 'justifie').length,
  };

  const taux = eleves.length > 0 ? ((stats.present / eleves.length) * 100).toFixed(1) : '0';

  const handleValidate = async () => {
    setSubmitting(true);
    try {
      const promises = Object.entries(appel).map(([matricule, data]) => {
        const payload = {
          matricule,
          date: selectedDate,
          motif: data.motif || undefined,
        };
        if (data.statut === 'present') {
          return presencesAPI.setPresent(payload);
        } else if (data.statut === 'absent') {
          return presencesAPI.setAbsent({ ...payload, estJustifie: false });
        } else if (data.statut === 'justifie') {
          return presencesAPI.setAbsent({ ...payload, estJustifie: true });
        } else {
          return presencesAPI.setPresent(payload);
        }
      });
      if (promises.length > 0) await Promise.all(promises);
      setValidated(true);
      toast.success(
        language === 'fr'
          ? `Appel validé pour ${classes.find((c: any) => (c.idClasse || c.id) === selectedClass)?.libelle || ''} — ${selectedDate}`
          : `Attendance recorded for ${classes.find((c: any) => (c.idClasse || c.id) === selectedClass)?.libelle || ''} — ${selectedDate}`
      );
    } catch {
      toast.error(language === 'fr' ? 'Erreur lors de la validation' : 'Error recording attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => { setSelectedDate(e.target.value); setValidated(false); }}
                  className="border border-border/50 rounded-xl px-3 py-2 text-sm bg-muted/50 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {classes.map((cls: any) => (
                  <button
                    key={cls.idClasse || cls.id}
                    onClick={() => { setSelectedClass(cls.idClasse || cls.id); setValidated(false); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedClass === (cls.idClasse || cls.id)
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {cls.libelle}
                  </button>
                ))}
              </div>
              {validated && (
                <Badge className="bg-green-100 text-green-700 px-3 py-1">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> {t('teacher.attendance.validated')}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: t('attendance.present'), value: stats.present, color: 'text-green-700 bg-green-50', icon: CheckCircle },
          { label: t('attendance.absent'), value: stats.absent, color: 'text-red-700 bg-red-50', icon: XCircle },
          { label: t('attendance.late'), value: stats.retard, color: 'text-yellow-700 bg-yellow-50', icon: Clock },
          { label: 'Justifiés', value: stats.justifie, color: 'text-blue-700 bg-blue-50', icon: AlertCircle },
          { label: t('attendance.rate'), value: `${taux}%`, color: 'text-purple-700 bg-purple-50', icon: Users },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`animate-fade-in-up ${s.color} rounded-xl p-4 text-center`} style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
              <Icon className="w-5 h-5 mx-auto mb-1 opacity-70" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('teacher.attendance.callSheet')} — {classes.find((c: any) => (c.idClasse || c.id) === selectedClass)?.libelle || ''}</span>
              <Button onClick={handleValidate} disabled={validated || submitting} className="bg-orange-600 hover:bg-orange-700 gap-2">
                <Save className="w-4 h-4" />
                {submitting ? '...' : validated ? t('teacher.attendance.validated') : t('attendance.validate')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eleves.map((eleve, i) => {
                const statut = getStatut(eleve.matricule);
                const showMotif = statut !== 'present' && motifOpen === eleve.matricule;

                return (
                  <div key={eleve.matricule} className="animate-fade-in-up border border-border/50 rounded-xl overflow-hidden" style={{ animationDelay: `${0.5 + i * 0.03}s` }}>
                    <div className="flex items-center justify-between p-4 bg-card">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {eleve.prenom?.charAt(0)}{eleve.nom?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{eleve.nom} {eleve.prenom}</p>
                          <p className="text-xs text-muted-foreground">{eleve.matricule}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {(Object.keys(statutConfig) as Statut[]).map(s => {
                          const cfg = statutConfig[s];
                          const Icon = cfg.icon;
                          const isActive = statut === s;
                          return (
                            <button
                              key={s}
                              onClick={() => {
                                setStatut(eleve.matricule, s);
                                if (s !== 'present') setMotifOpen(eleve.matricule);
                                else setMotifOpen(null);
                              }}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all ${
                                isActive ? cfg.activeColor : cfg.color + ' bg-white'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{cfg.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {showMotif && (
                      <div className="px-4 pb-3 bg-muted/50 border-t border-border/50">
                        <input
                          type="text"
                          placeholder={language === 'fr' ? 'Motif (facultatif)...' : 'Reason (optional)...'}
                          value={appel[eleve.matricule]?.motif || ''}
                          onChange={e => setMotif(eleve.matricule, e.target.value)}
                          className="w-full text-sm border border-border/50 rounded-xl px-3 py-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-orange-300 mt-2"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
