const { Classe, Cycle, Salle } = require('../models');

// Récupérer toutes les classes
const getAllClasses = async () => {
  const classes = await Classe.findAll({
    include: [
      {
        model: Cycle,   // inclut le niveau de chaque classe
        attributes: ['idCycle', 'libelle'],
      },
      {
        model: Salle,   // inclut les salles de chaque classe
        attributes: ['idSalle', 'libelle'],
      },
    ],
    order: [['created_at', 'DESC']],
  });
  return classes;
};

// Récupérer une classe par son ID
const getClasseById = async (id) => {
  const classe = await Classe.findByPk(id, {
    include: [
      {
        model: Cycle,
        attributes: ['idCycle', 'libelle'],
      },
      {
        model: Salle,
        attributes: ['idSalle', 'libelle'],
      },
    ],
  });
  if (!classe) {
    throw new Error('Classe introuvable');
  }
  return classe;
};

// Créer une classe
const createClasse = async (data) => {
  // Vérifier que le cycle existe
  const cycle = await Cycle.findByPk(data.idCycle);
  if (!cycle) {
    throw new Error('Niveau scolaire introuvable');
  }

  const classe = await Classe.create({
    libelle: data.libelle,
    idCycle: data.idCycle,
  });
  return classe;
};

// Modifier une classe
const updateClasse = async (id, data) => {
  const classe = await getClasseById(id);

  // Vérifier que le nouveau cycle existe si fourni
  if (data.idCycle) {
    const cycle = await Cycle.findByPk(data.idCycle);
    if (!cycle) {
      throw new Error('Niveau scolaire introuvable');
    }
  }

  await classe.update({
    libelle: data.libelle,
    idCycle: data.idCycle,
  });
  return classe;
};

// Supprimer une classe
const deleteClasse = async (id) => {
  const classe = await getClasseById(id);
  await classe.destroy();
  return { message: 'Classe supprimée avec succès' };
};

module.exports = {
  getAllClasses,
  getClasseById,
  createClasse,
  updateClasse,
  deleteClasse,
};