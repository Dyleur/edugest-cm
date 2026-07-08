import { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { annoncesAPI } from '../../services/api';
import { X, Paperclip, Loader2, Send } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

let localAnnonceId = 0;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadLocalAnnonces(): any[] {
  try {
    const raw = localStorage.getItem('edugest_annonces');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLocalAnnonce(annonce: any) {
  const list = loadLocalAnnonces();
  list.unshift(annonce);
  try { localStorage.setItem('edugest_annonces', JSON.stringify(list)); } catch {}
}

export default function CreateAnnonceModal({ open, onClose, onCreated }: Props) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!titre.trim() || sending) return;
    setSending(true);

    let fichierUrl: string | undefined;
    let fichierNom: string | undefined;
    let fichierTaille: number | undefined;

    try {
      if (file) {
        setUploading(true);
        const uploadRes = await annoncesAPI.upload(file).catch(() => null);
        setUploading(false);
        if (uploadRes?.success) {
          fichierUrl = uploadRes.data.fichierUrl;
          fichierNom = uploadRes.data.fichierNom;
          fichierTaille = uploadRes.data.fichierTaille;
        } else {
          fichierUrl = await fileToBase64(file);
          fichierNom = file.name;
          fichierTaille = file.size;
        }
      }

      await annoncesAPI.create({
        titre: titre.trim(),
        contenu: contenu.trim() || undefined,
        fichierUrl,
        fichierNom,
        fichierTaille,
      });
    } catch (err) {
      console.log('API indisponible, sauvegarde locale de l\'annonce');
      localAnnonceId -= 1;
      saveLocalAnnonce({
        idAnnonce: localAnnonceId,
        titre: titre.trim(),
        contenu: contenu.trim() || '',
        auteurNom: user?.nom || 'Administration',
        auteurRole: user?.role || 'ADMIN',
        fichierUrl,
        fichierNom,
        fichierTaille,
        dateCreation: new Date().toISOString(),
      });
    }

    setTitre('');
    setContenu('');
    setFile(null);
    onCreated();
    onClose();
    setSending(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-background rounded-xl shadow-xl w-[480px] max-w-[90vw] max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-semibold">{language === 'fr' ? 'Nouvelle annonce' : 'New announcement'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              {language === 'fr' ? 'Titre' : 'Title'} *
            </label>
            <input
              value={titre}
              onChange={e => setTitre(e.target.value)}
              placeholder={language === 'fr' ? 'Titre de l\'annonce...' : 'Announcement title...'}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              {language === 'fr' ? 'Message' : 'Message'}
            </label>
            <textarea
              value={contenu}
              onChange={e => setContenu(e.target.value)}
              placeholder={language === 'fr' ? 'Écrivez votre annonce...' : 'Write your announcement...'}
              rows={5}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              {language === 'fr' ? 'Pièce jointe (facultative)' : 'Attachment (optional)'}
            </label>
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border/50 hover:bg-muted/50 transition-colors text-sm text-muted-foreground">
              <Paperclip className="w-4 h-4" />
              {file ? file.name : (language === 'fr' ? 'Ajouter un fichier' : 'Add a file')}
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp" className="hidden"
              onChange={e => setFile(e.target.files?.[0] || null)} />
            {file && (
              <p className="text-xs text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border/50 flex justify-end gap-2">
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
            {language === 'fr' ? 'Annuler' : 'Cancel'}
          </button>
          <button onClick={handleSubmit} disabled={!titre.trim() || sending || uploading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40">
            {sending || uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {language === 'fr' ? 'Publier' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
