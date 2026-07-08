const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Epreuve = sequelize.define('Epreuve', {
  idEpreuve: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idCours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  libelle: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING(50),
    defaultValue: 'Devoir',
  },
  dateEpreuve: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  noteMax: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
  },
  idClasse: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Epreuve',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Epreuve;
