const { sequelize } = require('../config/database');

// Import de tous les modèles
const NatureEpreuve = require('./NatureEpreuve');
const Trimestre = require('./Trimestre');
const Session = require('./Session');
const Cours = require('./Cours');
const Epreuve = require('./Epreuve');
const Evaluation = require('./Evaluation');
const Personne = require('./Personne');
const Messages = require('./Messages');

// ── ASSOCIATIONS (relations entre tables) ──────────────────────

// NatureEpreuve → Epreuve (1 nature peut avoir plusieurs épreuves)
NatureEpreuve.hasMany(Epreuve, { foreignKey: 'idNature' });
Epreuve.belongsTo(NatureEpreuve, { foreignKey: 'idNature' });

// Trimestre → Session (1 trimestre a plusieurs sessions)
Trimestre.hasMany(Session, { foreignKey: 'idTrimestre' });
Session.belongsTo(Trimestre, { foreignKey: 'idTrimestre' });

// Epreuve → Evaluation (1 épreuve a plusieurs notes)
Epreuve.hasMany(Evaluation, { foreignKey: 'idEpreuve' });
Evaluation.belongsTo(Epreuve, { foreignKey: 'idEpreuve' });

// Cours → Evaluation (1 cours a plusieurs notes)
Cours.hasMany(Evaluation, { foreignKey: 'idCours' });
Evaluation.belongsTo(Cours, { foreignKey: 'idCours' });

// Session → Evaluation (1 session a plusieurs notes)
Session.hasMany(Evaluation, { foreignKey: 'idSession' });
Evaluation.belongsTo(Session, { foreignKey: 'idSession' });

// Personne → Messages envoyés
Personne.hasMany(Messages, { foreignKey: 'idExp_Pers', as: 'messagesEnvoyes' });
Messages.belongsTo(Personne, { foreignKey: 'idExp_Pers', as: 'expediteur' });

// Fonction pour synchroniser les modèles avec la DB
// force: false = ne supprime pas les tables existantes
const syncDB = async () => {
  await sequelize.sync({ force: false });
  console.log('✅ Tables synchronisées avec PostgreSQL');
};

module.exports = {
  sequelize,
  syncDB,
  NatureEpreuve,
  Trimestre,
  Session,
  Cours,
  Epreuve,
  Evaluation,
  Personne,
  Messages
};