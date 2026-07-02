const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Session = séquence d'évaluation dans un trimestre
// Exemple : Session 1 du Trimestre 1
const Session = sequelize.define('Session', {
  idSession: {
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
  },
  idTrimestre: {
    type: DataTypes.INTEGER,
    allowNull: false  // une session appartient toujours à un trimestre
  },
  idPers: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'sessions',
  timestamps: true
});

module.exports = Session;