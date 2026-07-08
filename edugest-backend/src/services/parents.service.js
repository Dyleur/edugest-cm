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

const getAll = async () => {
  return Personne.findAll({
    where: { typePersonne: 3 },
    include: [{ model: Parents, include: [{ model: Eleve, attributes: ['matricule', 'nom', 'prenom'] }] }],
    order: [['nom', 'ASC']],
  });
};

const getById = async (id) => {
  const parent = await Personne.findByPk(id, {
    include: [{ model: Parents, include: [{ model: Eleve, attributes: ['matricule', 'nom', 'prenom'] }] }],
  });
  if (!parent) throw new Error('Parent introuvable');
  return parent;
};

const create = async (data) => {
  return Personne.create({
    nom: data.nom,
    prenom: data.prenom,
    dateNaissance: data.dateNaissance,
    lieuNaissance: data.lieuNaissance,
    mobile: data.mobile,
    phone: data.phone,
    typePersonne: 3,
    username: data.username,
    password: data.password,
    alanyaID: data.alanyaID,
    idAdmin: data.idAdmin,
  });
};

const update = async (id, data) => {
  const parent = await Personne.findByPk(id);
  if (!parent) throw new Error('Parent introuvable');
  await parent.update(data);
  return parent;
};

const remove = async (id) => {
  const parent = await Personne.findByPk(id);
  if (!parent) throw new Error('Parent introuvable');
  await Parents.destroy({ where: { idPers: id } });
  await parent.destroy();
};

module.exports = { getEnfantsByParentId, getAll, getById, create, update, remove };
