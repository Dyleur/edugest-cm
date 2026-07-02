import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { MessageSquare, Mail, MailOpen, Clock, Info, Users, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { messagesAPI } from '../../services/api';

type TypeMsg = 'individuel' | 'circulaire' | 'impayes';

const typeConfig: Record<TypeMsg, { label: string; icon: React.ElementType; color: string }> = {
  individuel: { label: 'Personnel', icon: User, color: 'bg-blue-100 text-blue-700' },
  circulaire: { label: 'Circulaire', icon: Users, color: 'bg-purple-100 text-purple-700' },
  impayes: { label: 'Paiement', icon: Clock, color: 'bg-orange-100 text-orange-700' },
};

export default function ParentMessages() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);
  const [readSet, setReadSet] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<TypeMsg | 'all'>('all');

  useEffect(() => {
    messagesAPI.mesMessages()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setMessages(list.map((m: any) => ({
          id: m.idMessage,
          objet: m.objet || '(Sans objet)',
          expediteur: 'Administration',
          date: m.dateEnvoi || new Date().toISOString(),
          lu: m.statut === 'lu' || m.statut === 'Lu',
          type: m.typeMessage === 2 ? 'circulaire' : m.typeMessage === 1 ? 'impayes' : 'individuel',
          contenu: m.contenu || 'Aucun contenu.',
        })));
        setReadSet(new Set(list.filter((m: any) => m.statut === 'lu' || m.statut === 'Lu').map((m: any) => m.idMessage)));
      })
      .catch(() => {});
  }, []);

  const unread = messages.filter(m => !readSet.has(m.id)).length;
  const filtered = filter === 'all' ? messages : messages.filter(m => m.type === filter);

  const handleOpen = (msg: any) => {
    setSelectedMsg(msg);
    setReadSet(prev => { const s = new Set(prev); s.add(msg.id); return s; });
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-purple-900 to-violet-700 h-40">
        <div className="relative h-full flex items-center px-8 text-white">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{t('parent.messages.title')}</h1>
            <p className="text-purple-100">{t('parent.messages.subtitle')}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-purple-200 bg-white/10 rounded-xl px-4 py-2">
            <MessageSquare className="w-4 h-4" /> Lecture seule
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Consultation des messages reçus.</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">{messages.length} messages</span>
          {unread > 0 && <Badge className="bg-orange-500 text-white">{unread} non lu{unread > 1 ? 's' : ''}</Badge>}
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'all' ? 'bg-gray-700 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
            Tous
          </button>
          {(Object.keys(typeConfig) as TypeMsg[]).map(t => (
            <button key={t} onClick={() => setFilter(filter === t ? 'all' : t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === t ? 'bg-gray-700 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
              {typeConfig[t].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-2">
          {filtered.map(msg => {
            const isRead = readSet.has(msg.id);
            const isSelected = selectedMsg?.id === msg.id;
            const tcfg = typeConfig[msg.type as TypeMsg] || typeConfig.individuel;
            const TypeIcon = tcfg.icon;

            return (
              <div key={msg.id} onClick={() => handleOpen(msg)}
                className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                  isSelected ? 'border-purple-400 bg-purple-50 shadow-sm' :
                  !isRead ? 'border-orange-200 bg-orange-50 hover:border-orange-300' :
                  'border-transparent bg-white hover:bg-gray-50 hover:border-gray-200'
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isRead ? 'bg-gray-100' : 'bg-orange-100'}`}>
                    {isRead ? <MailOpen className="w-4 h-4 text-gray-400" /> : <Mail className="w-4 h-4 text-orange-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-medium text-gray-500 truncate">{msg.expediteur}</p>
                      <Badge className={`text-xs flex-shrink-0 ${tcfg.color}`}>
                        <TypeIcon className="w-2.5 h-2.5 mr-1" />{tcfg.label}
                      </Badge>
                    </div>
                    <p className={`text-sm truncate ${!isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>
                      {msg.objet}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun message</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          {selectedMsg ? (
            <Card className="sticky top-6">
              <CardHeader className="border-b bg-gray-50">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg leading-snug">{selectedMsg.objet}</CardTitle>
                    {readSet.has(selectedMsg.id) && (
                      <Badge className="bg-green-100 text-green-700 flex-shrink-0 gap-1">
                        <MailOpen className="w-3 h-3" /> Lu
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span>De : <strong>{selectedMsg.expediteur}</strong></span>
                    <span>·</span>
                    <span>{new Date(selectedMsg.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
                  {selectedMsg.contenu}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <MessageSquare className="w-16 h-16 mb-3 opacity-20" />
              <p className="text-sm">Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
