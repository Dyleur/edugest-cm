const cycleService = require('../services/cycle.service');

// GET /api/cycles
const getAllCycles = async (req, res) => {
  try {
    const cycles = await cycleService.getAllCycles();
    res.status(200).json({
      success: true,
      data: cycles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/cycles/:id
const getCycleById = async (req, res) => {
  try {
    const cycle = await cycleService.getCycleById(req.params.id);
    res.status(200).json({
      success: true,
      data: cycle,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/cycles
const createCycle = async (req, res) => {
  try {
    const cycle = await cycleService.createCycle(req.body);
    res.status(201).json({
      success: true,
      message: 'Niveau scolaire créé avec succès',
      data: cycle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/cycles/:id
const updateCycle = async (req, res) => {
  try {
    const cycle = await cycleService.updateCycle(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Niveau scolaire modifié avec succès',
      data: cycle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/cycles/:id
const deleteCycle = async (req, res) => {
  try {
    const result = await cycleService.deleteCycle(req.params.id);
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
  getAllCycles,
  getCycleById,
  createCycle,
  updateCycle,
  deleteCycle,
};