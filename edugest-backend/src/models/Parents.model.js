const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parents = sequelize.define('Parents', {
  idParent: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idPers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  matricule: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Parents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Parents;
