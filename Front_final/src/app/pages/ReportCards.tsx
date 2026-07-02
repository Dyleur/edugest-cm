import { useState, useEffect } from 'react';
import { Download, Eye, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { bulletinsAPI, classesAPI } from '../services/api';

export default function ReportCards() {
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    classesAPI.list()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setClasses(list);
        if (list.length > 0) setSelectedClasse(list[0].idClasse.toString());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClasse) return;
    bulletinsAPI.getByClasse(parseInt(selectedClasse))
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setBulletins(list.map((b: any, i: number) => ({
          matricule: b.matricule || b.Eleve?.matricule || `2025${String(i+1).padStart(4, '0')}`,
          nom: b.eleve ? `${b.eleve.nom} ${b.eleve.prenom}` : b.nom || `Élève ${i+1}`,
          classe: b.classe?.libelle || b.Classe?.libelle || classes.find(c => c.idClasse.toString() === selectedClasse)?.libelle || '',
          moyenne: b.moyenneGenerale || b.moyenne || 0,
          rang: b.rang || 0,
          appreciation: b.appreciation || 'Bulletin disponible',
          statut: 'Disponible',
        })));
      })
      .catch(() => {});
  }, [selectedClasse]);

  const moyGen = bulletins.length
    ? (bulletins.reduce((sum, b) => sum + (b.moyenne || 0), 0) / bulletins.length).toFixed(1)
    : 'N/A';

  const reussite = bulletins.length
    ? Math.round((bulletins.filter(b => (b.moyenne || 0) >= 10).length / bulletins.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div
        className="relative h-48 rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1595315342828-f5c4749649ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwYm9va3MlMjBsaWJyYXJ5fGVufDF8fHx8MTc3NzQ1NzkwN3ww&ixlib=rb-4.1.0&q=80&w=1080)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
        <div className="relative h-full flex items-center px-8 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">Bulletins Scolaires</h1>
            <p className="text-lg">Consultation et téléchargement des bulletins</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input type="text" placeholder="Rechercher un bulletin..." className="pl-10" />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Classe:</span>
            <select
              className="border p-1 rounded"
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
            >
              {classes.map((c: any) => (
                <option key={c.idClasse} value={c.idClasse}>{c.libelle}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Exporter tout (PDF)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Bulletins disponibles</p>
            <p className="text-3xl font-bold mt-2">{bulletins.length}</p>
            <p className="text-xs opacity-75 mt-1">Classe sélectionnée</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Moyenne générale</p>
            <p className="text-3xl font-bold mt-2">{moyGen}/20</p>
            <p className="text-xs opacity-75 mt-1">Classe</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-90">Taux de réussite</p>
            <p className="text-3xl font-bold mt-2">{reussite}%</p>
            <p className="text-xs opacity-75 mt-1">Moyenne ≥ 10</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <span>Bulletins</span>
              <select
                className="text-sm font-normal border p-1 rounded"
                value={selectedClasse}
                onChange={(e) => setSelectedClasse(e.target.value)}
              >
                {classes.map((c: any) => (
                  <option key={c.idClasse} value={c.idClasse}>{c.libelle}</option>
                ))}
              </select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bulletins.map((bulletin: any) => (
              <div
                key={bulletin.matricule}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {bulletin.rang || '-'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{bulletin.nom}</h3>
                      <Badge variant="outline">{bulletin.classe}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{bulletin.matricule}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-600">
                      {bulletin.moyenne ? `${bulletin.moyenne}/20` : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">{bulletin.appreciation}</p>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" /> Voir
                  </Button>
                  <Button size="sm" className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                    <Download className="w-4 h-4" /> PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
