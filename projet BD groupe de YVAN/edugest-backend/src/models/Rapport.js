const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Rapport = sequelize.define('Rapport', {
  idRap: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  libelle: { type: DataTypes.STRING(255), allowNull: false },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  matricule: { type: DataTypes.INTEGER, allowNull: false },
  idAca: { type: DataTypes.INTEGER, allowNull: true },
  commentaire: { type: DataTypes.TEXT, allowNull: true },
  event_date: { type: DataTypes.DATEONLY, allowNull: false },
  idPers: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'Rapport', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Rapport;
