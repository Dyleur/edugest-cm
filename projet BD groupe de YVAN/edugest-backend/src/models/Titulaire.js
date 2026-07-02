const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Titulaire = sequelize.define('Titulaire', {
  idTitulaire: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idPers: { type: DataTypes.INTEGER, allowNull: false },
  idSalle: { type: DataTypes.INTEGER, allowNull: false },
  idAdmin: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'Titulaire', timestamps: true, createdAt: 'created_at', updatedAt: false });

module.exports = Titulaire;
