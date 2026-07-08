import { useState, useEffect, useRef } from 'react';
import { Search, Download, Eye, FileText, Award, TrendingUp, Printer, Receipt, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { bulletinsAPI, classesAPI } from '../services/api';
import { mockBulletins } from '../data/mock-data';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ReportCards() {
  const { t, language } = useLanguage();
  const [bulletins, setBulletins] = useState<any[]>(mockBulletins);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    classesAPI.list()
      .then(async classes => {
        const classesList = Array.isArray(classes) ? classes : (classes?.data || []);
        const allBulletins: any[] = [];
        for (const cls of classesList.slice(0, 3)) {
          try {
            const data = await bulletinsAPI.getByClasse(cls.idClasse || cls.id);
            const items = Array.isArray(data) ? data : (data?.data || []);
            items.forEach((b: any) => allBulletins.push({ ...b, classe: cls.libelle }));
          } catch { /* skip class without bulletins */ }
        }
        setBulletins(allBulletins);
      })
      .catch(() => { setBulletins(mockBulletins); setLoading(false); })
      .finally(() => setLoading(false));
  }, []);

  const downloadPDF = async (bulletin: any) => {
    try {
      const data = bulletin.matieres && bulletin.matieres.length > 0
        ? bulletin
        : await bulletinsAPI.getByEleve(bulletin.matricule, 0).then(d => d?.data || d).catch(() => bulletin);

      const matieres = data.matieres || [];
      if (!matieres.length) {
        toast.error(language === 'fr'
          ? `Aucune note disponible pour ${bulletin.nom}. Le bulletin ne peut pas être généré.`
          : `No grades available for ${bulletin.nom}. The report card cannot be generated.`);
        return;
      }

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div style="width: 800px; padding: 40px; font-family: Arial, sans-serif; background: white;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3B82F6; padding-bottom: 20px;">
            <h1 style="font-size: 24px; color: #1e3a5f; margin: 0;">BULLETIN DE NOTES</h1>
            <p style="font-size: 14px; color: #666; margin: 5px 0 0;">Année Académique 2024-2025</p>
          </div>
          <div style="margin-bottom: 20px;">
            <p style="font-size: 14px; margin: 3px 0;"><strong>Élève :</strong> ${bulletin.nom || bulletin.prenom || 'N/A'}</p>
            <p style="font-size: 14px; margin: 3px 0;"><strong>Classe :</strong> ${bulletin.classe || 'N/A'}</p>
            <p style="font-size: 14px; margin: 3px 0;"><strong>Matricule :</strong> ${bulletin.matricule || 'N/A'}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background: #3B82F6; color: white;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Matière</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Note</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Coefficient</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">/20</th>
              </tr>
            </thead>
            <tbody>
              ${matieres.map((m: any) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${m.matiere}</td>
                  <td style="padding: 8px; text-align: center; border: 1px solid #ddd; font-weight: bold;">${m.note ?? '-'}</td>
                  <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${m.coefficient || 1}</td>
                  <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${m.noteMax || 20}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="margin-top: 20px; padding: 15px; background: #f0f7ff; border-radius: 8px; text-align: center;">
            <p style="font-size: 18px; margin: 0;"><strong>Moyenne Générale :</strong> 
              <span style="color: ${data.moyenne >= 10 ? '#059669' : '#dc2626'}; font-size: 22px;">${data.moyenne || 'N/A'}</span> / 20
            </p>
          </div>
          <div style="margin-top: 30px; border-top: 2px solid #ddd; padding-top: 15px; font-size: 12px; color: #999; text-align: center;">
            <p>Document généré automatiquement - EduGest</p>
          </div>
        </div>
      `;
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true });
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`bulletin_${bulletin.matricule || bulletin.nom || 'eleve'}.pdf`);

      toast.success(language === 'fr' ? 'PDF téléchargé avec succès' : 'PDF downloaded successfully');
    } catch (err) {
      toast.error(language === 'fr'
        ? 'Erreur lors de la génération du PDF'
        : 'Error generating PDF');
    }
  };

  const downloadAllPDF = async () => {
    if (!bulletins.length) {
      toast.error(language === 'fr' ? 'Aucun bulletin à exporter' : 'No report cards to export');
      return;
    }
    for (const b of bulletins) {
      await downloadPDF(b);
    }
  };

  const overallAvg = bulletins.length > 0
    ? (bulletins.reduce((s: number, b: any) => s + (Number(b.moyenne) || 0), 0) / bulletins.length).toFixed(1)
    : '0';

  const successRate = bulletins.filter(b => Number(b.moyenne) >= 10).length;
  const successPct = bulletins.length > 0 ? Math.round(successRate / bulletins.length * 100) : 0;
  const filteredBulletins = bulletins.filter(b =>
    (b.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.classe || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.matricule || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: t('reportCards.generated'), value: bulletins.length.toString(), sub: language === 'fr' ? 'Bulletins générés' : 'Generated', icon: FileText, color: 'from-blue-400 to-blue-500', delay: '0s' },
          { label: t('reportCards.overallAverage'), value: overallAvg, sub: '/20', icon: Award, color: 'from-violet-500 to-violet-600', delay: '0.1s' },
          { label: t('reportCards.successRate'), value: `${successPct}%`, sub: `${successRate}/${bulletins.length}`, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600', delay: '0.15s' },
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

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input type="text" placeholder={t('reportCards.search')} className="pl-9 h-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="w-3.5 h-3.5" />
            {language === 'fr' ? 'Imprimer' : 'Print'}
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={downloadAllPDF}>
            <Download className="w-3.5 h-3.5" />
            {t('reportCards.exportAll')}
          </Button>
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              {t('reportCards.preview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : bulletins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Receipt className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Aucun bulletin disponible' : 'No report cards available'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('reportCards.student')}</th>
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('students.class')}</th>
                      <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('reportCards.grade')}</th>
                      <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('reportCards.rank')}</th>
                      <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('reportCards.comment')}</th>
                      <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('common.status')}</th>
                      <th className="text-right p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{language === 'fr' ? 'Actions' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBulletins.map((b, i) => (
                      <tr key={b.matricule} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {b.nom?.split(' ').map((s: string) => s[0]).join('').substring(0, 2) || 'NA'}
                            </div>
                            <span className="font-medium text-foreground text-sm">{b.nom}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">{b.classe}</Badge>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`font-bold text-sm ${Number(b.moyenne) >= 10 ? 'text-success' : 'text-destructive'}`}>
                            {b.moyenne?.toFixed(1) || '-'}
                          </span>
                        </td>
                        <td className="p-3 text-center text-sm text-muted-foreground">{b.rang}</td>
                        <td className="p-3 text-sm text-muted-foreground max-w-[200px] truncate">{b.appreciation || '-'}</td>
                        <td className="p-3 text-center">
                          <Badge className="bg-success/10 text-success border-success/20 text-xs">{b.statut || (b.moyenne >= 10 ? 'Admis' : 'Échec')}</Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title={language === 'fr' ? 'Voir le bulletin' : 'View report card'} onClick={() => downloadPDF(b)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title={language === 'fr' ? 'Télécharger le PDF' : 'Download PDF'} onClick={() => downloadPDF(b)}>
                            <Download className="w-3.5 h-3.5" />
                          </Button>
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
    </div>
  );
}
