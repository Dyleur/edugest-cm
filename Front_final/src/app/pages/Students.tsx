import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
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

export default function Students() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    elevesAPI.list()
      .then(data => { setStudents(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maleCount = students.filter(s => s.sexe === 'M').length;
  const femaleCount = students.filter(s => s.sexe === 'F').length;

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1764720572930-eb63afd14b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzY2hvb2wlMjBjbGFzc3Jvb20lMjBzdHVkZW50cyUyMGxlYXJuaW5nJTIwbW9kZXJufGVufDF8fHx8MTc3NzQ1NzkwNXww&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/70" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('students.title')}</h1>
            <p className="text-lg">{t('students.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-3 flex-1 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={t('students.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            {t('common.filter')}
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            {t('students.new')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">{t('students.total')}</p>
            <p className="text-3xl font-bold mt-2">{students.length.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-1">
              {language === 'fr' ? 'Total inscrits' : 'Total enrolled'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">{t('common.male')}</p>
            <p className="text-3xl font-bold mt-2">{maleCount}</p>
            <p className="text-xs opacity-75 mt-1">{students.length ? `${Math.round(maleCount/students.length*100)}%` : '0%'}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">{t('common.female')}</p>
            <p className="text-3xl font-bold mt-2">{femaleCount}</p>
            <p className="text-xs opacity-75 mt-1">{students.length ? `${Math.round(femaleCount/students.length*100)}%` : '0%'}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">{t('students.newEnrollments')}</p>
            <p className="text-3xl font-bold mt-2">{students.length}</p>
            <p className="text-xs opacity-75 mt-1">{t('students.thisQuarter')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('students.matricule')}</TableHead>
                <TableHead>{t('students.fullName')}</TableHead>
                <TableHead>{t('students.dateOfBirth')}</TableHead>
                <TableHead>{t('students.class')}</TableHead>
                <TableHead>{t('students.gender')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="text-right">
                  {language === 'fr' ? 'Actions' : 'Actions'}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Aucun élève trouvé
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student: any) => (
                  <TableRow key={student.matricule}>
                    <TableCell className="font-medium">{student.matricule}</TableCell>
                    <TableCell>{student.nom} {student.prenom}</TableCell>
                    <TableCell>{student.dateNaissance ? new Date(student.dateNaissance).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {student.Classe?.libelle || student.inscriptions?.[0]?.classe?.libelle || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.sexe}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Actif
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" title={t('common.view')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title={t('common.edit')}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title={t('common.delete')}>
                          <Trash2 className="w-4 h-4 text-red-500" />
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
    </div>
  );
}
