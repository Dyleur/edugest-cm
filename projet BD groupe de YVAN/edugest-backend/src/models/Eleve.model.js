const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Eleve = sequelize.define('Eleve', {
  matricule: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  dateNaissance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  lieuNaissance: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  sexe: {
    type: DataTypes.SMALLINT,
    allowNull: false,  // 1 = Masculin, 2 = Féminin
  },
  langue: {
    type: DataTypes.STRING(30),
    allowNull: true,   // FR, EN, BIL
  },
  photoURL: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  actif: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  idVilleNaissance: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Eleve',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Eleve;