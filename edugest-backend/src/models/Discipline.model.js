const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Discipline = sequelize.define('Discipline', {
  idDiscipline: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  matricule: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  typeIncident: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dateIncident: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  statut: {
    type: DataTypes.STRING(20),
    defaultValue: 'En attente',
  },
  idEnseignant: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Discipline',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Discipline;
