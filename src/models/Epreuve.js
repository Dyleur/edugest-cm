const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Epreuve = un devoir ou examen spécifique
// Exemple : "Devoir 1 de Mathématiques - Trimestre 1"
const Epreuve = sequelize.define('Epreuve', {
  idEpreuve: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  libelle: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  urlDoc: {
    type: DataTypes.STRING(255),
    allowNull: true   // lien vers le document de l'épreuve
  },
  auteur: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  idNature: {
    type: DataTypes.INTEGER,
    allowNull: false  // lien vers NatureEpreuve (Contrôle, Examen...)
  },
  idPers: {
    type: DataTypes.INTEGER,
    allowNull: true   // enseignant qui a créé l'épreuve
  }
}, {
  tableName: 'epreuves',
  timestamps: true
});

module.exports = Epreuve;