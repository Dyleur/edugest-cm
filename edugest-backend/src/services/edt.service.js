const { EmploiDuTemps, Cours, Classe } = require('../models');

const getAll = async () => {
  return EmploiDuTemps.findAll({
    include: [
      { model: Cours, attributes: ['libelle', 'coefficient'] },
      { model: Classe, attributes: ['libelle'] },
    ],
    order: [['jourSemaine', 'ASC'], ['heureDebut', 'ASC']],
  });
};

const getByClasse = async (classeId) => {
  return EmploiDuTemps.findAll({
    where: { idClasse: classeId },
    include: [{ model: Cours, attributes: ['libelle', 'coefficient'] }],
    order: [['jourSemaine', 'ASC'], ['heureDebut', 'ASC']],
  });
};

const getByCours = async (coursId) => {
  return EmploiDuTemps.findAll({
    where: { idCours: coursId },
    include: [{ model: Classe, attributes: ['libelle'] }],
    order: [['jourSemaine', 'ASC'], ['heureDebut', 'ASC']],
  });
};

const create = async (data) => {
  return EmploiDuTemps.create(data);
};

const update = async (id, data) => {
  const edt = await EmploiDuTemps.findByPk(id);
  if (!edt) throw new Error('Emploi du temps introuvable');
  await edt.update(data);
  return edt;
};

const remove = async (id) => {
  const edt = await EmploiDuTemps.findByPk(id);
  if (!edt) throw new Error('Emploi du temps introuvable');
  await edt.destroy();
};

module.exports = { getAll, getByClasse, getByCours, create, update, remove };
