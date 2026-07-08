const { Salle, Classe } = require('../models');

const getAll = async () => {
  return Salle.findAll({
    include: [{ model: Classe, attributes: ['libelle'] }],
    order: [['libelle', 'ASC']],
  });
};

const create = async (data) => {
  return Salle.create(data);
};

const setTitulaire = async (id, data) => {
  const salle = await Salle.findByPk(id);
  if (!salle) throw new Error('Salle introuvable');
  await salle.update({ idTitulaire: data.idEnseignant });
  return salle;
};

const getById = async (id) => {
  const salle = await Salle.findByPk(id, {
    include: [{ model: Classe, attributes: ['libelle'] }],
  });
  if (!salle) throw new Error('Salle introuvable');
  return salle;
};

const update = async (id, data) => {
  const salle = await Salle.findByPk(id);
  if (!salle) throw new Error('Salle introuvable');
  await salle.update(data);
  return salle;
};

const remove = async (id) => {
  const salle = await Salle.findByPk(id);
  if (!salle) throw new Error('Salle introuvable');
  await salle.destroy();
};

module.exports = { getAll, create, setTitulaire, getById, update, remove };
