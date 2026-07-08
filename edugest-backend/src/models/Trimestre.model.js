const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trimestre = sequelize.define('Trimestre', {
  idTrimestre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  libelle: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  dateDebut: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  dateFin: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  idAnnee: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  actif: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
}, {
  tableName: 'Trimestre',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Trimestre;
