import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';

interface Props {
  conversationId: number;
  onSend: (contenu: string, file?: File) => void;
  disabled?: boolean;
}

export default function MessageInput({ conversationId, onSend, disabled }: Props) {
  const { language } = useLanguage();
  const { socket } = useSocket();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  const emitTyping = (isTyping: boolean) => {
    if (socket?.connected && conversationId) {
      socket.emit(isTyping ? 'typing:start' : 'typing:stop', { conversationId });
    }
  };

  const handleChange = (value: string) => {
    setText(value);
    emitTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(false), 2000);
  };

  const handleSend = () => {
    if ((!text.trim() && !file) || disabled) return;
    onSend(text.trim(), file || undefined);
    setText('');
    setFile(null);
    emitTyping(false);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border/50 bg-card px-3 py-2.5">
      {file && (
        <div className="flex items-center gap-2 mb-2 bg-muted rounded-lg px-3 py-1.5 text-xs">
          <Paperclip className="w-3 h-3 text-muted-foreground" />
          <span className="text-foreground truncate flex-1">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button onClick={() => fileRef.current?.click()} type="button" className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground flex-shrink-0"
          title={language === 'fr' ? 'Joindre un fichier' : 'Attach file'}>
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp"
          className="hidden"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={language === 'fr' ? 'Écrivez votre message...' : 'Type your message...'}
          rows={1}
          className="flex-1 resize-none bg-muted/50 border border-border/50 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground/50"
          disabled={disabled}
        />
        <button onClick={handleSend} disabled={(!text.trim() && !file) || disabled} type="button"
          className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
