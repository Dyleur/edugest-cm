import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Award, GraduationCap, TrendingUp, FileText, BookOpen, Printer, Download } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { bulletinsAPI } from '../../services/api';
import { mockBulletins, mockGrades } from '../../data/mock-data';
import { useSelectedChild } from '../../hooks/useSelectedChild';
import { ChildSelector } from '../../components/ui/child-selector';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

function getMoy(notes: { moyenne: number; coefficient: number }[]) {
  const pts = notes.reduce((s, n) => s + n.moyenne * n.coefficient, 0);
  const coeff = notes.reduce((s, n) => s + n.coefficient, 0);
  return coeff > 0 ? pts / coeff : 0;
}

export default function ParentReportCard() {
  const { t, language } = useLanguage();
  const { selected: enfant, selectChild } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [bulletin, setBulletin] = useState<any>(mockBulletins[0]);
  const [notes, setNotes] = useState<any[]>(() => mockGrades.map((n: any) => ({
    matiere: n.matiere, coefficient: n.coefficient, moyenne: n.note,
    noteMax: n.noteMax,
    cours: { libelle: n.matiere, coefficient: n.coefficient },
  })));
  const bulletinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enfant?.matricule) { setLoading(false); return; }
    bulletinsAPI.getByEleve(enfant.matricule, 1)
      .then(data => {
        if (!data) return;
        const d = Array.isArray(data) ? data[0] : data;
        if (d) setBulletin(d);
        const items = Array.isArray(d?.notes) ? d.notes : (Array.isArray(data) ? data : []);
        if (items.length) {
          setNotes(items.map((n: any) => ({
            matiere: n.cours?.libelle || n.matiere || 'Matière',
            coefficient: n.coefficient || n.cours?.coefficient || 1,
            moyenne: n.moyenne ?? n.note ?? 0,
            noteMax: n.noteMax || 20,
            cours: { libelle: n.cours?.libelle || n.matiere || 'Matière', coefficient: n.coefficient || n.cours?.coefficient || 1 },
          })));
        }
      })
      .catch(() => {
        const d = mockBulletins[0];
        setBulletin(d);
        setNotes(mockGrades.map((n: any) => ({ matiere: n.matiere, coefficient: n.coefficient, moyenne: n.note, noteMax: n.noteMax, cours: { libelle: n.matiere, coefficient: n.coefficient } })));
      })
      .finally(() => setLoading(false));
  }, [enfant?.matricule]);

  const moy = notes.length ? getMoy(notes.map(n => ({ moyenne: n.moyenne, coefficient: n.coefficient }))) : 0;

  const downloadPDF = async () => {
    if (!bulletinRef.current) return;
    try {
      const canvas = await html2canvas(bulletinRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`bulletin_${enfant?.matricule || 'eleve'}.pdf`);
      toast.success(language === 'fr' ? 'Bulletin téléchargé avec succès' : 'Report card downloaded');
    } catch {
      toast.error(language === 'fr' ? 'Erreur lors du téléchargement' : 'Download error');
    }
  };

  const radarData = notes.map(n => ({
    matiere: n.matiere.split(' ')[0],
    Note: parseFloat(((n.moyenne / 20) * 100).toFixed(1)),
  }));

  const strengths = notes.filter(n => n.moyenne >= 14).sort((a, b) => b.moyenne - a.moyenne);
  const weaknesses = notes.filter(n => n.moyenne < 13).sort((a, b) => a.moyenne - b.moyenne);

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="print-area" ref={bulletinRef}>
      <Card className="border-border/50 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{t('parent.reportCard.title')}</h1>
                  <ChildSelector onChildChange={(e) => selectChild(e.matricule)} selectedMatricule={enfant?.matricule} />
                </div>
                <p className="text-indigo-200 text-sm">{t('parent.reportCard.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 no-print">
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5 bg-white/20 text-white hover:bg-white/30"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" />
                {language === 'fr' ? 'Imprimer' : 'Print'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5 bg-white/20 text-white hover:bg-white/30"
                onClick={downloadPDF}
              >
                <Download className="w-4 h-4" />
                {language === 'fr' ? 'Télécharger PDF' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('parent.dashboard.overallAverage'), value: notes.length ? `${moy.toFixed(2)}/20` : '-', icon: GraduationCap, color: 'from-indigo-500 to-indigo-600', sub: t('reportCards.overallAverage') },
          { label: t('reportCards.rank'), value: bulletin?.rang ? `${bulletin.rang}${language === 'fr' ? 'ème' : 'th'}` : 'N/A', icon: Award, color: 'from-amber-500 to-amber-600', sub: t('reportCards.comment') },
          { label: language === 'fr' ? 'Appréciation' : 'Comment', value: bulletin?.appreciation?.split(' ').slice(0, 2).join(' ') || 'N/A', icon: TrendingUp, color: 'from-green-500 to-green-600', sub: t('reportCards.comment') },
          { label: language === 'fr' ? 'Matières' : 'Subjects', value: notes.length ? `${notes.filter(n => n.moyenne >= 10).length}/${notes.length}` : '0/0', icon: BookOpen, color: 'from-purple-500 to-purple-600', sub: language === 'fr' ? 'au-dessus de 10' : 'above 10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.sub}</p>
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

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Card className="border-border/50 border-2 border-indigo-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{t('reportCards.preview')}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('parent.childProfile.academicYear')} 2025-2026</p>
                  </div>
                  {enfant && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{enfant.nom} {enfant.prenom}</p>
                      <p className="text-xs text-muted-foreground">{t('students.matricule')}. {enfant.matricule}</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">{t('reportCards.subject')}</th>
                      <th className="text-center px-3 py-3 font-semibold text-muted-foreground">{t('subjects.coefficient')}</th>
                      <th className="text-center px-3 py-3 font-semibold text-muted-foreground">{t('reportCards.grade')}</th>
                      <th className="text-center px-3 py-3 font-semibold text-muted-foreground">{language === 'fr' ? 'Max' : 'Max'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map((n, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                        <td className="px-4 py-2.5 font-medium text-foreground">{n.matiere}</td>
                        <td className="px-3 py-2.5 text-center text-muted-foreground">{n.coefficient}</td>
                        <td className={`px-3 py-2.5 text-center font-bold ${n.moyenne >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                          {n.moyenne.toFixed(2)}
                        </td>
                        <td className="px-3 py-2.5 text-center text-muted-foreground">{n.noteMax}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-indigo-200 bg-indigo-50">
                    <tr>
                      <td className="px-4 py-3 font-bold text-foreground">{t('reportCards.overallAverage')}</td>
                      <td className="px-3 py-3 text-center font-bold text-muted-foreground">
                        {notes.reduce((s, n) => s + n.coefficient, 0)}
                      </td>
                      <td className={`px-3 py-3 text-center font-bold text-lg ${moy >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                        {moy.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>

                {bulletin?.appreciation && (
                  <div className="p-4 border-t bg-amber-50">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">{language === 'fr' ? 'Appréciation' : 'Teacher\'s Comment'}</p>
                        <p className="text-sm text-muted-foreground italic">{bulletin.appreciation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {bulletin?.rang && (
                  <div className="p-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">
                        {bulletin.rang}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {bulletin.rang ? `${bulletin.rang}${language === 'fr' ? 'ème' : 'th'} sur 40 ${language === 'fr' ? 'élèves' : 'students'}` : language === 'fr' ? 'Rang non disponible' : 'Rank unavailable'}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-700">{bulletin.statut}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">{language === 'fr' ? 'Profil académique' : 'Academic Profile'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="matiere" tick={{ fontSize: 11 }} />
                      <Radar name="Note" dataKey="Note" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                      <Tooltip formatter={(val: number) => [`${val}%`, '']} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">{language === 'fr' ? 'Points forts / à améliorer' : 'Strengths / Weaknesses'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">{language === 'fr' ? 'Points forts' : 'Strengths'}</p>
                      {strengths.map((n, i) => (
                        <div key={i} className="flex items-center justify-between mb-1.5 p-2 bg-green-50 rounded-lg">
                          <span className="text-sm text-foreground">{n.matiere}</span>
                          <span className="font-bold text-green-700 text-sm">{n.moyenne.toFixed(2)}/20</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {weaknesses.length > 0 && (
                    <div className="border-t pt-3">
                      <p className="text-xs font-semibold text-orange-700 mb-2 uppercase tracking-wide">{language === 'fr' ? 'À améliorer' : 'To Improve'}</p>
                      {weaknesses.map((n, i) => (
                        <div key={i} className="flex items-center justify-between mb-1.5 p-2 bg-orange-50 rounded-lg">
                          <span className="text-sm text-foreground">{n.matiere}</span>
                          <span className={`font-bold text-sm ${n.moyenne >= 10 ? 'text-orange-600' : 'text-red-600'}`}>
                            {n.moyenne.toFixed(2)}/20
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">{language === 'fr' ? 'Aucun bulletin disponible' : 'No report cards available'}</p>
            <p className="text-sm text-muted-foreground mt-1">{language === 'fr' ? 'Les bulletins de votre enfant apparaîtront ici' : 'Your child\'s report cards will appear here'}</p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
