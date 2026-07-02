const { Parents, Eleve, Personne } = require('../models');

const getEnfantsByParentId = async (idParent) => {
  const parent = await Personne.findByPk(idParent);
  if (!parent) {
    throw new Error('Parent introuvable');
  }

  const liens = await Parents.findAll({
    where: { idPers: idParent },
    include: [{
      model: Eleve,
      attributes: ['matricule', 'nom', 'prenom', 'dateNaissance', 'sexe', 'langue', 'photoURL', 'actif'],
    }],
  });

  return liens.map(lien => ({
    idParent: lien.idParent,
    ...lien.Eleve.toJSON(),
  }));
};

module.exports = { getEnfantsByParentId };
