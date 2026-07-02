const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mode = sequelize.define('Mode', {
  idMode: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  libelle: { type: DataTypes.STRING(100), allowNull: false },
  information: { type: DataTypes.TEXT, allowNull: true },
  actif: { type: DataTypes.TINYINT, defaultValue: 1 }
}, { tableName: 'Mode', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Mode;
