const { Trimestre, Session } = require('../models/index');

const getAll = async (req, res) => {
  try {
    const trimestres = await Trimestre.findAll({ order: [['created_at', 'ASC']] });
    res.json({ success: true, data: trimestres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { libelle, periode, idAca } = req.body;
    if (!libelle) return res.status(400).json({ success: false, message: 'libelle requis' });
    const trimestre = await Trimestre.create({ libelle, periode, idAca, idAdmin: req.user?.id });
    res.status(201).json({ success: true, message: 'Trimestre créé', data: trimestre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const trimestre = await Trimestre.findByPk(req.params.id, { include: [{ model: Session }] });
    if (!trimestre) return res.status(404).json({ success: false, message: 'Trimestre introuvable' });
    res.json({ success: true, data: trimestre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, create, getById };
