const { Frequente } = require('../models');
const { Op } = require('sequelize');

const faireAppel = async (data) => {
  const results = [];
  for (const item of data.presences || []) {
    const [record, created] = await Frequente.findOrCreate({
      where: {
        idSalle: data.idSalle,
        idAcademi: data.idAcademi,
        matricule: item.matricule,
      },
      defaults: {
        idSalle: data.idSalle,
        idAcademi: data.idAcademi,
        matricule: item.matricule,
        commentaire: item.statut === 'present' ? 'PRESENT' : `ABSENT|${item.motif || ''}`,
      },
    });
    results.push(record);
  }
  return results;
};

const marquerPresent = async (data) => {
  const [record, created] = await Frequente.findOrCreate({
    where: { idSalle: data.idSalle, idAcademi: data.idAcademi, matricule: data.matricule },
    defaults: { idSalle: data.idSalle, idAcademi: data.idAcademi, matricule: data.matricule, commentaire: 'PRESENT' },
  });
  if (!created) await record.update({ commentaire: 'PRESENT' });
  return record;
};

const marquerAbsent = async (data) => {
  const motif = data.motif || '';
  const [record, created] = await Frequente.findOrCreate({
    where: { idSalle: data.idSalle, idAcademi: data.idAcademi, matricule: data.matricule },
    defaults: { idSalle: data.idSalle, idAcademi: data.idAcademi, matricule: data.matricule, commentaire: `ABSENT|${motif}` },
  });
  if (!created) await record.update({ commentaire: `ABSENT|${motif}` });
  return record;
};

const getPresencesBySalle = async (idSalle, idAcademi) => {
  return Frequente.findAll({ where: { idSalle, idAcademi } });
};

const getPresencesByEleve = async (matricule) => {
  return Frequente.findAll({ where: { matricule }, order: [['created_at', 'DESC']] });
};

const getAbsencesByEleve = async (matricule) => {
  return Frequente.findAll({
    where: { matricule, commentaire: { [Op.like]: 'ABSENT%' } },
    order: [['created_at', 'DESC']],
  });
};

const getGlobalStats = async () => {
  const total = await Frequente.count();
  const presents = await Frequente.count({ where: { commentaire: 'PRESENT' } });
  const absents = await Frequente.count({ where: { commentaire: { [Op.like]: 'ABSENT%' } } });
  return { total, presents, absents, taux: total > 0 ? Math.round(presents / total * 100) : 0 };
};

const getStatistiquesBySalle = async (idSalle, idAcademi) => {
  const total = await Frequente.count({ where: { idSalle, idAcademi } });
  const presents = await Frequente.count({ where: { idSalle, idAcademi, commentaire: 'PRESENT' } });
  const absents = await Frequente.count({ where: { idSalle, idAcademi, commentaire: { [Op.like]: 'ABSENT%' } } });
  return { total, presents, absents, taux: total > 0 ? Math.round(presents / total * 100) : 0 };
};

module.exports = {
  faireAppel, marquerPresent, marquerAbsent,
  getPresencesBySalle, getPresencesByEleve, getAbsencesByEleve,
  getGlobalStats, getStatistiquesBySalle,
};
