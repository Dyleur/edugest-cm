const { Discipline, Eleve } = require('../models');

const TYPES_INCIDENTS = [
  'Retard répété', 'Absence non justifiée', 'Bruit en classe',
  'Devoir non fait', 'Manque de respect', 'Bagarre',
  'Dégradation de matériel', 'Tricherie', 'Harcèlement',
  'Autre',
];

const getAll = async () => {
  return Discipline.findAll({
    include: [{ model: Eleve, attributes: ['nom', 'prenom', 'matricule'] }],
    order: [['dateIncident', 'DESC']],
  });
};

const getTypes = async () => {
  return TYPES_INCIDENTS;
};

const getById = async (id) => {
  const incident = await Discipline.findByPk(id);
  if (!incident) throw new Error('Incident introuvable');
  return incident;
};

const create = async (data) => {
  return Discipline.create({
    matricule: data.matricule,
    typeIncident: data.typeIncident,
    description: data.description,
    dateIncident: data.dateIncident,
    points: data.points || 0,
    statut: 'En attente',
    idEnseignant: data.idEnseignant,
  });
};

const update = async (id, data) => {
  const incident = await getById(id);
  await incident.update(data);
  return incident;
};

const justify = async (id, data) => {
  const incident = await getById(id);
  await incident.update({ statut: 'Résolu', ...data });
  return incident;
};

const remove = async (id) => {
  const incident = await getById(id);
  await incident.destroy();
};

module.exports = { getAll, getTypes, getById, create, update, justify, remove };
