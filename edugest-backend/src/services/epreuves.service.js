const { Epreuve, Cours } = require('../models');

const getAll = async () => {
  return Epreuve.findAll({
    include: [{ model: Cours, attributes: ['libelle', 'coefficient'] }],
    order: [['dateEpreuve', 'DESC']],
  });
};

const getById = async (id) => {
  const epreuve = await Epreuve.findByPk(id, { include: [{ model: Cours }] });
  if (!epreuve) throw new Error('Épreuve introuvable');
  return epreuve;
};

const create = async (data) => {
  return Epreuve.create({
    idCours: data.idCours,
    libelle: data.libelle,
    type: data.type || 'Devoir',
    dateEpreuve: data.dateEpreuve,
    noteMax: data.noteMax || 20,
    idClasse: data.idClasse,
  });
};

const update = async (id, data) => {
  const epreuve = await getById(id);
  await epreuve.update(data);
  return epreuve;
};

const remove = async (id) => {
  const epreuve = await getById(id);
  await epreuve.destroy();
};

module.exports = { getAll, getById, create, update, remove };
