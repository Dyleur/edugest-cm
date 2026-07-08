import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Wallet, CheckCircle, XCircle, Clock, AlertTriangle, DollarSign, Landmark } from 'lucide-react';
import { elevesAPI } from '../../services/api';
import { mockPayments } from '../../data/mock-data';
import { useSelectedChild } from '../../hooks/useSelectedChild';
import { ChildSelector } from '../../components/ui/child-selector';

export default function ParentPayments() {
  const { t, language } = useLanguage();
  const { selected: enfant, selectChild } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>(mockPayments);

  useEffect(() => {
    if (!enfant?.matricule) { setLoading(false); return; }
    elevesAPI.paiements(enfant.matricule)
      .then(data => {
        const items = Array.isArray(data) ? data : (data?.data || []);
        setPayments(items);
      })
      .catch(() => { setPayments(mockPayments); })
      .finally(() => setLoading(false));
  }, [enfant?.matricule]);

  const totalPaye = payments
    .filter(p => p.statut === 'Payé')
    .reduce((s, p) => s + (p.montant || 0), 0);

  const totalImpayes = payments
    .filter(p => p.statut === 'Impayé')
    .reduce((s, p) => s + (p.montant || 0), 0);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{t('parent.payments.title')}</h1>
                <ChildSelector onChildChange={(e) => selectChild(e.matricule)} selectedMatricule={enfant?.matricule} />
              </div>
              <p className="text-emerald-200 text-sm">{t('parent.payments.subtitle')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {totalImpayes > 0 && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-300 rounded-xl animate-fade-in-up">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">{language === 'fr' ? 'Solde impayé' : 'Outstanding balance'} : {totalImpayes.toLocaleString()} FCFA</p>
            <p className="text-sm text-red-600 mt-0.5">{language === 'fr' ? 'Veuillez régulariser votre situation' : 'Please settle your account'}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: language === 'fr' ? 'Montant total' : 'Total Amount', value: `${(totalPaye + totalImpayes).toLocaleString()} FCFA`, icon: DollarSign, color: 'from-blue-400 to-blue-500' },
          { label: language === 'fr' ? 'Payé' : 'Paid', value: `${totalPaye.toLocaleString()} FCFA`, icon: CheckCircle, color: 'from-green-500 to-green-600' },
          { label: language === 'fr' ? 'Impayés' : 'Unpaid', value: `${totalImpayes.toLocaleString()} FCFA`, icon: XCircle, color: totalImpayes > 0 ? 'from-red-500 to-red-600' : 'from-green-500 to-green-600' },
          { label: language === 'fr' ? 'Transactions' : 'Transactions', value: payments.length.toString(), icon: Clock, color: 'from-purple-500 to-purple-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet className="w-5 h-5 text-emerald-600" />
                {t('parent.payments.paymentHistory')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payments.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">{language === 'fr' ? 'Aucun paiement enregistré' : 'No payments recorded'}</p>
              ) : payments.map((p, i) => (
                <div key={i} className={`p-4 rounded-xl border-2 transition-colors ${p.statut === 'Payé' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${p.statut === 'Payé' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {p.statut === 'Payé' ? <CheckCircle className="w-5 h-5 text-white" /> : <XCircle className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{p.motif || p.type || 'Scolarité'}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.datePaiement ? new Date(p.datePaiement).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : (language === 'fr' ? 'En attente' : 'Pending')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-foreground">{(p.montant || 0).toLocaleString()} FCFA</p>
                      <Badge className={p.statut === 'Payé' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {p.statut === 'Payé' ? t('parent.dashboard.paid') : t('parent.dashboard.unpaid')}
                      </Badge>
                    </div>
                  </div>
                  {p.datePaiement && (
                    <div className="mt-3 pt-3 border-t border-green-200 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">{t('parent.payments.date')}</span><br />{new Date(p.datePaiement).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{t('parent.payments.paymentMethod')}</span><br />{p.mode || '-'}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{language === 'fr' ? 'Réf.' : 'Ref.'}</span><br />{p.reference || '-'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Landmark className="w-5 h-5 text-emerald-600" /> {t('payments.feeSchedule')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { type: t('payments.tuition'), montant: 150000, periode: language === 'fr' ? 'Par trimestre' : 'Per term' },
                { type: t('payments.registration'), montant: 25000, periode: language === 'fr' ? 'Annuel' : 'Annual' },
                { type: language === 'fr' ? 'Transport' : 'Transport', montant: 90000, periode: language === 'fr' ? 'Par trimestre' : 'Per term' },
              ].map((fee, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground text-sm">{fee.type}</p>
                    <p className="font-bold text-foreground">{fee.montant.toLocaleString()} FCFA</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{fee.periode}</p>
                </div>
              ))}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-emerald-800 text-sm">{language === 'fr' ? 'Total annuel' : 'Annual Total'}</p>
                  <p className="font-bold text-emerald-800">{(150000 * 3 + 25000 + 90000 * 3).toLocaleString()} FCFA</p>
                </div>
                <p className="text-xs text-emerald-600 mt-1">{language === 'fr' ? 'Scolarité + Inscription + Transport' : 'Tuition + Registration + Transport'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
