const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  idNotification: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idDestinataire: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  typeDestinataire: {
    type: DataTypes.STRING(20),
    defaultValue: 'PARENT',
  },
  titre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  typeNotification: {
    type: DataTypes.STRING(50),
    defaultValue: 'info',
  },
  referenceType: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lu: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  dateCreation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  dateLecture: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Notification',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Notification;
