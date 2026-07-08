const edtService = require('../services/edt.service');

const getAll = async (req, res) => {
  try {
    const edt = await edtService.getAll();
    res.json({ success: true, data: edt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByClasse = async (req, res) => {
  try {
    const edt = await edtService.getByClasse(req.params.id);
    res.json({ success: true, data: edt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByCours = async (req, res) => {
  try {
    const edt = await edtService.getByCours(req.params.id);
    res.json({ success: true, data: edt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const edt = await edtService.create(req.body);
    res.status(201).json({ success: true, message: 'Emploi du temps créé avec succès', data: edt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const edt = await edtService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Emploi du temps modifié avec succès', data: edt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await edtService.remove(req.params.id);
    res.json({ success: true, message: 'Emploi du temps supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getByClasse, getByCours, create, update, remove };
