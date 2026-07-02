const { EmploiDuTemps, Classe, Cours, Enseignant } = require('../models/index');
const { Op } = require('sequelize');

const getAll = async (req, res) => {
  try {
    const edt = await EmploiDuTemps.findAll({
      include: [
        { model: Classe, attributes: ['idClasse', 'libelle'] },
        { model: Cours, attributes: ['idCours', 'libelle', 'coefficient'] }
      ],
      order: [['jour', 'ASC'], ['heure', 'ASC']]
    });
    res.json({ success: true, data: edt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByClasse = async (req, res) => {
  try {
    const edt = await EmploiDuTemps.findAll({
      where: { idClasse: req.params.id },
      include: [{ model: Cours, attributes: ['idCours', 'libelle', 'coefficient'] }],
      order: [['jour', 'ASC'], ['heure', 'ASC']]
    });
    res.json({ success: true, data: edt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByCours = async (req, res) => {
  try {
    const edt = await EmploiDuTemps.findAll({
      where: { idCours: req.params.id },
      include: [{ model: Classe, attributes: ['idClasse', 'libelle'] }],
      order: [['jour', 'ASC'], ['heure', 'ASC']]
    });
    res.json({ success: true, data: edt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { jour, heure, idClasse, idCours } = req.body;
    if (!jour || !heure || !idClasse || !idCours) {
      return res.status(400).json({ success: false, message: 'jour, heure, idClasse et idCours requis' });
    }
    const existant = await EmploiDuTemps.findOne({ where: { jour, heure, idClasse } });
    if (existant) return res.status(409).json({ success: false, message: 'Créneau déjà existant pour cette classe' });
    const edt = await EmploiDuTemps.create({ jour, heure, idClasse, idCours, idAdmin: req.user?.id });
    res.status(201).json({ success: true, message: 'Créneau ajouté', data: edt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const edt = await EmploiDuTemps.findByPk(req.params.id);
    if (!edt) return res.status(404).json({ success: false, message: 'Créneau introuvable' });
    await edt.update(req.body);
    res.json({ success: true, message: 'Créneau modifié', data: edt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const edt = await EmploiDuTemps.findByPk(req.params.id);
    if (!edt) return res.status(404).json({ success: false, message: 'Créneau introuvable' });
    await edt.destroy();
    res.json({ success: true, message: 'Créneau supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getByClasse, getByCours, create, update, remove };
