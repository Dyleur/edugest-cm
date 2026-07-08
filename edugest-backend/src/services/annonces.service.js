const { Annonce } = require('../models');
const { Op } = require('sequelize');

const getAll = async (userRole) => {
  const where = {};
  if (userRole !== 'ADMIN') {
    where[Op.or] = [
      { cibleRoles: { [Op.like]: '%' + userRole + '%' } },
      { cibleRoles: 'ALL' },
    ];
  }
  return Annonce.findAll({
    where,
    order: [['dateCreation', 'DESC']],
  });
};

const getById = async (id) => {
  const annonce = await Annonce.findByPk(id);
  if (!annonce) throw new Error('Annonce introuvable');
  return annonce;
};

const create = async (data) => {
  return Annonce.create({
    titre: data.titre,
    contenu: data.contenu,
    auteurId: data.auteurId,
    auteurNom: data.auteurNom,
    auteurRole: data.auteurRole,
    fichierUrl: data.fichierUrl || null,
    fichierNom: data.fichierNom || null,
    fichierTaille: data.fichierTaille || null,
    cibleRoles: data.cibleRoles || 'ALL',
    dateCreation: new Date(),
  });
};

const remove = async (id, userId) => {
  const annonce = await getById(id);
  if (annonce.auteurId !== userId) throw new Error('Non autorisé');
  await annonce.destroy();
  return annonce;
};

module.exports = { getAll, getById, create, remove };
