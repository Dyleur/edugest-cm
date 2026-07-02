const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Justificatifs = sequelize.define('Justificatifs', {
  ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idRap: { type: DataTypes.INTEGER, allowNull: false },
  urlDoc: { type: DataTypes.STRING(255), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'Justificatifs', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Justificatifs;
