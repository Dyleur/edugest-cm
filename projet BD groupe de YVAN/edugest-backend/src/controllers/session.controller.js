const { Session, Trimestre } = require('../models/index');

const getAll = async (req, res) => {
  try {
    const sessions = await Session.findAll({ include: [{ model: Trimestre, attributes: ['libelle'] }], order: [['created_at', 'ASC']] });
    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { libelle, description, idTrimestre } = req.body;
    if (!libelle || !idTrimestre) return res.status(400).json({ success: false, message: 'libelle et idTrimestre requis' });
    const session = await Session.create({ libelle, description, idTrimestre, idPers: req.user?.id });
    res.status(201).json({ success: true, message: 'Session créée', data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id, { include: [{ model: Trimestre }] });
    if (!session) return res.status(404).json({ success: false, message: 'Session introuvable' });
    res.json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, create, getById };
