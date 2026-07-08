import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { edtAPI, classesAPI } from '../../services/api';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: any | null;
  onSuccess: () => void;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const HOURS = ['08:00', '09:00', '10:30', '11:30'];

export default function EditTimetableModal({ open, onOpenChange, entry, onSuccess }: Props) {
  const { t, language } = useLanguage();
  const [classes, setClasses] = useState<any[]>([]);
  const [form, setForm] = useState({
    idClasse: '',
    jour: 'Lundi',
    heure: '08:00',
    libelle: '',
    salle: '',
  });

  useEffect(() => {
    classesAPI.list().then(data => {
      const list = Array.isArray(data) ? data : (data?.data || []);
      setClasses(list);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (entry) {
      setForm({
        idClasse: entry.idClasse?.toString() || '',
        jour: entry.jour || 'Lundi',
        heure: entry.heure || '08:00',
        libelle: entry.Cours?.libelle || entry.libelle || '',
        salle: entry.salle || entry.idSalle || '',
      });
    } else {
      setForm({ idClasse: classes[0]?.idClasse?.toString() || '', jour: 'Lundi', heure: '08:00', libelle: '', salle: '' });
    }
  }, [entry, open, classes]);

  const handleSubmit = async () => {
    if (!form.libelle || !form.idClasse) {
      toast.error(language === 'fr' ? 'Veuillez remplir tous les champs' : 'Please fill all fields');
      return;
    }
    try {
      const payload = { ...form, idClasse: Number(form.idClasse) };
      if (entry?.idEdt || entry?.id) {
        await edtAPI.update(entry.idEdt || entry.id, payload);
        toast.success(language === 'fr' ? 'Créneau modifié' : 'Slot updated');
      } else {
        await edtAPI.create(payload);
        toast.success(language === 'fr' ? 'Créneau ajouté' : 'Slot added');
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error(language === 'fr' ? 'Erreur lors de l\'enregistrement' : 'Save error');
    }
  };

  const handleDelete = async () => {
    if (!entry) return;
    try {
      await edtAPI.delete(entry.idEdt || entry.id);
      toast.success(language === 'fr' ? 'Créneau supprimé' : 'Slot deleted');
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error(language === 'fr' ? 'Erreur de suppression' : 'Delete error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{entry ? (language === 'fr' ? 'Modifier le créneau' : 'Edit Slot') : (language === 'fr' ? 'Ajouter un créneau' : 'Add Slot')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t('subjects.name')}</Label>
            <Input value={form.libelle} onChange={(e) => setForm({ ...form, libelle: e.target.value })} placeholder={language === 'fr' ? 'Matière (ex: Mathématiques)' : 'Subject (e.g. Mathematics)'} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('timetable.day')}</Label>
              <Select value={form.jour} onValueChange={(v) => setForm({ ...form, jour: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('timetable.schedule')}</Label>
              <Select value={form.heure} onValueChange={(v) => setForm({ ...form, heure: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {HOURS.map(h => <SelectItem key={h} value={h}>{h}:00 - {h === '11:30' ? '12:30' : `${String(Number(h.split(':')[0]) + 1).padStart(2, '0')}:00`}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('timetable.class')}</Label>
              <Select value={form.idClasse} onValueChange={(v) => setForm({ ...form, idClasse: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {classes.map((c: any) => <SelectItem key={c.idClasse || c.id} value={(c.idClasse || c.id).toString()}>{c.libelle}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('common.room')}</Label>
              <Input value={form.salle} onChange={(e) => setForm({ ...form, salle: e.target.value })} placeholder="Salle" />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          {entry && (
            <Button variant="destructive" onClick={handleDelete} className="mr-auto">
              {language === 'fr' ? 'Supprimer' : 'Delete'}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit}>
            {entry ? (language === 'fr' ? 'Modifier' : 'Update') : (language === 'fr' ? 'Ajouter' : 'Add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
