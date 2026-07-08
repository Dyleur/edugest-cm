import { useState, useEffect, useCallback } from 'react';
import { ModalForm } from '../ui/modal-form';
import { useLanguage } from '../../contexts/LanguageContext';
import { communicantsAPI } from '../../services/api';
import { Megaphone, MessageCircle, Search, ChevronRight } from 'lucide-react';
import { Input } from '../ui/input';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onStartChat?: (destinataireId: number, destinataireNom: string) => void;
}

export default function SendMessageModal({ open, onOpenChange, onSuccess, onStartChat }: Props) {
  const { language } = useLanguage();
  const [communicants, setCommunicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'prive' | 'annonce'>('prive');
  const [search, setSearch] = useState('');

  const DEMO_COMMUNICANTS = [
    { id: 1, nom: 'Admin', prenom: 'Système', role: 'ADMIN' },
    { id: 2, nom: 'Nkwi', prenom: 'Paul', role: 'DIRECTEUR' },
    { id: 3, nom: 'Tchinda', prenom: 'Marie', role: 'ENSEIGNANT' },
    { id: 4, nom: 'Mbah', prenom: 'Alice', role: 'RESPONSABLE_ADMIN' },
    { id: 5, nom: 'Fotso', prenom: 'Jean', role: 'PARENT' },
  ];

  const loadCommunicants = useCallback(async () => {
    setLoading(true);
    try {
      const d = await communicantsAPI.list();
      const arr = Array.isArray(d) ? d : (d?.data || []);
      if (arr.length > 0) { setCommunicants(arr); return; }
    } catch (e) { console.warn('[SendMessageModal] communicantsAPI failed', e); }
    try {
      const resp = await fetch('http://localhost:8080/api/communicants', {
        headers: { Authorization: `Bearer ${localStorage.getItem('edugest_token')}` },
      });
      const data = await resp.json();
      const arr = Array.isArray(data) ? data : (data?.data || data?.communicants || []);
      if (arr.length > 0) { setCommunicants(arr); return; }
    } catch (e2) { console.warn('[SendMessageModal] direct fetch failed', e2); }
    setCommunicants(DEMO_COMMUNICANTS);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) {
      loadCommunicants();
      setMode('prive');
      setSearch('');
    }
  }, [open, loadCommunicants]);

  const roleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ENSEIGNANT: language === 'fr' ? 'Enseignant' : 'Teacher',
      DIRECTEUR: language === 'fr' ? 'Directeur' : 'Director',
      PARENT: language === 'fr' ? 'Parent' : 'Parent',
      RESPONSABLE_ADMIN: language === 'fr' ? 'Resp. Admin' : 'Admin Officer',
      ADMIN: 'Admin',
    };
    return labels[role] || role;
  };

  const roleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-red-500',
      DIRECTEUR: 'bg-purple-500',
      ENSEIGNANT: 'bg-blue-500',
      RESPONSABLE_ADMIN: 'bg-orange-500',
      PARENT: 'bg-green-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  const handleStartChat = (c: any) => {
    const name = `${c.prenom} ${c.nom}`.trim();
    if (onStartChat) onStartChat(c.id, name);
    onOpenChange(false);
    onSuccess();
  };

  const filtered = communicants.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.nom?.toLowerCase().includes(q) || c.prenom?.toLowerCase().includes(q) || c.role?.toLowerCase().includes(q);
  });

  return (
    <ModalForm
      open={open}
      onOpenChange={onOpenChange}
      title={mode === 'annonce' ? (language === 'fr' ? 'Nouvelle annonce' : 'New Announcement') : (language === 'fr' ? 'Nouvelle discussion' : 'New Conversation')}
      description={mode === 'annonce' ? (language === 'fr' ? 'Envoyer une annonce à tous' : 'Send an announcement to all') : (language === 'fr' ? 'Choisissez un destinataire pour démarrer une discussion' : 'Choose a recipient to start a conversation')}
    >
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => setMode('prive')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'prive' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}>
          <MessageCircle className="w-4 h-4" />
          {language === 'fr' ? 'Privé' : 'Private'}
        </button>
        <button type="button" onClick={() => setMode('annonce')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'annonce' ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}>
          <Megaphone className="w-4 h-4" />
          {language === 'fr' ? 'Annonce' : 'Announcement'}
        </button>
      </div>

      {mode === 'prive' ? (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={language === 'fr' ? 'Rechercher un destinataire...' : 'Search recipient...'}
              className="pl-9 h-9 text-sm"
            />
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
              {language === 'fr' ? 'Chargement...' : 'Loading...'}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {language === 'fr' ? 'Aucun destinataire trouvé' : 'No recipient found'}
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-1 -mx-1">
              {filtered.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleStartChat(c)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/80 transition-colors text-left group"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${roleColor(c.role)}`}>
                    {(c.prenom?.[0] || c.nom?.[0] || '?').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {c.prenom} {c.nom}
                    </p>
                    <p className="text-xs text-muted-foreground">{roleLabel(c.role)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
          <Megaphone className="w-4 h-4 inline mr-1.5" />
          {language === 'fr'
            ? 'Cette annonce sera envoyée à tous les utilisateurs. Utilisez l\'onglet "Annonces" pour créer une annonce.'
            : 'This announcement will be sent to all users. Use the "Announcements" tab to create one.'}
        </div>
      )}
    </ModalForm>
  );
}
