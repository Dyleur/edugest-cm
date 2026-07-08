const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
  idNote: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idEpreuve: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  matricule: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  note: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  appreciation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Note',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Note;
