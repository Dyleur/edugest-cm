import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Wallet, CheckCircle, XCircle, Clock, Eye, Info, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { parentsAPI, elevesAPI, paiementsAPI } from '../../services/api';

export default function ParentPayments() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [paiements, setPaiements] = useState<any[]>([]);
  const [enfant, setEnfant] = useState<any>(null);

  useEffect(() => {
    if (!user?.idPers) return;

    parentsAPI.enfants(user.idPers).then(async (enfants) => {
      const list = Array.isArray(enfants) ? enfants : [];
      if (list.length === 0) return;
      const first = list[0];
      setEnfant({ nom: `${first.nom} ${first.prenom}`, classe: first.Classe?.libelle || '', matricule: first.matricule });
      try {
        const pData = await elevesAPI.paiements(first.matricule);
        setPaiements(Array.isArray(pData) ? pData : []);
      } catch {}
    }).catch(() => {});
  }, []);

  const totalPaye = paiements.filter((p: any) => p.statut === 'paye' || p.statut === 'Payé').reduce((s: number, p: any) => s + (p.montant || 0), 0);
  const totalImpayes = paiements.filter((p: any) => p.statut === 'impaye' || p.statut === 'Impayé' || p.statut === 'impayé').reduce((s: number, p: any) => s + (p.montant || 0), 0);

  const paiementLabels: Record<string, string> = {
    'SCOLARITE': 'Scolarité',
    'INSCRIPTION': 'Inscription',
    'AUTRE': 'Autre',
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-emerald-900 to-green-700 h-40">
        <div className="relative h-full flex items-center px-8 text-white">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{t('parent.payments.title')}</h1>
            <p className="text-emerald-100">{t('parent.payments.subtitle')}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-emerald-200 bg-white/10 rounded-xl px-4 py-2">
            <Eye className="w-4 h-4" /> Son enfant uniquement
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Consultation de l'historique des paiements.</span>
      </div>

      {totalImpayes > 0 && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-300 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">Solde impayé : {totalImpayes.toLocaleString()} FCFA</p>
            <p className="text-sm text-red-600 mt-0.5">Veuillez régulariser votre situation.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Montant total', value: `${(totalPaye + totalImpayes).toLocaleString()} FCFA`, icon: Wallet, color: 'text-gray-700' },
          { label: 'Montant payé', value: `${totalPaye.toLocaleString()} FCFA`, icon: CheckCircle, color: 'text-green-700' },
          { label: 'Impayés', value: `${totalImpayes.toLocaleString()} FCFA`, icon: XCircle, color: totalImpayes > 0 ? 'text-red-600' : 'text-green-600' },
          { label: 'Transactions', value: `${paiements.length}`, icon: Clock, color: 'text-blue-700' },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label}>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{k.label}</p>
                    <p className={`text-lg font-bold mt-1 ${k.color}`}>{k.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${k.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            Historique des paiements {enfant ? `— ${enfant.nom}` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paiements.map((p: any, idx: number) => (
              <div key={p.idPaie || idx} className={`p-4 rounded-xl border-2 transition-colors ${(p.statut === 'paye' || p.statut === 'Payé') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${(p.statut === 'paye' || p.statut === 'Payé') ? 'bg-green-500' : 'bg-red-500'}`}>
                      {(p.statut === 'paye' || p.statut === 'Payé') ? <CheckCircle className="w-5 h-5 text-white" /> : <XCircle className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{paiementLabels[p.type] || p.type || 'Paiement'}</p>
                      <p className="text-xs text-gray-500">
                        {p.datePaiement ? new Date(p.datePaiement).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'En attente'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">{p.montant?.toLocaleString() || 0} FCFA</p>
                    <Badge className={(p.statut === 'paye' || p.statut === 'Payé') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {(p.statut === 'paye' || p.statut === 'Payé') ? 'Payé' : 'Impayé'}
                    </Badge>
                  </div>
                </div>
                {p.datePaiement && (
                  <div className="mt-3 pt-3 border-t border-green-200 grid grid-cols-3 gap-2 text-xs text-gray-500">
                    <div><span className="font-medium">Date</span><br />{new Date(p.datePaiement).toLocaleDateString()}</div>
                    <div><span className="font-medium">Mode</span><br />{p.mode || '-'}</div>
                    <div><span className="font-medium">Réf.</span><br />{p.reference || '-'}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
