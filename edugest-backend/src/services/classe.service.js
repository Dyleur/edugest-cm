const { Classe, Cycle, Salle, Frequente, Eleve, Enseignant, Personne } = require('../models');

const getAllClasses = async () => {
  const classes = await Classe.findAll({
    include: [
      { model: Cycle, attributes: ['idCycle', 'libelle'] },
      { model: Salle, include: [{ model: Enseignant, as: 'titulaire', include: [{ model: Personne, attributes: ['nom', 'prenom'] }] }] },
    ],
    order: [['libelle', 'ASC']],
  });

  const result = [];
  for (const cl of classes) {
    const salles = cl.Salles || [];
    const salleIds = salles.map(s => s.idSalle);
    let effectif = 0;
    if (salleIds.length > 0) {
      effectif = await Frequente.count({ where: { idSalle: salleIds } });
    }
    const salle = salles[0] || null;
    const titulaire = salle?.titulaire?.Personne
      ? { nom: salle.titulaire.Personne.nom, prenom: salle.titulaire.Personne.prenom }
      : null;

    result.push({
      idClasse: cl.idClasse,
      libelle: cl.libelle,
      idCycle: cl.idCycle,
      idAdmin: cl.idAdmin,
      Cycle: cl.Cycle,
      effectif,
      salle: salle ? { libelle: salle.libelle, capacite: 45 } : null,
      titulaire,
      createdAt: cl.createdAt,
    });
  }

  return result;
};

const getClasseById = async (id) => {
  const classe = await Classe.findByPk(id, {
    include: [
      { model: Cycle },
      { model: Salle, include: [{ model: Enseignant, as: 'titulaire', include: [{ model: Personne }] }] },
    ],
  });
  if (!classe) throw new Error('Classe introuvable');
  return classe;
};

const getElevesByClasse = async (id) => {
  const salles = await Salle.findAll({ where: { idClasse: id } });
  const salleIds = salles.map(s => s.idSalle);
  const frequentes = await Frequente.findAll({
    where: { idSalle: salleIds },
    include: [{ model: Eleve }],
  });
  return frequentes.map(f => f.Eleve).filter(Boolean);
};

const createClasse = async (data) => {
  const classe = await Classe.create({ libelle: data.libelle, idCycle: data.idCycle });
  await Salle.create({
    libelle: `Salle ${data.libelle}`,
    idClasse: classe.idClasse,
    actif: 1,
    idAdmin: data.idAdmin || null,
  });
  return classe;
};

const updateClasse = async (id, data) => {
  const classe = await getClasseById(id);
  await classe.update(data);
  return classe;
};

const deleteClasse = async (id) => {
  const classe = await getClasseById(id);
  await classe.destroy();
  return { message: 'Classe supprimée avec succès' };
};

module.exports = { getAllClasses, getClasseById, getElevesByClasse, createClasse, updateClasse, deleteClasse };
