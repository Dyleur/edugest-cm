const disciplineService = require('../services/discipline.service');

const getAll = async (req, res) => {
  try {
    const incidents = await disciplineService.getAll();
    res.json({ success: true, data: incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTypes = async (req, res) => {
  try {
    const types = await disciplineService.getTypes();
    res.json({ success: true, data: types });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const incident = await disciplineService.getById(req.params.id);
    res.json({ success: true, data: incident });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const incident = await disciplineService.create(req.body);
    res.status(201).json({ success: true, message: 'Incident signalé avec succès', data: incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const incident = await disciplineService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Incident modifié avec succès', data: incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const justify = async (req, res) => {
  try {
    const incident = await disciplineService.justify(req.params.id, req.body);
    res.json({ success: true, message: 'Incident justifié avec succès', data: incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await disciplineService.remove(req.params.id);
    res.json({ success: true, message: 'Incident supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getTypes, getById, create, update, justify, remove };
