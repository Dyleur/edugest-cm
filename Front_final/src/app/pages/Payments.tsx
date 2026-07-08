import { useState, useEffect } from 'react';
import { Plus, DollarSign, AlertCircle, CheckCircle, Search, CreditCard, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { paiementsAPI } from '../services/api';
import { mockPayments } from '../data/mock-data';
import { toast } from 'sonner';
import CreatePaymentModal from '../components/modals/CreatePaymentModal';

export default function Payments() {
  const [paiements, setPaiements] = useState<any[]>(() => mockPayments.slice(0, 10).map((p: any) => ({
    id: p.idPaie,
    matricule: p.matricule,
    eleve: p.eleve ? `${p.eleve.nom} ${p.eleve.prenom}` : p.matricule,
    montant: p.montant || 0,
    date: p.datePaiement || '-',
    type: p.type || 'Scolarité',
    mode: p.mode || '-',
    statut: p.statut === 'paye' || p.statut === 'Payé' ? 'Payé' : p.montant > 0 ? 'Partiel' : 'Impayé',
  })));
  const [stats, setStats] = useState(() => {
    const listArr = mockPayments;
    const total = listArr.length;
    const payes = listArr.filter((p: any) => p.statut === 'paye' || p.statut === 'Payé').length;
    const partiels = listArr.filter((p: any) => p.montant > 0 && p.statut !== 'paye' && p.statut !== 'Payé').length;
    const montantTotal = listArr.reduce((sum: number, p: any) => sum + (p.montant || 0), 0);
    return { encaissements: montantTotal, payes, partiels, impayes: total - payes - partiels };
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

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
      .catch(() => {
        const listArr = mockPayments;
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
        setStats({ encaissements: montantTotal, payes, partiels, impayes: total - payes - partiels });
      });
  }, []);

  const totalPayments = stats.payes + stats.partiels + stats.impayes;
  const filteredPaiements = paiements.filter(p =>
    (p.eleve || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.matricule || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.statut || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    'Payé': 'bg-success/10 text-success border-success/20',
    'Partiel': 'bg-warning/10 text-warning border-warning/20',
    'Impayé': 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Encaissements', value: stats.encaissements > 0 ? `${(stats.encaissements/1000000).toFixed(1)}M` : '0', sub: 'FCFA', icon: DollarSign, color: 'from-blue-400 to-blue-500', delay: '0s' },
          { label: 'Payés', value: stats.payes.toString(), sub: totalPayments > 0 ? `${Math.round(stats.payes/totalPayments*100)}%` : '0%', icon: CheckCircle, color: 'from-emerald-500 to-emerald-600', delay: '0.1s' },
          { label: 'Partiels', value: stats.partiels.toString(), sub: totalPayments > 0 ? `${Math.round(stats.partiels/totalPayments*100)}%` : '0%', icon: TrendingUp, color: 'from-amber-500 to-amber-600', delay: '0.15s' },
          { label: 'Impayés', value: stats.impayes.toString(), sub: totalPayments > 0 ? `${Math.round(stats.impayes/totalPayments*100)}%` : '0%', icon: AlertCircle, color: 'from-rose-500 to-rose-600', delay: '0.2s' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: stat.delay }}>
              <Card className="border-border/50 overflow-hidden group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                    </div>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input type="text" placeholder="Rechercher un paiement..." className="pl-9 h-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowModal(true)}>
          <Plus className="w-3.5 h-3.5" /> Nouveau paiement
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Paiements récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredPaiements.map((paiement: any) => (
                  <div
                    key={paiement.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      paiement.statut === 'Payé' ? 'bg-success/10' : paiement.statut === 'Partiel' ? 'bg-warning/10' : 'bg-destructive/10'
                    }`}>
                      {paiement.statut === 'Payé' ? (
                        <CheckCircle className={`w-5 h-5 ${paiement.statut === 'Payé' ? 'text-success' : paiement.statut === 'Partiel' ? 'text-warning' : 'text-destructive'}`} />
                      ) : (
                        <AlertCircle className={`w-5 h-5 ${paiement.statut === 'Partiel' ? 'text-warning' : 'text-destructive'}`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm">{paiement.eleve}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">{paiement.matricule}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{paiement.type}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {paiement.montant > 0 ? `${paiement.montant.toLocaleString()} FCFA` : '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {paiement.mode !== '-' ? paiement.mode : ''}
                      </p>
                    </div>

                    <Badge className={`${statusColors[paiement.statut] || ''} text-xs`}>
                      {paiement.statut}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Répartition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Payés', value: stats.payes, color: 'bg-success', total: totalPayments },
                  { label: 'Partiels', value: stats.partiels, color: 'bg-warning', total: totalPayments },
                  { label: 'Impayés', value: stats.impayes, color: 'bg-destructive', total: totalPayments },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-foreground">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.total > 0 ? `${Math.round(item.value/item.total*100)}%` : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${item.total > 0 ? Math.round(item.value/item.total*100) : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                Grille tarifaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'Scolarité', value: '150 000 FCFA' },
                  { label: 'Inscription', value: '50 000 FCFA' },
                  { label: 'Transport', value: '75 000 FCFA' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CreatePaymentModal open={showModal} onOpenChange={setShowModal} onSuccess={() => {
        Promise.all([paiementsAPI.list(), paiementsAPI.stats(), paiementsAPI.impayes()]).then(([list, _, impayesData]) => {
          const listArr = Array.isArray(list) ? list : [];
          setPaiements(listArr.slice(0, 10).map((p: any) => ({ id: p.idPaie, matricule: p.matricule, eleve: p.eleve ? `${p.eleve.nom} ${p.eleve.prenom}` : p.matricule, montant: p.montant || 0, date: p.datePaiement || '-', type: p.type || 'Scolarité', mode: p.mode || '-', statut: p.statut === 'paye' || p.statut === 'Payé' ? 'Payé' : p.montant > 0 ? 'Partiel' : 'Impayé' })));
          const payes = listArr.filter((p: any) => p.statut === 'paye' || p.statut === 'Payé').length;
          const partiels = listArr.filter((p: any) => p.montant > 0 && p.statut !== 'paye' && p.statut !== 'Payé').length;
          const montantTotal = listArr.reduce((sum: number, p: any) => sum + (p.montant || 0), 0);
          const impayesArr = Array.isArray(impayesData) ? impayesData : [];
          setStats({ encaissements: montantTotal, payes, partiels, impayes: impayesArr.length || (listArr.length - payes - partiels) });
        }).catch(() => {
          const listArr = mockPayments;
          setPaiements(listArr.slice(0, 10).map((p: any) => ({ id: p.idPaie, matricule: p.matricule, eleve: p.eleve ? `${p.eleve.nom} ${p.eleve.prenom}` : p.matricule, montant: p.montant || 0, date: p.datePaiement || '-', type: p.type || 'Scolarité', mode: p.mode || '-', statut: p.statut === 'paye' || p.statut === 'Payé' ? 'Payé' : p.montant > 0 ? 'Partiel' : 'Impayé' })));
          const payes = listArr.filter((p: any) => p.statut === 'paye' || p.statut === 'Payé').length;
          const partiels = listArr.filter((p: any) => p.montant > 0 && p.statut !== 'paye' && p.statut !== 'Payé').length;
          const montantTotal = listArr.reduce((sum: number, p: any) => sum + (p.montant || 0), 0);
          setStats({ encaissements: montantTotal, payes, partiels, impayes: listArr.length - payes - partiels });
        });
      }} />
    </div>
  );
}
