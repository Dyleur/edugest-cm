import { useState, useEffect } from 'react';
import { Download, FileText, TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const rapports = [
  { id: 1, titre: 'Effectifs par classe', description: 'Rapport détaillé des inscriptions et effectifs', icon: Users, couleur: 'bg-blue-500', type: 'PDF/Excel' },
  { id: 2, titre: 'Résultats académiques', description: 'Moyennes, classements et statistiques de réussite', icon: Award, couleur: 'bg-green-500', type: 'PDF/Excel' },
  { id: 3, titre: 'Taux de présence', description: 'Assiduité et statistiques d\'absences', icon: TrendingUp, couleur: 'bg-purple-500', type: 'PDF/Excel' },
  { id: 4, titre: 'Situation financière', description: 'Encaissements, impayés et tableau de bord financier', icon: DollarSign, couleur: 'bg-emerald-500', type: 'PDF/Excel' },
  { id: 5, titre: 'Incidents disciplinaires', description: 'Synthèse des rapports et sanctions', icon: FileText, couleur: 'bg-amber-500', type: 'PDF/Excel' },
  { id: 6, titre: 'Rapport trimestriel complet', description: 'Vue d\'ensemble complète de l\'établissement', icon: FileText, couleur: 'bg-cyan-500', type: 'PDF' },
];

export default function Reports() {
  const [stats] = useState([
    { label: 'Rapports disponibles', value: rapports.length.toString(), change: 'Différents types', icon: FileText },
    { label: 'Types de rapports', value: '5', change: 'Effectifs, Résultats, Présences, Finances, Discipline', icon: Download },
    { label: 'Formats', value: 'PDF/Excel', change: 'Exportable', icon: TrendingUp },
  ]);

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1581343191085-f2ded7b8d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzY2hvb2wlMjBzdXBwbGllcyUyMGVkdWNhdGlvbiUyMGNvbG9yZnVsfGVufDF8fHx8MTc3NzQ1NzkwN3ww&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-700/70" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">Rapports & Exports</h1>
            <p className="text-lg">Génération de rapports et analyses statistiques</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className="bg-slate-500 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Rapports disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rapports.map((rapport) => {
            const Icon = rapport.icon;
            return (
              <Card key={rapport.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`${rapport.couleur} p-4 rounded-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{rapport.titre}</h3>
                      <p className="text-sm text-gray-600 mb-3">{rapport.description}</p>
                      <Badge variant="outline">{rapport.type}</Badge>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button className="flex-1 gap-2" variant="outline">
                      <FileText className="w-4 h-4" /> Aperçu
                    </Button>
                    <Button className="flex-1 gap-2 bg-slate-700 hover:bg-slate-800">
                      <Download className="w-4 h-4" /> Exporter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { nom: 'Rapport effectifs - Trimestre 2', date: '2026-04-28 15:32', format: 'PDF', taille: '2.3 MB' },
              { nom: 'Résultats académiques - CM2', date: '2026-04-27 10:15', format: 'Excel', taille: '1.8 MB' },
              { nom: 'Situation financière - Avril 2026', date: '2026-04-25 14:20', format: 'PDF', taille: '3.1 MB' },
            ].map((export_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{export_.nom}</h4>
                    <p className="text-xs text-gray-600 mt-1">{export_.date} • {export_.format} • {export_.taille}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="gap-2">
                  <Download className="w-4 h-4" /> Télécharger
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
