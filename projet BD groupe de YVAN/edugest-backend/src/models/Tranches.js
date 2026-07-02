const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tranches = sequelize.define('Tranches', {
  idTranche: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  libelle: { type: DataTypes.STRING(255), allowNull: false },
  montant: { type: DataTypes.FLOAT, allowNull: false },
  idScolarite: { type: DataTypes.INTEGER, allowNull: false },
  actif: { type: DataTypes.TINYINT, defaultValue: 1 },
  idAdmin: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'Tranches', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Tranches;
