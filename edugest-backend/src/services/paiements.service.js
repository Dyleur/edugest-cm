const { Paiement, Eleve, Scolarite } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const getAll = async () => {
  return Paiement.findAll({
    include: [{ model: Eleve, attributes: ['nom', 'prenom', 'matricule'] }],
    order: [['datePaiement', 'DESC']],
  });
};

const getStats = async () => {
  const total = await Paiement.sum('montant');
  const count = await Paiement.count();
  return { total: total || 0, count };
};

const getImpayes = async () => {
  const impayes = await Scolarite.findAll({
    where: { montantPaye: { [Op.lt]: sequelize.col('montantTotal') } },
    include: [{ model: Eleve, attributes: ['nom', 'prenom', 'matricule'] }],
  });
  return impayes.map(s => ({
    ...s.toJSON(),
    reste: s.montantTotal - s.montantPaye,
  }));
};

const getById = async (id) => {
  const paiement = await Paiement.findByPk(id);
  if (!paiement) throw new Error('Paiement introuvable');
  return paiement;
};

const create = async (data) => {
  return Paiement.create(data);
};

const update = async (id, data) => {
  const paiement = await getById(id);
  await paiement.update(data);
  return paiement;
};

const remove = async (id) => {
  const paiement = await getById(id);
  await paiement.destroy();
};

module.exports = { getAll, getStats, getImpayes, getById, create, update, remove };
