const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Scolarite = sequelize.define('Scolarite', {
  idScolarite: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  libelle: { type: DataTypes.STRING(255), allowNull: false },
  inscription: { type: DataTypes.FLOAT, defaultValue: 0 },
  pension: { type: DataTypes.FLOAT, defaultValue: 0 },
  idCycle: { type: DataTypes.INTEGER, allowNull: false },
  idFondateur: { type: DataTypes.INTEGER, allowNull: true },
  actif: { type: DataTypes.TINYINT, defaultValue: 1 },
  delai_mois: { type: DataTypes.STRING(2), allowNull: true },
  delai_jour: { type: DataTypes.STRING(2), allowNull: true },
  idAdmin: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'Scolarite', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Scolarite;
