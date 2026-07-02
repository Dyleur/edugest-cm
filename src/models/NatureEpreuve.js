const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Table NatureEpreuve — définit les types d'épreuves
// Exemples : Contrôle, Composition, Devoir, Examen
const NatureEpreuve = sequelize.define('NatureEpreuve', {
  idNature: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  libelle: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'nature_epreuves',
  timestamps: true  // ajoute created_at et updated_at automatiquement
});

module.exports = NatureEpreuve;