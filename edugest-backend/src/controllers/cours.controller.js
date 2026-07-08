const coursService = require('../services/cours.service');

const getAll = async (req, res) => {
  try {
    const cours = await coursService.getAll();
    res.json({ success: true, data: cours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const cours = await coursService.getById(req.params.id);
    res.json({ success: true, data: cours });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const cours = await coursService.create(req.body);
    res.status(201).json({ success: true, message: 'Matière créée avec succès', data: cours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const cours = await coursService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Matière modifiée avec succès', data: cours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await coursService.remove(req.params.id);
    res.json({ success: true, message: 'Matière supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
