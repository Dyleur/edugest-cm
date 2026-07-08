const { Trimestre } = require('../models');

const getAll = async () => {
  return Trimestre.findAll({ order: [['dateDebut', 'ASC']] });
};

const getById = async (id) => {
  const trimestre = await Trimestre.findByPk(id);
  if (!trimestre) throw new Error('Trimestre introuvable');
  return trimestre;
};

const create = async (data) => {
  return Trimestre.create(data);
};

const update = async (id, data) => {
  const trimestre = await getById(id);
  await trimestre.update(data);
  return trimestre;
};

const remove = async (id) => {
  const trimestre = await getById(id);
  await trimestre.destroy();
};

module.exports = { getAll, getById, create, update, remove };
