import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { conversationsAPI, communicantsAPI } from '../../services/api';
import { X, Search, Loader2, MessageSquare, Megaphone } from 'lucide-react';
import { Input } from '../ui/input';

interface User {
  id: number;
  nom: string;
  prenom: string;
  role: string;
  mobile?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (convId: number, otherUser?: { id: number; nom: string; role: string }) => void;
  onNewAnnonce?: () => void;
  currentUserId: number;
  currentUserRole?: string;
}

const DEMO_USERS = [
  { id: 1, nom: 'Système', prenom: 'Admin', role: 'ADMIN' },
  { id: 2, nom: 'Nkwi', prenom: 'Paul', role: 'DIRECTEUR' },
  { id: 3, nom: 'Mbah', prenom: 'Alice', role: 'RESPONSABLE_ADMIN' },
  { id: 4, nom: 'Tchinda', prenom: 'Marie', role: 'ENSEIGNANT' },
  { id: 5, nom: 'Fotso', prenom: 'Jean', role: 'PARENT' },
];

const roleColor = (role: string) => {
  const map: Record<string, string> = {
    ADMIN: 'bg-red-500',
    DIRECTEUR: 'bg-purple-500',
    ENSEIGNANT: 'bg-blue-500',
    RESPONSABLE_ADMIN: 'bg-orange-500',
    PARENT: 'bg-green-500',
  };
  return map[role] || 'bg-gray-500';
};

const roleLabel = (role: string) => {
  const labels: Record<string, string> = {
    ADMIN: 'Admin',
    DIRECTEUR: 'Directeur',
    ENSEIGNANT: 'Enseignant',
    RESPONSABLE_ADMIN: 'Resp. Admin',
    PARENT: 'Parent',
  };
  return labels[role] || role;
};

export default function NewConversationModal({ open, onClose, onCreated, onNewAnnonce, currentUserId, currentUserRole }: Props) {
  const { language } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setSearch('');

    communicantsAPI.list()
      .then(data => {
        const list = data?.data || data;
        setUsers(Array.isArray(list) && list.length > 0 ? list.filter((u: User) => u.id !== currentUserId) : DEMO_USERS.filter(u => u.id !== currentUserId));
      })
      .catch(err => {
        console.error('Erreur chargement utilisateurs:', err);
        setUsers(DEMO_USERS.filter(u => u.id !== currentUserId));
      })
      .finally(() => setLoading(false));
  }, [open, currentUserId]);

  const roleChatRules: Record<string, string[]> = {
    ADMIN: ['DIRECTEUR', 'RESPONSABLE_ADMIN'],
    DIRECTEUR: ['ADMIN', 'RESPONSABLE_ADMIN', 'ENSEIGNANT'],
    ENSEIGNANT: ['PARENT', 'DIRECTEUR', 'RESPONSABLE_ADMIN'],
    PARENT: ['ENSEIGNANT', 'RESPONSABLE_ADMIN'],
  };

  const filtered = useMemo(() => {
    let list = users;
    const allowed = currentUserRole ? roleChatRules[currentUserRole] : undefined;
    if (allowed) list = list.filter(u => allowed.includes(u.role));
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(u =>
      `${u.nom} ${u.prenom}`.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  }, [users, currentUserRole, search]);

  const startConversation = async (otherUserId: number) => {
    const otherUser = users.find(u => u.id === otherUserId);
    try {
      const res = await conversationsAPI.getOrCreate(otherUserId);
      const conv = res?.data || res;
      onCreated(conv.id || conv.idConversation, otherUser);
      onClose();
    } catch (err) {
      console.error('Erreur création conversation:', err);
      if (otherUser) {
        const localConvId = -(Math.min(currentUserId, otherUserId) * 100000 + Math.max(currentUserId, otherUserId));
        onCreated(localConvId, otherUser);
        onClose();
      }
    }
  };

  if (!open) return null;

  const hasUsers = !loading && filtered.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-background rounded-xl shadow-xl w-96 max-w-[90vw] max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <h3 className="font-semibold text-sm">{language === 'fr' ? 'Nouvelle discussion' : 'New conversation'}</h3>
          <div className="flex items-center gap-1">
            {onNewAnnonce && <button onClick={onNewAnnonce}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-orange-500 hover:bg-orange-500/10 transition-colors"
              title={language === 'fr' ? 'Créer une annonce' : 'Create announcement'}>
              <Megaphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'fr' ? 'Annonce' : 'Announce'}</span>
            </button>}
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-3 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={language === 'fr' ? 'Rechercher un utilisateur...' : 'Search users...'}
              className="pl-8 h-8 text-xs"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : !hasUsers ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs">
                {search
                  ? (language === 'fr' ? 'Aucun utilisateur trouvé' : 'No users found')
                  : (language === 'fr' ? 'Aucun utilisateur disponible' : 'No users available')}
              </p>
            </div>
          ) : (
            filtered.map(u => (
              <div
                key={u.id}
                onClick={() => startConversation(u.id)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/60 transition-colors border-b border-border/20 last:border-0"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${roleColor(u.role)}`}>
                  {u.nom?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {u.prenom} {u.nom}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full text-white ${roleColor(u.role)}`}>
                      {roleLabel(u.role)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
