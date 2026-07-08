const { Eleve, Frequente, Salle, Classe, Cycle, AnneeAcademique, Note, Epreuve, Cours, Paiement, Discipline, Parents, Personne } = require('../models');
const { Op } = require('sequelize');

const getAllEleves = async (query) => {
  const where = {};
  if (query.search) {
    where[Op.or] = [
      { nom: { [Op.like]: `%${query.search}%` } },
      { prenom: { [Op.like]: `%${query.search}%` } },
    ];
  }
  if (query.sexe) where.sexe = query.sexe;

  const eleves = await Eleve.findAll({
    where,
    include: [{
      model: Frequente,
      include: [{ model: Salle, include: [{ model: Classe }] }],
    }],
    order: [['nom', 'ASC']],
  });
  return eleves;
};

const getEleveById = async (matricule) => {
  const eleve = await Eleve.findByPk(matricule, {
    include: [{
      model: Frequente,
      include: [{ model: Salle, include: [{ model: Classe, include: [{ model: Cycle }] }] }, { model: AnneeAcademique }],
    }],
  });
  if (!eleve) throw new Error('Élève introuvable');
  return eleve;
};

const getEleveNotes = async (matricule) => {
  return Note.findAll({
    where: { matricule },
    include: [{ model: Epreuve, include: [{ model: Cours }] }],
    order: [['created_at', 'DESC']],
  });
};

const getElevePresences = async (matricule) => {
  return Frequente.findAll({
    where: { matricule },
    include: [{ model: Salle }, { model: AnneeAcademique }],
    order: [['created_at', 'DESC']],
  });
};

const getElevePaiements = async (matricule) => {
  return Paiement.findAll({ where: { matricule }, order: [['datePaiement', 'DESC']] });
};

const getEleveBulletin = async (matricule) => {
  const notes = await Note.findAll({
    where: { matricule },
    include: [{ model: Epreuve, include: [{ model: Cours }] }],
  });

  const matieres = notes.map(n => ({
    matiere: n.Epreuve?.Cours?.libelle || 'Matière',
    note: n.note,
    coefficient: n.Epreuve?.Cours?.coefficient || 1,
    noteMax: n.Epreuve?.noteMax || 20,
  }));

  const totalPoints = matieres.reduce((sum, m) => sum + (Number(m.note) || 0) * m.coefficient, 0);
  const totalCoeffs = matieres.reduce((sum, m) => sum + m.coefficient, 0);
  const moyenne = totalCoeffs > 0 ? (totalPoints / totalCoeffs).toFixed(2) : 0;

  return { matricule, matieres, moyenne };
};

const getEleveDiscipline = async (matricule) => {
  return Discipline.findAll({ where: { matricule }, order: [['dateIncident', 'DESC']] });
};

const getEleveParents = async (matricule) => {
  return Parents.findAll({
    where: { matricule },
    include: [{ model: Personne, attributes: ['idPers', 'nom', 'prenom', 'mobile'] }],
  });
};

const createEleve = async (data) => {
  const eleve = await Eleve.create({
    nom: data.nom, prenom: data.prenom, dateNaissance: data.dateNaissance,
    lieuNaissance: data.lieuNaissance, sexe: data.sexe, langue: data.langue,
    photoURL: data.photoURL, actif: 1,
  });
  if (data.idSalle) {
    const annee = await AnneeAcademique.findOne({ order: [['idAnnee', 'DESC']] });
    if (annee) {
      await Frequente.create({
        idSalle: data.idSalle,
        idAcademi: annee.idAnnee,
        matricule: eleve.matricule,
      });
    }
  }
  return eleve;
};

const addEleveParent = async (matricule, data) => {
  return Parents.create({ matricule, idPers: data.idPers, idAdmin: data.idAdmin });
};

const updateEleve = async (matricule, data) => {
  const eleve = await getEleveById(matricule);
  await eleve.update(data);
  return eleve;
};

const deleteEleve = async (matricule) => {
  const eleve = await getEleveById(matricule);
  await eleve.update({ actif: 0 });
  return { message: 'Élève désactivé avec succès' };
};

module.exports = {
  getAllEleves, getEleveById, createEleve, updateEleve, deleteEleve,
  getEleveNotes, getElevePresences, getElevePaiements, getEleveBulletin,
  getEleveDiscipline, getEleveParents, addEleveParent,
};
