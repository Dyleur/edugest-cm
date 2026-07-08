const parentsService = require('../services/parents.service');

const getEnfants = async (req, res) => {
  try {
    const enfants = await parentsService.getEnfantsByParentId(req.params.idParent);
    res.status(200).json({ success: true, data: enfants });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const parents = await parentsService.getAll();
    res.status(200).json({ success: true, data: parents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const parent = await parentsService.getById(req.params.id);
    res.status(200).json({ success: true, data: parent });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const parent = await parentsService.create(req.body);
    res.status(201).json({ success: true, message: 'Parent créé avec succès', data: parent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const parent = await parentsService.update(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Parent modifié avec succès', data: parent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await parentsService.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Parent supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEnfants, getAll, getById, create, update, remove };
