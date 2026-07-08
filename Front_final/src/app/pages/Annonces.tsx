import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { annoncesAPI } from '../services/api';
import CreateAnnonceModal from '../components/chat/CreateAnnonceModal';
import { FileText, Calendar, User, Plus, Loader2, Megaphone, Trash2 } from 'lucide-react';

const mockAnnonces = [
  { idAnnonce: -1, titre: 'Réunion pédagogique du 15 mai', contenu: 'Tous les enseignants sont invités à la réunion pédagogique qui se tiendra le 15 mai à 14h00 dans la salle de conférence.', auteurNom: 'Administration', auteurRole: 'ADMIN', dateCreation: new Date().toISOString() },
  { idAnnonce: -2, titre: 'Sortie scolaire CM2', contenu: 'Les élèves de CM2 participeront à une sortie scolaire au Musée National le 20 mai.', auteurNom: 'Directeur', auteurRole: 'DIRECTEUR', dateCreation: new Date(Date.now() - 86400000).toISOString() },
  { idAnnonce: -3, titre: 'Rappel paiement scolarité', contenu: 'Veuillez noter que le délai de paiement du 2ème trimestre expire le 30 mai.', auteurNom: 'Administration', auteurRole: 'RESPONSABLE_ADMIN', dateCreation: new Date(Date.now() - 172800000).toISOString() },
];

function loadLocalAnnonces(): any[] {
  try {
    const raw = localStorage.getItem('edugest_annonces');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function Annonces() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchAnnonces = async () => {
    try {
      const data = await annoncesAPI.list();
      setAnnonces(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('API indisponible, chargement local des annonces');
      const local = loadLocalAnnonces();
      setAnnonces(local.length > 0 ? local : mockAnnonces);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (data: any) => {
      setAnnonces(prev => [data, ...prev]);
    };
    socket.on('annonces:new', handler);
    return () => { socket.off('annonces:new', handler); };
  }, [socket]);

  const handleDelete = async (id: number) => {
    if (id < 0) {
      setAnnonces(prev => {
        const filtered = prev.filter(a => a.idAnnonce !== id);
        try { localStorage.setItem('edugest_annonces', JSON.stringify(filtered)); } catch {}
        return filtered;
      });
      return;
    }
    try {
      await annoncesAPI.delete(id);
      setAnnonces(prev => prev.filter(a => a.idAnnonce !== id));
    } catch (err) {
      console.error('Failed to delete annonce:', err);
    }
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.startsWith('data:image');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-orange-500" />
            {language === 'fr' ? 'Annonces' : 'Announcements'}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {language === 'fr' ? 'Toutes les communications officielles' : 'All official communications'}
          </p>
        </div>
        {user?.role !== 'PARENT' && user?.role !== 'ENSEIGNANT' && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            {language === 'fr' ? 'Nouvelle annonce' : 'New announcement'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : annonces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Megaphone className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">{language === 'fr' ? 'Aucune annonce pour le moment' : 'No announcements yet'}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {annonces.map(a => (
            <div key={a.idAnnonce}
              className="bg-card border border-border/50 rounded-xl p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground mb-1">{a.titre}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-medium ${roleColor(a.auteurRole)}`}>
                      <User className="w-2.5 h-2.5" />
                      {a.auteurNom || 'Administration'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(a.dateCreation || a.created_at)}
                    </span>
                  </div>
                  {a.contenu && (
                    <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">{a.contenu}</p>
                  )}
                  {a.fichierUrl && (
                    isImage(a.fichierUrl) ? (
                      <a href={a.fichierUrl.startsWith('data:') || a.fichierUrl.startsWith('blob:') ? a.fichierUrl : `http://localhost:8080${a.fichierUrl}`}
                        target="_blank" rel="noopener noreferrer" className="inline-block mt-3">
                        <img src={a.fichierUrl.startsWith('data:') || a.fichierUrl.startsWith('blob:') ? a.fichierUrl : `http://localhost:8080${a.fichierUrl}`}
                          alt={a.fichierNom || 'Image'} className="max-w-xs max-h-48 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                      </a>
                    ) : (
                      <a href={a.fichierUrl.startsWith('data:') || a.fichierUrl.startsWith('blob:') ? a.fichierUrl : `http://localhost:8080${a.fichierUrl}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-xs text-foreground">
                        <FileText className="w-3.5 h-3.5 text-orange-500" />
                        {a.fichierNom || 'Fichier joint'}
                        {a.fichierTaille && (
                          <span className="text-muted-foreground">({(a.fichierTaille / 1024).toFixed(0)} KB)</span>
                        )}
                      </a>
                    )
                  )}
                </div>
                {user?.role === 'ADMIN' && (
                  <button onClick={() => handleDelete(a.idAnnonce)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground hover:text-red-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateAnnonceModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchAnnonces}
      />
    </div>
  );
}
