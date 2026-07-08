const presenceService = require('../services/presence.service');

const faireAppel = async (req, res) => {
  try {
    const result = await presenceService.faireAppel(req.body);
    res.status(201).json({ success: true, message: 'Appel enregistré', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const marquerPresent = async (req, res) => {
  try {
    const result = await presenceService.marquerPresent(req.body);
    res.json({ success: true, message: 'Présence marquée', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const marquerAbsent = async (req, res) => {
  try {
    const result = await presenceService.marquerAbsent(req.body);
    res.json({ success: true, message: 'Absence marquée', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPresencesBySalle = async (req, res) => {
  try {
    const presences = await presenceService.getPresencesBySalle(req.params.idSalle, req.params.idAcademi);
    res.json({ success: true, data: presences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

const getAbsencesByEleve = async (req, res) => {
  try {
    const absences = await presenceService.getAbsencesByEleve(req.params.matricule);
    res.json({ success: true, data: absences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGlobalStats = async (req, res) => {
  try {
    const stats = await presenceService.getGlobalStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStatistiquesBySalle = async (req, res) => {
  try {
    const stats = await presenceService.getStatistiquesBySalle(req.params.idSalle, req.params.idAcademi);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  faireAppel, marquerPresent, marquerAbsent,
  getPresencesBySalle, getPresencesByEleve, getAbsencesByEleve,
  getGlobalStats, getStatistiquesBySalle,
};
