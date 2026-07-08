import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSocket } from '../../contexts/SocketContext';
import { conversationsAPI, communicantsAPI } from '../../services/api';
import { Search, Users, Loader2, MessageSquare, ArrowLeft } from 'lucide-react';
import { Input } from '../ui/input';

interface User {
  id: number;
  nom: string;
  prenom: string;
  role: string;
}

interface Props {
  currentUserId: number;
  currentUserRole?: string;
  onSelect: (convId: number, otherUser?: { id: number; nom: string; role: string }) => void;
  onBack: () => void;
}

const DEMO_USERS: User[] = [
  { id: 1, nom: 'Admin', prenom: 'Système', role: 'ADMIN' },
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
    ENSEIGNANT: 'Ens.',
    RESPONSABLE_ADMIN: 'Resp.',
    PARENT: 'Parent',
  };
  return labels[role] || role;
};

export default function UserList({ currentUserId, currentUserRole, onSelect, onBack }: Props) {
  const { language } = useLanguage();
  const { onlineUsers } = useSocket();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    communicantsAPI.list()
      .then((data: any) => {
        const list = data?.data || data;
        if (Array.isArray(list) && list.length > 0) {
          setUsers(list);
        } else {
          setUsers(DEMO_USERS);
        }
      })
      .catch(() => {
        setUsers(DEMO_USERS);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchUsers();

    const interval = setInterval(() => {
      if (!cancelled) fetchUsers();
    }, 15000);

    const onFocus = () => { if (!cancelled) fetchUsers(); };
    const onVisible = () => { if (!cancelled && document.visibilityState === 'visible') fetchUsers(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const roleChatRules: Record<string, string[]> = {
    ADMIN: ['DIRECTEUR', 'RESPONSABLE_ADMIN'],
    DIRECTEUR: ['ADMIN', 'RESPONSABLE_ADMIN', 'ENSEIGNANT'],
    ENSEIGNANT: ['PARENT', 'DIRECTEUR', 'RESPONSABLE_ADMIN'],
    PARENT: ['ENSEIGNANT', 'RESPONSABLE_ADMIN'],
  };

  const filtered = useMemo(() => {
    let list = users.filter(u => u.id !== currentUserId);
    const allowed = currentUserRole ? roleChatRules[currentUserRole] : undefined;
    if (allowed) list = list.filter(u => allowed.includes(u.role));
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(u =>
      `${u.nom} ${u.prenom}`.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  }, [users, currentUserId, currentUserRole, search]);

  const handleStartChat = async (otherUserId: number) => {
    const otherUser = users.find(u => u.id === otherUserId);
    try {
      const res = await conversationsAPI.getOrCreate(otherUserId);
      const conv = res?.data || res;
      onSelect(conv.id || conv.idConversation, otherUser);
    } catch (err) {
      console.log('API indisponible, utilisation d\'un ID local');
      const localConvId = -(Math.min(currentUserId, otherUserId) * 100000 + Math.max(currentUserId, otherUserId));
      onSelect(localConvId, otherUser);
    }
  };

  return (
    <div className="w-80 border-r border-border/50 flex flex-col bg-card h-full">
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-1 -ml-1 rounded-lg hover:bg-muted text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              {language === 'fr' ? 'Utilisateurs' : 'Users'}
            </h3>
          </div>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-4 py-8">
            <Users className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium text-center">
              {language === 'fr' ? 'Aucun utilisateur' : 'No users'}
            </p>
          </div>
        ) : (
          <div>
            {filtered.map(u => {
              const isOnline = onlineUsers.includes(u.id);
              const initial = (u.prenom || u.nom)?.charAt(0)?.toUpperCase() || '?';
              return (
                <div
                  key={u.id}
                  onClick={() => handleStartChat(u.id)}
                  className="flex items-center gap-3 px-3 py-3 cursor-pointer transition-all hover:bg-muted/50 border-b border-border/20"
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${roleColor(u.role)}`}>
                      {initial}
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full" />
                    )}
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
                  <MessageSquare className="w-4 h-4 text-muted-foreground/30 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
