import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Users, UserCheck, UserX, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { elevesAPI } from '../services/api';
import { mockStudents } from '../data/mock-data';
import { toast } from 'sonner';
import CreateStudentModal from '../components/modals/CreateStudentModal';

export default function Students() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>(mockStudents);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    elevesAPI.list()
      .then(data => { setStudents(Array.isArray(data) ? data : (data?.data || [])); })
      .catch(() => { setStudents(mockStudents); setLoading(false); })
      .finally(() => setLoading(false));
  }, []);

  const maleCount = students.filter(s => s.sexe === 'M').length;
  const femaleCount = students.filter(s => s.sexe === 'F').length;

  const filteredStudents = students.filter(s =>
    `${s.nom} ${s.prenom} ${s.matricule}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('students.total'), value: students.length.toLocaleString(), sub: language === 'fr' ? 'Total inscrits' : 'Total enrolled', icon: Users, color: 'from-blue-400 to-blue-500', delay: '0s' },
          { label: t('common.male'), value: maleCount.toString(), sub: students.length ? `${Math.round(maleCount/students.length*100)}%` : '0%', icon: UserCheck, color: 'from-violet-500 to-violet-600', delay: '0.1s' },
          { label: t('common.female'), value: femaleCount.toString(), sub: students.length ? `${Math.round(femaleCount/students.length*100)}%` : '0%', icon: UserX, color: 'from-emerald-500 to-emerald-600', delay: '0.15s' },
          { label: t('students.newEnrollments'), value: students.length.toString(), sub: t('students.thisQuarter'), icon: Users, color: 'from-amber-500 to-amber-600', delay: '0.2s' },
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

      <Card className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="flex gap-3 flex-1 w-full md:w-auto">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder={t('students.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info(language === 'fr' ? 'Filtres disponibles via la recherche' : 'Filters available via search')}>
                <Filter className="w-3.5 h-3.5" />
                {t('common.filter')}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success(language === 'fr' ? 'Export démarré' : 'Export started')}>
                <Download className="w-3.5 h-3.5" />
                {t('common.export')}
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => setShowModal(true)}>
                <Plus className="w-3.5 h-3.5" />
                {t('students.new')}
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('students.matricule')}</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('students.fullName')}</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('students.dateOfBirth')}</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('students.class')}</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('students.gender')}</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t('common.status')}</TableHead>
                <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  {language === 'fr' ? 'Actions' : 'Actions'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">Chargement...</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {searchTerm ? language === 'fr' ? 'Aucun élève trouvé' : 'No students found' : language === 'fr' ? 'Aucun élève inscrit' : 'No students enrolled'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student: any, i: number) => (
                  <TableRow key={student.matricule} className="group">
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">{student.matricule}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                          {(student.prenom?.[0] || '')}{(student.nom?.[0] || '')}
                        </div>
                        <span className="font-medium text-foreground">{student.nom} {student.prenom}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.dateNaissance ? new Date(student.dateNaissance).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
                        {student.Classe?.libelle || student.inscriptions?.[0]?.classe?.libelle || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={student.sexe === 'M' ? 'text-blue-500' : 'text-pink-600'}>
                        {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success border-success/20 text-xs">
                        Actif
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title={t('common.view')} onClick={() => toast.info(`${student.nom} ${student.prenom} - ${student.matricule}`, { description: language === 'fr' ? 'Détails de l\'élève' : 'Student details' })}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title={t('common.edit')} onClick={() => toast.success(language === 'fr' ? 'Modification de l\'élève' : 'Editing student', { description: `${student.nom} ${student.prenom}` })}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title={t('common.delete')} onClick={async () => {
                          if (window.confirm(language === 'fr' ? `Supprimer ${student.nom} ${student.prenom} ?` : `Delete ${student.nom} ${student.prenom}?`)) {
                            try {
                              await elevesAPI.delete(student.matricule);
                              toast.success(language === 'fr' ? 'Élève supprimé' : 'Student deleted');
                              setStudents(prev => prev.filter(s => s.matricule !== student.matricule));
                            } catch {
                              toast.error(language === 'fr' ? 'Erreur lors de la suppression' : 'Error deleting student');
                            }
                          }
                        }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CreateStudentModal open={showModal} onOpenChange={setShowModal} onSuccess={() => elevesAPI.list().then(d => setStudents(Array.isArray(d) ? d : (d?.data || []))).catch(() => setStudents(mockStudents))} />
    </div>
  );
}
