export type UserRole = 'ADMIN' | 'DIRECTEUR' | 'ENSEIGNANT' | 'RESPONSABLE_ADMIN' | 'PARENT';

export type PersonType = 1 | 2 | 3 | 4;

export type Gender = 'M' | 'F';

export type Language = 'FR' | 'EN' | 'BIL';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'RETARD' | 'JUSTIFIE';

export type PaymentType = 'SCOLARITE' | 'INSCRIPTION' | 'AUTRE';

export type MessageType = 0 | 1 | 2;

export interface User {
  idPers: number;
  username: string;
  role: UserRole;
  typePersonne: PersonType;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
}

export interface AnneeAcademique {
  idAca: number;
  libelle: string;
  periode: string;
  actif: boolean;
}

export interface Trimestre {
  idTrimes: number;
  libelle: string;
  idAca: number;
  dateDebut: string;
  dateFin: string;
}

export interface Cycle {
  idCycle: number;
  libelle: string;
  description?: string;
}

export interface Classe {
  idClasse: number;
  libelle: string;
  niveau: number;
  idCycle: number;
  idSalle?: number;
  effectif: number;
  cycle?: Cycle;
  salle?: Salle;
  titulaire?: Enseignant;
}

export interface Salle {
  idSalle: number;
  libelle: string;
  capacite: number;
}

export interface Eleve {
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: Gender;
  langue: Language;
  idVilleNaissance?: number;
  adresse?: string;
  photoUrl?: string;
  parents?: Parent[];
}

export interface Parent {
  idParent: number;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  profession?: string;
  lienParente: string;
}

export interface Enseignant {
  idEnseign: number;
  nom: string;
  prenom: string;
  specialite?: string;
  telephone?: string;
  email?: string;
  photoUrl?: string;
  idCours?: number;
}

export interface Cours {
  idCours: number;
  libelle: string;
  coefficient: number;
  description?: string;
  actif: boolean;
}

export interface EmploiDuTemps {
  idEmploi: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  idClasse: number;
  idCours: number;
  cours?: Cours;
}

export interface Presence {
  idFrequente: number;
  matricule: string;
  date: string;
  statut: AttendanceStatus;
  motif?: string;
  eleve?: Eleve;
}

export interface Epreuve {
  idEpreuve: number;
  libelle: string;
  dateEpreuve: string;
  noteMax: number;
  idSession: number;
  idCours: number;
  idClasse: number;
  cours?: Cours;
}

export interface Evaluation {
  idEval: number;
  note: number;
  matricule: string;
  idEpreuve: number;
  eleve?: Eleve;
  epreuve?: Epreuve;
}

export interface Paiement {
  idPaie: number;
  matricule: string;
  montant: number;
  datePaiement: string;
  type: PaymentType;
  trimestre?: string;
  mode: string;
  reference?: string;
  eleve?: Eleve;
}

export interface Rapport {
  idRapport: number;
  matricule: string;
  dateIncident: string;
  description: string;
  points: number;
  sanction?: string;
  statut: string;
  eleve?: Eleve;
}

export interface Message {
  idMessage: number;
  expediteur: number;
  destinataire?: number;
  typeMessage: MessageType;
  objet: string;
  contenu: string;
  dateEnvoi: string;
  statut: string;
}

export interface Stats {
  totalEleves: number;
  totalEnseignants: number;
  totalClasses: number;
  tauxPresence: number;
  paiementsEnCours: number;
  impayes: number;
}

export interface Bulletin {
  matricule: string;
  eleve: Eleve;
  trimestre: Trimestre;
  notes: {
    cours: Cours;
    moyenne: number;
    coefficient: number;
  }[];
  moyenneGenerale: number;
  rang: number;
  appreciation: string;
}
