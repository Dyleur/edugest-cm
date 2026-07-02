import { useState, useEffect } from 'react';
import { Plus, DollarSign, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { paiementsAPI } from '../services/api';

export default function Payments() {
  const [paiements, setPaiements] = useState<any[]>([]);
  const [stats, setStats] = useState({ encaissements: 0, payes: 0, partiels: 0, impayes: 0 });

  useEffect(() => {
    Promise.all([
      paiementsAPI.list(),
      paiementsAPI.stats(),
      paiementsAPI.impayes(),
    ])
      .then(([list, statsData, impayesData]) => {
        const listArr = Array.isArray(list) ? list : [];
        const impayesArr = Array.isArray(impayesData) ? impayesData : [];

        setPaiements(listArr.slice(0, 10).map((p: any) => ({
          id: p.idPaie,
          matricule: p.matricule,
          eleve: p.eleve ? `${p.eleve.nom} ${p.eleve.prenom}` : p.matricule,
          montant: p.montant || 0,
          date: p.datePaiement || '-',
          type: p.type || 'Scolarité',
          mode: p.mode || '-',
          statut: p.statut === 'paye' || p.statut === 'Payé' ? 'Payé' : p.montant > 0 ? 'Partiel' : 'Impayé',
        })));

        const total = listArr.length;
        const payes = listArr.filter((p: any) => p.statut === 'paye' || p.statut === 'Payé').length;
        const partiels = listArr.filter((p: any) => p.montant > 0 && p.statut !== 'paye' && p.statut !== 'Payé').length;
        const montantTotal = listArr.reduce((sum: number, p: any) => sum + (p.montant || 0), 0);

        setStats({
          encaissements: montantTotal,
          payes,
          partiels,
          impayes: impayesArr.length || (total - payes - partiels),
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1773558057568-27ee1049a8ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzY2hvb2wlMjBzdXBwbGllcyUyMGVkdWNhdGlvbiUyMGNvbG9yZnVsfGVufDF8fHx8MTc3NzQ1NzkwN3ww&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">Gestion des Paiements</h1>
            <p className="text-lg">Scolarité, frais et suivi des paiements</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input type="text" placeholder="Rechercher un paiement..." className="pl-10" />
        </div>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> Nouveau paiement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Encaissements</p>
                <p className="text-3xl font-bold mt-2">
                  {stats.encaissements > 0 ? `${(stats.encaissements/1000000).toFixed(1)}M` : '0'}
                </p>
                <p className="text-xs opacity-75 mt-1">FCFA</p>
              </div>
              <DollarSign className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Payés</p>
                <p className="text-3xl font-bold mt-2">{stats.payes}</p>
                <p className="text-xs opacity-75 mt-1">{stats.payes + stats.partiels + stats.impayes > 0 ? `${Math.round(stats.payes/(stats.payes+stats.partiels+stats.impayes)*100)}%` : '0%'}</p>
              </div>
              <CheckCircle className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Partiels</p>
                <p className="text-3xl font-bold mt-2">{stats.partiels}</p>
                <p className="text-xs opacity-75 mt-1">{stats.payes + stats.partiels + stats.impayes > 0 ? `${Math.round(stats.partiels/(stats.payes+stats.partiels+stats.impayes)*100)}%` : '0%'}</p>
              </div>
              <AlertCircle className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Impayés</p>
                <p className="text-3xl font-bold mt-2">{stats.impayes}</p>
                <p className="text-xs opacity-75 mt-1">{stats.payes + stats.partiels + stats.impayes > 0 ? `${Math.round(stats.impayes/(stats.payes+stats.partiels+stats.impayes)*100)}%` : '0%'}</p>
              </div>
              <AlertCircle className="w-12 h-12 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paiements récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paiements.map((paiement: any) => (
              <div
                key={paiement.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      paiement.statut === 'Payé'
                        ? 'bg-green-500'
                        : paiement.statut === 'Partiel'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {paiement.statut === 'Payé' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <AlertCircle className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{paiement.eleve}</h3>
                      <Badge variant="outline">{paiement.matricule}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{paiement.type}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">
                      {paiement.montant > 0 ? `${paiement.montant.toLocaleString()} FCFA` : '-'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {paiement.mode} {paiement.date !== '-' ? `• ${new Date(paiement.date).toLocaleDateString()}` : ''}
                    </p>
                  </div>

                  <Badge
                    className={
                      paiement.statut === 'Payé'
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : paiement.statut === 'Partiel'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                    }
                  >
                    {paiement.statut}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Payés</span>
                  <span className="text-sm text-gray-600">
                    {stats.payes + stats.partiels + stats.impayes > 0
                      ? `${Math.round(stats.payes/(stats.payes+stats.partiels+stats.impayes)*100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${stats.payes + stats.partiels + stats.impayes > 0 ? Math.round(stats.payes/(stats.payes+stats.partiels+stats.impayes)*100) : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Partiels</span>
                  <span className="text-sm text-gray-600">
                    {stats.payes + stats.partiels + stats.impayes > 0
                      ? `${Math.round(stats.partiels/(stats.payes+stats.partiels+stats.impayes)*100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full"
                    style={{ width: `${stats.payes + stats.partiels + stats.impayes > 0 ? Math.round(stats.partiels/(stats.payes+stats.partiels+stats.impayes)*100) : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Impayés</span>
                  <span className="text-sm text-gray-600">
                    {stats.payes + stats.partiels + stats.impayes > 0
                      ? `${Math.round(stats.impayes/(stats.payes+stats.partiels+stats.impayes)*100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{ width: `${stats.payes + stats.partiels + stats.impayes > 0 ? Math.round(stats.impayes/(stats.payes+stats.partiels+stats.impayes)*100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grille tarifaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Scolarité</span>
                <span className="text-lg font-bold text-emerald-600">Variable</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Frais d'inscription</span>
                <span className="text-lg font-bold text-emerald-600">50,000 FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
