const paiementsService = require('../services/paiements.service');

const getAll = async (req, res) => {
  try {
    const paiements = await paiementsService.getAll();
    res.json({ success: true, data: paiements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await paiementsService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getImpayes = async (req, res) => {
  try {
    const impayes = await paiementsService.getImpayes();
    res.json({ success: true, data: impayes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const paiement = await paiementsService.getById(req.params.id);
    res.json({ success: true, data: paiement });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const paiement = await paiementsService.create(req.body);
    res.status(201).json({ success: true, message: 'Paiement enregistré avec succès', data: paiement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const paiement = await paiementsService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Paiement modifié avec succès', data: paiement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    await paiementsService.remove(req.params.id);
    res.json({ success: true, message: 'Paiement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getStats, getImpayes, getById, create, update, remove };
