import { useState } from 'react';
import { ModalForm } from '../ui/modal-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { disciplineAPI } from '../../services/api';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function ReportDisciplineModal({ open, onOpenChange, onSuccess }: Props) {
  const { language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ matricule: '', typeIncident: '', description: '', points: '0' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.matricule || !form.typeIncident) { toast.error(language === 'fr' ? 'Matricule et type d\'incident requis' : 'Matricule and incident type required'); return; }
    setSubmitting(true);
    try {
      await disciplineAPI.create({ ...form, points: parseInt(form.points) || 0, dateIncident: new Date().toISOString() });
      toast.success(language === 'fr' ? 'Incident signalé avec succès' : 'Incident reported successfully');
      onOpenChange(false);
      setForm({ matricule: '', typeIncident: '', description: '', points: '0' });
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || (language === 'fr' ? 'Erreur lors du signalement' : 'Error reporting incident'));
    } finally { setSubmitting(false); }
  };

  return (
    <ModalForm open={open} onOpenChange={onOpenChange} title={language === 'fr' ? 'Signaler un incident' : 'Report an Incident'} description={language === 'fr' ? 'Enregistrez un incident disciplinaire' : 'Record a disciplinary incident'} onSubmit={handleSubmit} submitLabel={language === 'fr' ? 'Signaler' : 'Report'} isSubmitting={submitting}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Matricule élève' : 'Student ID'}</Label>
          <Input value={form.matricule} onChange={e => setForm(p => ({ ...p, matricule: e.target.value }))} required placeholder="MAT001" />
        </div>
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Type d\'incident' : 'Incident type'}</Label>
          <Select value={form.typeIncident} onValueChange={v => setForm(p => ({ ...p, typeIncident: v }))}>
            <SelectTrigger><SelectValue placeholder={language === 'fr' ? 'Sélectionner' : 'Select'} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Retard">{language === 'fr' ? 'Retard' : 'Late'}</SelectItem>
              <SelectItem value="Absence">{language === 'fr' ? 'Absence non justifiée' : 'Unexcused absence'}</SelectItem>
              <SelectItem value="Indiscipline">{language === 'fr' ? 'Indiscipline' : 'Indiscipline'}</SelectItem>
              <SelectItem value="Tricherie">{language === 'fr' ? 'Tricherie' : 'Cheating'}</SelectItem>
              <SelectItem value="Violence">{language === 'fr' ? 'Violence' : 'Violence'}</SelectItem>
              <SelectItem value="Dégradation">{language === 'fr' ? 'Dégradation' : 'Property damage'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>{language === 'fr' ? 'Description' : 'Description'}</Label>
        <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder={language === 'fr' ? 'Décrivez l\'incident...' : 'Describe the incident...'} />
      </div>
      <div className="space-y-2">
        <Label>{language === 'fr' ? 'Points de pénalité' : 'Penalty points'}</Label>
        <Input type="number" value={form.points} onChange={e => setForm(p => ({ ...p, points: e.target.value }))} min={0} max={100} />
      </div>
    </ModalForm>
  );
}
