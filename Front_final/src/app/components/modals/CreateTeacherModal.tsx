import { useState, useEffect } from 'react';
import { ModalForm } from '../ui/modal-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { enseignantsAPI, sallesAPI, coursAPI } from '../../services/api';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateTeacherModal({ open, onOpenChange, onSuccess }: Props) {
  const { t, language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [salles, setSalles] = useState<any[]>([]);
  const [cours, setCours] = useState<any[]>([]);
  const [form, setForm] = useState({ nom: '', prenom: '', username: '', password: '', mobile: '', email: '', idSalle: '', idCours: '' });

  useEffect(() => {
    if (open) {
      Promise.all([
        sallesAPI.list().then(d => Array.isArray(d) ? d : (d?.data || [])).catch(() => []),
        coursAPI.list().then(d => Array.isArray(d) ? d : (d?.data || [])).catch(() => []),
      ]).then(([sallesData, coursData]) => {
        setSalles(sallesData);
        setCours(coursData);
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.username) { toast.error(language === 'fr' ? 'Nom, prénom et identifiant requis' : 'Name, first name and username required'); return; }
    setSubmitting(true);
    try {
      await enseignantsAPI.create({ ...form, typePersonne: 1, idCours: parseInt(form.idCours) || undefined, idSalle: parseInt(form.idSalle) || undefined });
      toast.success(language === 'fr' ? 'Enseignant créé avec succès' : 'Teacher created successfully');
      onOpenChange(false);
      setForm({ nom: '', prenom: '', username: '', password: '', mobile: '', email: '', idSalle: '', idCours: '' });
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || (language === 'fr' ? 'Erreur lors de la création' : 'Error creating teacher'));
    } finally { setSubmitting(false); }
  };

  return (
    <ModalForm open={open} onOpenChange={onOpenChange} title={language === 'fr' ? 'Nouvel enseignant' : 'New Teacher'} description={language === 'fr' ? 'Créez un compte enseignant' : 'Create a teacher account'} onSubmit={handleSubmit} submitLabel={language === 'fr' ? 'Créer l\'enseignant' : 'Create Teacher'} isSubmitting={submitting}>
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
          <Label>{language === 'fr' ? 'Identifiant' : 'Username'}</Label>
          <Input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required placeholder="username" />
        </div>
        <div className="space-y-2">
          <Label>{t('common.password')}</Label>
          <Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="********" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Matière' : 'Subject'}</Label>
          <Select value={form.idCours} onValueChange={v => setForm(p => ({ ...p, idCours: v }))}>
            <SelectTrigger><SelectValue placeholder={language === 'fr' ? 'Sélectionner une matière' : 'Select a subject'} /></SelectTrigger>
            <SelectContent>
              {cours.map((c: any) => (
                <SelectItem key={c.idCours || c.id} value={(c.idCours || c.id)?.toString()}>{c.libelle}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{language === 'fr' ? 'Classe' : 'Class'}</Label>
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('common.phone')}</Label>
          <Input value={form.mobile} onChange={e => setForm(p => ({ ...p, mobile: e.target.value }))} placeholder="+237 XXXXXXXXX" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@exemple.com" />
        </div>
      </div>
    </ModalForm>
  );
}
