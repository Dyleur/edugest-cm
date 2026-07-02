import { useState, useEffect } from 'react';
import { Plus, Send, Inbox, Users, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { messagesAPI } from '../services/api';

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [stats, setStats] = useState({ envoye: 0, lu: 0, diffusions: 0, rappels: 0 });

  useEffect(() => {
    messagesAPI.mesMessages()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setMessages(list.slice(0, 10).map((m: any) => ({
          id: m.idMessage,
          type: m.typeMessage === 2 ? 'Diffusion' : m.typeMessage === 1 ? 'Ciblé' : 'Individuel',
          destinataire: m.destinataireNom || m.destinataire || 'Destinataire',
          objet: m.objet || '(Sans objet)',
          date: m.dateEnvoi || '',
          statut: m.statut === 'envoye' || m.statut === 'Envoyé' ? 'Envoyé' : 'Brouillon',
          lu: m.statut === 'lu' || m.statut === 'Lu',
        })));

        setStats({
          envoye: list.length,
          lu: list.filter((m: any) => m.statut === 'lu' || m.statut === 'Lu').length,
          diffusions: list.filter((m: any) => m.typeMessage === 2).length,
          rappels: list.filter((m: any) => (m.objet || '').toLowerCase().includes('rappel')).length,
        });
      })
      .catch(() => {});
  }, []);

  const tauxLecture = stats.envoye ? Math.round((stats.lu / stats.envoye) * 100) : 0;

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1761604478724-13fe879468cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx0ZWFjaGVyJTIwdGVhY2hpbmclMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3Nzc0NTc5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">Communication</h1>
            <p className="text-lg">Messages et notifications aux parents</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Messages envoyés</p>
                <p className="text-3xl font-bold mt-2">{stats.envoye}</p>
                <p className="text-xs opacity-75 mt-1">Total</p>
              </div>
              <Send className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Taux de lecture</p>
                <p className="text-3xl font-bold mt-2">{tauxLecture}%</p>
                <p className="text-xs opacity-75 mt-1">Messages lus</p>
              </div>
              <Inbox className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Diffusions</p>
                <p className="text-3xl font-bold mt-2">{stats.diffusions}</p>
                <p className="text-xs opacity-75 mt-1">Messages groupés</p>
              </div>
              <Users className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Rappels</p>
                <p className="text-3xl font-bold mt-2">{stats.rappels}</p>
                <p className="text-xs opacity-75 mt-1">Paiements/Discipline</p>
              </div>
              <AlertCircle className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Nouveau message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="type">Type de message</Label>
                <select id="type" className="w-full mt-1 p-2 border rounded-md bg-white">
                  <option>Message individuel</option>
                  <option>Diffusion (tous les parents)</option>
                  <option>Parents d'une classe</option>
                  <option>Parents avec impayés</option>
                </select>
              </div>
              <div>
                <Label htmlFor="destinataire">Destinataire</Label>
                <Input id="destinataire" type="text" placeholder="Sélectionner un ou plusieurs parents..." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="objet">Objet</Label>
                <Input id="objet" type="text" placeholder="Sujet du message..." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={6} placeholder="Écrivez votre message ici..." className="mt-1" />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700">
                  <Send className="w-4 h-4 mr-2" /> Envoyer
                </Button>
                <Button type="button" variant="outline">Brouillon</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="w-5 h-5" />
              Messages récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.map((message: any) => (
                <div
                  key={message.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={
                            message.type === 'Diffusion'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : message.type === 'Ciblé'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                              : 'bg-purple-50 text-purple-700 border-purple-300'
                          }
                        >
                          {message.type}
                        </Badge>
                        {!message.lu && (
                          <span className="w-2 h-2 bg-violet-600 rounded-full" />
                        )}
                      </div>
                      <h4 className="font-semibold text-sm mb-1 truncate">
                        {message.objet}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        À: {message.destinataire}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {message.date ? new Date(message.date).toLocaleDateString() : ''}
                        </span>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                          {message.statut}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modèles de messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-500 hover:bg-violet-50 transition-colors cursor-pointer">
              <h4 className="font-semibold mb-2">Convocation réunion</h4>
              <p className="text-sm text-gray-600">Invitation des parents à une réunion pédagogique</p>
            </div>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-500 hover:bg-violet-50 transition-colors cursor-pointer">
              <h4 className="font-semibold mb-2">Rappel de paiement</h4>
              <p className="text-sm text-gray-600">Notification pour frais de scolarité impayés</p>
            </div>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-500 hover:bg-violet-50 transition-colors cursor-pointer">
              <h4 className="font-semibold mb-2">Incident disciplinaire</h4>
              <p className="text-sm text-gray-600">Information sur un comportement à signaler</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
