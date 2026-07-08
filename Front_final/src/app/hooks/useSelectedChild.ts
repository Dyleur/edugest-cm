import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { parentsAPI } from '../services/api';

export interface Enfant {
  matricule: string;
  nom: string;
  prenom: string;
  classe?: string;
  [key: string]: any;
}

export function useSelectedChild() {
  const { user } = useAuth();
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [selected, setSelected] = useState<Enfant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.idPers) { setLoading(false); return; }
    parentsAPI.enfants(user.idPers)
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setEnfants(list);
        if (list.length > 0 && !selected) {
          setSelected(list[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.idPers]);

  const selectChild = (matricule: string) => {
    const enfant = enfants.find(e => e.matricule === matricule);
    if (enfant) setSelected(enfant);
  };

  return { enfants, selected, selectChild, loading, hasMultiple: enfants.length > 1 };
}
