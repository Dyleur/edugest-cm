const trimestresService = require('../services/trimestres.service');

const getAll = async (req, res) => {
  try {
    const trimestres = await trimestresService.getAll();
    res.json({ success: true, data: trimestres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const trimestre = await trimestresService.getById(req.params.id);
    res.json({ success: true, data: trimestre });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const trimestre = await trimestresService.create(req.body);
    res.status(201).json({ success: true, message: 'Trimestre créé avec succès', data: trimestre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const trimestre = await trimestresService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Trimestre modifié avec succès', data: trimestre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await trimestresService.remove(req.params.id);
    res.json({ success: true, message: 'Trimestre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
