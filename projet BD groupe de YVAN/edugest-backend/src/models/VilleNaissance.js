const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VilleNaissance = sequelize.define('VilleNaissance', {
  idVille: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(60), allowNull: false },
  actif: { type: DataTypes.TINYINT, defaultValue: 1 }
}, { tableName: 'VilleNaissance', timestamps: false });

module.exports = VilleNaissance;
