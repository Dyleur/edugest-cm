import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {isFr ? 'Conditions d\'Utilisation' : 'Terms of Service'}
          </h1>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? '1. Acceptation des conditions' : '1. Acceptance of Terms'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'En utilisant EduGest CM, vous acceptez les présentes conditions d\'utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.'
                : 'By using EduGest CM, you agree to these terms of service. If you do not accept these terms, please do not use the platform.'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? '2. Description du service' : '2. Service Description'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'EduGest CM est une plateforme de gestion scolaire destinée aux écoles primaires au Cameroun. Elle permet le suivi des présences, notes, paiements et la communication entre parents et enseignants.'
                : 'EduGest CM is a school management platform for primary schools in Cameroon. It enables attendance tracking, grades, payments, and communication between parents and teachers.'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? '3. Responsabilités' : '3. Responsibilities'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Les informations saisies dans la plateforme sont sous la responsabilité des établissements scolaires. EduGest CM ne peut être tenu responsable des erreurs de saisie ou des informations inexactes fournies par les utilisateurs.'
                : 'Information entered in the platform is the responsibility of the schools. EduGest CM cannot be held responsible for input errors or inaccurate information provided by users.'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? '4. Modification des conditions' : '4. Modification of Terms'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des changements importants par email ou via la plateforme.'
                : 'We reserve the right to modify these terms at any time. Users will be notified of important changes by email or via the platform.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
