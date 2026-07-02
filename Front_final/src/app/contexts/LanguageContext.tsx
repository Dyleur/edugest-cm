import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  fr: {
    // Common
    'common.search': 'Rechercher',
    'common.add': 'Ajouter',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.view': 'Voir',
    'common.export': 'Exporter',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.filter': 'Filtrer',
    'common.download': 'Télécharger',
    'common.upload': 'Téléverser',
    'common.total': 'Total',
    'common.male': 'Garçons',
    'common.female': 'Filles',
    'common.status': 'Statut',
    'common.active': 'Actif',
    'common.inactive': 'Inactif',

    // Auth
    'auth.login': 'Connexion',
    'auth.logout': 'Déconnexion',
    'auth.username': 'Nom d\'utilisateur',
    'auth.password': 'Mot de passe',
    'auth.rememberMe': 'Se souvenir de moi',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.signIn': 'Se connecter',
    'auth.welcome': 'Bienvenue',
    'auth.loginToAccount': 'Connectez-vous à votre compte',
    'auth.testCredentials': 'Identifiants de test : admin / password',

    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.students': 'Élèves',
    'nav.teachers': 'Enseignants',
    'nav.classes': 'Classes',
    'nav.subjects': 'Matières',
    'nav.timetable': 'Emploi du temps',
    'nav.attendance': 'Présences',
    'nav.grades': 'Notes',
    'nav.reportCards': 'Bulletins',
    'nav.payments': 'Paiements',
    'nav.discipline': 'Discipline',
    'nav.messages': 'Messages',
    'nav.reports': 'Rapports',

    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.subtitle': 'Année académique 2025-2026 | Trimestre 2',
    'dashboard.today': 'Aujourd\'hui',
    'dashboard.welcome': 'Bienvenue sur EduGest CM',
    'dashboard.description': 'Gérez efficacement votre école primaire avec notre système intégré de gestion académique et administrative.',
    'dashboard.totalStudents': 'Total Élèves',
    'dashboard.teachers': 'Enseignants',
    'dashboard.classes': 'Classes',
    'dashboard.attendanceRate': 'Taux de Présence',
    'dashboard.recentActivities': 'Activités récentes',
    'dashboard.upcomingEvents': 'Événements à venir',
    'dashboard.thisMonth': 'ce mois',
    'dashboard.newTeachers': 'nouveaux',
    'dashboard.cycles': 'cycles',

    // Students
    'students.title': 'Gestion des Élèves',
    'students.subtitle': 'Gérez les inscriptions, dossiers et informations des élèves',
    'students.new': 'Nouvel élève',
    'students.search': 'Rechercher un élève...',
    'students.total': 'Total Élèves',
    'students.boys': 'Garçons',
    'students.girls': 'Filles',
    'students.newEnrollments': 'Nouvelles inscriptions',
    'students.thisQuarter': 'Ce trimestre',
    'students.matricule': 'Matricule',
    'students.fullName': 'Nom complet',
    'students.dateOfBirth': 'Date de naissance',
    'students.class': 'Classe',
    'students.gender': 'Sexe',

    // Teachers
    'teachers.title': 'Gestion des Enseignants',
    'teachers.subtitle': 'Gérez le personnel enseignant et leurs affectations',
    'teachers.new': 'Nouvel enseignant',
    'teachers.search': 'Rechercher un enseignant...',
    'teachers.total': 'Total Enseignants',
    'teachers.ratio': 'Ratio Élèves/Enseignant',
    'teachers.newHires': 'Nouveaux recrutements',
    'teachers.excellentRatio': 'Excellent ratio',
    'teachers.thisYear': 'Cette année',
    'teachers.activeStaff': 'Personnel actif',

    // Classes
    'classes.title': 'Gestion des Classes',
    'classes.subtitle': 'Organisation des cycles, classes et salles',
    'classes.new': 'Nouvelle classe',
    'classes.byCycle': 'Classes par cycle',
    'classes.total': 'Total Classes',
    'classes.onCycles': 'Sur 3 cycles',
    'classes.totalEnrollment': 'Effectif Total',
    'classes.enrolled': 'Élèves inscrits',
    'classes.average': 'Moyenne par classe',
    'classes.students': 'Élèves',
    'classes.room': 'Salle',
    'classes.capacity': 'Capacité',

    // Subjects
    'subjects.title': 'Gestion des Matières',
    'subjects.subtitle': 'Programme scolaire et matières enseignées',
    'subjects.new': 'Nouvelle matière',
    'subjects.taught': 'Matières enseignées',
    'subjects.program': 'Programme de l\'enseignement primaire',
    'subjects.total': 'Total Matières',
    'subjects.allActive': 'Toutes actives',
    'subjects.totalCoefficient': 'Coefficient Total',
    'subjects.totalPoints': 'Points au total',
    'subjects.assignedTeachers': 'Enseignants affectés',
    'subjects.coefficient': 'Coefficient',
    'subjects.assigned': 'affectés',

    // Timetable
    'timetable.title': 'Emploi du Temps',
    'timetable.subtitle': 'Planning hebdomadaire des cours',
    'timetable.class': 'Classe',
    'timetable.week': 'Semaine du',
    'timetable.weeklySchedule': 'Planning de la semaine',
    'timetable.schedule': 'Horaires',
    'timetable.break': 'Pause',
    'timetable.recess': 'Récréation',
    'timetable.lunch': 'Déjeuner',
    'timetable.monday': 'Lundi',
    'timetable.tuesday': 'Mardi',
    'timetable.wednesday': 'Mercredi',
    'timetable.thursday': 'Jeudi',
    'timetable.friday': 'Vendredi',

    // Attendance
    'attendance.title': 'Gestion des Présences',
    'attendance.subtitle': 'Suivi de l\'assiduité et des absences',
    'attendance.present': 'Présents',
    'attendance.absent': 'Absents',
    'attendance.late': 'Retards',
    'attendance.rate': 'Taux',
    'attendance.sheet': 'Feuille d\'appel',
    'attendance.validate': 'Valider l\'appel',
    'attendance.presentBtn': 'Présent',
    'attendance.absentBtn': 'Absent',
    'attendance.lateBtn': 'Retard',

    // Grades
    'grades.title': 'Saisie des Notes',
    'grades.subtitle': 'Évaluations et résultats scolaires',
    'grades.recent': 'Évaluations récentes',
    'grades.new': 'Nouvelle évaluation',
    'grades.average': 'Moyenne',
    'grades.saveGrades': 'Enregistrer les notes',
    'grades.test': 'Devoir',
    'grades.exam': 'Composition',
    'grades.quiz': 'Interrogation',

    // Report Cards
    'reportCards.title': 'Bulletins Scolaires',
    'reportCards.subtitle': 'Consultation et téléchargement des bulletins',
    'reportCards.search': 'Rechercher un bulletin...',
    'reportCards.exportAll': 'Exporter tout (PDF)',
    'reportCards.generated': 'Bulletins générés',
    'reportCards.overallAverage': 'Moyenne générale',
    'reportCards.successRate': 'Taux de réussite',
    'reportCards.school': 'École',
    'reportCards.preview': 'Aperçu du bulletin',
    'reportCards.student': 'Élève',
    'reportCards.rank': 'Rang',
    'reportCards.subject': 'Matière',
    'reportCards.grade': 'Note',
    'reportCards.comment': 'Appréciation du conseil de classe',

    // Payments
    'payments.title': 'Gestion des Paiements',
    'payments.subtitle': 'Scolarité, frais et suivi des paiements',
    'payments.new': 'Nouveau paiement',
    'payments.search': 'Rechercher un paiement...',
    'payments.collections': 'Encaissements',
    'payments.paid': 'Payés',
    'payments.partial': 'Partiels',
    'payments.unpaid': 'Impayés',
    'payments.recent': 'Paiements récents',
    'payments.distribution': 'Répartition des paiements',
    'payments.feeSchedule': 'Grille tarifaire 2025-2026',
    'payments.tuition': 'Scolarité',
    'payments.registration': 'Frais d\'inscription',
    'payments.cash': 'Espèces',
    'payments.mobileMoney': 'Mobile Money',
    'payments.bankTransfer': 'Virement bancaire',
    'payments.check': 'Chèque',

    // Discipline
    'discipline.title': 'Gestion de la Discipline',
    'discipline.subtitle': 'Suivi des incidents et sanctions',
    'discipline.report': 'Signaler un incident',
    'discipline.reports': 'Rapports d\'incidents',
    'discipline.total': 'Total incidents',
    'discipline.minor': 'Mineurs',
    'discipline.moderate': 'Moyens',
    'discipline.severe': 'Graves',
    'discipline.recent': 'Incidents récents',
    'discipline.sanctions': 'Barème de sanctions',
    'discipline.minorOffenses': 'Infractions mineures (-1 à -3 points)',
    'discipline.moderateOffenses': 'Infractions moyennes (-4 à -7 points)',
    'discipline.severeOffenses': 'Infractions graves (-8 à -15 points)',
    'discipline.thresholds': 'Seuils d\'intervention',
    'discipline.mostFrequent': 'Types d\'incidents les plus fréquents',

    // Messages
    'messages.title': 'Communication',
    'messages.subtitle': 'Messages et notifications aux parents',
    'messages.new': 'Nouveau message',
    'messages.sent': 'Messages envoyés',
    'messages.readRate': 'Taux de lecture',
    'messages.broadcasts': 'Diffusions',
    'messages.reminders': 'Rappels',
    'messages.recent': 'Messages récents',
    'messages.type': 'Type de message',
    'messages.recipient': 'Destinataire',
    'messages.subject': 'Objet',
    'messages.message': 'Message',
    'messages.send': 'Envoyer',
    'messages.draft': 'Brouillon',
    'messages.templates': 'Modèles de messages',
    'messages.individual': 'Message individuel',
    'messages.broadcast': 'Diffusion (tous les parents)',
    'messages.classParents': 'Parents d\'une classe',
    'messages.unpaidParents': 'Parents avec impayés',

    // Reports
    'reports.title': 'Rapports & Exports',
    'reports.subtitle': 'Génération de rapports et analyses statistiques',
    'reports.available': 'Rapports disponibles',
    'reports.generated': 'Rapports générés',
    'reports.pdfExports': 'Exports PDF',
    'reports.excelExports': 'Exports Excel',
    'reports.enrollment': 'Effectifs par classe',
    'reports.academicResults': 'Résultats académiques',
    'reports.attendanceStats': 'Taux de présence',
    'reports.financialStatus': 'Situation financière',
    'reports.disciplineReport': 'Incidents disciplinaires',
    'reports.quarterlyReport': 'Rapport trimestriel complet',
    'reports.preview': 'Aperçu',
    'reports.exportParams': 'Paramètres d\'export',
    'reports.period': 'Période',
    'reports.format': 'Format',
    'reports.history': 'Historique des exports',

    // Teacher Navigation
    'nav.myClasses': 'Mes Classes',
    'nav.schedule': 'Emploi du Temps',
    'nav.gradesAndTests': 'Notes & Épreuves',

    // Teacher Dashboard
    'teacher.dashboard.greeting': 'Bonjour',
    'teacher.dashboard.subtitle': 'Année académique 2025-2026 · Trimestre 2 · Espace Enseignant',
    'teacher.dashboard.myClasses': 'Mes Classes',
    'teacher.dashboard.myStudents': 'Mes Élèves',
    'teacher.dashboard.plannedTests': 'Épreuves planifiées',
    'teacher.dashboard.receivedMessages': 'Messages reçus',
    'teacher.dashboard.assigned': 'assignées',
    'teacher.dashboard.total': 'au total',
    'teacher.dashboard.thisTerm': 'ce trimestre',
    'teacher.dashboard.unread': 'non lus',
    'teacher.dashboard.classOverview': 'Aperçu de mes classes',
    'teacher.dashboard.students': 'élèves',
    'teacher.dashboard.attendanceRate': 'Taux de présence',
    'teacher.dashboard.subject': 'Matière',
    'teacher.dashboard.upcomingTests': 'Épreuves à venir',
    'teacher.dashboard.recentMessages': 'Messages récents',
    'teacher.dashboard.recentActivity': 'Activité récente',
    'teacher.dashboard.from': 'De',
    'teacher.dashboard.read': 'lu',
    'teacher.dashboard.today': 'Aujourd\'hui',
    'teacher.dashboard.yesterday': 'Hier',
    'teacher.dashboard.validated': 'Appel validé',
    'teacher.dashboard.gradesEntered': 'Notes saisies',
    'teacher.dashboard.absenceReported': 'Absence signalée',

    // Teacher My Classes
    'teacher.myClasses.title': 'Mes Classes',
    'teacher.myClasses.subtitle': 'Classes dont vous êtes responsable',
    'teacher.myClasses.viewDetails': 'Voir les détails',
    'teacher.myClasses.studentList': 'Liste des élèves',
    'teacher.myClasses.performances': 'Performances',

    // Teacher Attendance
    'teacher.attendance.title': 'Appel des Présences',
    'teacher.attendance.subtitle': 'Enregistrez les présences de vos élèves',
    'teacher.attendance.callSheet': 'Feuille d\'appel',
    'teacher.attendance.validated': 'Appel validé',
    'teacher.attendance.reason': 'Motif',

    // Teacher Grades
    'teacher.grades.title': 'Notes & Épreuves',
    'teacher.grades.subtitle': 'Saisissez les notes et gérez les évaluations',
    'teacher.grades.newTest': 'Nouvelle épreuve',
    'teacher.grades.testDate': 'Date de l\'épreuve',
    'teacher.grades.maxScore': 'Note maximale',
    'teacher.grades.enterGrades': 'Saisir les notes',
    'teacher.grades.score': 'Note',

    // Teacher Report Cards
    'teacher.reportCards.title': 'Bulletins de mes Classes',
    'teacher.reportCards.subtitle': 'Consultez les bulletins de vos élèves',

    // Teacher Discipline
    'teacher.discipline.title': 'Incidents Disciplinaires',
    'teacher.discipline.subtitle': 'Signalez les incidents de vos élèves',
    'teacher.discipline.incidentDate': 'Date de l\'incident',
    'teacher.discipline.description': 'Description',
    'teacher.discipline.points': 'Points',
    'teacher.discipline.pending': 'En attente',
    'teacher.discipline.resolved': 'Résolu',

    // Teacher Messages
    'teacher.messages.title': 'Mes Messages',
    'teacher.messages.subtitle': 'Communication avec l\'administration et les parents',

    // Parent Navigation
    'nav.myChild': 'Mon Enfant',
    'nav.childProfile': 'Profil de l\'enfant',

    // Parent Dashboard
    'parent.dashboard.greeting': 'Bonjour',
    'parent.dashboard.subtitle': 'Année académique 2025-2026 · Trimestre 2 · Espace Parent',
    'parent.dashboard.child': 'Enfant',
    'parent.dashboard.class': 'Classe',
    'parent.dashboard.cycle': 'Cycle',
    'parent.dashboard.section': 'Section',
    'parent.dashboard.age': 'ans',
    'parent.dashboard.overallAverage': 'Moyenne générale',
    'parent.dashboard.currentTerm': 'Trimestre actuel',
    'parent.dashboard.attendanceRate': 'Taux de présence',
    'parent.dashboard.last30Days': 'Sur 30 derniers jours',
    'parent.dashboard.outstandingBalance': 'Solde impayé',
    'parent.dashboard.tuitionFees': 'Frais de scolarité',
    'parent.dashboard.unreadMessages': 'Messages non lus',
    'parent.dashboard.fromSchool': 'De l\'école',
    'parent.dashboard.recentGrades': 'Notes récentes',
    'parent.dashboard.viewAll': 'Voir tout',
    'parent.dashboard.recentAttendance': 'Présences récentes',
    'parent.dashboard.present': 'Présent',
    'parent.dashboard.absent': 'Absent',
    'parent.dashboard.late': 'Retard',
    'parent.dashboard.justified': 'Justifié',
    'parent.dashboard.reason': 'Motif',
    'parent.dashboard.illness': 'Maladie',
    'parent.dashboard.transport': 'Transport',
    'parent.dashboard.recentPayments': 'Paiements récents',
    'parent.dashboard.paid': 'Payé',
    'parent.dashboard.unpaid': 'Impayé',
    'parent.dashboard.unreadMessagesTitle': 'Messages non lus',

    // Parent Child Profile
    'parent.childProfile.title': 'Profil de l\'Enfant',
    'parent.childProfile.subtitle': 'Informations détaillées sur votre enfant',
    'parent.childProfile.personalInfo': 'Informations personnelles',
    'parent.childProfile.studentId': 'Matricule',
    'parent.childProfile.fullName': 'Nom complet',
    'parent.childProfile.dateOfBirth': 'Date de naissance',
    'parent.childProfile.placeOfBirth': 'Lieu de naissance',
    'parent.childProfile.gender': 'Sexe',
    'parent.childProfile.male': 'Garçon',
    'parent.childProfile.female': 'Fille',
    'parent.childProfile.academicInfo': 'Informations académiques',
    'parent.childProfile.currentClass': 'Classe actuelle',
    'parent.childProfile.academicYear': 'Année académique',
    'parent.childProfile.language': 'Langue d\'enseignement',
    'parent.childProfile.french': 'Français',
    'parent.childProfile.english': 'Anglais',
    'parent.childProfile.bilingual': 'Bilingue',
    'parent.childProfile.parentInfo': 'Informations des parents',
    'parent.childProfile.relationship': 'Lien de parenté',
    'parent.childProfile.phone': 'Téléphone',
    'parent.childProfile.email': 'Email',
    'parent.childProfile.profession': 'Profession',

    // Parent Grades
    'parent.grades.title': 'Notes de mon Enfant',
    'parent.grades.subtitle': 'Consultez les résultats scolaires',
    'parent.grades.maxScore': 'Note max',
    'parent.grades.coefficient': 'Coefficient',

    // Parent Attendance
    'parent.attendance.title': 'Présences de mon Enfant',
    'parent.attendance.subtitle': 'Historique de présence',
    'parent.attendance.monthlyStats': 'Statistiques mensuelles',
    'parent.attendance.presentDays': 'Jours présents',
    'parent.attendance.absentDays': 'Jours absents',
    'parent.attendance.lateDays': 'Retards',

    // Parent Report Card
    'parent.reportCard.title': 'Bulletin Scolaire',
    'parent.reportCard.subtitle': 'Bulletin de votre enfant',
    'parent.reportCard.term': 'Trimestre',

    // Parent Payments
    'parent.payments.title': 'Mes Paiements',
    'parent.payments.subtitle': 'Historique et frais scolaires',
    'parent.payments.paymentHistory': 'Historique des paiements',
    'parent.payments.amount': 'Montant',
    'parent.payments.date': 'Date',
    'parent.payments.paymentMethod': 'Mode de paiement',

    // Parent Messages
    'parent.messages.title': 'Mes Messages',
    'parent.messages.subtitle': 'Communications de l\'école',
    'parent.messages.sender': 'Expéditeur',
  },

  en: {
    // Common
    'common.search': 'Search',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.export': 'Export',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.filter': 'Filter',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.total': 'Total',
    'common.male': 'Boys',
    'common.female': 'Girls',
    'common.status': 'Status',
    'common.active': 'Active',
    'common.inactive': 'Inactive',

    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.signIn': 'Sign in',
    'auth.welcome': 'Welcome',
    'auth.loginToAccount': 'Sign in to your account',
    'auth.testCredentials': 'Test credentials: admin / password',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.students': 'Students',
    'nav.teachers': 'Teachers',
    'nav.classes': 'Classes',
    'nav.subjects': 'Subjects',
    'nav.timetable': 'Timetable',
    'nav.attendance': 'Attendance',
    'nav.grades': 'Grades',
    'nav.reportCards': 'Report Cards',
    'nav.payments': 'Payments',
    'nav.discipline': 'Discipline',
    'nav.messages': 'Messages',
    'nav.reports': 'Reports',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Academic Year 2025-2026 | Term 2',
    'dashboard.today': 'Today',
    'dashboard.welcome': 'Welcome to EduGest CM',
    'dashboard.description': 'Efficiently manage your primary school with our integrated academic and administrative management system.',
    'dashboard.totalStudents': 'Total Students',
    'dashboard.teachers': 'Teachers',
    'dashboard.classes': 'Classes',
    'dashboard.attendanceRate': 'Attendance Rate',
    'dashboard.recentActivities': 'Recent Activities',
    'dashboard.upcomingEvents': 'Upcoming Events',
    'dashboard.thisMonth': 'this month',
    'dashboard.newTeachers': 'new',
    'dashboard.cycles': 'cycles',

    // Students
    'students.title': 'Student Management',
    'students.subtitle': 'Manage enrollments, records and student information',
    'students.new': 'New student',
    'students.search': 'Search for a student...',
    'students.total': 'Total Students',
    'students.boys': 'Boys',
    'students.girls': 'Girls',
    'students.newEnrollments': 'New enrollments',
    'students.thisQuarter': 'This quarter',
    'students.matricule': 'ID Number',
    'students.fullName': 'Full name',
    'students.dateOfBirth': 'Date of birth',
    'students.class': 'Class',
    'students.gender': 'Gender',

    // Teachers
    'teachers.title': 'Teacher Management',
    'teachers.subtitle': 'Manage teaching staff and their assignments',
    'teachers.new': 'New teacher',
    'teachers.search': 'Search for a teacher...',
    'teachers.total': 'Total Teachers',
    'teachers.ratio': 'Student/Teacher Ratio',
    'teachers.newHires': 'New hires',
    'teachers.excellentRatio': 'Excellent ratio',
    'teachers.thisYear': 'This year',
    'teachers.activeStaff': 'Active staff',

    // Classes
    'classes.title': 'Class Management',
    'classes.subtitle': 'Organization of cycles, classes and rooms',
    'classes.new': 'New class',
    'classes.byCycle': 'Classes by cycle',
    'classes.total': 'Total Classes',
    'classes.onCycles': 'On 3 cycles',
    'classes.totalEnrollment': 'Total Enrollment',
    'classes.enrolled': 'Enrolled students',
    'classes.average': 'Average per class',
    'classes.students': 'Students',
    'classes.room': 'Room',
    'classes.capacity': 'Capacity',

    // Subjects
    'subjects.title': 'Subject Management',
    'subjects.subtitle': 'School curriculum and taught subjects',
    'subjects.new': 'New subject',
    'subjects.taught': 'Taught subjects',
    'subjects.program': 'Primary education curriculum',
    'subjects.total': 'Total Subjects',
    'subjects.allActive': 'All active',
    'subjects.totalCoefficient': 'Total Coefficient',
    'subjects.totalPoints': 'Total points',
    'subjects.assignedTeachers': 'Assigned teachers',
    'subjects.coefficient': 'Coefficient',
    'subjects.assigned': 'assigned',

    // Timetable
    'timetable.title': 'Timetable',
    'timetable.subtitle': 'Weekly class schedule',
    'timetable.class': 'Class',
    'timetable.week': 'Week of',
    'timetable.weeklySchedule': 'Weekly Schedule',
    'timetable.schedule': 'Schedule',
    'timetable.break': 'Break',
    'timetable.recess': 'Recess',
    'timetable.lunch': 'Lunch',
    'timetable.monday': 'Monday',
    'timetable.tuesday': 'Tuesday',
    'timetable.wednesday': 'Wednesday',
    'timetable.thursday': 'Thursday',
    'timetable.friday': 'Friday',

    // Attendance
    'attendance.title': 'Attendance Management',
    'attendance.subtitle': 'Track attendance and absences',
    'attendance.present': 'Present',
    'attendance.absent': 'Absent',
    'attendance.late': 'Late',
    'attendance.rate': 'Rate',
    'attendance.sheet': 'Attendance Sheet',
    'attendance.validate': 'Submit Attendance',
    'attendance.presentBtn': 'Present',
    'attendance.absentBtn': 'Absent',
    'attendance.lateBtn': 'Late',

    // Grades
    'grades.title': 'Grade Entry',
    'grades.subtitle': 'Assessments and academic results',
    'grades.recent': 'Recent assessments',
    'grades.new': 'New assessment',
    'grades.average': 'Average',
    'grades.saveGrades': 'Save grades',
    'grades.test': 'Test',
    'grades.exam': 'Exam',
    'grades.quiz': 'Quiz',

    // Report Cards
    'reportCards.title': 'Report Cards',
    'reportCards.subtitle': 'View and download report cards',
    'reportCards.search': 'Search for a report card...',
    'reportCards.exportAll': 'Export all (PDF)',
    'reportCards.generated': 'Generated report cards',
    'reportCards.overallAverage': 'Overall average',
    'reportCards.successRate': 'Success rate',
    'reportCards.school': 'School',
    'reportCards.preview': 'Report card preview',
    'reportCards.student': 'Student',
    'reportCards.rank': 'Rank',
    'reportCards.subject': 'Subject',
    'reportCards.grade': 'Grade',
    'reportCards.comment': 'Teacher\'s comment',

    // Payments
    'payments.title': 'Payment Management',
    'payments.subtitle': 'Tuition, fees and payment tracking',
    'payments.new': 'New payment',
    'payments.search': 'Search for a payment...',
    'payments.collections': 'Collections',
    'payments.paid': 'Paid',
    'payments.partial': 'Partial',
    'payments.unpaid': 'Unpaid',
    'payments.recent': 'Recent payments',
    'payments.distribution': 'Payment distribution',
    'payments.feeSchedule': 'Fee Schedule 2025-2026',
    'payments.tuition': 'Tuition',
    'payments.registration': 'Registration fee',
    'payments.cash': 'Cash',
    'payments.mobileMoney': 'Mobile Money',
    'payments.bankTransfer': 'Bank transfer',
    'payments.check': 'Check',

    // Discipline
    'discipline.title': 'Discipline Management',
    'discipline.subtitle': 'Track incidents and sanctions',
    'discipline.report': 'Report an incident',
    'discipline.reports': 'Incident reports',
    'discipline.total': 'Total incidents',
    'discipline.minor': 'Minor',
    'discipline.moderate': 'Moderate',
    'discipline.severe': 'Severe',
    'discipline.recent': 'Recent incidents',
    'discipline.sanctions': 'Sanctions scale',
    'discipline.minorOffenses': 'Minor offenses (-1 to -3 points)',
    'discipline.moderateOffenses': 'Moderate offenses (-4 to -7 points)',
    'discipline.severeOffenses': 'Severe offenses (-8 to -15 points)',
    'discipline.thresholds': 'Intervention thresholds',
    'discipline.mostFrequent': 'Most frequent incident types',

    // Messages
    'messages.title': 'Communication',
    'messages.subtitle': 'Messages and notifications to parents',
    'messages.new': 'New message',
    'messages.sent': 'Sent messages',
    'messages.readRate': 'Read rate',
    'messages.broadcasts': 'Broadcasts',
    'messages.reminders': 'Reminders',
    'messages.recent': 'Recent messages',
    'messages.type': 'Message type',
    'messages.recipient': 'Recipient',
    'messages.subject': 'Subject',
    'messages.message': 'Message',
    'messages.send': 'Send',
    'messages.draft': 'Draft',
    'messages.templates': 'Message templates',
    'messages.individual': 'Individual message',
    'messages.broadcast': 'Broadcast (all parents)',
    'messages.classParents': 'Parents of a class',
    'messages.unpaidParents': 'Parents with unpaid fees',

    // Reports
    'reports.title': 'Reports & Exports',
    'reports.subtitle': 'Report generation and statistical analysis',
    'reports.available': 'Available reports',
    'reports.generated': 'Generated reports',
    'reports.pdfExports': 'PDF exports',
    'reports.excelExports': 'Excel exports',
    'reports.enrollment': 'Enrollment by class',
    'reports.academicResults': 'Academic results',
    'reports.attendanceStats': 'Attendance statistics',
    'reports.financialStatus': 'Financial status',
    'reports.disciplineReport': 'Discipline incidents',
    'reports.quarterlyReport': 'Quarterly comprehensive report',
    'reports.preview': 'Preview',
    'reports.exportParams': 'Export parameters',
    'reports.period': 'Period',
    'reports.format': 'Format',
    'reports.history': 'Export history',

    // Teacher Navigation
    'nav.myClasses': 'My Classes',
    'nav.schedule': 'Schedule',
    'nav.gradesAndTests': 'Grades & Tests',

    // Teacher Dashboard
    'teacher.dashboard.greeting': 'Hello',
    'teacher.dashboard.subtitle': 'Academic Year 2025-2026 · Term 2 · Teacher Portal',
    'teacher.dashboard.myClasses': 'My Classes',
    'teacher.dashboard.myStudents': 'My Students',
    'teacher.dashboard.plannedTests': 'Planned tests',
    'teacher.dashboard.receivedMessages': 'Received messages',
    'teacher.dashboard.assigned': 'assigned',
    'teacher.dashboard.total': 'total',
    'teacher.dashboard.thisTerm': 'this term',
    'teacher.dashboard.unread': 'unread',
    'teacher.dashboard.classOverview': 'My classes overview',
    'teacher.dashboard.students': 'students',
    'teacher.dashboard.attendanceRate': 'Attendance rate',
    'teacher.dashboard.subject': 'Subject',
    'teacher.dashboard.upcomingTests': 'Upcoming tests',
    'teacher.dashboard.recentMessages': 'Recent messages',
    'teacher.dashboard.recentActivity': 'Recent activity',
    'teacher.dashboard.from': 'From',
    'teacher.dashboard.read': 'read',
    'teacher.dashboard.today': 'Today',
    'teacher.dashboard.yesterday': 'Yesterday',
    'teacher.dashboard.validated': 'Attendance submitted',
    'teacher.dashboard.gradesEntered': 'Grades entered',
    'teacher.dashboard.absenceReported': 'Absence reported',

    // Teacher My Classes
    'teacher.myClasses.title': 'My Classes',
    'teacher.myClasses.subtitle': 'Classes you are responsible for',
    'teacher.myClasses.viewDetails': 'View details',
    'teacher.myClasses.studentList': 'Student list',
    'teacher.myClasses.performances': 'Performances',

    // Teacher Attendance
    'teacher.attendance.title': 'Attendance Call',
    'teacher.attendance.subtitle': 'Record your students\' attendance',
    'teacher.attendance.callSheet': 'Call sheet',
    'teacher.attendance.validated': 'Attendance submitted',
    'teacher.attendance.reason': 'Reason',

    // Teacher Grades
    'teacher.grades.title': 'Grades & Tests',
    'teacher.grades.subtitle': 'Enter grades and manage assessments',
    'teacher.grades.newTest': 'New test',
    'teacher.grades.testDate': 'Test date',
    'teacher.grades.maxScore': 'Max score',
    'teacher.grades.enterGrades': 'Enter grades',
    'teacher.grades.score': 'Score',

    // Teacher Report Cards
    'teacher.reportCards.title': 'My Classes Report Cards',
    'teacher.reportCards.subtitle': 'View your students\' report cards',

    // Teacher Discipline
    'teacher.discipline.title': 'Discipline Incidents',
    'teacher.discipline.subtitle': 'Report incidents for your students',
    'teacher.discipline.incidentDate': 'Incident date',
    'teacher.discipline.description': 'Description',
    'teacher.discipline.points': 'Points',
    'teacher.discipline.pending': 'Pending',
    'teacher.discipline.resolved': 'Resolved',

    // Teacher Messages
    'teacher.messages.title': 'My Messages',
    'teacher.messages.subtitle': 'Communication with administration and parents',

    // Parent Navigation
    'nav.myChild': 'My Child',
    'nav.childProfile': 'Child profile',

    // Parent Dashboard
    'parent.dashboard.greeting': 'Hello',
    'parent.dashboard.subtitle': 'Academic Year 2025-2026 · Term 2 · Parent Portal',
    'parent.dashboard.child': 'Child',
    'parent.dashboard.class': 'Class',
    'parent.dashboard.cycle': 'Cycle',
    'parent.dashboard.section': 'Section',
    'parent.dashboard.age': 'years old',
    'parent.dashboard.overallAverage': 'Overall average',
    'parent.dashboard.currentTerm': 'Current term',
    'parent.dashboard.attendanceRate': 'Attendance rate',
    'parent.dashboard.last30Days': 'Last 30 days',
    'parent.dashboard.outstandingBalance': 'Outstanding balance',
    'parent.dashboard.tuitionFees': 'Tuition fees',
    'parent.dashboard.unreadMessages': 'Unread messages',
    'parent.dashboard.fromSchool': 'From school',
    'parent.dashboard.recentGrades': 'Recent grades',
    'parent.dashboard.viewAll': 'View all',
    'parent.dashboard.recentAttendance': 'Recent attendance',
    'parent.dashboard.present': 'Present',
    'parent.dashboard.absent': 'Absent',
    'parent.dashboard.late': 'Late',
    'parent.dashboard.justified': 'Justified',
    'parent.dashboard.reason': 'Reason',
    'parent.dashboard.illness': 'Illness',
    'parent.dashboard.transport': 'Transport',
    'parent.dashboard.recentPayments': 'Recent payments',
    'parent.dashboard.paid': 'Paid',
    'parent.dashboard.unpaid': 'Unpaid',
    'parent.dashboard.unreadMessagesTitle': 'Unread messages',

    // Parent Child Profile
    'parent.childProfile.title': 'Child Profile',
    'parent.childProfile.subtitle': 'Detailed information about your child',
    'parent.childProfile.personalInfo': 'Personal information',
    'parent.childProfile.studentId': 'Student ID',
    'parent.childProfile.fullName': 'Full name',
    'parent.childProfile.dateOfBirth': 'Date of birth',
    'parent.childProfile.placeOfBirth': 'Place of birth',
    'parent.childProfile.gender': 'Gender',
    'parent.childProfile.male': 'Boy',
    'parent.childProfile.female': 'Girl',
    'parent.childProfile.academicInfo': 'Academic information',
    'parent.childProfile.currentClass': 'Current class',
    'parent.childProfile.academicYear': 'Academic year',
    'parent.childProfile.language': 'Language of instruction',
    'parent.childProfile.french': 'French',
    'parent.childProfile.english': 'English',
    'parent.childProfile.bilingual': 'Bilingual',
    'parent.childProfile.parentInfo': 'Parent information',
    'parent.childProfile.relationship': 'Relationship',
    'parent.childProfile.phone': 'Phone',
    'parent.childProfile.email': 'Email',
    'parent.childProfile.profession': 'Profession',

    // Parent Grades
    'parent.grades.title': 'My Child\'s Grades',
    'parent.grades.subtitle': 'View academic results',
    'parent.grades.maxScore': 'Max score',
    'parent.grades.coefficient': 'Coefficient',

    // Parent Attendance
    'parent.attendance.title': 'My Child\'s Attendance',
    'parent.attendance.subtitle': 'Attendance history',
    'parent.attendance.monthlyStats': 'Monthly statistics',
    'parent.attendance.presentDays': 'Present days',
    'parent.attendance.absentDays': 'Absent days',
    'parent.attendance.lateDays': 'Late days',

    // Parent Report Card
    'parent.reportCard.title': 'Report Card',
    'parent.reportCard.subtitle': 'Your child\'s report card',
    'parent.reportCard.term': 'Term',

    // Parent Payments
    'parent.payments.title': 'My Payments',
    'parent.payments.subtitle': 'Payment history and school fees',
    'parent.payments.paymentHistory': 'Payment history',
    'parent.payments.amount': 'Amount',
    'parent.payments.date': 'Date',
    'parent.payments.paymentMethod': 'Payment method',

    // Parent Messages
    'parent.messages.title': 'My Messages',
    'parent.messages.subtitle': 'School communications',
    'parent.messages.sender': 'Sender',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('edugest_language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('edugest_language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
