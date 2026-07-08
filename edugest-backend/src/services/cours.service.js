const { Cours } = require('../models');

const getAll = async () => {
  return Cours.findAll({ where: { actif: 1 }, order: [['libelle', 'ASC']] });
};

const getById = async (id) => {
  const cours = await Cours.findByPk(id);
  if (!cours) throw new Error('Matière introuvable');
  return cours;
};

const create = async (data) => {
  return Cours.create({
    libelle: data.libelle,
    coefficient: data.coefficient || 1,
    actif: 1,
  });
};

const update = async (id, data) => {
  const cours = await getById(id);
  await cours.update({
    libelle: data.libelle,
    coefficient: data.coefficient,
  });
  return cours;
};

const remove = async (id) => {
  const cours = await getById(id);
  await cours.destroy();
};

module.exports = { getAll, getById, create, update, remove };
