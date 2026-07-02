const { Eleve, Frequente, Salle, Classe, Cycle, AnneeAcademique } = require('../models');
const { Op } = require('sequelize');

// Récupérer tous les élèves
const getAllEleves = async (query) => {
  // Recherche par nom ou prénom si fourni
  const where = {};
  if (query.search) {
    where[Op.or] = [
      { nom: { [Op.like]: `%${query.search}%` } },
      { prenom: { [Op.like]: `%${query.search}%` } },
    ];
  }

  // Filtre par sexe si fourni
  if (query.sexe) {
    where.sexe = query.sexe;
  }

  const eleves = await Eleve.findAll({
    where,
    order: [['nom', 'ASC']],
  });
  return eleves;
};

// Récupérer un élève par son matricule
const getEleveById = async (matricule) => {
  const eleve = await Eleve.findByPk(matricule, {
    include: [{
      model: Frequente,
      include: [{
        model: Salle,
        include: [{
          model: Classe,
          include: [{ model: Cycle }],
        }],
      }, {
        model: AnneeAcademique,
      }],
    }],
  });
  if (!eleve) {
    throw new Error('Élève introuvable');
  }
  return eleve;
};

// Créer un élève
const createEleve = async (data) => {
  const eleve = await Eleve.create({
    nom: data.nom,
    prenom: data.prenom,
    dateNaissance: data.dateNaissance,
    lieuNaissance: data.lieuNaissance,
    sexe: data.sexe,
    langue: data.langue,
    photoURL: data.photoURL,
    actif: 1,
  });
  return eleve;
};

// Modifier un élève
const updateEleve = async (matricule, data) => {
  const eleve = await getEleveById(matricule);
  await eleve.update({
    nom: data.nom,
    prenom: data.prenom,
    dateNaissance: data.dateNaissance,
    lieuNaissance: data.lieuNaissance,
    sexe: data.sexe,
    langue: data.langue,
    photoURL: data.photoURL,
  });
  return eleve;
};

// Supprimer un élève (désactivation)
const deleteEleve = async (matricule) => {
  const eleve = await getEleveById(matricule);
  // On désactive au lieu de supprimer définitivement
  await eleve.update({ actif: 0 });
  return { message: 'Élève désactivé avec succès' };
};

module.exports = {
  getAllEleves,
  getEleveById,
  createEleve,
  updateEleve,
  deleteEleve,
};