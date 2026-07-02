const { Rapport, Discipline, Justificatifs, Eleve } = require('../models/index');

const getAll = async (req, res) => {
  try {
    const rapports = await Rapport.findAll({
      include: [{ model: Eleve, attributes: ['nom', 'prenom', 'matricule'] }],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: rapports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { matricule, idAca, libelle, points, commentaire, event_date } = req.body;
    if (!matricule || !libelle || !event_date) {
      return res.status(400).json({ success: false, message: 'matricule, libelle et event_date requis' });
    }
    const eleve = await Eleve.findByPk(matricule);
    if (!eleve) return res.status(404).json({ success: false, message: 'Élève introuvable' });
    const rapport = await Rapport.create({ matricule, idAca, libelle, points, commentaire, event_date, idPers: req.user?.id });
    res.status(201).json({ success: true, message: 'Incident enregistré', data: rapport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const rapport = await Rapport.findByPk(req.params.id, {
      include: [
        { model: Eleve, attributes: ['nom', 'prenom', 'matricule'] },
        { model: Justificatifs }
      ]
    });
    if (!rapport) return res.status(404).json({ success: false, message: 'Incident introuvable' });
    res.json({ success: true, data: rapport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const rapport = await Rapport.findByPk(req.params.id);
    if (!rapport) return res.status(404).json({ success: false, message: 'Incident introuvable' });
    await rapport.update(req.body);
    res.json({ success: true, message: 'Incident mis à jour', data: rapport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addJustif = async (req, res) => {
  try {
    const rapport = await Rapport.findByPk(req.params.id);
    if (!rapport) return res.status(404).json({ success: false, message: 'Incident introuvable' });
    const justif = await Justificatifs.create({ idRap: req.params.id, ...req.body });
    res.status(201).json({ success: true, message: 'Justificatif ajouté', data: justif });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTypes = async (req, res) => {
  try {
    const types = await Discipline.findAll({ where: { actif: 1 } });
    res.json({ success: true, data: types });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByEleve = async (req, res) => {
  try {
    const rapports = await Rapport.findAll({
      where: { matricule: req.params.matricule },
      order: [['event_date', 'DESC']]
    });
    res.json({ success: true, data: rapports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, create, getById, update, addJustif, getTypes, getByEleve };
