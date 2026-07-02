const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Frequente = sequelize.define('Frequente', {
  idFrequente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idSalle: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idAcademi: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  matricule: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Format : 'PRESENT|' ou 'ABSENT|Maladie'
  commentaire: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Frequente',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Frequente;