import { useState } from 'react';
import { ModalForm } from '../ui/modal-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useLanguage } from '../../contexts/LanguageContext';
import { coursAPI } from '../../services/api';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateSubjectModal({ open, onOpenChange, onSuccess }: Props) {
  const { t, language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ libelle: '', coefficient: '1' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.libelle) { toast.error(language === 'fr' ? 'Le libellé est requis' : 'Label is required'); return; }
    setSubmitting(true);
    try {
      await coursAPI.create({ ...form, coefficient: parseInt(form.coefficient) || 1 });
      toast.success(language === 'fr' ? 'Matière créée avec succès' : 'Subject created successfully');
      onOpenChange(false);
      setForm({ libelle: '', coefficient: '1' });
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || (language === 'fr' ? 'Erreur lors de la création' : 'Error creating subject'));
    } finally { setSubmitting(false); }
  };

  return (
    <ModalForm open={open} onOpenChange={onOpenChange} title={language === 'fr' ? 'Nouvelle matière' : 'New Subject'} description={language === 'fr' ? 'Ajoutez une matière' : 'Add a subject'} onSubmit={handleSubmit} submitLabel={language === 'fr' ? 'Créer la matière' : 'Create Subject'} isSubmitting={submitting}>
      <div className="space-y-2">
        <Label>{t('subjects.name')}</Label>
        <Input value={form.libelle} onChange={e => setForm(p => ({ ...p, libelle: e.target.value }))} required placeholder={language === 'fr' ? 'Ex: Mathématiques' : 'E.g: Mathematics'} />
      </div>
      <div className="space-y-2">
        <Label>{t('subjects.coefficient')}</Label>
        <Input type="number" value={form.coefficient} onChange={e => setForm(p => ({ ...p, coefficient: e.target.value }))} min={1} max={10} />
      </div>
    </ModalForm>
  );
}
