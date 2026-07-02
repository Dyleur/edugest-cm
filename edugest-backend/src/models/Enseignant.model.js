const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enseignant = sequelize.define('Enseignant', {
  idEnseignant: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idPers: {
    type: DataTypes.INTEGER,
    allowNull: false,  // lié à une Personne
  },
  idCours: {
    type: DataTypes.INTEGER,
    allowNull: false,  // lié à une matière
  },
  Actif: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Enseignant',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Enseignant;