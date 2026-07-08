import { useState, useEffect } from 'react';
import { ModalForm } from '../ui/modal-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { epreuvesAPI, coursAPI, classesAPI } from '../../services/api';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateGradeModal({ open, onOpenChange, onSuccess }: Props) {
  const { language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [cours, setCours] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [form, setForm] = useState({ libelle: '', idCours: '', idClasse: '', type: 'Devoir', dateEpreuve: '', noteMax: '20' });

  useEffect(() => {
    if (open) {
      coursAPI.list().then(d => setCours(Array.isArray(d) ? d : [])).catch(() => {});
      classesAPI.list().then(d => setClasses(Array.isArray(d) ? d : [])).catch(() => {});
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.libelle || !form.idCours) { toast.error(language === 'fr' ? 'Libellé et matière requis' : 'Label and subject required'); return; }
    setSubmitting(true);
    try {
      await epreuvesAPI.create({ ...form, idCours: parseInt(form.idCours), idClasse: parseInt(form.idClasse) || undefined, noteMax: parseFloat(form.noteMax) || 20 });
      toast.success(language === 'fr' ? 'Évaluation créée avec succès' : 'Assessment created successfully');
      onOpenChange(false);
      setForm({ libelle: '', idCours: '', idClasse: '', type: 'Devoir', dateEpreuve: '', noteMax: '20' });
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || (language === 'fr' ? 'Erreur lors de la création' : 'Error creating assessment'));
    } finally { setSubmitting(false); }
  };

  return (
    <ModalForm open={open} onOpenChange={onOpenChange} title={language === 'fr' ? 'Nouvelle évaluation' : 'New Assessment'} description={language === 'fr' ? 'Créez une nouvelle évaluation' : 'Create a new assessment'} onSubmit={handleSubmit} submitLabel={language === 'fr' ? 'Créer l\'évaluation' : 'Create Assessment'} isSubmitting={submitting}>
      <div className="space-y-2">
        <Label>{language === 'fr' ? 'Libellé' : 'Label'}</Label>
        <Input value={form.libelle} onChange={e => setForm(p => ({ ...p, libelle: e.target.value }))} required placeholder={language === 'fr' ? 'Ex: Devoir n°1' : 'E.g: Test #1'} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Matière' : 'Subject'}</Label>
          <Select value={form.idCours} onValueChange={v => setForm(p => ({ ...p, idCours: v }))}>
            <SelectTrigger><SelectValue placeholder={language === 'fr' ? 'Sélectionner' : 'Select'} /></SelectTrigger>
            <SelectContent>
              {cours.map((c: any) => <SelectItem key={c.idCours} value={c.idCours?.toString()}>{c.libelle}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Type' : 'Type'}</Label>
          <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Devoir">{language === 'fr' ? 'Devoir' : 'Test'}</SelectItem>
              <SelectItem value="Composition">{language === 'fr' ? 'Composition' : 'Composition'}</SelectItem>
              <SelectItem value="Examen">{language === 'fr' ? 'Examen' : 'Exam'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Classe' : 'Class'}</Label>
          <Select value={form.idClasse} onValueChange={v => setForm(p => ({ ...p, idClasse: v }))}>
            <SelectTrigger><SelectValue placeholder={language === 'fr' ? 'Optionnelle' : 'Optional'} /></SelectTrigger>
            <SelectContent>
              {classes.map((c: any) => <SelectItem key={c.idClasse} value={c.idClasse?.toString()}>{c.libelle}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Note max' : 'Max score'}</Label>
          <Input type="number" value={form.noteMax} onChange={e => setForm(p => ({ ...p, noteMax: e.target.value }))} min={1} max={100} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{language === 'fr' ? 'Date' : 'Date'}</Label>
        <Input type="date" value={form.dateEpreuve} onChange={e => setForm(p => ({ ...p, dateEpreuve: e.target.value }))} />
      </div>
    </ModalForm>
  );
}
