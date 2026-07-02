const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Discipline = sequelize.define('Discipline', {
  ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  libelle: { type: DataTypes.STRING(255), allowNull: false },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  description: { type: DataTypes.TEXT, allowNull: true },
  actif: { type: DataTypes.TINYINT, defaultValue: 1 }
}, { tableName: 'Discipline', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Discipline;
