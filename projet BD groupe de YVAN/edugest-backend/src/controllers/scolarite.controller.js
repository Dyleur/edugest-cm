const { Scolarite, Tranches, Cycle } = require('../models/index');

const getAll = async (req, res) => {
  try {
    const scolarites = await Scolarite.findAll({
      include: [{ model: Cycle, attributes: ['libelle'] }, { model: Tranches }],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: scolarites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { libelle, inscription, pension, idCycle } = req.body;
    if (!libelle || !idCycle) return res.status(400).json({ success: false, message: 'libelle et idCycle requis' });
    const scolarite = await Scolarite.create({ libelle, inscription, pension, idCycle, idAdmin: req.user?.id });
    res.status(201).json({ success: true, message: 'Grille tarifaire créée', data: scolarite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTranches = async (req, res) => {
  try {
    const tranches = await Tranches.findAll({ where: { idScolarite: req.params.id }, order: [['created_at', 'ASC']] });
    res.json({ success: true, data: tranches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTranche = async (req, res) => {
  try {
    const { libelle, montant } = req.body;
    if (!libelle || !montant) return res.status(400).json({ success: false, message: 'libelle et montant requis' });
    const scolarite = await Scolarite.findByPk(req.params.id);
    if (!scolarite) return res.status(404).json({ success: false, message: 'Grille tarifaire introuvable' });
    const tranche = await Tranches.create({ libelle, montant, idScolarite: req.params.id, idAdmin: req.user?.id });
    res.status(201).json({ success: true, message: 'Tranche ajoutée', data: tranche });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, create, getTranches, createTranche };
