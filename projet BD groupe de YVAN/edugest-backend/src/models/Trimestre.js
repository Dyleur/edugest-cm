const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trimestre = sequelize.define('Trimestre', {
  idTrimestre: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  libelle: {
    type: DataTypes.STRING(255),
    allowNull: false  // ex: "Trimestre 1", "Trimestre 2"
  },
  periode: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  idAca: {
    type: DataTypes.INTEGER,
    allowNull: true   // lien vers AnneeAcademique
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'trimestres',
  timestamps: true
});

module.exports = Trimestre;