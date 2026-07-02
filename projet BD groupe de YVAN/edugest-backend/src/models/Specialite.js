const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Specialite = sequelize.define('Specialite', {
  idSpecialite: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  libelle: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  idAdmin: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'Specialite', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Specialite;
