const sequelize = require('../config/database');

const AnneeAcademique = require('./AnneeAcademique.model');
const Cycle           = require('./Cycle.model');
const Classe          = require('./Classe.model');
const Salle           = require('./Salle.model');
const Eleve           = require('./Eleve.model');
const Personne        = require('./Personne.model');
const Enseignant      = require('./Enseignant.model');
const Frequente       = require('./Frequente.model');
const Admin           = require('./Admin.model');
const Parents         = require('./Parents.model');
const Message         = require('./Message.model');
const Cours           = require('./Cours.model');
const Epreuve         = require('./Epreuve.model');
const Note            = require('./Note.model');
const Paiement        = require('./Paiement.model');
const Discipline      = require('./Discipline.model');
const EmploiDuTemps   = require('./EmploiDuTemps.model');
const Scolarite       = require('./Scolarite.model');
const Trimestre       = require('./Trimestre.model');
const Notification    = require('./Notification.model');
const Conversation    = require('./Conversation.model');
const ConversationParticipant = require('./ConversationParticipant.model');
const Annonce = require('./Annonce.model');

// ── RELATIONS EXISTANTES ────────────────────────────────────

Cycle.hasMany(Classe, { foreignKey: 'idCycle' });
Classe.belongsTo(Cycle, { foreignKey: 'idCycle' });

Classe.hasMany(Salle, { foreignKey: 'idClasse' });
Salle.belongsTo(Classe, { foreignKey: 'idClasse' });

Salle.hasMany(Frequente, { foreignKey: 'idSalle' });
Frequente.belongsTo(Salle, { foreignKey: 'idSalle' });

Eleve.hasMany(Frequente, { foreignKey: 'matricule' });
Frequente.belongsTo(Eleve, { foreignKey: 'matricule' });

AnneeAcademique.hasMany(Frequente, { foreignKey: 'idAcademi' });
Frequente.belongsTo(AnneeAcademique, { foreignKey: 'idAcademi' });

Personne.hasOne(Enseignant, { foreignKey: 'idPers' });
Enseignant.belongsTo(Personne, { foreignKey: 'idPers' });

Personne.hasMany(Parents, { foreignKey: 'idPers' });
Parents.belongsTo(Personne, { foreignKey: 'idPers' });

Eleve.hasMany(Parents, { foreignKey: 'matricule' });
Parents.belongsTo(Eleve, { foreignKey: 'matricule' });

// ── NOUVELLES RELATIONS ─────────────────────────────────────

// Cours
Cours.hasMany(Epreuve, { foreignKey: 'idCours' });
Epreuve.belongsTo(Cours, { foreignKey: 'idCours' });

Cours.hasMany(EmploiDuTemps, { foreignKey: 'idCours' });
EmploiDuTemps.belongsTo(Cours, { foreignKey: 'idCours' });

// Epreuve
Epreuve.hasMany(Note, { foreignKey: 'idEpreuve' });
Note.belongsTo(Epreuve, { foreignKey: 'idEpreuve' });

// Eleve
Eleve.hasMany(Note, { foreignKey: 'matricule' });
Note.belongsTo(Eleve, { foreignKey: 'matricule' });

Eleve.hasMany(Paiement, { foreignKey: 'matricule' });
Paiement.belongsTo(Eleve, { foreignKey: 'matricule' });

Eleve.hasMany(Discipline, { foreignKey: 'matricule' });
Discipline.belongsTo(Eleve, { foreignKey: 'matricule' });

Eleve.hasMany(Scolarite, { foreignKey: 'matricule' });
Scolarite.belongsTo(Eleve, { foreignKey: 'matricule' });

// Classe
Classe.hasMany(EmploiDuTemps, { foreignKey: 'idClasse' });
EmploiDuTemps.belongsTo(Classe, { foreignKey: 'idClasse' });

Classe.hasMany(Epreuve, { foreignKey: 'idClasse' });
Epreuve.belongsTo(Classe, { foreignKey: 'idClasse' });

// Annee Academique
AnneeAcademique.hasMany(Trimestre, { foreignKey: 'idAnnee' });
Trimestre.belongsTo(AnneeAcademique, { foreignKey: 'idAnnee' });

AnneeAcademique.hasMany(Scolarite, { foreignKey: 'idAnnee' });
Scolarite.belongsTo(AnneeAcademique, { foreignKey: 'idAnnee' });

// Notification
Personne.hasMany(Notification, { foreignKey: 'idDestinataire' });
Notification.belongsTo(Personne, { foreignKey: 'idDestinataire' });

// Enseignant -> Salle (idTitulaire)
Enseignant.hasOne(Salle, { foreignKey: 'idTitulaire', as: 'salle' });
Salle.belongsTo(Enseignant, { foreignKey: 'idTitulaire', as: 'titulaire' });

// ── CONVERSATIONS ──────────────────────────────────────────
Conversation.hasMany(Message, { foreignKey: 'conversationId' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

Conversation.hasMany(ConversationParticipant, { foreignKey: 'idConversation' });
ConversationParticipant.belongsTo(Conversation, { foreignKey: 'idConversation' });

Personne.hasMany(Annonce, { foreignKey: 'auteurId' });
Annonce.belongsTo(Personne, { foreignKey: 'auteurId' });

module.exports = {
  sequelize,
  AnneeAcademique,
  Cycle,
  Classe,
  Salle,
  Eleve,
  Personne,
  Enseignant,
  Frequente,
  Admin,
  Parents,
  Message,
  Cours,
  Epreuve,
  Note,
  Paiement,
  Discipline,
  EmploiDuTemps,
  Scolarite,
  Trimestre,
  Notification,
  Conversation,
  ConversationParticipant,
  Annonce,
};
