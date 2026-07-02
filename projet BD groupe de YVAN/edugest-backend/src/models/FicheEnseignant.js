const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FicheEnseignant = sequelize.define('FicheEnseignant', {
  idRap: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idEnseignant: { type: DataTypes.INTEGER, allowNull: false },
  libelle: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  idAdmin: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'FicheEnseignant', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = FicheEnseignant;
