const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Personne = sequelize.define('Personne', {
  idPers: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  typePersonne: {
    type: DataTypes.SMALLINT,
    allowNull: true  // 1=Admin, 2=Enseignant, 3=Parent...
  },
  idAdmin: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'personnes',
  timestamps: true
});

module.exports = Personne;