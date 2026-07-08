import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, Search, Plus, Flag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { disciplineAPI } from '../services/api';
import { mockDiscipline } from '../data/mock-data';
import ReportDisciplineModal from '../components/modals/ReportDisciplineModal';

function deriveGravite(points) {
  if (points >= 8) return 'Grave';
  if (points >= 4) return 'Moyenne';
  return 'Mineure';
}

function mapIncident(r) {
  const eleve = r.Eleve || r.eleve;
  const nomEleve = eleve ? `${eleve.nom} ${eleve.prenom}` : (r.matricule || '');
  const points = Math.abs(r.points || 0);
  return {
    id: r.idDiscipline || r.idRapport,
    eleve: nomEleve,
    matricule: r.matricule,
    type: r.typeIncident || r.type,
    gravite: deriveGravite(points),
    points,
    date: r.dateIncident || '',
    statut: r.statut || 'En attente',
    description: r.description || '',
    sanction: r.sanction || '',
  };
}

export default function Discipline() {
  const { t, language } = useLanguage();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    disciplineAPI.list()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setIncidents(list.map(mapIncident));
      })
      .catch(() => { setIncidents(mockDiscipline.map(mapIncident)); })
      .finally(() => setLoading(false));
  }, []);

  const filteredIncidents = incidents.filter(inc =>
    `${inc.eleve} ${inc.type} ${inc.gravite} ${inc.statut}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: incidents.length,
    mineurs: incidents.filter(i => i.gravite === 'Mineure').length,
    moyens: incidents.filter(i => i.gravite === 'Moyenne').length,
    graves: incidents.filter(i => i.gravite === 'Grave').length,
  };

  const graviteColors: Record<string, string> = {
    'Mineure': 'bg-success/10 text-success border-success/20',
    'Moyenne': 'bg-warning/10 text-warning border-warning/20',
    'Grave': 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const statutColors: Record<string, string> = {
    'Résolu': 'bg-success/10 text-success border-success/20',
    'En cours': 'bg-warning/10 text-warning border-warning/20',
    'En attente': 'bg-muted text-muted-foreground border-border/50',
    'Traité': 'bg-info/10 text-info border-info/20',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('discipline.total'), value: stats.total.toString(), sub: language === 'fr' ? 'Incidents' : 'Incidents', icon: ShieldAlert, color: 'from-blue-400 to-blue-500', delay: '0s' },
          { label: t('discipline.minor'), value: stats.mineurs.toString(), sub: language === 'fr' ? 'Infractions mineures' : 'Minor offenses', icon: AlertCircle, color: 'from-emerald-500 to-emerald-600', delay: '0.1s' },
          { label: t('discipline.moderate'), value: stats.moyens.toString(), sub: language === 'fr' ? 'Infractions moyennes' : 'Moderate offenses', icon: AlertTriangle, color: 'from-amber-500 to-amber-600', delay: '0.15s' },
          { label: t('discipline.severe'), value: stats.graves.toString(), sub: language === 'fr' ? 'Infractions graves' : 'Severe offenses', icon: Flag, color: 'from-rose-500 to-rose-600', delay: '0.2s' },
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
          <Input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={language === 'fr' ? 'Rechercher un incident...' : 'Search incidents...'}
            className="pl-9 h-9"
          />
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowModal(true)}>
          <Plus className="w-3.5 h-3.5" />
          {t('discipline.report')}
        </Button>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              {t('discipline.recent')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShieldAlert className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Aucun incident trouvé' : 'No incidents found'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('students.fullName')}</th>
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'fr' ? 'Type' : 'Type'}</th>
                      <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'fr' ? 'Gravité' : 'Severity'}</th>
                      <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Points</th>
                      <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'fr' ? 'Date' : 'Date'}</th>
                      <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('common.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncidents.map((incident) => (
                      <tr key={incident.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {incident.eleve ? incident.eleve.split(' ').map((s: string) => s[0]).join('').substring(0, 2) : 'NA'}
                            </div>
                            <span className="font-medium text-foreground text-sm">{incident.eleve || incident.matricule}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{incident.type}</td>
                        <td className="p-3 text-center">
                          <Badge className={`${graviteColors[incident.gravite] || ''} text-xs`}>{incident.gravite}</Badge>
                        </td>
                        <td className="p-3 text-center font-mono text-sm text-foreground">{incident.points}</td>
                        <td className="p-3 text-center text-sm text-muted-foreground">
                          {incident.date ? new Date(incident.date).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-3 text-center">
                          <Badge className={`${statutColors[incident.statut] || ''} text-xs`}>{incident.statut}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ReportDisciplineModal open={showModal} onOpenChange={setShowModal} onSuccess={() => {
        disciplineAPI.list().then(data => {
          const list = Array.isArray(data) ? data : [];
          setIncidents(list.map(mapIncident));
        }).catch(() => {});
      }} />
    </div>
  );
}
