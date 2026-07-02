const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Messages = communication entre acteurs de l'école
const Messages = sequelize.define('Messages', {
  idMessages: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idExp_Pers: {
    type: DataTypes.INTEGER,
    allowNull: false  // expéditeur (Personne)
  },
  idParent: {
    type: DataTypes.INTEGER,
    allowNull: true   // destinataire parent (optionnel)
  },
  objet: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  information: {
    type: DataTypes.TEXT,
    allowNull: false  // contenu du message
  },
  type_message: {
    type: DataTypes.SMALLINT,
    allowNull: true   // 1=Info, 2=Convocation, 3=Résultat...
  },
  AnneeAcade: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  valider: {
    type: DataTypes.BOOLEAN,
    defaultValue: false  // message validé par le directeur ?
  }
}, {
  tableName: 'messages',
  timestamps: true
});

module.exports = Messages;