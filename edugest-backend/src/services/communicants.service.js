const { Personne, Admin } = require('../models');

const getAll = async () => {
  const personnes = await Personne.findAll({
    where: { typePersonne: [1, 2, 3, 4] },
    attributes: ['idPers', 'nom', 'prenom', 'typePersonne', 'mobile'],
    order: [['nom', 'ASC']],
  });

  const admins = await Admin.findAll({
    attributes: ['ID', 'nom', 'username'],
    where: { actif: 1 },
    order: [['nom', 'ASC']],
  });

  const communicants = personnes.map(p => ({
    id: p.idPers,
    nom: p.nom,
    prenom: p.prenom,
    role: p.typePersonne === 1 ? 'ENSEIGNANT' : p.typePersonne === 2 ? 'DIRECTEUR' : p.typePersonne === 3 ? 'RESPONSABLE_ADMIN' : 'PARENT',
    mobile: p.mobile,
  }));

  admins.forEach(a => {
    communicants.push({
      id: a.ID,
      nom: a.nom,
      prenom: '',
      role: 'ADMIN',
      mobile: '',
    });
  });

  communicants.sort((a, b) => a.nom.localeCompare(b.nom));
  return communicants;
};

module.exports = { getAll };
