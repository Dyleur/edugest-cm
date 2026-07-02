const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Salle = sequelize.define('Salle', {
  idSalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  libelle: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  surface: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  idClasse: {
    type: DataTypes.INTEGER,
    allowNull: false,  // une salle appartient à une classe
  },
  actif: {
    type: DataTypes.TINYINT,
    defaultValue: 1,  // 1 = active par défaut
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Salle',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Salle;