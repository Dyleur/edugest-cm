const { Note, Epreuve, Cours, Eleve, Frequente, Salle, Classe } = require('../models');
const { Op } = require('sequelize');

const getAll = async () => {
  const eleves = await Eleve.findAll({
    include: [{
      model: Frequente,
      include: [{ model: Salle, include: [{ model: Classe }] }],
    }],
  });
  return eleves.map(eleve => ({
    matricule: eleve.matricule,
    nom: eleve.nom,
    prenom: eleve.prenom,
    classe: eleve.Frequentes?.[0]?.Salle?.Classe?.libelle || '-',
  }));
};

const getByEleve = async (matricule, idSession) => {
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

  const totalPoints = matieres.reduce((sum, m) => sum + (m.note || 0) * m.coefficient, 0);
  const totalCoeffs = matieres.reduce((sum, m) => sum + m.coefficient, 0);
  const moyenne = totalCoeffs > 0 ? (totalPoints / totalCoeffs).toFixed(2) : 0;

  return { matricule, matieres, moyenne };
};

const getByClasse = async (classeId, idSession) => {
  const eleves = await Eleve.findAll({
    include: [{
      model: Frequente,
      where: { '$Frequente.Salle.idClasse$': classeId },
      include: [{ model: Salle }],
    }],
  });

  const bulletins = [];
  for (const eleve of eleves) {
    const bulletin = await getByEleve(eleve.matricule, idSession);
    bulletins.push({ ...bulletin, nom: eleve.nom, prenom: eleve.prenom });
  }
  return bulletins;
};

const getMoyenne = async (matricule, idSession) => {
  const result = await getByEleve(matricule, idSession);
  return { matricule: result.matricule, moyenne: result.moyenne, matieres: result.matieres };
};

module.exports = { getAll, getByEleve, getByClasse, getMoyenne };
