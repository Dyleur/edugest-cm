import { useState, useEffect } from 'react';
import { ModalForm } from '../ui/modal-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { classesAPI, cyclesAPI } from '../../services/api';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateClassModal({ open, onOpenChange, onSuccess }: Props) {
  const { t, language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [cycles, setCycles] = useState<any[]>([]);
  const [form, setForm] = useState({ libelle: '', idCycle: '' });

  useEffect(() => {
    if (open) cyclesAPI.list().then(d => setCycles(Array.isArray(d) ? d : [])).catch(() => {});
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.libelle) { toast.error(language === 'fr' ? 'Le libellé est requis' : 'Label is required'); return; }
    setSubmitting(true);
    try {
      await classesAPI.create({ ...form, idCycle: parseInt(form.idCycle) || undefined });
      toast.success(language === 'fr' ? 'Classe créée avec succès' : 'Class created successfully');
      onOpenChange(false);
      setForm({ libelle: '', idCycle: '' });
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || (language === 'fr' ? 'Erreur lors de la création' : 'Error creating class'));
    } finally { setSubmitting(false); }
  };

  return (
    <ModalForm open={open} onOpenChange={onOpenChange} title={language === 'fr' ? 'Nouvelle classe' : 'New Class'} description={language === 'fr' ? 'Créez une nouvelle classe' : 'Create a new class'} onSubmit={handleSubmit} submitLabel={language === 'fr' ? 'Créer la classe' : 'Create Class'} isSubmitting={submitting}>
      <div className="space-y-2">
        <Label>{t('classes.name')}</Label>
        <Input value={form.libelle} onChange={e => setForm(p => ({ ...p, libelle: e.target.value }))} required placeholder={language === 'fr' ? 'Ex: CM2A' : 'E.g: CM2A'} />
      </div>
      <div className="space-y-2">
        <Label>{t('classes.cycle')}</Label>
        <Select value={form.idCycle} onValueChange={v => setForm(p => ({ ...p, idCycle: v }))}>
          <SelectTrigger><SelectValue placeholder={language === 'fr' ? 'Sélectionner un cycle' : 'Select a cycle'} /></SelectTrigger>
          <SelectContent>
            {cycles.map((c: any) => <SelectItem key={c.idCycle} value={c.idCycle?.toString()}>{c.libelle}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </ModalForm>
  );
}
