const { AnneeAcademique } = require('../models');

// Récupérer toutes les années scolaires
const getAllAnnees = async () => {
  const annees = await AnneeAcademique.findAll({
    order: [['created_at', 'DESC']],
  });
  return annees;
};

// Récupérer une année par son ID
const getAnneeById = async (id) => {
  const annee = await AnneeAcademique.findByPk(id);
  if (!annee) {
    throw new Error('Année scolaire introuvable');
  }
  return annee;
};

// Créer une nouvelle année scolaire
const createAnnee = async (data) => {
  const annee = await AnneeAcademique.create({
    libelle: data.libelle,
    periode: data.periode,
  });
  return annee;
};

// Modifier une année scolaire
const updateAnnee = async (id, data) => {
  const annee = await getAnneeById(id);
  await annee.update({
    libelle: data.libelle,
    periode: data.periode,
  });
  return annee;
};

// Supprimer une année scolaire
const deleteAnnee = async (id) => {
  const annee = await getAnneeById(id);
  await annee.destroy();
  return { message: 'Année scolaire supprimée avec succès' };
};

module.exports = {
  getAllAnnees,
  getAnneeById,
  createAnnee,
  updateAnnee,
  deleteAnnee,
};