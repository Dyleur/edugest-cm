const { Cours, Livres, Specialite, sequelize } = require('../models/index');
const { Op } = require('sequelize');

const getAll = async (req, res) => {
  try {
    const cours = await Cours.findAll({ include: [{ model: Livres }], order: [['libelle', 'ASC']] });
    res.json({ success: true, data: cours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const cour = await Cours.findByPk(req.params.id, {
      include: [{ model: Livres, include: [{ model: Specialite }] }]
    });
    if (!cour) return res.status(404).json({ success: false, message: 'Matière introuvable' });
    res.json({ success: true, data: cour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { libelle, coefficient, description, idLivre } = req.body;
    if (!libelle) return res.status(400).json({ success: false, message: 'libelle requis' });
    const existant = await Cours.findOne({ where: { libelle } });
    if (existant) return res.status(409).json({ success: false, message: 'Matière déjà existante' });
    const cour = await Cours.create({ libelle, coefficient: coefficient || 1, description, idLivre, idAdmin: req.user?.id });
    res.status(201).json({ success: true, message: 'Matière créée', data: cour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const cour = await Cours.findByPk(req.params.id);
    if (!cour) return res.status(404).json({ success: false, message: 'Matière introuvable' });
    await cour.update(req.body);
    res.json({ success: true, message: 'Matière modifiée', data: cour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMoyennesClasse = async (req, res) => {
  try {
    const { Evaluation, Eleve, Frequente, Salle } = require('../models/index');
    const evaluations = await Evaluation.findAll({
      include: [{ model: Cours, attributes: ['libelle', 'coefficient'] }],
      where: { '$Cours.id$': sequelize.col('Cours.id') }
    });
    res.json({ success: true, data: evaluations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, getMoyennesClasse };
