const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Annonce = sequelize.define('Annonce', {
  idAnnonce: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titre: { type: DataTypes.STRING(255), allowNull: false },
  contenu: { type: DataTypes.TEXT, allowNull: true },
  auteurId: { type: DataTypes.INTEGER, allowNull: false },
  auteurNom: { type: DataTypes.STRING(255), allowNull: true },
  auteurRole: { type: DataTypes.STRING(50), allowNull: true },
  fichierUrl: { type: DataTypes.STRING(500), allowNull: true },
  fichierNom: { type: DataTypes.STRING(255), allowNull: true },
  fichierTaille: { type: DataTypes.INTEGER, allowNull: true },
  cibleRoles: { type: DataTypes.STRING(500), allowNull: true, defaultValue: 'ALL' },
  dateCreation: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'Annonce',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Annonce;
