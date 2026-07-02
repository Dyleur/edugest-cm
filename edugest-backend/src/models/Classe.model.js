const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Classe = sequelize.define('Classe', {
  idClasse: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  libelle: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  idCycle: {
    type: DataTypes.INTEGER,
    allowNull: false,  // une classe appartient toujours à un cycle
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Classe',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Classe;