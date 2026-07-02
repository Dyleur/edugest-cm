const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Paiement = sequelize.define('Paiement', {
  idPaie: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  matricule: { type: DataTypes.INTEGER, allowNull: false },
  idAca: { type: DataTypes.INTEGER, allowNull: false },
  montant: { type: DataTypes.FLOAT, allowNull: false },
  url: { type: DataTypes.STRING(255), allowNull: true },
  comentaire: { type: DataTypes.STRING(255), allowNull: true },
  idMode: { type: DataTypes.INTEGER, allowNull: false },
  operation_ID: { type: DataTypes.STRING(30), allowNull: true },
  idPers: { type: DataTypes.INTEGER, allowNull: true },
  datePaie: { type: DataTypes.DATEONLY, allowNull: false },
  dateEnregistrer: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'Paiement', timestamps: false });

module.exports = Paiement;
