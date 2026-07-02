const { Frequente, Eleve, Salle, Classe, Cycle, AnneeAcademique } = require('../models');

// Récupérer toutes les inscriptions
const getAllInscriptions = async () => {
  const inscriptions = await Frequente.findAll({
    include: [
      {
        model: Eleve,
        attributes: ['matricule', 'nom', 'prenom', 'sexe'],
      },
      {
        model: Salle,
        attributes: ['idSalle', 'libelle'],
        include: [{
          model: Classe,
          attributes: ['idClasse', 'libelle'],
          include: [{
            model: Cycle,
            attributes: ['idCycle', 'libelle'],
          }],
        }],
      },
      {
        model: AnneeAcademique,
        attributes: ['idAnnee', 'libelle'],
      },
    ],
    order: [['created_at', 'DESC']],
  });
  return inscriptions;
};

// Récupérer les inscriptions d'un élève
const getInscriptionsByEleve = async (matricule) => {
  // Vérifier que l'élève existe
  const eleve = await Eleve.findByPk(matricule);
  if (!eleve) {
    throw new Error('Élève introuvable');
  }

  const inscriptions = await Frequente.findAll({
    where: { matricule },
    include: [
      {
        model: Salle,
        attributes: ['idSalle', 'libelle'],
        include: [{
          model: Classe,
          attributes: ['idClasse', 'libelle'],
        }],
      },
      {
        model: AnneeAcademique,
        attributes: ['idAnnee', 'libelle'],
      },
    ],
    order: [['created_at', 'DESC']],
  });
  return inscriptions;
};

// Inscrire un élève
const inscrireEleve = async (data) => {
  // Vérifier que l'élève existe
  const eleve = await Eleve.findByPk(data.matricule);
  if (!eleve) {
    throw new Error('Élève introuvable');
  }

  // Vérifier que la salle existe
  const salle = await Salle.findByPk(data.idSalle);
  if (!salle) {
    throw new Error('Salle introuvable');
  }

  // Vérifier que l'année scolaire existe
  const annee = await AnneeAcademique.findByPk(data.idAcademi);
  if (!annee) {
    throw new Error('Année scolaire introuvable');
  }

  // Vérifier qu'il n'est pas déjà inscrit cette année
  const dejaInscrit = await Frequente.findOne({
    where: {
      matricule: data.matricule,
      idAcademi: data.idAcademi,
    },
  });
  if (dejaInscrit) {
    throw new Error('Cet élève est déjà inscrit pour cette année scolaire');
  }

  // Créer l'inscription
  const inscription = await Frequente.create({
    matricule: data.matricule,
    idSalle: data.idSalle,
    idAcademi: data.idAcademi,
    commentaire: 'INSCRIT|',
  });

  return inscription;
};

// Modifier une inscription
const updateInscription = async (id, data) => {
  const inscription = await Frequente.findByPk(id);
  if (!inscription) {
    throw new Error('Inscription introuvable');
  }

  // Vérifier que la nouvelle salle existe
  if (data.idSalle) {
    const salle = await Salle.findByPk(data.idSalle);
    if (!salle) {
      throw new Error('Salle introuvable');
    }
  }

  await inscription.update({
    idSalle: data.idSalle,
  });

  return inscription;
};

// Annuler une inscription
const deleteInscription = async (id) => {
  const inscription = await Frequente.findByPk(id);
  if (!inscription) {
    throw new Error('Inscription introuvable');
  }
  await inscription.destroy();
  return { message: 'Inscription annulée avec succès' };
};

module.exports = {
  getAllInscriptions,
  getInscriptionsByEleve,
  inscrireEleve,
  updateInscription,
  deleteInscription,
};