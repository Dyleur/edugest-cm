const enseignantService = require('../services/enseignant.service');

// GET /api/enseignants
const getAllEnseignants = async (req, res) => {
  try {
    const enseignants = await enseignantService.getAllEnseignants(req.query);
    res.status(200).json({
      success: true,
      data: enseignants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/enseignants/:id
const getEnseignantById = async (req, res) => {
  try {
    const enseignant = await enseignantService.getEnseignantById(req.params.id);
    res.status(200).json({
      success: true,
      data: enseignant,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/enseignants
const createEnseignant = async (req, res) => {
  try {
    const enseignant = await enseignantService.createEnseignant(req.body);
    res.status(201).json({
      success: true,
      message: 'Enseignant créé avec succès',
      data: enseignant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/enseignants/:id
const updateEnseignant = async (req, res) => {
  try {
    const enseignant = await enseignantService.updateEnseignant(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Enseignant modifié avec succès',
      data: enseignant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/enseignants/:id
const deleteEnseignant = async (req, res) => {
  try {
    const result = await enseignantService.deleteEnseignant(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/enseignants/:id/classes
const getClassesByEnseignant = async (req, res) => {
  try {
    const classes = await enseignantService.getClassesByEnseignant(req.params.id);
    res.status(200).json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
  getClassesByEnseignant,
};