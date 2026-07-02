const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Livres = sequelize.define('Livres', {
  idLivre: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titre: { type: DataTypes.STRING(255), allowNull: false },
  auteurs: { type: DataTypes.STRING(255), allowNull: true },
  edition: { type: DataTypes.STRING(255), allowNull: true },
  annee_parution: { type: DataTypes.DATEONLY, allowNull: true },
  prix: { type: DataTypes.FLOAT, allowNull: true },
  idSpecialite: { type: DataTypes.INTEGER, allowNull: true },
  actif: { type: DataTypes.TINYINT, defaultValue: 1 },
  idAdmin: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'Livres', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Livres;
