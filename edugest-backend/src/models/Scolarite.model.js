const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Scolarite = sequelize.define('Scolarite', {
  idScolarite: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  matricule: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  montantTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  montantPaye: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  idAnnee: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Scolarite',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Scolarite;
