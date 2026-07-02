const classeService = require('../services/classe.service');

const getAllClasses = async (req, res) => {
  try {
    const classes = await classeService.getAllClasses(req.query);
    res.status(200).json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getClasseById = async (req, res) => {
  try {
    const classe = await classeService.getClasseById(req.params.id);
    res.status(200).json({ success: true, data: classe });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const createClasse = async (req, res) => {
  try {
    const classe = await classeService.createClasse(req.body);
    res.status(201).json({ success: true, message: 'Classe créée avec succès', data: classe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateClasse = async (req, res) => {
  try {
    const classe = await classeService.updateClasse(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Classe modifiée avec succès', data: classe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteClasse = async (req, res) => {
  try {
    const result = await classeService.deleteClasse(req.params.id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllClasses, getClasseById, createClasse, updateClasse, deleteClasse };
