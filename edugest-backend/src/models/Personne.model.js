const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Personne = sequelize.define('Personne', {
  idPers: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  dateNaissance: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  lieuNaissance: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  mobile: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  typePersonne: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  alanyaID: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Personne',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Personne;
