const eleveService = require('../services/eleve.service');

const getAllEleves = async (req, res) => {
  try {
    const eleves = await eleveService.getAllEleves(req.query);
    res.status(200).json({ success: true, data: eleves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEleveById = async (req, res) => {
  try {
    const eleve = await eleveService.getEleveById(req.params.matricule);
    res.status(200).json({ success: true, data: eleve });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getEleveNotes = async (req, res) => {
  try {
    const notes = await eleveService.getEleveNotes(req.params.matricule);
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getElevePresences = async (req, res) => {
  try {
    const presences = await eleveService.getElevePresences(req.params.matricule);
    res.json({ success: true, data: presences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getElevePaiements = async (req, res) => {
  try {
    const paiements = await eleveService.getElevePaiements(req.params.matricule);
    res.json({ success: true, data: paiements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEleveBulletin = async (req, res) => {
  try {
    const bulletin = await eleveService.getEleveBulletin(req.params.matricule);
    res.json({ success: true, data: bulletin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEleveDiscipline = async (req, res) => {
  try {
    const discipline = await eleveService.getEleveDiscipline(req.params.matricule);
    res.json({ success: true, data: discipline });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEleveParents = async (req, res) => {
  try {
    const parents = await eleveService.getEleveParents(req.params.matricule);
    res.json({ success: true, data: parents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createEleve = async (req, res) => {
  try {
    const eleve = await eleveService.createEleve(req.body);
    res.status(201).json({ success: true, message: 'Élève créé avec succès', data: eleve });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addEleveParent = async (req, res) => {
  try {
    const parent = await eleveService.addEleveParent(req.params.matricule, req.body);
    res.status(201).json({ success: true, message: 'Parent ajouté avec succès', data: parent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEleve = async (req, res) => {
  try {
    const eleve = await eleveService.updateEleve(req.params.matricule, req.body);
    res.status(200).json({ success: true, message: 'Élève modifié avec succès', data: eleve });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEleve = async (req, res) => {
  try {
    const result = await eleveService.deleteEleve(req.params.matricule);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEleves, getEleveById, createEleve, updateEleve, deleteEleve,
  getEleveNotes, getElevePresences, getElevePaiements, getEleveBulletin,
  getEleveDiscipline, getEleveParents, addEleveParent,
};
