import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Search, Calendar, Users, UserCheck, UserX, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { elevesAPI, presencesAPI } from '../services/api';
import { mockAttendance } from '../data/mock-data';
import { toast } from 'sonner';

export default function Attendance() {
  const { t, language } = useLanguage();
  const [students, setStudents] = useState<any[]>(() => mockAttendance.map((a: any) => ({ ...a, classe: 'CM2 A', statut: a.statut })));
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      elevesAPI.list(),
      presencesAPI.stats?.()
    ]).then(([eleves]: [any, any]) => {
      const elevesList = Array.isArray(eleves) ? eleves : (eleves?.data || []);
      setStudents(elevesList.map((e: any) => ({
        matricule: e.matricule,
        nom: e.nom,
        prenom: e.prenom,
        classe: e.Classe?.libelle || e.inscriptions?.[0]?.classe?.libelle || '-',
        statut: 'present',
      })));
    }).catch(() => { setStudents(mockAttendance.map((a: any) => ({ ...a, classe: 'CM2 A', statut: a.statut }))); }).finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(s =>
    `${s.nom} ${s.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    present: students.filter(s => s.statut === 'present').length,
    absent: students.filter(s => s.statut === 'absent').length,
    late: students.filter(s => s.statut === 'retard' || s.statut === 'late').length,
  };

  const total = students.length || 1;

  const setStatus = (matricule: string, statut: string) => {
    setStudents(prev => prev.map(s => s.matricule === matricule ? { ...s, statut } : s));
  };

  const statutColors: Record<string, string> = {
    present: 'bg-success/10 text-success border-success/20',
    absent: 'bg-destructive/10 text-destructive border-destructive/20',
    late: 'bg-warning/10 text-warning border-warning/20',
    retard: 'bg-warning/10 text-warning border-warning/20',
  };

  const handleValidate = async () => {
    setSaving(true);
    try {
      const results = await Promise.allSettled(students.map(s => {
        if (s.statut === 'present') {
          return presencesAPI.setPresent({ matricule: s.matricule, idAcademi: 1, idSalle: s.idSalle || 1 });
        } else if (s.statut === 'absent') {
          return presencesAPI.setAbsent({ matricule: s.matricule, idAcademi: 1, idSalle: s.idSalle || 1 });
        } else {
          return presencesAPI.setAbsent({ matricule: s.matricule, idAcademi: 1, idSalle: s.idSalle || 1, motif: 'Retard' });
        }
      }));
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      toast.success(language === 'fr'
        ? `Appel validé : ${students.filter(s => s.statut === 'present').length}/${students.length} présent(s)`
        : `Attendance saved: ${students.filter(s => s.statut === 'present').length}/${students.length} present(s)`);
    } catch {
      toast.error(language === 'fr' ? 'Erreur lors de la validation' : 'Save failed');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: t('attendance.present'), value: stats.present.toString(), sub: `${Math.round(stats.present/total*100)}%`, icon: UserCheck, color: 'from-emerald-500 to-emerald-600', delay: '0s' },
          { label: t('attendance.absent'), value: stats.absent.toString(), sub: `${Math.round(stats.absent/total*100)}%`, icon: UserX, color: 'from-rose-500 to-rose-600', delay: '0.1s' },
          { label: t('attendance.late'), value: stats.late.toString(), sub: `${Math.round(stats.late/total*100)}%`, icon: Clock, color: 'from-amber-500 to-amber-600', delay: '0.15s' },
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
            placeholder={language === 'fr' ? 'Rechercher un élève...' : 'Search for a student...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button size="sm" className="gap-1.5 bg-success hover:bg-success/90" disabled={saving} onClick={handleValidate}>
          <Save className="w-3.5 h-3.5" />
          {t('attendance.validate')}
        </Button>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {language === 'fr' ? "Feuille d'appel" : 'Attendance Sheet'}
              <Badge variant="outline" className="ml-auto text-xs">
                {new Date().toLocaleDateString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('students.fullName')}</th>
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('students.class')}</th>
                      <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'fr' ? 'Statut' : 'Status'}</th>
                      <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'fr' ? 'Actions' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.matricule} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {(student.prenom?.[0] || '')}{(student.nom?.[0] || '')}
                            </div>
                            <span className="font-medium text-foreground text-sm">{student.nom} {student.prenom}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">{student.classe}</Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge className={`${statutColors[student.statut] || 'bg-muted text-muted-foreground'} text-xs`}>
                            {student.statut === 'present' ? (language === 'fr' ? 'Présent' : 'Present') : 
                             student.statut === 'absent' ? (language === 'fr' ? 'Absent' : 'Absent') : 
                             (language === 'fr' ? 'Retard' : 'Late')}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => setStatus(student.matricule, 'present')}
                              className={`p-1.5 rounded-lg transition-all ${
                                student.statut === 'present' 
                                  ? 'bg-success/10 text-success ring-1 ring-success/30' 
                                  : 'text-muted-foreground hover:bg-success/5 hover:text-success'
                              }`}
                              title={language === 'fr' ? 'Présent' : 'Present'}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setStatus(student.matricule, 'absent')}
                              className={`p-1.5 rounded-lg transition-all ${
                                student.statut === 'absent' 
                                  ? 'bg-destructive/10 text-destructive ring-1 ring-destructive/30' 
                                  : 'text-muted-foreground hover:bg-destructive/5 hover:text-destructive'
                              }`}
                              title={language === 'fr' ? 'Absent' : 'Absent'}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setStatus(student.matricule, 'late')}
                              className={`p-1.5 rounded-lg transition-all ${
                                student.statut === 'late' || student.statut === 'retard'
                                  ? 'bg-warning/10 text-warning ring-1 ring-warning/30' 
                                  : 'text-muted-foreground hover:bg-warning/5 hover:text-warning'
                              }`}
                              title={language === 'fr' ? 'Retard' : 'Late'}
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
