import { useState, useEffect } from 'react';
import { ModalForm } from '../ui/modal-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { elevesAPI, sallesAPI } from '../../services/api';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateStudentModal({ open, onOpenChange, onSuccess }: Props) {
  const { t, language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [salles, setSalles] = useState<any[]>([]);
  const [form, setForm] = useState({ nom: '', prenom: '', dateNaissance: '', lieuNaissance: '', sexe: 'M', idSalle: '', langue: 'FR' });

  useEffect(() => {
    if (open) sallesAPI.list().then(d => setSalles(Array.isArray(d) ? d : (d?.data || []))).catch(() => {});
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.prenom) { toast.error(language === 'fr' ? 'Nom et prénom requis' : 'First and last name required'); return; }
    setSubmitting(true);
    try {
      await elevesAPI.create({ ...form, idSalle: parseInt(form.idSalle) || undefined });
      toast.success(language === 'fr' ? 'Élève créé avec succès' : 'Student created successfully');
      onOpenChange(false);
      setForm({ nom: '', prenom: '', dateNaissance: '', lieuNaissance: '', sexe: 'M', idSalle: '', langue: 'FR' });
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || (language === 'fr' ? 'Erreur lors de la création' : 'Error creating student'));
    } finally { setSubmitting(false); }
  };

  return (
    <ModalForm open={open} onOpenChange={onOpenChange} title={language === 'fr' ? 'Nouvel élève' : 'New Student'} description={language === 'fr' ? 'Remplissez les informations de l\'élève' : 'Fill in the student information'} onSubmit={handleSubmit} submitLabel={language === 'fr' ? 'Créer l\'élève' : 'Create Student'} isSubmitting={submitting}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('students.lastName')}</Label>
          <Input value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))} required placeholder={language === 'fr' ? 'Nom' : 'Last name'} />
        </div>
        <div className="space-y-2">
          <Label>{t('students.firstName')}</Label>
          <Input value={form.prenom} onChange={e => setForm(p => ({ ...p, prenom: e.target.value }))} required placeholder={language === 'fr' ? 'Prénom' : 'First name'} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('students.dateOfBirth')}</Label>
          <Input type="date" value={form.dateNaissance} onChange={e => setForm(p => ({ ...p, dateNaissance: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>{t('students.placeOfBirth')}</Label>
          <Input value={form.lieuNaissance} onChange={e => setForm(p => ({ ...p, lieuNaissance: e.target.value }))} placeholder={language === 'fr' ? 'Lieu de naissance' : 'Place of birth'} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('students.gender')}</Label>
          <Select value={form.sexe} onValueChange={v => setForm(p => ({ ...p, sexe: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="M">{language === 'fr' ? 'Masculin' : 'Male'}</SelectItem>
              <SelectItem value="F">{language === 'fr' ? 'Féminin' : 'Female'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t('students.class')}</Label>
          <Select value={form.idSalle} onValueChange={v => setForm(p => ({ ...p, idSalle: v }))}>
            <SelectTrigger><SelectValue placeholder={language === 'fr' ? 'Sélectionner une classe' : 'Select a class'} /></SelectTrigger>
            <SelectContent>
              {salles.map((s: any) => (
                <SelectItem key={s.idSalle} value={s.idSalle?.toString()}>
                  {s.Classe?.libelle ? `${s.Classe.libelle} - ${s.libelle}` : s.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('students.language')}</Label>
        <Select value={form.langue} onValueChange={v => setForm(p => ({ ...p, langue: v }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="FR">Français</SelectItem>
            <SelectItem value="EN">English</SelectItem>
            <SelectItem value="BIL">{language === 'fr' ? 'Bilingue' : 'Bilingual'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </ModalForm>
  );
}
