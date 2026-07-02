const { Classe, Cycle, Salle, Eleve, Enseignant, Frequente } = require('../models');

const getAllClasses = async (req, res) => {
  try {
    const classes = await Classe.findAll({
      include: [
        { model: Cycle, attributes: ['idCycle', 'libelle'] },
        { model: Salle, attributes: ['idSalle', 'libelle', 'actif'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getClasseById = async (req, res) => {
  try {
    const classe = await Classe.findByPk(req.params.id, {
      include: [
        { model: Cycle, attributes: ['idCycle', 'libelle'] },
        { model: Salle, attributes: ['idSalle', 'libelle', 'actif'] },
      ],
    });
    if (!classe) return res.status(404).json({ success: false, message: 'Classe introuvable' });
    res.json({ success: true, data: classe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createClasse = async (req, res) => {
  try {
    const { libelle, idCycle } = req.body;
    if (!libelle || !idCycle) return res.status(400).json({ success: false, message: 'libelle et idCycle requis' });
    const cycle = await Cycle.findByPk(idCycle);
    if (!cycle) return res.status(404).json({ success: false, message: 'Cycle introuvable' });
    const classe = await Classe.create({ libelle, idCycle, idAdmin: req.user?.id });
    res.status(201).json({ success: true, message: 'Classe créée', data: classe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateClasse = async (req, res) => {
  try {
    const classe = await Classe.findByPk(req.params.id);
    if (!classe) return res.status(404).json({ success: false, message: 'Classe introuvable' });
    if (req.body.idCycle) {
      const cycle = await Cycle.findByPk(req.body.idCycle);
      if (!cycle) return res.status(404).json({ success: false, message: 'Cycle introuvable' });
    }
    await classe.update(req.body);
    res.json({ success: true, message: 'Classe modifiée', data: classe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteClasse = async (req, res) => {
  try {
    const classe = await Classe.findByPk(req.params.id);
    if (!classe) return res.status(404).json({ success: false, message: 'Classe introuvable' });
    await classe.destroy();
    res.json({ success: true, message: 'Classe supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getElevesByClasse = async (req, res) => {
  try {
    const salles = await Salle.findAll({
      where: { idClasse: req.params.id, actif: 1 },
      include: [{ model: Frequente, include: [{ model: Eleve }] }],
    });
    res.json({ success: true, data: salles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllClasses, getClasseById, createClasse, updateClasse, deleteClasse, getElevesByClasse };
