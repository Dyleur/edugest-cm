import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { conversationsAPI } from '../../services/api';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface OtherUser {
  id: number;
  nom: string;
  role: string;
}

interface Props {
  conversationId: number | null;
  otherUsers: OtherUser[];
  onBack: () => void;
}

function storageKey(convId: number) {
  return `edugest_messages_${convId}`;
}

function loadMessages(convId: number): any[] {
  try {
    const raw = localStorage.getItem(storageKey(convId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveMessages(convId: number, msgs: any[]) {
  try { localStorage.setItem(storageKey(convId), JSON.stringify(msgs)); } catch {}
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

let localMsgId = 0;

export default function ChatArea({ conversationId, otherUsers, onBack }: Props) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { socket, onlineUsers, typingUsers } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const other = otherUsers[0];
  const isOnline = other && onlineUsers.includes(other.id);
  const convTyping = conversationId ? typingUsers[conversationId] || [] : [];
  const isTyping = convTyping.length > 0 && convTyping.some(t => t.username !== user?.username);
  const isLocal = conversationId != null && conversationId < 0;

  useEffect(() => {
    if (!conversationId) return;
    if (isLocal) {
      const msgs = loadMessages(conversationId);
      setMessages(msgs);
      const minId = msgs.reduce((min: number, m: any) => Math.min(min, m.idMessage || 0), 0);
      if (minId < 0) localMsgId = minId;
      setLoading(false);
      return;
    }
    setMessages([]);
    setLoading(true);
    conversationsAPI.getMessages(conversationId)
      .then(res => {
        const msgs = res?.messages || res?.data || [];
        setMessages(Array.isArray(msgs) ? msgs : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !conversationId || isLocal) return;

    socket.emit('conversations:join', [conversationId]);

    const handleNewMessage = (msg: any) => {
      if (msg.conversationId === conversationId) {
        setMessages(prev => {
          if (prev.some((m: any) => m.idMessage === msg.idMessage)) return prev;
          return [...prev, msg].sort((a: any, b: any) => new Date(a.dateEnvoi).getTime() - new Date(b.dateEnvoi).getTime());
        });
      }
    };

    const handleEditedMessage = (data: any) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => prev.map((m: any) => m.idMessage === data.idMessage ? { ...m, contenu: data.contenu, editedAt: data.editedAt } : m));
      }
    };

    const handleDeletedMessage = (data: any) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => prev.filter((m: any) => m.idMessage !== data.idMessage));
      }
    };

    socket.on('messages:new', handleNewMessage);
    socket.on('messages:edited', handleEditedMessage);
    socket.on('messages:deleted', handleDeletedMessage);

    return () => {
      socket.off('messages:new', handleNewMessage);
      socket.off('messages:edited', handleEditedMessage);
      socket.off('messages:deleted', handleDeletedMessage);
    };
  }, [socket, conversationId, isLocal]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (contenu: string, file?: File) => {
    if (!conversationId) return;
    setSending(true);

    if (isLocal) {
      localMsgId -= 1;
      let fichierUrl: string | undefined;
      let fichierNom: string | undefined;
      if (file) {
        fichierUrl = await fileToBase64(file);
        fichierNom = file.name;
      }
      const newMsg = {
        idMessage: localMsgId,
        contenu: contenu?.trim() || '',
        expediteurId: user?.idPers,
        conversationId,
        dateEnvoi: new Date().toISOString(),
        fichierUrl,
        fichierNom,
      };
      setMessages(prev => {
        const updated = [...prev, newMsg];
        saveMessages(conversationId, updated);
        return updated;
      });
      setSending(false);
      return;
    }

    if (!socket?.connected) {
      setSending(false);
      return;
    }

    try {
      let fichierUrl: string | undefined;
      let fichierNom: string | undefined;

      if (file) {
        const formData = new FormData();
        formData.append('fichier', file);
        const token = localStorage.getItem('edugest_token');
        const res = await fetch('http://localhost:8080/api/messages/upload', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        const uploadData = await res.json();
        if (uploadData?.success) {
          fichierUrl = uploadData.data.fichierUrl;
          fichierNom = uploadData.data.fichierNom;
        }
      }

      socket.emit('messages:send', {
        conversationId,
        contenu,
        fichierUrl,
        fichierNom,
      }, (ack: any) => {
        setSending(false);
        if (ack?.error) {
          console.error('Send error:', ack.error);
          return;
        }
        if (ack?.success) {
          const newMsg = {
            ...(ack.message || ack),
            isMine: true,
            expediteurId: user?.idPers,
            expediteur: 'Moi',
            conversationId,
            dateEnvoi: new Date().toISOString(),
          };
          setMessages(prev => {
            if (prev.some((m: any) => m.idMessage === newMsg.idMessage)) return prev;
            return [...prev, newMsg];
          });
        }
      });
    } catch (err) {
      console.error('Send error:', err);
      setSending(false);
    }
  };

  const handleEdit = (messageId: number, newContenu: string) => {
    if (isLocal) {
      setMessages(prev => {
        const updated = prev.map((m: any) => m.idMessage === messageId ? { ...m, contenu: newContenu, editedAt: new Date().toISOString() } : m);
        saveMessages(conversationId!, updated);
        return updated;
      });
    } else {
      socket?.emit('messages:edit', { messageId, contenu: newContenu });
    }
  };

  const handleDelete = (messageId: number) => {
    if (isLocal) {
      setMessages(prev => {
        const updated = prev.filter((m: any) => m.idMessage !== messageId);
        saveMessages(conversationId!, updated);
        return updated;
      });
    } else {
      socket?.emit('messages:delete', { messageId });
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-muted-foreground text-sm">
            {language === 'fr' ? 'Sélectionnez une discussion' : 'Select a conversation'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background h-full">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 bg-card">
        <button onClick={onBack} className="md:hidden p-1 -ml-1 rounded-lg hover:bg-muted text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
            {other?.nom?.charAt(0)?.toUpperCase() || '?'}
          </div>
          {isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">{other?.nom || 'Inconnu'}</p>
          <p className="text-[11px] text-muted-foreground">
            {isLocal
              ? (language === 'fr' ? 'Mode local' : 'Local mode')
              : isTyping
                ? (language === 'fr' ? 'Écrit...' : 'Typing...')
                : isOnline
                  ? (language === 'fr' ? 'En ligne' : 'Online')
                  : (language === 'fr' ? 'Hors ligne' : 'Offline')}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p className="text-xs">
              {language === 'fr' ? 'Aucun message. Envoyez le premier message !' : 'No messages. Say hello!'}
            </p>
          </div>
        ) : (
          messages.map((msg: any) => {
            const isMine = msg.expediteurId === user?.idPers;
            return (
              <MessageBubble
                key={msg.idMessage || msg.id}
                message={{
                  ...msg,
                  isMine,
                  expediteur: isMine ? 'Moi' : (other?.nom || 'Inconnu'),
                }}
                onEdit={isMine ? (id: number, newContent: string) => handleEdit(id, newContent) : undefined}
                onDelete={isMine ? () => handleDelete(msg.idMessage) : undefined}
              />
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <MessageInput conversationId={conversationId} onSend={handleSend} disabled={sending} />
    </div>
  );
}
