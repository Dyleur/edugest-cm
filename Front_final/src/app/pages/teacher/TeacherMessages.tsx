import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { MessageSquare, Mail, MailOpen, Clock, Info } from 'lucide-react';
import { messagesAPI } from '../../services/api';

export default function TeacherMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);
  const [readSet, setReadSet] = useState<Set<number>>(new Set());

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
          contenu: m.contenu || 'Aucun contenu.',
        })));
        setReadSet(new Set(list.filter((m: any) => m.statut === 'lu' || m.statut === 'Lu').map((m: any) => m.idMessage)));
      })
      .catch(() => {});
  }, []);

  const unreadCount = messages.filter((m) => !readSet.has(m.id)).length;

  const handleOpen = (msg: any) => {
    setSelectedMsg(msg);
    setReadSet((prev) => { const s = new Set(prev); s.add(msg.id); return s; });
  };

  return (
    <div className="space-y-6">
      <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-slate-800 to-slate-600">
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-1">Mes Messages</h1>
            <p className="text-slate-200">Messages reçus</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Consultation des messages reçus uniquement.</span>
      </div>

      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-gray-700">Boîte de réception</h2>
        {unreadCount > 0 && (
          <Badge className="bg-orange-500 text-white">{unreadCount} non lu{unreadCount > 1 ? 's' : ''}</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {messages.map((msg) => {
            const isRead = readSet.has(msg.id);
            const isSelected = selectedMsg?.id === msg.id;
            return (
              <div
                key={msg.id}
                onClick={() => handleOpen(msg)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected ? 'border-blue-400 bg-blue-50 shadow-sm' :
                  !isRead ? 'border-orange-200 bg-orange-50 hover:bg-orange-100' :
                  'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {isRead
                      ? <MailOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      : <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    }
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {msg.objet}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{msg.expediteur}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-400">
                    {new Date(msg.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          {selectedMsg ? (
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg leading-snug">{selectedMsg.objet}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500">De : <strong>{selectedMsg.expediteur}</strong></span>
                      <span className="text-sm text-gray-400">
                        {new Date(selectedMsg.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 flex-shrink-0">
                    <MailOpen className="w-3 h-3 mr-1" /> Lu
                  </Badge>
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
              <MessageSquare className="w-16 h-16 mb-3 opacity-30" />
              <p>Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
