const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  idMessage: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expediteurId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expediteurType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'PERSONNE',
  },
  destinataireId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  destinataireType: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  destinataireNom: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  objet: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  typeMessage: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
  },
  statut: {
    type: DataTypes.STRING(20),
    defaultValue: 'Envoyé',
  },
  dateEnvoi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  luLe: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fichierUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  fichierNom: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Message',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Message;
