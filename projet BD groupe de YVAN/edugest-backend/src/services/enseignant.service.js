const { Enseignant, Personne, Salle, Classe } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Récupérer tous les enseignants
const getAllEnseignants = async (query) => {
  const where = {};

  // Recherche par nom ou prénom
  if (query.search) {
    where[Op.or] = [
      { nom: { [Op.like]: `%${query.search}%` } },
      { prenom: { [Op.like]: `%${query.search}%` } },
    ];
  }

  const enseignants = await Enseignant.findAll({
    include: [{
      model: Personne,
      where,           // filtre appliqué sur Personne
      attributes: [
        'idPers', 'nom', 'prenom',
        'mobile', 'username', 'typePersonne'
      ],
    }],
    order: [[Personne, 'nom', 'ASC']],
  });
  return enseignants;
};

// Récupérer un enseignant par son ID
const getEnseignantById = async (id) => {
  const enseignant = await Enseignant.findByPk(id, {
    include: [{
      model: Personne,
      attributes: [
        'idPers', 'nom', 'prenom',
        'mobile', 'username', 'typePersonne'
      ],
    }],
  });
  if (!enseignant) {
    throw new Error('Enseignant introuvable');
  }
  return enseignant;
};

// Créer un enseignant (Personne + Enseignant)
const createEnseignant = async (data) => {
  // Vérifier que le username n'existe pas déjà
  const existingPersonne = await Personne.findOne({
    where: { username: data.username },
  });
  if (existingPersonne) {
    throw new Error('Ce nom d\'utilisateur existe déjà');
  }

  // Chiffrer le mot de passe
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Étape 1 : Créer la Personne
  const personne = await Personne.create({
    nom: data.nom,
    prenom: data.prenom,
    mobile: data.mobile,
    typePersonne: 1,          // 1 = Enseignant
    username: data.username,
    password: hashedPassword,
  });

  // Étape 2 : Créer l'Enseignant lié à la Personne
  const enseignant = await Enseignant.create({
    idPers: personne.idPers,
    idCours: data.idCours,
    Actif: 1,
  });

  return enseignant;
};

// Modifier un enseignant
const updateEnseignant = async (id, data) => {
  const enseignant = await getEnseignantById(id);

  // Modifier la Personne liée
  await Personne.update(
    {
      nom: data.nom,
      prenom: data.prenom,
      mobile: data.mobile,
    },
    { where: { idPers: enseignant.idPers } }
  );

  // Modifier l'Enseignant
  await enseignant.update({
    idCours: data.idCours,
  });

  return await getEnseignantById(id);
};

// Désactiver un enseignant
const deleteEnseignant = async (id) => {
  const enseignant = await getEnseignantById(id);
  await enseignant.update({ Actif: 0 });
  return { message: 'Enseignant désactivé avec succès' };
};

module.exports = {
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
};