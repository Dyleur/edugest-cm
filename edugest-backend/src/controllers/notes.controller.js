const notesService = require('../services/notes.service');

const getByEleve = async (req, res) => {
  try {
    const notes = await notesService.getByEleve(req.params.matricule);
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const note = await notesService.create(req.body);
    res.status(201).json({ success: true, message: 'Note enregistrée avec succès', data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const note = await notesService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Note modifiée avec succès', data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const notes = await notesService.getAll();
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await notesService.remove(req.params.id);
    res.json({ success: true, message: 'Note supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getByEleve, create, update, getAll, remove };
