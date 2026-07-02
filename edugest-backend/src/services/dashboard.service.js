const { Eleve, Enseignant, Classe, Frequente } = require('../models');

const getStats = async () => {
  const [
    totalEleves,
    totalEnseignants,
    totalClasses,
    presences,
  ] = await Promise.all([
    Eleve.count({ where: { actif: 1 } }),
    Enseignant.count({ where: { Actif: 1 } }),
    Classe.count(),
    Frequente.findAll({
      attributes: ['commentaire'],
    }),
  ]);

  const totalPresences = presences.length;
  const presents = presences.filter(p => p.commentaire && p.commentaire.startsWith('PRESENT')).length;
  const absents = presences.filter(p => p.commentaire && p.commentaire.startsWith('ABSENT')).length;

  return {
    totalEleves,
    totalEnseignants,
    totalClasses,
    totalInscriptions: totalPresences,
    presents,
    absents,
    tauxPresence: totalPresences > 0 ? Number(((presents / totalPresences) * 100).toFixed(2)) : 0,
    tauxAbsence: totalPresences > 0 ? Number(((absents / totalPresences) * 100).toFixed(2)) : 0,
  };
};

module.exports = { getStats };
