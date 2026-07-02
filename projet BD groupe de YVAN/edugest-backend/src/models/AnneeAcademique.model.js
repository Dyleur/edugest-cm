const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AnneeAcademique = sequelize.define('AnneeAcademique', {
  idAnnee: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  libelle: {
    type: DataTypes.STRING(200),
    allowNull: false,  // obligatoire
  },
  periode: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'AnneeAcademique',  // nom exact de la table MySQL
  timestamps: true,               // gère created_at automatiquement
  createdAt: 'created_at',
  updatedAt: false,               // pas de updated_at dans le MCD
});

module.exports = AnneeAcademique;