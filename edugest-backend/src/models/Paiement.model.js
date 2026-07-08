const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Paiement = sequelize.define('Paiement', {
  idPaiement: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  matricule: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  datePaiement: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  modePaiement: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  motif: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reference: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Paiement',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Paiement;
