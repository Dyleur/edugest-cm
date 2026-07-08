const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmploiDuTemps = sequelize.define('EmploiDuTemps', {
  idEDT: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idClasse: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idCours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jourSemaine: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  heureDebut: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  heureFin: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  salle: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'EmploiDuTemps',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = EmploiDuTemps;
