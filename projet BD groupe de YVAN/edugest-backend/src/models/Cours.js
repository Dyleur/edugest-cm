const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Cours = matière enseignée avec son coefficient
// Le coefficient est CRUCIAL pour le calcul des moyennes pondérées
const Cours = sequelize.define('Cours', {
  idCours: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  libelle: {
    type: DataTypes.STRING(255),
    allowNull: false  // ex: "Mathématiques", "Français"
  },
  note: {
    type: DataTypes.FLOAT,
    allowNull: true   // note maximale du cours
  },
  coefficient: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1   // coefficient pour la moyenne pondérée
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  idClasse: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idLivre: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'cours',
  timestamps: true
});

module.exports = Cours;