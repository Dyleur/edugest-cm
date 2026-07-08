const { Note, Epreuve, Cours } = require('../models');

const getByEleve = async (matricule) => {
  return Note.findAll({
    where: { matricule },
    include: [{ model: Epreuve, include: [{ model: Cours }] }],
    order: [['created_at', 'DESC']],
  });
};

const create = async (data) => {
  return Note.create({
    idEpreuve: data.idEpreuve,
    matricule: data.matricule,
    note: data.note,
    appreciation: data.appreciation,
  });
};

const update = async (id, data) => {
  const note = await Note.findByPk(id);
  if (!note) throw new Error('Note introuvable');
  await note.update({ note: data.note, appreciation: data.appreciation });
  return note;
};

const getAll = async () => {
  return Note.findAll({
    include: [{ model: Epreuve, include: [{ model: Cours }] }],
    order: [['created_at', 'DESC']],
  });
};

const remove = async (id) => {
  const note = await Note.findByPk(id);
  if (!note) throw new Error('Note introuvable');
  await note.destroy();
};

module.exports = { getByEleve, create, update, getAll, remove };
