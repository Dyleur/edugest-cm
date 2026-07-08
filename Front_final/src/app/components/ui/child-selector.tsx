import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { parentsAPI } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { GraduationCap } from 'lucide-react';

interface Enfant {
  matricule: string;
  nom: string;
  prenom: string;
  classe?: string;
}

interface Props {
  onChildChange?: (enfant: Enfant) => void;
  selectedMatricule?: string;
}

export function ChildSelector({ onChildChange, selectedMatricule }: Props) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [selected, setSelected] = useState(selectedMatricule || '');

  useEffect(() => {
    if (!user?.idPers) return;
    parentsAPI.enfants(user.idPers).then(data => {
      const list = Array.isArray(data) ? data : [];
      setEnfants(list);
      if (list.length > 0 && !selected) {
        setSelected(list[0].matricule);
        onChildChange?.(list[0]);
      }
    }).catch(() => {});
  }, [user?.idPers]);

  const handleChange = (matricule: string) => {
    setSelected(matricule);
    const enfant = enfants.find(e => e.matricule === matricule);
    if (enfant) onChildChange?.(enfant);
  };

  if (enfants.length <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <GraduationCap className="w-4 h-4 text-primary" />
      <Select value={selected} onValueChange={handleChange}>
        <SelectTrigger className="w-[200px] h-9 text-sm">
          <SelectValue placeholder={t('students.selectChild') || 'Sélectionner un enfant'} />
        </SelectTrigger>
        <SelectContent>
          {enfants.map(e => (
            <SelectItem key={e.matricule} value={e.matricule}>
              {e.nom} {e.prenom} {e.classe ? `(${e.classe})` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
