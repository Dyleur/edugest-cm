const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmploiDuTemps = sequelize.define('EmploiDuTemps', {
  idTemps: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  jour: { type: DataTypes.STRING(30), allowNull: false },
  heure: { type: DataTypes.STRING(6), allowNull: false },
  idClasse: { type: DataTypes.INTEGER, allowNull: false },
  idCours: { type: DataTypes.INTEGER, allowNull: false },
  idAdmin: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'EmploiDuTemps', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = EmploiDuTemps;
