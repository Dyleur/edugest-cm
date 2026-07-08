import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User, Loader2, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { edtAPI, classesAPI } from '../services/api';
import { mockTimetable, mockClasses } from '../data/mock-data';
import EditTimetableModal from '../components/modals/EditTimetableModal';

export default function Timetable() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>(mockClasses);
  const [loading, setLoading] = useState(true);
  const [editEntry, setEditEntry] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const editableRoles = ['ADMIN', 'DIRECTEUR', 'RESPONSABLE_ADMIN'];
  const isEditable = editableRoles.includes(user?.role || '');

  useEffect(() => {
    classesAPI.list().then(data => {
      const list = Array.isArray(data) ? data : (data?.data || []);
      setClasses(list);
      if (list.length > 0 && selectedClass === 0) setSelectedClass(list[0].idClasse || list[0].id);
    }).catch(() => { setClasses(mockClasses); setLoading(false); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      edtAPI.getByClasse(selectedClass).then(data => {
        const items = Array.isArray(data) ? data : (data?.data || []);
        setTimetable(items);
      }).catch(() => { const t = mockTimetable[selectedClass]; setTimetable(t ? Object.entries(t).flatMap(([jour, slots]: [string, any]) => slots.map((s: any, i: number) => s ? { jour, heure: ['08:00', '09:00', '10:30', '11:30'][i], ...s, Cours: { libelle: s.matiere } } : null).filter(Boolean) ) : []); }).finally(() => setLoading(false));
    }
  }, [selectedClass]);

  const days = [t('timetable.monday'), t('timetable.tuesday'), t('timetable.wednesday'), t('timetable.thursday'), t('timetable.friday')];
  const hours = ['08:00 - 09:00', '09:00 - 10:00', '10:30 - 11:30', '11:30 - 12:30'];

  const dayMap: Record<string, string> = {
    [t('timetable.monday')]: 'Lundi', [t('timetable.tuesday')]: 'Mardi',
    [t('timetable.wednesday')]: 'Mercredi', [t('timetable.thursday')]: 'Jeudi',
    [t('timetable.friday')]: 'Vendredi',
    'Monday': 'Lundi', 'Tuesday': 'Mardi', 'Wednesday': 'Mercredi',
    'Thursday': 'Jeudi', 'Friday': 'Vendredi',
  };

  const getCell = (day: string, hour: string) => {
    const h = hour.split(' - ')[0];
    return timetable.find((e: any) => e.jour === dayMap[day] && e.heure === h);
  };

  const getWeekLabel = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + weekOffset * 7 - today.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4);
    return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
  };

  const handleCellClick = (day: string, hour: string) => {
    if (!isEditable) return;
    const cell = getCell(day, hour);
    if (cell) {
      setEditEntry(cell);
    } else {
      setEditEntry(null);
    }
    setEditOpen(true);
  };

  const refreshData = () => {
    if (selectedClass) {
      edtAPI.getByClasse(selectedClass).then(data => {
        const items = Array.isArray(data) ? data : (data?.data || []);
        setTimetable(items);
      }).catch(() => { const t = mockTimetable[selectedClass]; setTimetable(t ? Object.entries(t).flatMap(([jour, slots]: [string, any]) => slots.map((s: any, i: number) => s ? { jour, heure: ['08:00', '09:00', '10:30', '11:30'][i], ...s, Cours: { libelle: s.matiere } } : null).filter(Boolean) ) : []); });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(Number(e.target.value))}
            className="h-9 rounded-lg border border-input bg-input-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {classes.map((c: any) => (
              <option key={c.idClasse || c.id} value={c.idClasse || c.id}>{c.libelle}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {t('timetable.week')} {getWeekLabel()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
              {language === 'fr' ? 'Cette semaine' : 'This week'}
            </button>
            <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          {isEditable && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setEditEntry(null); setEditOpen(true); }}>
              <Edit3 className="w-3.5 h-3.5" />
              {language === 'fr' ? 'Modifier' : 'Edit'}
            </Button>
          )}
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {t('timetable.weeklySchedule')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr>
                      <th className="w-24 p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {t('timetable.schedule')}
                        </div>
                      </th>
                      {days.map((day) => (
                        <th key={day} className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hours.map((hour, rowIndex) => (
                      <tr key={hour}>
                        <td className="p-2 text-xs text-muted-foreground font-medium whitespace-nowrap">
                          <div className="bg-muted rounded-lg px-2 py-1.5 text-center">{hour}</div>
                        </td>
                        {days.map((day) => {
                          const cell = getCell(day, hour);
                          const isBreak = hour.includes('10:00') && rowIndex === 1;
                          const isLunch = hour.includes('12:30');
                          if (isBreak) return (
                            <td key={day} className="p-2">
                              <div className="h-full flex items-center justify-center bg-warning/5 rounded-xl py-6">
                                <span className="text-xs text-warning font-medium">{t('timetable.recess')}</span>
                              </div>
                            </td>
                          );
                          if (isLunch) return (
                            <td key={day} className="p-2">
                              <div className="h-full flex items-center justify-center bg-muted rounded-xl py-6">
                                <span className="text-xs text-muted-foreground font-medium">{t('timetable.lunch')}</span>
                              </div>
                            </td>
                          );
                          if (!cell) return (
                            <td key={day} className="p-2">
                              <div
                                className={`rounded-xl bg-muted/30 h-full min-h-[80px] flex items-center justify-center ${
                                  isEditable ? 'cursor-pointer hover:bg-muted/60 hover:border hover:border-dashed hover:border-primary/40 transition-all' : ''
                                }`}
                                onClick={() => handleCellClick(day, hour)}
                              >
                                {isEditable && <span className="text-xs text-muted-foreground/40">+</span>}
                              </div>
                            </td>
                          );
                          return (
                            <td key={day} className="p-2">
                              <div
                                className={`bg-primary/5 border border-primary/10 rounded-xl p-3 min-h-[80px] transition-colors ${
                                  isEditable ? 'cursor-pointer hover:bg-primary/10 hover:border-primary/20' : 'cursor-default'
                                }`}
                                onClick={() => handleCellClick(day, hour)}
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <p className="text-sm font-medium text-foreground">{cell.Cours?.libelle || cell.libelle}</p>
                                  {isEditable && <Edit3 className="w-3 h-3 text-muted-foreground/40 flex-shrink-0 mt-0.5" />}
                                </div>
                                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {cell.salle || cell.idSalle || '-'}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <EditTimetableModal
        open={editOpen}
        onOpenChange={setEditOpen}
        entry={editEntry}
        onSuccess={refreshData}
      />
    </div>
  );
}
