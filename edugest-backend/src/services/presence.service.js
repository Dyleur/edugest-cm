const { Frequente, Eleve, Salle, Classe, AnneeAcademique } = require('../models');

// Marquer un élève présent
const marquerPresent = async (data) => {
  // Vérifier que l'inscription existe
  const inscription = await Frequente.findOne({
    where: {
      matricule: data.matricule,
      idAcademi: data.idAcademi,
      idSalle: data.idSalle,
    },
  });
  if (!inscription) {
    throw new Error('Aucune inscription trouvée pour cet élève');
  }

  // Mettre à jour le statut
  await inscription.update({
    commentaire: 'PRESENT|',
  });

  return inscription;
};

// Marquer un élève absent
const marquerAbsent = async (data) => {
  // Vérifier que l'inscription existe
  const inscription = await Frequente.findOne({
    where: {
      matricule: data.matricule,
      idAcademi: data.idAcademi,
      idSalle: data.idSalle,
    },
  });
  if (!inscription) {
    throw new Error('Aucune inscription trouvée pour cet élève');
  }

  // Le motif est optionnel — 'Sans motif' par défaut
  const motif = data.motif || 'Sans motif';

  // Mettre à jour le statut
  await inscription.update({
    commentaire: `ABSENT|${motif}`,
  });

  return inscription;
};

// Récupérer les présences d'une salle
const getPresencesBySalle = async (idSalle, idAcademi) => {
  const presences = await Frequente.findAll({
    where: {
      idSalle,
      idAcademi,
    },
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
        }],
      },
      {
        model: AnneeAcademique,
        attributes: ['idAnnee', 'libelle'],
      },
    ],
    order: [[Eleve, 'nom', 'ASC']],
  });

  // On enrichit chaque enregistrement avec le statut parsé
  const result = presences.map((p) => {
    const raw = p.commentaire || '';
    const parts = raw.split('|');
    return {
      ...p.toJSON(),
      statut: parts[0] || 'INCONNU',   // PRESENT ou ABSENT
      motif: parts[1] || '',            // motif de l'absence
    };
  });

  return result;
};

// Récupérer les absences d'un élève
const getAbsencesByEleve = async (matricule) => {
  // Vérifier que l'élève existe
  const eleve = await Eleve.findByPk(matricule);
  if (!eleve) {
    throw new Error('Élève introuvable');
  }

  // Récupérer toutes ses lignes marquées ABSENT
  const absences = await Frequente.findAll({
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
  });

  // Filtrer uniquement les absences et parser le commentaire
  const result = absences
    .filter((p) => p.commentaire && p.commentaire.startsWith('ABSENT'))
    .map((p) => {
      const parts = p.commentaire.split('|');
      return {
        ...p.toJSON(),
        statut: parts[0],
        motif: parts[1] || 'Sans motif',
      };
    });

  return result;
};

// Statistiques de présence d'une salle
const getStatistiquesBySalle = async (idSalle, idAcademi) => {
  const presences = await Frequente.findAll({
    where: { idSalle, idAcademi },
  });

  const total = presences.length;
  const presents = presences.filter(
    (p) => p.commentaire && p.commentaire.startsWith('PRESENT')
  ).length;
  const absents = presences.filter(
    (p) => p.commentaire && p.commentaire.startsWith('ABSENT')
  ).length;

  return {
    total,
    presents,
    absents,
    tauxPresence: total > 0 ? ((presents / total) * 100).toFixed(2) + '%' : '0%',
    tauxAbsence: total > 0 ? ((absents / total) * 100).toFixed(2) + '%' : '0%',
  };
};

module.exports = {
  marquerPresent,
  marquerAbsent,
  getPresencesBySalle,
  getAbsencesByEleve,
  getStatistiquesBySalle,
};