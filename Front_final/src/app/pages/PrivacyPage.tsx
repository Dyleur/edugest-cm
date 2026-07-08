import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
          </h1>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? '1. Collecte des informations' : '1. Information Collection'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Nous collectons les informations nécessaires au fonctionnement de la plateforme, notamment les noms, prénoms, adresses email, et informations scolaires des élèves et du personnel enseignant.'
                : 'We collect information necessary for the platform\'s operation, including names, email addresses, and academic information of students and teaching staff.'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? '2. Utilisation des données' : '2. Use of Data'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Les données collectées sont utilisées uniquement pour la gestion scolaire : suivi des présences, notes, paiements, et communication entre parents et enseignants.'
                : 'Collected data is used solely for school management: attendance tracking, grades, payments, and communication between parents and teachers.'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? '3. Protection des données' : '3. Data Protection'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données personnelles contre tout accès non autorisé.'
                : 'We implement technical and organizational security measures to protect your personal data against unauthorized access.'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {isFr ? '4. Vos droits' : '4. Your Rights'}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {isFr
                ? 'Vous avez le droit d\'accéder, de modifier ou de supprimer vos données personnelles à tout moment. Pour exercer ces droits, contactez-nous à contact@edugestcm.com.'
                : 'You have the right to access, modify or delete your personal data at any time. To exercise these rights, contact us at contact@edugestcm.com.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
