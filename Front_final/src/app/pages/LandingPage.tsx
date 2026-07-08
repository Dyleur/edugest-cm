import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/ui/language-switcher';
import {
  GraduationCap, Users, School, BookOpen, ClipboardCheck,
  BarChart3, Shield, Bell, ChevronRight, Menu, X, Check,
  Star, ChevronDown, Mail, Phone, MapPin, ArrowRight,
  CreditCard, CalendarCheck, FileText, MessageSquare
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isFr = language === 'fr';

  const features = [
    {
      icon: Users,
      title: isFr ? 'Gestion des élèves' : 'Student Management',
      desc: isFr ? 'Inscriptions, dossiers, suivis individualisés et historiques complets.' : 'Enrollments, records, individualized tracking and complete histories.',
      color: 'from-indigo-500 to-indigo-600',
      gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent'
    },
    {
      icon: GraduationCap,
      title: isFr ? 'Gestion des enseignants' : 'Teacher Management',
      desc: isFr ? 'Affectations, emplois du temps et suivi des activités pédagogiques.' : 'Assignments, schedules and pedagogical activity tracking.',
      color: 'from-violet-500 to-violet-600',
      gradient: 'from-violet-500/20 via-violet-500/5 to-transparent'
    },
    {
      icon: ClipboardCheck,
      title: isFr ? 'Suivi des présences' : 'Attendance Tracking',
      desc: isFr ? 'Feuilles d\'appel numériques, statistiques et notifications automatiques.' : 'Digital call sheets, statistics and automatic notifications.',
      color: 'from-emerald-500 to-emerald-600',
      gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent'
    },
    {
      icon: BarChart3,
      title: isFr ? 'Notes & Bulletins' : 'Grades & Report Cards',
      desc: isFr ? 'Saisie des notes, calcul automatique des moyennes et génération de bulletins.' : 'Grade entry, automatic average calculation and report card generation.',
      color: 'from-amber-500 to-amber-600',
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent'
    },
    {
      icon: CreditCard,
      title: isFr ? 'Gestion des paiements' : 'Payment Management',
      desc: isFr ? 'Scolarité, frais divers, suivi des impayés et reçus numériques.' : 'Tuition, miscellaneous fees, arrears tracking and digital receipts.',
      color: 'from-rose-500 to-rose-600',
      gradient: 'from-rose-500/20 via-rose-500/5 to-transparent'
    },
    {
      icon: MessageSquare,
      title: isFr ? 'Communication' : 'Communication',
      desc: isFr ? 'Messages aux parents, notifications et diffusion d\'informations importantes.' : 'Messages to parents, notifications and important information broadcasts.',
      color: 'from-cyan-500 to-cyan-600',
      gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent'
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: isFr ? 'Sécurisé & Fiable' : 'Secure & Reliable',
      desc: isFr ? 'Vos données sont protégées avec un accès sécurisé par rôle (administrateur, enseignant, parent).' : 'Your data is protected with role-based secure access (admin, teacher, parent).'
    },
    {
      icon: Bell,
      title: isFr ? 'Notifications en temps réel' : 'Real-time Notifications',
      desc: isFr ? 'Restez informé des absences, des notes, des paiements et des événements importants.' : 'Stay informed about absences, grades, payments and important events.'
    },
    {
      icon: BarChart3,
      title: isFr ? 'Rapports détaillés' : 'Detailed Reports',
      desc: isFr ? 'Générez des rapports complets sur les performances académiques et financières.' : 'Generate comprehensive reports on academic and financial performance.'
    },
    {
      icon: School,
      title: isFr ? 'Adapté au contexte camerounais' : 'Adapted to Cameroonian Context',
      desc: isFr ? 'Conçu pour les écoles primaires du Cameroun avec les cycles, matières et formats locaux.' : 'Designed for Cameroonian primary schools with local cycles, subjects and formats.'
    },
  ];

  const steps = [
    { num: '01', title: isFr ? 'Créez votre école' : 'Create Your School', desc: isFr ? 'Inscrivez votre établissement et configurez l\'année académique en quelques clics.' : 'Register your institution and configure the academic year in a few clicks.' },
    { num: '02', title: isFr ? 'Ajoutez vos données' : 'Add Your Data', desc: isFr ? 'Importez les élèves, enseignants, classes et matières dans le système.' : 'Import students, teachers, classes and subjects into the system.' },
    { num: '03', title: isFr ? 'Gérez au quotidien' : 'Manage Daily', desc: isFr ? 'Suivez les présences, notes, paiements et communications en temps réel.' : 'Track attendance, grades, payments and communications in real-time.' },
    { num: '04', title: isFr ? 'Analysez & Optimisez' : 'Analyze & Optimize', desc: isFr ? 'Consultez les rapports et statistiques pour améliorer la gestion de votre école.' : 'View reports and statistics to improve your school management.' },
  ];

  const faqs = [
    {
      q: isFr ? 'EduGest CM est-il adapté aux écoles primaires du Cameroun ?' : 'Is EduGest CM suitable for Cameroonian primary schools?',
      a: isFr ? 'Absolument. EduGest CM a été spécifiquement conçu pour les écoles primaires camerounaises. Il prend en compte les cycles d\'enseignement locaux (CP, CE1, CE2, CM1, CM2), les matières au programme, le système de notation sur 20 et les modes de paiement locaux (Mobile Money, espèces).' : 'Absolutely. EduGest CM was specifically designed for Cameroonian primary schools. It takes into account local teaching cycles, curriculum subjects, the 20-point grading system and local payment methods (Mobile Money, cash).'
    },
    {
      q: isFr ? 'Puis-je importer mes données existantes ?' : 'Can I import my existing data?',
      a: isFr ? 'Oui, EduGest CM permet l\'importation de données via des fichiers Excel ou CSV. Notre équipe peut vous accompagner dans la migration de vos données existantes.' : 'Yes, EduGest CM allows data import via Excel or CSV files. Our team can assist you in migrating your existing data.'
    },
    {
      q: isFr ? 'Comment les parents peuvent-ils suivre la scolarité de leurs enfants ?' : 'How can parents track their children\'s education?',
      a: isFr ? 'Chaque parent reçoit un accès personnel à l\'espace parent où il peut consulter les notes, les présences, les bulletins et les paiements de son enfant. Des notifications sont envoyées automatiquement en cas d\'absence ou de nouvel événement.' : 'Each parent receives personal access to the parent portal where they can view their child\'s grades, attendance, report cards and payments. Notifications are sent automatically in case of absence or new event.'
    },
    {
      q: isFr ? 'Quels modes de paiement sont supportés ?' : 'What payment methods are supported?',
      a: isFr ? 'EduGest CM supporte les espèces, le Mobile Money (MTN, Orange, etc.), les virements bancaires et les chèques. Vous pouvez générer des reçus numériques pour chaque transaction.' : 'EduGest CM supports cash, Mobile Money, bank transfers and checks. You can generate digital receipts for each transaction.'
    },
    {
      q: isFr ? 'Est-ce que l\'application fonctionne sans connexion Internet ?' : 'Does the app work without an Internet connection?',
      a: isFr ? 'EduGest CM est une application web qui nécessite une connexion Internet pour fonctionner. Cependant, les données sont automatiquement sauvegardées et accessibles depuis n\'importe quel appareil connecté.' : 'EduGest CM is a web application that requires an Internet connection. However, data is automatically saved and accessible from any connected device.'
    },
  ];

  const testimonials = [
    {
      name: 'M. Jean-Pierre Nkoulou',
      role: isFr ? 'Directeur, École Primaire Les Bambins' : 'Principal, Les Bambins Primary School',
      text: isFr ? 'EduGest CM a transformé la gestion de notre école. Nous économisons des heures chaque semaine sur le suivi des présences et des notes.' : 'EduGest CM has transformed our school management. We save hours each week on attendance and grade tracking.',
      avatar: 'JN',
      rating: 5
    },
    {
      name: 'Mme Esther Biya',
      role: isFr ? 'Enseignante, Groupe Scolaire La Colombe' : 'Teacher, La Colombe School Group',
      text: isFr ? 'L\'interface est intuitive et mes collègues l\'ont adoptée immédiatement. Les parents apprécient particulièrement le suivi en temps réel.' : 'The interface is intuitive and my colleagues adopted it immediately. Parents particularly appreciate the real-time tracking.',
      avatar: 'EB',
      rating: 5
    },
    {
      name: 'M. Paul Ekambi',
      role: isFr ? 'Parent d\'élève, Douala' : 'Parent, Douala',
      text: isFr ? 'Je peux suivre les notes et les présences de mon fils depuis mon téléphone. C\'est rassurant de voir sa progression en temps réel.' : 'I can track my son\'s grades and attendance from my phone. It\'s reassuring to see his progress in real time.',
      avatar: 'PE',
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                EG
              </div>
              <span className="font-bold text-lg text-foreground">EduGest <span className="text-primary">CM</span></span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isFr ? 'Fonctionnalités' : 'Features'}</a>
              <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isFr ? 'Avantages' : 'Benefits'}</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isFr ? 'Comment ça marche' : 'How it works'}</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
              <LanguageSwitcher />
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-foreground hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition-all"
              >
                {isFr ? 'Connexion' : 'Login'}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all shadow-sm"
              >
                {isFr ? 'Commencer' : 'Get Started'}
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-2 animate-fade-in">
            {[
              { href: '#features', label: isFr ? 'Fonctionnalités' : 'Features' },
              { href: '#benefits', label: isFr ? 'Avantages' : 'Benefits' },
              { href: '#how-it-works', label: isFr ? 'Comment ça marche' : 'How it works' },
              { href: '#faq', label: 'FAQ' },
            ].map(item => (
              <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                {item.label}
              </a>
            ))}
            <hr className="border-border my-2" />
            <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="block w-full text-center px-3 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
              {isFr ? 'Connexion' : 'Login'}
            </button>
            <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="block w-full text-center px-3 py-2 text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all">
              {isFr ? 'Commencer' : 'Get Started'}
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-secondary/[0.08]" />
        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/[0.03] to-secondary/[0.03] rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <GraduationCap className="w-4 h-4" />
              {isFr ? 'Solution de gestion scolaire n°1 au Cameroun' : 'Cameroon\'s #1 School Management Solution'}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 animate-fade-in-up">
              {isFr ? 'Gérez votre école' : 'Manage Your School'}
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                {isFr ? 'avec intelligence' : 'Intelligently'}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up">
              {isFr
                ? 'La plateforme tout-en-un pour gérer les élèves, les enseignants, les notes, les paiements et la communication avec les parents.'
                : 'The all-in-one platform to manage students, teachers, grades, payments and parent communication.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all shadow-lg shadow-primary/20"
              >
                {isFr ? 'Commencer maintenant' : 'Start Now'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-all"
              >
                {isFr ? 'En savoir plus' : 'Learn More'}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-gradient-to-r from-primary/[0.02] via-transparent to-secondary/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: isFr ? 'Écoles utilisatrices' : 'Schools Using', icon: School },
              { value: '50K+', label: isFr ? 'Élèves gérés' : 'Students Managed', icon: Users },
              { value: '98%', label: isFr ? 'Satisfaction' : 'Satisfaction', icon: Star },
              { value: '24/7', label: isFr ? 'Support disponible' : 'Support Available', icon: Bell },
            ].map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="text-center group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                    <StatIcon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isFr ? 'Tout ce dont vous avez besoin' : 'Everything You Need'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isFr
                ? 'Une suite complète d\'outils pour gérer votre établissement scolaire efficacement.'
                : 'A complete suite of tools to manage your school efficiently.'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, ${feature.gradient})` }} />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 md:py-28 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {isFr ? 'Pourquoi choisir EduGest CM ?' : 'Why Choose EduGest CM?'}
              </h2>
              <p className="text-muted-foreground mb-8">
                {isFr
                  ? 'Nous avons conçu EduGest CM spécifiquement pour répondre aux besoins des écoles primaires au Cameroun.'
                  : 'We designed EduGest CM specifically to meet the needs of primary schools in Cameroon.'}
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, i) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{benefit.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-sm" />
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-destructive/80" />
                  <div className="w-3 h-3 rounded-full bg-warning/80" />
                  <div className="w-3 h-3 rounded-full bg-success/80" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">JD</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{isFr ? 'Jean Dupont, CP1 A' : 'Jean Dupont, Grade 1 A'}</p>
                        <p className="text-xs text-success">{isFr ? 'Présent aujourd\'hui' : 'Present today'}</p>
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">MF</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{isFr ? 'Marie Fotso, CE2 B' : 'Marie Fotso, Grade 3 B'}</p>
                        <p className="text-xs text-destructive">{isFr ? 'Absente (motif médical)' : 'Absent (medical reason)'}</p>
                      </div>
                    </div>
                    <Bell className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">PN</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{isFr ? 'Paul Nomo, CM2 A' : 'Paul Nomo, Grade 6 A'}</p>
                        <p className="text-xs text-success">Moyenne: <strong>15.8/20</strong></p>
                      </div>
                    </div>
                    <Star className="w-5 h-5 text-accent fill-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isFr ? 'Comment ça fonctionne ?' : 'How Does It Work?'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isFr
                ? 'Mettez en place votre système de gestion scolaire en 4 étapes simples.'
                : 'Set up your school management system in 4 simple steps.'}
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    <span className="text-2xl font-bold text-white">{step.num}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[calc(80%)] h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isFr ? 'Ce qu\'en disent nos utilisateurs' : 'What Our Users Say'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isFr
                ? 'Des écoles de tout le Cameroun nous font confiance.'
                : 'Schools across Cameroon trust us.'}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="group relative bg-card border border-border rounded-2xl p-6 animate-fade-in-up hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20 transition-all duration-300" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/[0.03] to-transparent rounded-bl-3xl rounded-tr-2xl" />
                <div className="relative">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 italic leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-primary via-primary to-secondary rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {isFr ? 'Prêt à moderniser votre école ?' : 'Ready to Modernize Your School?'}
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                {isFr
                  ? 'Rejoignez des centaines d\'écoles camerounaises qui utilisent déjà EduGest CM.'
                  : 'Join hundreds of Cameroonian schools already using EduGest CM.'}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-medium rounded-xl hover:bg-white/90 transition-all shadow-lg"
              >
                {isFr ? 'Commencer gratuitement' : 'Start Free'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 bg-gradient-to-r from-primary/[0.02] via-transparent to-secondary/[0.02] border-y border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isFr ? 'Questions fréquentes' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isFr
                ? 'Tout ce que vous devez savoir sur EduGest CM.'
                : 'Everything you need to know about EduGest CM.'}
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-sm text-foreground">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border bg-gradient-to-b from-background to-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  EG
                </div>
                <span className="font-bold text-foreground">EduGest <span className="text-primary">CM</span></span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isFr
                  ? 'La solution de gestion scolaire moderne pour les écoles primaires au Cameroun.'
                  : 'The modern school management solution for primary schools in Cameroon.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-4">{isFr ? 'Produit' : 'Product'}</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isFr ? 'Fonctionnalités' : 'Features'}</a></li>
                <li><a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isFr ? 'Connexion' : 'Login'}</a></li>
                <li><a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{isFr ? 'Commencer' : 'Get Started'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-4">{isFr ? 'Contact' : 'Contact'}</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" /> contact@edugestcm.com
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" /> +237 691 000 000
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" /> Yaoundé, Cameroun
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-4">{isFr ? 'Légal' : 'Legal'}</h4>
              <ul className="space-y-2">
                {[
                  isFr ? 'Confidentialité' : 'Privacy',
                  isFr ? 'Conditions d\'utilisation' : 'Terms of Service',
                  isFr ? 'Mentions légales' : 'Legal Notice'
                ].map((item, i) => (
                  <li key={i}><a href={['/privacy', '/terms', '/legal'][i]} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} EduGest CM. {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
