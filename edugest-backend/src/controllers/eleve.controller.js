const eleveService = require('../services/eleve.service');

// GET /api/eleves
const getAllEleves = async (req, res) => {
  try {
    // req.query contient les paramètres de recherche
    // ex: /api/eleves?search=Jean&sexe=1
    const eleves = await eleveService.getAllEleves(req.query);
    res.status(200).json({
      success: true,
      data: eleves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/eleves/:matricule
const getEleveById = async (req, res) => {
  try {
    const eleve = await eleveService.getEleveById(req.params.matricule);
    res.status(200).json({
      success: true,
      data: eleve,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/eleves
const createEleve = async (req, res) => {
  try {
    const eleve = await eleveService.createEleve(req.body);
    res.status(201).json({
      success: true,
      message: 'Élève créé avec succès',
      data: eleve,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/eleves/:matricule
const updateEleve = async (req, res) => {
  try {
    const eleve = await eleveService.updateEleve(req.params.matricule, req.body);
    res.status(200).json({
      success: true,
      message: 'Élève modifié avec succès',
      data: eleve,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/eleves/:matricule
const deleteEleve = async (req, res) => {
  try {
    const result = await eleveService.deleteEleve(req.params.matricule);
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
  getAllEleves,
  getEleveById,
  createEleve,
  updateEleve,
  deleteEleve,
};