const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cycle = sequelize.define('Cycle', {
  idCycle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  libelle: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Cycle',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Cycle;