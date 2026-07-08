import { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSocket } from '../../contexts/SocketContext';
import { Search, MessageSquare, Plus, Users } from 'lucide-react';
import { Input } from '../ui/input';

interface OtherUser {
  id: number;
  nom: string;
  role: string;
}

interface Conversation {
  id: number;
  otherUsers: OtherUser[];
  lastMessage: { contenu: string; date: string; expediteurId: number } | null;
  unreadCount: number;
  updatedAt: string;
}

interface Props {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (convId: number) => void;
  onNewChat: () => void;
  onShowAllUsers?: () => void;
  currentUserId: number;
  loading?: boolean;
}

export default function ConversationList({ conversations, selectedId, onSelect, onNewChat, onShowAllUsers, currentUserId, loading }: Props) {
  const { language } = useLanguage();
  const { onlineUsers } = useSocket();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(c =>
      c.otherUsers.some(u => u.nom.toLowerCase().includes(q))
    );
  }, [conversations, search]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return d.toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return language === 'fr' ? 'Hier' : 'Yesterday';
    if (days < 7) return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short' });
    return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' });
  };

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

  return (
    <div className="w-80 border-r border-border/50 flex flex-col bg-card h-full">
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground text-sm">
            {language === 'fr' ? 'Discussions' : 'Chats'}
          </h3>
          <div className="flex items-center gap-1">
            {onShowAllUsers && (
              <button onClick={onShowAllUsers}
                className="px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors"
                title={language === 'fr' ? 'Tous les utilisateurs' : 'All users'}>
                <Users className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={onNewChat}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              {language === 'fr' ? 'Nouvelle' : 'New'}
            </button>
          </div>
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
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-4 py-8">
            <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium text-center">
              {search
                ? (language === 'fr' ? 'Aucun résultat' : 'No results')
                : (language === 'fr' ? 'Aucune discussion' : 'No conversations')}
            </p>
            <p className="text-xs text-center mt-1 opacity-60">
              {!search && (language === 'fr'
                ? 'Cliquez sur "Nouvelle" pour démarrer une conversation'
                : 'Click "New" to start a conversation')}
            </p>
          </div>
        ) : (
          filtered.map(conv => {
            const other = conv.otherUsers[0];
            const isOnline = other && onlineUsers.includes(other.id);
            const initial = other?.nom?.charAt(0)?.toUpperCase() || '?';
            return (
              <div key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-all border-b border-border/30 hover:bg-muted/50 ${
                  selectedId === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}>
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${roleColor(other?.role || '')}`}>
                    {initial}
                  </div>
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-medium text-foreground truncate">{other?.nom || 'Inconnu'}</p>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {formatTime(conv.lastMessage.date)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {other?.role && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full text-white ${roleColor(other.role)}`}>
                        {roleLabel(other.role)}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground truncate flex-1">
                      {conv.lastMessage?.contenu || (language === 'fr' ? 'Nouvelle conversation' : 'New conversation')}
                    </p>
                  </div>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
