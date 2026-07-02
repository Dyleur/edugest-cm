const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Evaluation = note individuelle d'un élève à une épreuve
// C'est la table CENTRALE de ton module
const Evaluation = sequelize.define('Evaluation', {
  idEval: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  note: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,   // note minimale
      max: 20   // note maximale
    }
  },
  appreciation: {
    type: DataTypes.STRING(255),
    allowNull: true  // ex: "Très bien", "Peut mieux faire"
  },
  matricule: {
    type: DataTypes.STRING,
    allowNull: false  // matricule de l'élève
  },
  idEpreuve: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idCours: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idSession: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idPers: {
    type: DataTypes.INTEGER,
    allowNull: true   // enseignant qui a saisi la note
  }
}, {
  tableName: 'evaluations',
  timestamps: true
});

module.exports = Evaluation;