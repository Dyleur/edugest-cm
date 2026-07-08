import { useState, useEffect } from 'react';
import { BarChart3, FileText, Download, Eye, Calendar, Users, GraduationCap, DollarSign, ShieldAlert, Loader2, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { rapportsAPI } from '../services/api';
import jsPDF from 'jspdf';

const DEMO_DATA: Record<string, any> = {
  effectifs: { success: true, data: [
    { classe: 'CP', cycle: 'Primaire', effectif: 45 },
    { classe: 'CE1', cycle: 'Primaire', effectif: 38 },
    { classe: 'CE2', cycle: 'Primaire', effectif: 42 },
    { classe: 'CM1', cycle: 'Primaire', effectif: 36 },
    { classe: 'CM2', cycle: 'Primaire', effectif: 40 },
  ]},
  resultats: { success: true, data: [
    { matricule: 'E001', nom: 'Kamga', prenom: 'Pierre', moyenne: 14.5 },
    { matricule: 'E002', nom: 'Nganou', prenom: 'Sophie', moyenne: 16.2 },
    { matricule: 'E003', nom: 'Tchinda', prenom: 'Jean', moyenne: 12.8 },
    { matricule: 'E004', nom: 'Fotso', prenom: 'Marie', moyenne: 17.1 },
  ]},
  presences: { success: true, data: [
    { matricule: 'E001', total: 42 }, { matricule: 'E002', total: 44 },
    { matricule: 'E003', total: 40 }, { matricule: 'E004', total: 45 },
  ]},
  finances: { success: true, data: { totalEncaissements: 2580000, nombrePaiements: 186, totalEleves: 201 }},
  discipline: { success: true, data: [
    { id: 1, libelle: 'Retard', points: -2, Eleve: { nom: 'Kamga', prenom: 'Pierre', matricule: 'E001' } },
    { id: 2, libelle: 'Absence non justifiée', points: -5, Eleve: { nom: 'Nganou', prenom: 'Sophie', matricule: 'E002' } },
  ]},
};

export default function Reports() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<Record<string, any>>({});
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState('PDF');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const results = await Promise.allSettled([
          rapportsAPI.effectifs(), rapportsAPI.resultats(), rapportsAPI.presences(),
          rapportsAPI.finances(), rapportsAPI.discipline(),
        ]);
        const keys = ['effectifs', 'resultats', 'presences', 'finances', 'discipline'];
        const merged: Record<string, any> = {};
        results.forEach((r, i) => { if (r.status === 'fulfilled') merged[keys[i]] = r.value; });
        setReportData(Object.keys(merged).length > 0 ? merged : DEMO_DATA);
      } catch {
        setReportData(DEMO_DATA);
      } finally { setLoading(false); }
    };
    fetchReports();
  }, []);

  const countItems = (obj: any): number => {
    if (!obj?.success) return 0;
    const d = obj.data;
    if (Array.isArray(d)) return d.length;
    if (typeof d === 'object') return Object.keys(d).length;
    return typeof d === 'number' ? d : 0;
  };
  const total = Object.values(reportData).reduce((s, i) => s + countItems(i), 0);

  const reportTypes = [
    { key: 'effectifs', icon: Users, label: language === 'fr' ? 'Effectifs' : 'Enrollment', desc: language === 'fr' ? 'Par classe et cycle' : 'By class and cycle', color: 'from-blue-400 to-blue-500' },
    { key: 'resultats', icon: BarChart3, label: language === 'fr' ? 'Résultats' : 'Results', desc: language === 'fr' ? 'Moyennes générales' : 'Averages', color: 'from-violet-500 to-violet-600' },
    { key: 'presences', icon: Users, label: language === 'fr' ? 'Présences' : 'Attendance', desc: language === 'fr' ? 'Taux de présence' : 'Attendance rate', color: 'from-emerald-500 to-emerald-600' },
    { key: 'finances', icon: DollarSign, label: language === 'fr' ? 'Finances' : 'Finances', desc: language === 'fr' ? 'Situation financière' : 'Financial status', color: 'from-amber-500 to-amber-600' },
    { key: 'discipline', icon: ShieldAlert, label: language === 'fr' ? 'Discipline' : 'Discipline', desc: language === 'fr' ? 'Incidents et sanctions' : 'Incidents', color: 'from-rose-500 to-rose-600' },
    { key: 'quarterly', icon: GraduationCap, label: language === 'fr' ? 'Rapport trimestriel' : 'Quarterly report', desc: language === 'fr' ? 'Rapport complet' : 'Complete report', color: 'from-cyan-500 to-cyan-600' },
  ];

  function buildPdfRows(key: string): string[][] {
    const data = reportData[key]?.data;
    if (!data) return [['Aucune donnée', '']];
    if (key === 'effectifs' && Array.isArray(data)) {
      return [['Classe', 'Cycle', 'Effectif'], ...data.map((d: any) => [d.classe, d.cycle, String(d.effectif)])];
    }
    if (key === 'resultats' && Array.isArray(data)) {
      return [['Matricule', 'Nom', 'Moyenne'], ...data.map((d: any) => [d.matricule, `${d.prenom} ${d.nom}`, String(d.moyenne)])];
    }
    if (key === 'presences' && Array.isArray(data)) {
      return [['Matricule', 'Total'], ...data.map((d: any) => [d.matricule, String(d.total)])];
    }
    if (key === 'finances' && typeof data === 'object') {
      return [
        ['Indicateur', 'Valeur'],
        ['Total encaissements', `${(data.totalEncaissements || 0).toLocaleString()} FCFA`],
        ['Nombre de paiements', String(data.nombrePaiements || 0)],
        ['Total élèves', String(data.totalEleves || 0)],
      ];
    }
    if (key === 'discipline' && Array.isArray(data)) {
      return [['Élève', 'Incident', 'Points'], ...data.map((d: any) => [
        d.Eleve ? `${d.Eleve.prenom} ${d.Eleve.nom}` : '-', d.libelle || '-', String(d.points || 0),
      ])];
    }
    if (key === 'quarterly') {
      const e = reportData.effectifs?.data;
      const r = reportData.resultats?.data;
      const f = reportData.finances?.data;
      const totalEl = Array.isArray(e) ? e.reduce((s: number, d: any) => s + (d.effectif || 0), 0) : 0;
      const avg = Array.isArray(r) && r.length > 0 ? (r.reduce((s: number, d: any) => s + parseFloat(d.moyenne), 0) / r.length).toFixed(2) : '-';
      return [
        ['Indicateur', 'Valeur'],
        ['Effectifs total', String(totalEl)],
        ['Moyenne générale', `${avg}/20`],
        ['Encaissements', `${f?.totalEncaissements?.toLocaleString() || 0} FCFA`],
        ['Paiements', String(f?.nombrePaiements || 0)],
        ['Élèves actifs', String(f?.totalEleves || 0)],
      ];
    }
    return [['Données non disponibles', '']];
  }

  async function generatePdf(key: string) {
    setGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = 190;
      let y = 20;

      pdf.setFontSize(16);
      pdf.text('EduGest CM', pageW / 2, y, { align: 'center' });
      y += 8;
      pdf.setFontSize(11);
      const title = reportTypes.find(r => r.key === key)?.label || key;
      pdf.text(title, pageW / 2, y, { align: 'center' });
      y += 5;
      pdf.setFontSize(9);
      pdf.text(`Période: Trimestre 2 - 2025-2026`, pageW / 2, y, { align: 'center' });
      y += 10;

      const rows = buildPdfRows(key);
      if (rows.length <= 1) {
        pdf.text('Aucune donnée disponible', 10, y);
      } else {
        const colCount = rows[0].length;
        const colW = pageW / colCount;
        pdf.setFontSize(9);
        rows.forEach((row, ri) => {
          if (y > 270) { pdf.addPage(); y = 20; }
          pdf.setFont(undefined, ri === 0 ? 'bold' : 'normal');
          row.forEach((cell, ci) => {
            pdf.text(cell, 10 + ci * colW, y);
          });
          y += 6;
          if (ri === 0) { pdf.line(10, y - 3, 200, y - 3); }
        });
      }

      pdf.save(`rapport-${key}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    } finally { setGenerating(false); }
  }

  function generateCsv(key: string) {
    setGenerating(true);
    try {
      const rows = buildPdfRows(key);
      const csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${key}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally { setGenerating(false); }
  }

  function renderPreviewContent(key: string) {
    const data = reportData[key]?.data;
    if (!data) return <p className="text-muted-foreground text-sm">{language === 'fr' ? 'Aucune donnée' : 'No data'}</p>;

    if (key === 'effectifs' && Array.isArray(data)) {
      return (
        <table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-1">Classe</th><th className="text-left py-1">Cycle</th><th className="text-right py-1">Effectif</th></tr></thead>
        <tbody>{data.map((d: any, i: number) => <tr key={i} className="border-b border-border/50"><td className="py-1">{d.classe}</td><td className="py-1">{d.cycle}</td><td className="text-right py-1 font-medium">{d.effectif}</td></tr>)}</tbody></table>
      );
    }
    if (key === 'resultats' && Array.isArray(data)) {
      return (
        <table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-1">Matricule</th><th className="text-left py-1">Nom</th><th className="text-right py-1">Moyenne</th></tr></thead>
        <tbody>{data.map((d: any, i: number) => <tr key={i} className="border-b border-border/50"><td className="py-1">{d.matricule}</td><td className="py-1">{d.prenom} {d.nom}</td><td className="text-right py-1 font-medium">{d.moyenne}</td></tr>)}</tbody></table>
      );
    }
    if (key === 'presences' && Array.isArray(data)) {
      return (
        <table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-1">Matricule</th><th className="text-right py-1">Total</th></tr></thead>
        <tbody>{data.map((d: any, i: number) => <tr key={i} className="border-b border-border/50"><td className="py-1">{d.matricule}</td><td className="text-right py-1 font-medium">{d.total}</td></tr>)}</tbody></table>
      );
    }
    if (key === 'finances' && typeof data === 'object') {
      return (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-border/50 pb-1"><span>Total encaissements</span><span className="font-medium">{(data.totalEncaissements || 0).toLocaleString()} FCFA</span></div>
          <div className="flex justify-between border-b border-border/50 pb-1"><span>Nombre de paiements</span><span className="font-medium">{data.nombrePaiements || 0}</span></div>
          <div className="flex justify-between"><span>Total élèves</span><span className="font-medium">{data.totalEleves || 0}</span></div>
        </div>
      );
    }
    if (key === 'discipline' && Array.isArray(data)) {
      return (
        <table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-1">Élève</th><th className="text-left py-1">Incident</th><th className="text-right py-1">Points</th></tr></thead>
        <tbody>{data.map((d: any, i: number) => <tr key={i} className="border-b border-border/50"><td className="py-1">{d.Eleve?.prenom} {d.Eleve?.nom}</td><td className="py-1">{d.libelle}</td><td className="text-right py-1 font-medium text-red-500">{d.points}</td></tr>)}</tbody></table>
      );
    }
    if (key === 'quarterly') {
      const e = reportData.effectifs?.data;
      const r = reportData.resultats?.data;
      const f = reportData.finances?.data;
      const totalEl = Array.isArray(e) ? e.reduce((s: number, d: any) => s + (d.effectif || 0), 0) : 0;
      const avg = Array.isArray(r) && r.length > 0 ? (r.reduce((s: number, d: any) => s + parseFloat(d.moyenne), 0) / r.length).toFixed(2) : '-';
      return (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-border/50 pb-1"><span>Effectifs total</span><span className="font-medium">{totalEl} élèves</span></div>
          <div className="flex justify-between border-b border-border/50 pb-1"><span>Moyenne générale</span><span className="font-medium">{avg}/20</span></div>
          <div className="flex justify-between border-b border-border/50 pb-1"><span>Encaissements</span><span className="font-medium">{f?.totalEncaissements?.toLocaleString() || 0} FCFA</span></div>
          <div className="flex justify-between"><span>Élèves actifs</span><span className="font-medium">{f?.totalEleves || 0}</span></div>
        </div>
      );
    }
    return <p className="text-muted-foreground text-sm">{language === 'fr' ? 'Données non disponibles' : 'Data not available'}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: language === 'fr' ? 'Disponibles' : 'Available', value: String(reportTypes.length), sub: language === 'fr' ? 'Types' : 'Types', icon: FileText, color: 'from-blue-400 to-blue-500' },
          { label: language === 'fr' ? 'Données' : 'Data', value: loading ? '...' : String(total), sub: language === 'fr' ? 'Entrées' : 'Entries', icon: BarChart3, color: 'from-violet-500 to-violet-600' },
          { label: language === 'fr' ? 'Période' : 'Period', value: 'T2', sub: '2025-2026', icon: Calendar, color: 'from-emerald-500 to-emerald-600' },
          { label: language === 'fr' ? 'Statut' : 'Status', value: loading ? '...' : 'OK', sub: language === 'fr' ? 'Données prêtes' : 'Ready', icon: FileText, color: 'from-amber-500 to-amber-600' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                {language === 'fr' ? 'Rapports disponibles' : 'Available reports'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {reportTypes.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{r.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewKey(r.key)} title={language === 'fr' ? 'Aperçu' : 'Preview'}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => generatePdf(r.key)} disabled={generating} title={language === 'fr' ? 'Télécharger PDF' : 'Download PDF'}>
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {language === 'fr' ? 'Générer un rapport' : 'Generate report'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{language === 'fr' ? 'Période' : 'Period'}</label>
                  <select className="w-full h-9 rounded-lg border border-input bg-input-background px-3 text-sm text-foreground">
                    <option>Trimestre 2 - 2025-2026</option>
                    <option>Trimestre 1 - 2025-2026</option>
                    <option>{language === 'fr' ? 'Année complète' : 'Full Year'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{language === 'fr' ? 'Format' : 'Format'}</label>
                  <select value={format} onChange={e => setFormat(e.target.value)} className="w-full h-9 rounded-lg border border-input bg-input-background px-3 text-sm text-foreground">
                    <option>PDF</option>
                    <option>Excel (.csv)</option>
                    <option>CSV</option>
                  </select>
                </div>
              </div>
              <Button size="sm" className="gap-1.5 w-full" onClick={() => format === 'PDF' ? generatePdf('quarterly') : generateCsv('quarterly')} disabled={generating}>
                {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                {language === 'fr' ? 'Générer le rapport trimestriel' : 'Generate quarterly report'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {language === 'fr' ? `Le rapport sera téléchargé au format ${format}` : `The report will be downloaded as ${format}`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {previewKey && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPreviewKey(null)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                {reportTypes.find(r => r.key === previewKey)?.label || previewKey}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => generatePdf(previewKey)} disabled={generating} title={language === 'fr' ? 'Télécharger PDF' : 'Download PDF'}>
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <button onClick={() => setPreviewKey(null)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold">EduGest CM</h2>
                <p className="text-sm text-muted-foreground">{reportTypes.find(r => r.key === previewKey)?.label || previewKey}</p>
                <p className="text-xs text-muted-foreground">Trimestre 2 - 2025-2026</p>
                <hr className="my-3 border-border" />
              </div>
              {renderPreviewContent(previewKey)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
