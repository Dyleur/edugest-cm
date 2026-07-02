const { Cycle, Classe } = require('../models');

// Récupérer tous les cycles
const getAllCycles = async () => {
  const cycles = await Cycle.findAll({
    include: [{
      model: Classe,        // inclut les classes de chaque cycle
      attributes: ['idClasse', 'libelle'],
    }],
    order: [['created_at', 'DESC']],
  });
  return cycles;
};

// Récupérer un cycle par son ID
const getCycleById = async (id) => {
  const cycle = await Cycle.findByPk(id, {
    include: [{
      model: Classe,
      attributes: ['idClasse', 'libelle'],
    }],
  });
  if (!cycle) {
    throw new Error('Niveau scolaire introuvable');
  }
  return cycle;
};

// Créer un cycle
const createCycle = async (data) => {
  const cycle = await Cycle.create({
    libelle: data.libelle,
    description: data.description,
  });
  return cycle;
};

// Modifier un cycle
const updateCycle = async (id, data) => {
  const cycle = await getCycleById(id);
  await cycle.update({
    libelle: data.libelle,
    description: data.description,
  });
  return cycle;
};

// Supprimer un cycle
const deleteCycle = async (id) => {
  const cycle = await getCycleById(id);
  await cycle.destroy();
  return { message: 'Niveau scolaire supprimé avec succès' };
};

module.exports = {
  getAllCycles,
  getCycleById,
  createCycle,
  updateCycle,
  deleteCycle,
};