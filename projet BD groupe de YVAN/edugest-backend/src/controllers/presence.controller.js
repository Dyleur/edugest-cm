const presenceService = require('../services/presence.service');

// PUT /api/presences/present
const marquerPresent = async (req, res) => {
  try {
    const presence = await presenceService.marquerPresent(req.body);
    res.status(200).json({
      success: true,
      message: 'Élève marqué présent',
      data: presence,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/presences/absent
const marquerAbsent = async (req, res) => {
  try {
    const presence = await presenceService.marquerAbsent(req.body);
    res.status(200).json({
      success: true,
      message: 'Élève marqué absent',
      data: presence,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/presences/salle/:idSalle/annee/:idAcademi
const getPresencesBySalle = async (req, res) => {
  try {
    const presences = await presenceService.getPresencesBySalle(
      req.params.idSalle,
      req.params.idAcademi
    );
    res.status(200).json({
      success: true,
      data: presences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/presences/eleve/:matricule/absences
const getAbsencesByEleve = async (req, res) => {
  try {
    const absences = await presenceService.getAbsencesByEleve(
      req.params.matricule
    );
    res.status(200).json({
      success: true,
      data: absences,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/presences/stats/salle/:idSalle/annee/:idAcademi
const getStatistiquesBySalle = async (req, res) => {
  try {
    const stats = await presenceService.getStatistiquesBySalle(
      req.params.idSalle,
      req.params.idAcademi
    );
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPresencesByEleve = async (req, res) => {
  try {
    const presences = await presenceService.getPresencesByEleve(req.params.matricule);
    res.json({ success: true, data: presences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  marquerPresent,
  marquerAbsent,
  getPresencesBySalle,
  getAbsencesByEleve,
  getStatistiquesBySalle,
  getPresencesByEleve,
};