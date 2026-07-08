import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router';
import { ArrowLeft, Scale } from 'lucide-react';

export default function LegalPage() {
  const { isFr } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {isFr ? 'Retour à l\'accueil' : 'Back to home'}
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {isFr ? 'Mentions Légales' : 'Legal Notice'}
          </h1>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? 'Éditeur de la plateforme' : 'Platform Publisher'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              EduGest CM<br />
              Yaoundé, Cameroun<br />
              contact@edugestcm.com<br />
              +237 691 000 000
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? 'Hébergement' : 'Hosting'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'La plateforme est hébergée par des serveurs sécurisés. Les données sont stockées conformément aux lois en vigueur au Cameroun.'
                : 'The platform is hosted on secure servers. Data is stored in accordance with applicable laws in Cameroon.'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? 'Propriété intellectuelle' : 'Intellectual Property'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'L\'ensemble du contenu de la plateforme (textes, logos, designs) est protégé par le droit d\'auteur. Toute reproduction ou utilisation sans autorisation est interdite.'
                : 'All content on the platform (texts, logos, designs) is protected by copyright. Any reproduction or use without authorization is prohibited.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
