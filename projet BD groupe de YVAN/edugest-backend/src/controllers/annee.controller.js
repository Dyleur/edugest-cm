const anneeService = require('../services/annee.service');

// GET /api/annees
const getAllAnnees = async (req, res) => {
  try {
    const annees = await anneeService.getAllAnnees();
    res.status(200).json({
      success: true,
      data: annees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/annees/:id
const getAnneeById = async (req, res) => {
  try {
    const annee = await anneeService.getAnneeById(req.params.id);
    res.status(200).json({
      success: true,
      data: annee,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/annees
const createAnnee = async (req, res) => {
  try {
    const annee = await anneeService.createAnnee(req.body);
    res.status(201).json({
      success: true,
      message: 'Année scolaire créée avec succès',
      data: annee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/annees/:id
const updateAnnee = async (req, res) => {
  try {
    const annee = await anneeService.updateAnnee(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Année scolaire modifiée avec succès',
      data: annee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/annees/:id
const deleteAnnee = async (req, res) => {
  try {
    const result = await anneeService.deleteAnnee(req.params.id);
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

module.exports = {
  getAllAnnees,
  getAnneeById,
  createAnnee,
  updateAnnee,
  deleteAnnee,
};