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

// ── RELATIONS ──────────────────────────────────────────────

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
};
