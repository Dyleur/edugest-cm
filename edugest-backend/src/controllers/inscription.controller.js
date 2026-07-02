const inscriptionService = require('../services/inscription.service');

// GET /api/inscriptions
const getAllInscriptions = async (req, res) => {
  try {
    const inscriptions = await inscriptionService.getAllInscriptions();
    res.status(200).json({
      success: true,
      data: inscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/inscriptions/eleve/:matricule
const getInscriptionsByEleve = async (req, res) => {
  try {
    const inscriptions = await inscriptionService.getInscriptionsByEleve(
      req.params.matricule
    );
    res.status(200).json({
      success: true,
      data: inscriptions,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/inscriptions
const inscrireEleve = async (req, res) => {
  try {
    const inscription = await inscriptionService.inscrireEleve(req.body);
    res.status(201).json({
      success: true,
      message: 'Élève inscrit avec succès',
      data: inscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/inscriptions/:id
const updateInscription = async (req, res) => {
  try {
    const inscription = await inscriptionService.updateInscription(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Inscription modifiée avec succès',
      data: inscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/inscriptions/:id
const deleteInscription = async (req, res) => {
  try {
    const result = await inscriptionService.deleteInscription(req.params.id);
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
  getAllInscriptions,
  getInscriptionsByEleve,
  inscrireEleve,
  updateInscription,
  deleteInscription,
};