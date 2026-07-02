const { Evaluation, Cours, Session, Trimestre } = require('../models/index');

// Calcule la moyenne pondérée d'un élève pour une session
// Formule : Σ(note × coefficient) / Σ(coefficients)
const calculerMoyenne = async (matricule, idSession) => {

  const evaluations = await Evaluation.findAll({
    where: { matricule, idSession },
    include: [{
      model: Cours,
      attributes: ['libelle', 'coefficient']
    }]
  });

  if (evaluations.length === 0) return 0;

  let sommeProduits = 0;    // Σ(note × coefficient)
  let sommeCoefficients = 0; // Σ(coefficients)

  evaluations.forEach(eval => {
    const coefficient = eval.Cours.coefficient || 1;
    sommeProduits += eval.note * coefficient;
    sommeCoefficients += coefficient;
  });

  // Arrondi à 2 décimales
  return Math.round((sommeProduits / sommeCoefficients) * 100) / 100;
};

// Génère le bulletin complet d'un élève pour une session
const genererBulletin = async (matricule, idSession) => {

  const evaluations = await Evaluation.findAll({
    where: { matricule, idSession },
    include: [
      { model: Cours, attributes: ['libelle', 'coefficient'] },
      { model: Session, attributes: ['libelle'],
        include: [{ model: Trimestre, attributes: ['libelle'] }]
      }
    ]
  });

  if (evaluations.length === 0) {
    return null;
  }

  // Calcule la moyenne
  const moyenne = await calculerMoyenne(matricule, idSession);

  // Détermine l'appréciation générale
  let appreciationGenerale;
  if (moyenne >= 16) appreciationGenerale = 'Très bien';
  else if (moyenne >= 14) appreciationGenerale = 'Bien';
  else if (moyenne >= 12) appreciationGenerale = 'Assez bien';
  else if (moyenne >= 10) appreciationGenerale = 'Passable';
  else appreciationGenerale = 'Insuffisant';

  // Construit le bulletin
  const bulletin = {
    matricule,
    session: evaluations[0].Session?.libelle,
    trimestre: evaluations[0].Session?.Trimestre?.libelle,
    notes: evaluations.map(e => ({
      matiere: e.Cours.libelle,
      coefficient: e.Cours.coefficient,
      note: e.note,
      appreciation: e.appreciation
    })),
    moyenne,
    appreciationGenerale
  };

  return bulletin;
};

module.exports = { calculerMoyenne, genererBulletin };