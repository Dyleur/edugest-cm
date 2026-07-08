const { sequelize } = require('../config/database');

const NatureEpreuve = require('./NatureEpreuve');
const Trimestre = require('./Trimestre');
const Session = require('./Session');
const Cours = require('./Cours');
const Epreuve = require('./Epreuve');
const Evaluation = require('./Evaluation');
const Personne = require('./Personne');
const Messages = require('./Messages');
const Eleve = require('./Eleve.model');
const Enseignant = require('./Enseignant.model');
const Classe = require('./Classe.model');
const Cycle = require('./Cycle.model');
const AnneeAcademique = require('./AnneeAcademique.model');
const Salle = require('./Salle.model');
const Frequente = require('./Frequente.model');
const EmploiDuTemps = require('./EmploiDuTemps');
const Scolarite = require('./Scolarite');
const Tranches = require('./Tranches');
const Mode = require('./Mode');
const Paiement = require('./Paiement');
const Rapport = require('./Rapport');
const Discipline = require('./Discipline');
const Justificatifs = require('./Justificatifs');
const FicheEnseignant = require('./FicheEnseignant');
const Titulaire = require('./Titulaire');
const Parents = require('./Parents');
const Livres = require('./Livres');
const Specialite = require('./Specialite');
const VilleNaissance = require('./VilleNaissance');

NatureEpreuve.hasMany(Epreuve, { foreignKey: 'idNature' });
Epreuve.belongsTo(NatureEpreuve, { foreignKey: 'idNature' });

Trimestre.hasMany(Session, { foreignKey: 'idTrimestre' });
Session.belongsTo(Trimestre, { foreignKey: 'idTrimestre' });

Epreuve.hasMany(Evaluation, { foreignKey: 'idEpreuve' });
Evaluation.belongsTo(Epreuve, { foreignKey: 'idEpreuve' });

Cours.hasMany(Evaluation, { foreignKey: 'idCours' });
Evaluation.belongsTo(Cours, { foreignKey: 'idCours' });

Session.hasMany(Evaluation, { foreignKey: 'idSession' });
Evaluation.belongsTo(Session, { foreignKey: 'idSession' });

Personne.hasMany(Messages, { foreignKey: 'idExp_Pers', as: 'messagesEnvoyes' });
Messages.belongsTo(Personne, { foreignKey: 'idExp_Pers', as: 'expediteur' });

Cycle.hasMany(Classe, { foreignKey: 'idCycle' });
Classe.belongsTo(Cycle, { foreignKey: 'idCycle' });

Classe.hasMany(Salle, { foreignKey: 'idClasse' });
Salle.belongsTo(Classe, { foreignKey: 'idClasse' });

Salle.hasMany(Frequente, { foreignKey: 'idSalle' });
Frequente.belongsTo(Salle, { foreignKey: 'idSalle' });

VilleNaissance.hasMany(Eleve, { foreignKey: 'idVilleNaissance' });
Eleve.belongsTo(VilleNaissance, { foreignKey: 'idVilleNaissance' });
Eleve.hasMany(Frequente, { foreignKey: 'matricule' });
Frequente.belongsTo(Eleve, { foreignKey: 'matricule' });

AnneeAcademique.hasMany(Frequente, { foreignKey: 'idAcademi' });
Frequente.belongsTo(AnneeAcademique, { foreignKey: 'idAcademi' });

Personne.hasOne(Enseignant, { foreignKey: 'idPers' });
Enseignant.belongsTo(Personne, { foreignKey: 'idPers' });

Scolarite.hasMany(Tranches, { foreignKey: 'idScolarite' });
Tranches.belongsTo(Scolarite, { foreignKey: 'idScolarite' });

Cycle.hasMany(Scolarite, { foreignKey: 'idCycle' });
Scolarite.belongsTo(Cycle, { foreignKey: 'idCycle' });

Mode.hasMany(Paiement, { foreignKey: 'idMode' });
Paiement.belongsTo(Mode, { foreignKey: 'idMode' });

Eleve.hasMany(Paiement, { foreignKey: 'matricule' });
Paiement.belongsTo(Eleve, { foreignKey: 'matricule' });

AnneeAcademique.hasMany(Paiement, { foreignKey: 'idAca' });
Paiement.belongsTo(AnneeAcademique, { foreignKey: 'idAca' });

Rapport.hasMany(Justificatifs, { foreignKey: 'idRap' });
Justificatifs.belongsTo(Rapport, { foreignKey: 'idRap' });

Enseignant.hasMany(FicheEnseignant, { foreignKey: 'idEnseignant' });
FicheEnseignant.belongsTo(Enseignant, { foreignKey: 'idEnseignant' });

Personne.hasMany(Titulaire, { foreignKey: 'idPers' });
Titulaire.belongsTo(Personne, { foreignKey: 'idPers' });
Salle.hasMany(Titulaire, { foreignKey: 'idSalle' });
Titulaire.belongsTo(Salle, { foreignKey: 'idSalle' });

Personne.hasMany(Parents, { foreignKey: 'idPers' });
Parents.belongsTo(Personne, { foreignKey: 'idPers' });
Eleve.hasMany(Parents, { foreignKey: 'matricule' });
Parents.belongsTo(Eleve, { foreignKey: 'matricule' });

EmploiDuTemps.belongsTo(Classe, { foreignKey: 'idClasse' });
EmploiDuTemps.belongsTo(Cours, { foreignKey: 'idCours' });

Rapport.belongsTo(Eleve, { foreignKey: 'matricule' });
Eleve.hasMany(Rapport, { foreignKey: 'matricule' });

Cours.belongsTo(Livres, { foreignKey: 'idLivre' });
Livres.hasMany(Cours, { foreignKey: 'idLivre' });
Livres.belongsTo(Specialite, { foreignKey: 'idSpecialite' });
Specialite.hasMany(Livres, { foreignKey: 'idSpecialite' });

const syncDB = async () => {
  await sequelize.sync({ force: false });
};

module.exports = {
  sequelize, syncDB,
  NatureEpreuve, Trimestre, Session, Cours, Epreuve, Evaluation, Personne, Messages,
  Eleve, Enseignant, Classe, Cycle, AnneeAcademique, Salle, Frequente,
  EmploiDuTemps, Scolarite, Tranches, Mode, Paiement, Rapport, Discipline,
  Justificatifs, FicheEnseignant, Titulaire, Parents, Livres, Specialite, VilleNaissance
};
