import { useState } from 'react';
import { ModalForm } from '../ui/modal-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { paiementsAPI } from '../../services/api';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreatePaymentModal({ open, onOpenChange, onSuccess }: Props) {
  const { language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ matricule: '', montant: '', motif: '', modePaiement: 'Espèces', reference: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.matricule || !form.montant) { toast.error(language === 'fr' ? 'Matricule et montant requis' : 'Matricule and amount required'); return; }
    setSubmitting(true);
    try {
      await paiementsAPI.create({ ...form, montant: parseFloat(form.montant), datePaiement: new Date().toISOString() });
      toast.success(language === 'fr' ? 'Paiement enregistré avec succès' : 'Payment recorded successfully');
      onOpenChange(false);
      setForm({ matricule: '', montant: '', motif: '', modePaiement: 'Espèces', reference: '' });
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || (language === 'fr' ? 'Erreur lors de l\'enregistrement' : 'Error recording payment'));
    } finally { setSubmitting(false); }
  };

  return (
    <ModalForm open={open} onOpenChange={onOpenChange} title={language === 'fr' ? 'Nouveau paiement' : 'New Payment'} description={language === 'fr' ? 'Enregistrez un paiement' : 'Record a payment'} onSubmit={handleSubmit} submitLabel={language === 'fr' ? 'Enregistrer' : 'Save'} isSubmitting={submitting}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Matricule élève' : 'Student ID'}</Label>
          <Input value={form.matricule} onChange={e => setForm(p => ({ ...p, matricule: e.target.value }))} required placeholder="MAT001" />
        </div>
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Montant (FCFA)' : 'Amount (FCFA)'}</Label>
          <Input type="number" value={form.montant} onChange={e => setForm(p => ({ ...p, montant: e.target.value }))} required min={1} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Motif' : 'Reason'}</Label>
          <Select value={form.motif} onValueChange={v => setForm(p => ({ ...p, motif: v }))}>
            <SelectTrigger><SelectValue placeholder={language === 'fr' ? 'Sélectionner' : 'Select'} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Scolarité">Scolarité</SelectItem>
              <SelectItem value="Inscription">Inscription</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Pension">Pension</SelectItem>
              <SelectItem value="Autre">{language === 'fr' ? 'Autre' : 'Other'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Mode de paiement' : 'Payment method'}</Label>
          <Select value={form.modePaiement} onValueChange={v => setForm(p => ({ ...p, modePaiement: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Espèces">Espèces</SelectItem>
              <SelectItem value="Mobile Money">Mobile Money</SelectItem>
              <SelectItem value="Virement">Virement</SelectItem>
              <SelectItem value="Chèque">Chèque</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>{language === 'fr' ? 'Référence' : 'Reference'}</Label>
        <Input value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} placeholder={language === 'fr' ? 'Optionnelle' : 'Optional'} />
      </div>
    </ModalForm>
  );
}
