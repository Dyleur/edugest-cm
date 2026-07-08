const sallesService = require('../services/salles.service');

const getAll = async (req, res) => {
  try {
    const salles = await sallesService.getAll();
    res.json({ success: true, data: salles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const salle = await sallesService.create(req.body);
    res.status(201).json({ success: true, message: 'Salle créée avec succès', data: salle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const setTitulaire = async (req, res) => {
  try {
    const result = await sallesService.setTitulaire(req.params.id, req.body);
    res.json({ success: true, message: 'Titulaire affecté avec succès', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const salle = await sallesService.getById(req.params.id);
    res.json({ success: true, data: salle });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const salle = await sallesService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Salle modifiée avec succès', data: salle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await sallesService.remove(req.params.id);
    res.json({ success: true, message: 'Salle supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, create, setTitulaire, getById, update, remove };
