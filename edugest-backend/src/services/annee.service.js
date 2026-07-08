const { AnneeAcademique } = require('../models');
const { Op } = require('sequelize');

const getAllAnnees = async () => {
  return AnneeAcademique.findAll({ order: [['libelle', 'DESC']] });
};

const getAnneeCourante = async () => {
  const annee = await AnneeAcademique.findOne({ order: [['idAnnee', 'DESC']] });
  if (!annee) throw new Error('Aucune année académique trouvée');
  return annee;
};

const getAnneeById = async (id) => {
  const annee = await AnneeAcademique.findByPk(id);
  if (!annee) throw new Error('Année académique introuvable');
  return annee;
};

const createAnnee = async (data) => {
  return AnneeAcademique.create(data);
};

const updateAnnee = async (id, data) => {
  const annee = await getAnneeById(id);
  await annee.update(data);
  return annee;
};

const deleteAnnee = async (id) => {
  const annee = await getAnneeById(id);
  await annee.destroy();
  return { message: 'Année académique supprimée avec succès' };
};

module.exports = { getAllAnnees, getAnneeCourante, getAnneeById, createAnnee, updateAnnee, deleteAnnee };
