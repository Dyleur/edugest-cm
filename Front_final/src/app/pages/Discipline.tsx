import { useState, useEffect } from 'react';
import { Plus, AlertTriangle, Shield, FileWarning } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { disciplineAPI } from '../services/api';

export default function Discipline() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, mineurs: 0, moyens: 0, graves: 0 });

  useEffect(() => {
    disciplineAPI.list()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setIncidents(list.map((inc: any) => ({
          id: inc.idRapport,
          matricule: inc.matricule,
          eleve: inc.eleve ? `${inc.eleve.nom} ${inc.eleve.prenom}` : inc.matricule,
          date: inc.dateIncident || inc.date || '',
          type: inc.type || inc.description || 'Incident',
          gravite: inc.gravite || (Math.abs(inc.points || 0) >= 8 ? 'Grave' : Math.abs(inc.points || 0) >= 4 ? 'Moyenne' : 'Mineure'),
          points: inc.points || 0,
          sanction: inc.sanction || 'Aucune',
          statut: inc.statut === 'resolu' || inc.statut === 'Résolu' ? 'Résolu' : 'En cours',
        })));

        const mineurs = list.filter((i: any) => Math.abs(i.points || 0) < 4).length;
        const moyens = list.filter((i: any) => Math.abs(i.points || 0) >= 4 && Math.abs(i.points || 0) < 8).length;
        const graves = list.filter((i: any) => Math.abs(i.points || 0) >= 8 || i.gravite === 'Grave').length;

        setStats({ total: list.length, mineurs, moyens, graves });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1759755486391-d7bd120924f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx0ZWFjaGVyJTIwdGVhY2hpbmclMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3Nzc0NTc5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">Gestion de la Discipline</h1>
            <p className="text-lg">Suivi des incidents et sanctions</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rapports d'incidents</h2>
          <p className="text-gray-600">Tous les signalements</p>
        </div>
        <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4" />
          Signaler un incident
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total incidents</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
                <p className="text-xs opacity-75 mt-1">Tous les signalements</p>
              </div>
              <FileWarning className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Mineurs</p>
                <p className="text-3xl font-bold mt-2">{stats.mineurs}</p>
                <p className="text-xs opacity-75 mt-1">{stats.total ? `${Math.round(stats.mineurs/stats.total*100)}%` : '0%'}</p>
              </div>
              <AlertTriangle className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Moyens</p>
                <p className="text-3xl font-bold mt-2">{stats.moyens}</p>
                <p className="text-xs opacity-75 mt-1">{stats.total ? `${Math.round(stats.moyens/stats.total*100)}%` : '0%'}</p>
              </div>
              <Shield className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Graves</p>
                <p className="text-3xl font-bold mt-2">{stats.graves}</p>
                <p className="text-xs opacity-75 mt-1">{stats.total ? `${Math.round(stats.graves/stats.total*100)}%` : '0%'}</p>
              </div>
              <AlertTriangle className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incidents.map((incident: any) => {
              const graviteColor =
                incident.gravite === 'Grave'
                  ? 'bg-red-100 text-red-700'
                  : incident.gravite === 'Moyenne'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-yellow-100 text-yellow-700';

              const statutColor =
                incident.statut === 'Résolu'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700';

              return (
                <div
                  key={incident.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{incident.eleve}</h3>
                          <Badge variant="outline">{incident.matricule}</Badge>
                          <Badge className={`${graviteColor} hover:${graviteColor}`}>
                            {incident.gravite}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {incident.type}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{incident.date ? new Date(incident.date).toLocaleDateString() : ''}</span>
                          <span>Sanction: {incident.sanction}</span>
                          <span className="text-red-600 font-semibold">
                            {incident.points} points
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${statutColor} hover:${statutColor}`}>
                      {incident.statut}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Barème de sanctions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="font-medium text-yellow-900">Infractions mineures (-1 à -3 points)</p>
                <p className="text-sm text-yellow-700 mt-1">Retard, tenue incorrecte, oubli de matériel</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="font-medium text-orange-900">Infractions moyennes (-4 à -7 points)</p>
                <p className="text-sm text-orange-700 mt-1">Perturbation, manque de respect, tricherie</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <p className="font-medium text-red-900">Infractions graves (-8 à -15 points)</p>
                <p className="text-sm text-red-700 mt-1">Violence, vol, dégradation, fraude</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Mineurs</span>
                  <span className="text-sm text-gray-600">{stats.total ? `${Math.round(stats.mineurs/stats.total*100)}%` : '0%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${stats.total ? Math.round(stats.mineurs/stats.total*100) : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Moyens</span>
                  <span className="text-sm text-gray-600">{stats.total ? `${Math.round(stats.moyens/stats.total*100)}%` : '0%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-500 h-3 rounded-full" style={{ width: `${stats.total ? Math.round(stats.moyens/stats.total*100) : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Graves</span>
                  <span className="text-sm text-gray-600">{stats.total ? `${Math.round(stats.graves/stats.total*100)}%` : '0%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-red-500 h-3 rounded-full" style={{ width: `${stats.total ? Math.round(stats.graves/stats.total*100) : 0}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
