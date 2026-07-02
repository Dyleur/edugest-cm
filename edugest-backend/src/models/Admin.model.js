const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  actif: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  typeAdmin: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
  mobile: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  alanyaID: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
}, {
  tableName: 'Admin',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Admin;
