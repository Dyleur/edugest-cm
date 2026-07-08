import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCheck, FileText, Edit2, Trash2 } from 'lucide-react';

interface Message {
  idMessage: number;
  contenu: string;
  expediteur: string;
  expediteurId: number;
  dateEnvoi: string;
  statut: string;
  isMine: boolean;
  fichierUrl?: string;
  fichierNom?: string;
  fichierTaille?: number;
  editedAt?: string;
}

interface Props {
  message: Message;
  onEdit?: (messageId: number, newContenu: string) => void;
  onDelete?: (messageId: number) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' o';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
  return (bytes / 1048576).toFixed(1) + ' Mo';
}

export default function MessageBubble({ message, onEdit, onDelete }: Props) {
  const { language } = useLanguage();
  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.contenu || '');

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return '';
    if (days === 1) return language === 'fr' ? 'Hier ' : 'Yesterday ';
    return d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' }) + ' ';
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== message.contenu && onEdit) {
      onEdit(message.idMessage, editText.trim());
    }
    setEditing(false);
  };

  const isImage = message.fichierUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || message.fichierUrl?.startsWith('data:image');
  const fileUrl = message.fichierUrl?.startsWith('data:') || message.fichierUrl?.startsWith('blob:')
    ? message.fichierUrl
    : `http://localhost:8080${message.fichierUrl}`;

  return (
    <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} group mb-2`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}>
      <div className="max-w-[70%] min-w-[120px]">
        {!message.isMine && (
          <p className="text-[11px] text-muted-foreground mb-1 px-1">{message.expediteur}</p>
        )}
        <div className={`relative rounded-2xl px-3.5 py-2.5 shadow-sm ${
          message.isMine
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-zinc-700 dark:bg-zinc-800 text-white rounded-bl-sm'
        }`}>
          {editing ? (
            <div className="flex gap-1">
              <input
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') setEditing(false); }}
                className="flex-1 bg-transparent border-b border-current text-sm outline-none"
                autoFocus
              />
              <button onClick={handleSaveEdit} className="text-xs underline">OK</button>
            </div>
          ) : (
            <>
              {message.contenu && (
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.contenu}</p>
              )}
              {message.fichierUrl && (
                isImage ? (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-1.5">
                    <img src={fileUrl} alt={message.fichierNom || 'Image'}
                      className="max-w-full max-h-48 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                  </a>
                ) : (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 mt-1.5 p-2 rounded-lg ${
                      message.isMine ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20' : 'bg-white/10 hover:bg-white/20'
                    } transition-colors`}>
                    <div className="p-1.5 rounded-lg bg-orange-500/20">
                      <FileText className="w-4 h-4 text-orange-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{message.fichierNom || 'Fichier'}</p>
                      {message.fichierTaille && (
                        <p className="text-[10px] opacity-60">{formatFileSize(message.fichierTaille)}</p>
                      )}
                    </div>
                  </a>
                )
              )}
              {message.editedAt && (
                <span className="text-[10px] opacity-50 ml-1">
                  {language === 'fr' ? '(modifié)' : '(edited)'}
                </span>
              )}
            </>
          )}
          <div className={`flex items-center gap-1 mt-0.5 ${message.isMine ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-[10px] ${message.isMine ? 'text-primary-foreground/60' : 'text-white/50'}`}>
              {formatDate(message.dateEnvoi)}{formatTime(message.dateEnvoi)}
            </span>
            {message.isMine && (
              <CheckCheck className={`w-3 h-3 ${message.statut === 'Lu' ? 'text-blue-300' : 'text-primary-foreground/40'}`} />
            )}
          </div>
        </div>

        {message.isMine && showActions && !editing && (
          <div className="flex justify-end gap-1 mt-1">
            {onEdit && (
              <button onClick={() => { setEditing(true); setEditText(message.contenu || ''); }}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <Edit2 className="w-3 h-3" />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(message.idMessage)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
