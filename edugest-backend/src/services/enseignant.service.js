const { Enseignant, Personne, Salle, Classe } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const sallesService = require('./salles.service');

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

  const includeClauses = [{
    model: Personne,
    where,           // filtre appliqué sur Personne
    attributes: [
      'idPers', 'nom', 'prenom',
      'mobile', 'username', 'typePersonne'
    ],
  }, {
    model: Salle,
    as: 'salle',
    required: false,
    include: [{ model: Classe, attributes: ['libelle'] }],
  }];

  const enseignants = await Enseignant.findAll({
    include: includeClauses,
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
    }, {
      model: Salle,
      as: 'salle',
      required: false,
      include: [{ model: Classe, attributes: ['libelle'] }],
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

  // Vérifier qu'un enseignant ne peut avoir qu'une seule classe
  // On vérifie si l'enseignant a déjà une Salle assignée (via idTitulaire)
  // Mais ici on crée un nouvel enseignant, donc pas de vérification nécessaire

  if (data.idSalle) {
    // Vérifier que la salle existe
    const salle = await Salle.findByPk(data.idSalle, {
      include: [{ model: Classe }],
    });
    if (!salle) throw new Error('Classe introuvable');

    // Vérifier max 2 enseignants par classe (compter les salles de la même classe avec un titulaire)
    const sallesMemeClasse = await Salle.findAll({
      where: { idClasse: salle.idClasse, idTitulaire: { [Op.ne]: null } },
    });
    if (sallesMemeClasse.length >= 2) {
      throw new Error('Cette classe a déjà le maximum de 2 enseignants');
    }

    // Vérifier que la salle n'a pas déjà un titulaire
    if (salle.idTitulaire) {
      throw new Error('Cette salle a déjà un enseignant assigné');
    }
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

  // Étape 3 : Assigner l'enseignant à la salle (classe)
  if (data.idSalle) {
    await sallesService.setTitulaire(data.idSalle, { idEnseignant: enseignant.idEnseignant });
  }

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

  // Mettre à jour l'assignation de classe si idSalle est fourni
  if (data.idSalle) {
    // Retirer l'enseignant de son ancienne salle
    await Salle.update({ idTitulaire: null }, { where: { idTitulaire: id } });
    // Assigner à la nouvelle salle
    await sallesService.setTitulaire(data.idSalle, { idEnseignant: id });
  }

  return await getEnseignantById(id);
};

// Désactiver un enseignant
const deleteEnseignant = async (id) => {
  const enseignant = await getEnseignantById(id);
  await enseignant.update({ Actif: 0 });
  return { message: 'Enseignant désactivé avec succès' };
};

// Récupérer les classes liées à un enseignant
const getClassesByEnseignant = async (id) => {
  await getEnseignantById(id);

  // Trouver les salles dont cet enseignant est le titulaire
  const salles = await Salle.findAll({
    where: { idTitulaire: id },
    include: [{ model: Classe, attributes: ['libelle'] }],
    order: [['libelle', 'ASC']],
  });

  return salles;
};

module.exports = {
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
  getClassesByEnseignant,
};