const epreuvesService = require('../services/epreuves.service');

const getAll = async (req, res) => {
  try {
    const epreuves = await epreuvesService.getAll();
    res.json({ success: true, data: epreuves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const epreuve = await epreuvesService.getById(req.params.id);
    res.json({ success: true, data: epreuve });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const epreuve = await epreuvesService.create(req.body);
    res.status(201).json({ success: true, message: 'Épreuve créée avec succès', data: epreuve });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const epreuve = await epreuvesService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Épreuve modifiée avec succès', data: epreuve });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await epreuvesService.remove(req.params.id);
    res.json({ success: true, message: 'Épreuve supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
